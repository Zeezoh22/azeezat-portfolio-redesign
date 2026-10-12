#!/usr/bin/env node
/*
 * import-substack.mjs — build-time importer for Simply Zeezoh (Substack).
 *
 * Fetches the public RSS feed, sanitises each post's HTML into safe semantic
 * markup, downloads its inline images into writing/images/, and writes
 * writing-data.js (window.WRITING_ARTICLES), which the static site reads.
 *
 * No dependencies (uses Node 18+ global fetch). Re-run with:
 *   node tools/import-substack.mjs
 *
 * The site never fetches Substack from the browser, so it keeps working even
 * when the feed is unreachable. If the feed cannot be reached, any existing
 * writing-data.js is left untouched.
 */

import { writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FEED_URL = "https://simplyzeezoh.substack.com/feed";
const PUBLICATION_URL = "https://simplyzeezoh.substack.com/";
const PUBLICATION_NAME = "Simply Zeezoh";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMG_DIR = path.join(ROOT, "writing", "images");
const DATA_FILE = path.join(ROOT, "writing-data.js");

const KEEP_TAGS = new Set([
  "p", "br", "hr", "strong", "em", "b", "i", "u", "s", "code", "pre",
  "blockquote", "figure", "figcaption", "div", "span",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "a", "img",
]);
const VOID_TAGS = new Set(["br", "hr", "img"]);

const ATTRS = {
  a: ["href"],
  img: ["src", "alt", "width", "height"],
};

/* ---------- feed parsing (regex; the feed is well-formed RSS 2.0) ---------- */

const cdata = (xml, tag) => {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? (m[1] ?? m[2] ?? "").trim() : "";
};

function parseFeed(xml) {
  const items = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((m) => m[0]);
  return items.map((item) => {
    const link = cdata(item, "link");
    const slug = (link.split("/").filter(Boolean).pop() || "").replace(/[?#].*$/, "");
    const pubDate = cdata(item, "pubDate");
    const date = pubDate ? new Date(pubDate) : null;
    return {
      title: cdata(item, "title"),
      url: link,
      slug,
      dateISO: date && !isNaN(date) ? date.toISOString() : null,
      dateLabel:
        date && !isNaN(date)
          ? date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
          : "",
      raw: cdata(item, "content:encoded"),
    };
  });
}

/* ---------- sanitising ---------- */

function removeBalanced(html, tag, classHint) {
  const openRe = new RegExp(
    `<${tag}\\b[^>]*${classHint ? `class="[^"]*${classHint}[^"]*"[^>]*` : ""}>`,
    "i"
  );
  let m = openRe.exec(html);
  while (m) {
    const start = m.index;
    const tagRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
    tagRe.lastIndex = start + m[0].length;
    let depth = 1;
    let end = null;
    let t;
    while ((t = tagRe.exec(html))) {
      if (t[0][1] === "/") depth--;
      else depth++;
      if (depth === 0) {
        end = t.index + t[0].length;
        break;
      }
    }
    if (end === null) break;
    html = html.slice(0, start) + html.slice(end);
    m = openRe.exec(html);
  }
  return html;
}

function unwrapAnchorByClass(html, classHint) {
  const re = new RegExp(`<a\\b[^>]*class="[^"]*${classHint}[^"]*"[^>]*>`, "i");
  let m = re.exec(html);
  while (m) {
    const closeIdx = html.indexOf("</a>", m.index + m[0].length);
    if (closeIdx === -1) break;
    html =
      html.slice(0, m.index) +
      html.slice(m.index + m[0].length, closeIdx) +
      html.slice(closeIdx + 4);
    m = re.exec(html);
  }
  return html;
}

function cleanTag(tag) {
  const nameMatch = tag.match(/^<\/?\s*([a-z0-9]+)/i);
  if (!nameMatch) return "";
  const name = nameMatch[1].toLowerCase();
  if (!KEEP_TAGS.has(name)) return "";
  if (tag[1] === "/") return VOID_TAGS.has(name) ? "" : `</${name}>`;
  const allowed = ATTRS[name] || [];
  const attrs = [];
  for (const a of tag.matchAll(/([a-z-]+)\s*=\s*"([^"]*)"/gi)) {
    const key = a[1].toLowerCase();
    if (allowed.includes(key)) attrs.push(`${key}="${a[2]}"`);
  }
  const attrStr = attrs.length ? " " + attrs.join(" ") : "";
  return VOID_TAGS.has(name) ? `<${name}${attrStr}>` : `<${name}${attrStr}>`;
}

function sanitize(html) {
  let out = html;

  // Drop whole interactive/embedded widget blocks.
  out = removeBalanced(out, "div", "subscription-widget-wrap");
  out = removeBalanced(out, "div", "subscription-widget ");
  out = removeBalanced(out, "div", "image-link-expand");
  out = removeBalanced(out, "form");
  out = out.replace(/<button\b[\s\S]*?<\/button>/gi, "");
  out = out.replace(/<svg\b[\s\S]*?<\/svg>/gi, "");
  out = out.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<style\b[\s\S]*?<\/style>/gi, "");
  out = out.replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "");
  out = out.replace(/<input\b[^>]*>/gi, "");

  // Simplify image wrappers.
  out = unwrapAnchorByClass(out, "image-link");
  out = out.replace(/<\/?picture\b[^>]*>/gi, "");
  out = out.replace(/<source\b[^>]*>/gi, "");

  // Whitelist tags + attributes.
  out = out.replace(/<\/?[a-z][^>]*>/gi, cleanTag);

  // Collapse empty wrappers / stray whitespace.
  out = out.replace(/<div>\s*<\/div>/gi, "");
  out = out.replace(/<p>\s*<\/p>/gi, "");
  out = out.replace(/(\s*<br\s*\/?>\s*){3,}/gi, "<br><br>");
  out = out.trim();
  return out;
}

