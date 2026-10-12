/* Fetch the real, verifiable book covers used by the Bookshelf.
 *
 * `content.js` is the single source of truth: each book carries a local `cover`
 * path and a `coverSource` provenance URL. This tool re-downloads every cover
 * from that URL, verifies it is a real image (not a catalogue placeholder),
 * records dimensions, and writes `assets/books/sources.json`.
 *
 * Source types handled:
 *   - image URL (Open Library cover endpoints, Google Books front-cover
 *     endpoint, publisher CDN) — downloaded directly.
 *   - PDF URL (used only for "The Disease and the Cure", where the publisher
 *     cover is only distributed inside a PDF) — page 1 is rendered to PNG with
 *     macOS `qlmanage` and saved as JPEG.
 *   - user-supplied (My Hifdh Guide) — never invented; reported as pending.
 *
 * Run:            node tools/fetch-book-covers.mjs
 * Force refetch:  node tools/fetch-book-covers.mjs --force
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets", "books");
mkdirSync(outDir, { recursive: true });
const force = process.argv.includes("--force");

const UA = "AzeezatPortfolioBookshelf/1.0 (personal portfolio; cover provenance research)";

// Load content.js (browser global) safely in Node.
function loadBooks() {
  const code = readFileSync(path.join(root, "content.js"), "utf8");
  const sandbox = {};
  new Function("window", code)(sandbox);
  return sandbox.PORTFOLIO_CONTENT.books;
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function imageKind(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return "webp";
  return null;
}

function dimensions(file) {
  try {
    const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
    const w = (out.match(/pixelWidth:\s*(\d+)/) || [])[1];
    const h = (out.match(/pixelHeight:\s*(\d+)/) || [])[1];
    return w && h ? { width: Number(w), height: Number(h) } : null;
  } catch {
    return null;
  }
}

async function renderPdfCover(url, dest) {
  const work = path.join(tmpdir(), `cover-pdf-${Date.now()}`);
  mkdirSync(work, { recursive: true });
  const pdf = path.join(work, "cover.pdf");
  writeFileSync(pdf, await fetchBuffer(url));
  execFileSync("qlmanage", ["-t", "-s", "1200", "-o", work, pdf], { stdio: "ignore" });
  const rendered = `${pdf}.png`;
  if (!existsSync(rendered)) throw new Error("qlmanage produced no thumbnail");
  writeFileSync(dest, readFileSync(rendered));
  rmSync(work, { recursive: true, force: true });
}

const results = [];
for (const book of loadBooks()) {
  process.stdout.write(`${book.id} ... `);
  const local = path.join(root, book.cover);
  const record = {
    id: book.id,
    title: book.title,
    author: book.author,
    section: book.section,
    category: book.category,
    status: book.status,
    isbn: book.isbn || null,
    edition: book.edition || null,
    local: book.cover,
    source: book.coverSource,
    verified: book.coverVerified === true
  };

  const source = String(book.coverSource || "");
  const isUserSupplied = /user-supplied/i.test(source);

  if (isUserSupplied) {
    if (existsSync(local)) {
      record.status = "kept";
      Object.assign(record, dimensions(local) || {});
      record.bytes = statSync(local).size;
    } else {
      record.status = "pending-user-supplied";
    }
    results.push(record);
    console.log(existsSync(local) ? "user-supplied (present)" : "PENDING (user-supplied cover not provided)");
    continue;
  }

  if (existsSync(local) && statSync(local).size > 1500 && !force) {
    record.status = "kept";
    Object.assign(record, dimensions(local) || {});
    record.bytes = statSync(local).size;
    results.push(record);
    console.log(`kept ${book.cover}`);
    continue;
  }

  try {
    if (/\.pdf(\?|$)/i.test(source)) {
      await renderPdfCover(source, local);
    } else {
      const buf = await fetchBuffer(source);
      if (!imageKind(buf) || buf.length < 1500) throw new Error("not a usable image");
      writeFileSync(local, buf);
    }
    Object.assign(record, dimensions(local) || {});
    record.bytes = statSync(local).size;
    record.status = "downloaded";
    results.push(record);
    console.log(`OK ${path.basename(book.cover)} ${record.width || "?"}x${record.height || "?"}`);
  } catch (error) {
    record.status = "error";
    record.error = String(error);
    results.push(record);
    console.log(`ERROR ${error}`);
  }
  await new Promise((r) => setTimeout(r, 400));
}

writeFileSync(path.join(outDir, "sources.json"), JSON.stringify(results, null, 2));
const ok = results.filter((r) => r.status === "downloaded" || r.status === "kept").length;
const pending = results.filter((r) => r.status.includes("pending") || r.status === "error").map((r) => r.id);
console.log(`\n${ok}/${results.length} covers present. Needs attention: ${pending.join(", ") || "none"}`);