/* ---------- images ---------- */

function extFromBytes(buf) {
  const b = buf;
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8) return ".jpg";
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return ".png";
  if (b.length >= 12 && b.slice(0, 4).toString("ascii") === "RIFF" && b.slice(8, 12).toString("ascii") === "WEBP")
    return ".webp";
  if (b.length >= 3 && b.slice(0, 3).toString("ascii") === "GIF") return ".gif";
  return ".jpg";
}

async function fetchImage(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.length) throw new Error("empty image");
  return buf;
}

const CONTENT_TYPE_EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

async function localizeImages(slug, html) {
  const srcs = [...new Set([...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)].map((m) => m[1]))];
  let i = 0;
  for (const src of srcs) {
    if (!/^https?:/i.test(src)) continue;
    i += 1;
    try {
      const res = await fetch(src, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (!buf.length) throw new Error("empty image");
      const type = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const ext = CONTENT_TYPE_EXT[type] || extFromBytes(buf);
      const filename = `${slug}-${i}${ext}`;
      await writeFile(path.join(IMG_DIR, filename), buf);
      html = html.split(`src="${src}"`).join(`src="images/${filename}"`);
      html = html.split(`href="${src}"`).join(`href="images/${filename}"`);
    } catch (err) {
      console.warn(`  ! kept remote image (${err.message}): ${src.slice(0, 70)}…`);
    }
  }
  return html;
}

/* ---------- external link safety ---------- */

function hardenLinks(html) {
  return html.replace(/<a\b([^>]*)>/gi, (full, attrs) => {
    const href = (attrs.match(/href="([^"]*)"/i) || [])[1] || "";
    if (!/^https?:/i.test(href)) return full;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
  });
}

/* ---------- main ---------- */

async function main() {
  console.log(`Fetching ${FEED_URL} …`);
  let xml;
  try {
    const res = await fetch(FEED_URL, { redirect: "follow", headers: { "user-agent": "portfolio-importer/1.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.error(`Could not fetch the feed (${err.message}).`);
    console.error(existsSync(DATA_FILE) ? "Existing writing-data.js left unchanged." : "No writing-data.js written.");
    process.exit(1);
  }

  const parsed = parseFeed(xml).filter((p) => p.slug && p.raw);
  if (!parsed.length) {
    console.error("Feed contained no usable items. Nothing written.");
    process.exit(1);
  }

  await mkdir(IMG_DIR, { recursive: true });
  await rm(IMG_DIR, { recursive: true, force: true });
  await mkdir(IMG_DIR, { recursive: true });

  const articles = [];
  for (const item of parsed) {
    console.log(`• ${item.title}`);
    let content = sanitize(item.raw);
    content = await localizeImages(item.slug, content);
    content = hardenLinks(content);
    articles.push({
      slug: item.slug,
      title: item.title,
      url: item.url,
      date: item.dateLabel,
      dateISO: item.dateISO,
      content,
    });
  }

  articles.sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));

  const data = {
    source: PUBLICATION_NAME,
    url: PUBLICATION_URL,
    feed: FEED_URL,
    updated: new Date().toISOString(),
    articles,
  };

  const banner =
    "/* Generated by tools/import-substack.mjs — do not edit by hand. */\n" +
    "/* Re-run: node tools/import-substack.mjs */\n";
  await writeFile(DATA_FILE, banner + `window.WRITING_ARTICLES = ${JSON.stringify(data, null, 2)};\n`, "utf8");

  console.log(`\nWrote ${path.relative(ROOT, DATA_FILE)} with ${articles.length} articles.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
