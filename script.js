(() => {
  const data = window.PORTFOLIO_CONTENT || {};
  const articles = (window.WRITING_ARTICLES && window.WRITING_ARTICLES.articles) || [];
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" }[character]));
  // Asset paths in content.js are relative to the site root; each page declares
  // its own path back to the root ("" on the homepage, "../" on subpages).
  const assetRoot = (document.body && document.body.dataset.root) || "";
  const asset = (path) => `${assetRoot}${path}`;
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Shared dialog (project details, garden preview).
  const dialog = $("#project-dialog");
  const dialogContent = $("#project-dialog-content");
  const closeDialog = () => dialog?.close();
  if (dialog) {
    dialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
    dialog.addEventListener("click", (event) => { if (event.target === dialog) closeDialog(); });
  }
  const showDialog = (html) => {
    if (!dialog || !dialogContent) return;
    dialogContent.innerHTML = html;
    dialog.showModal();
    dialog.querySelector(".dialog-close").focus();
  };

  // Writing configuration (name/label/url) — used by any remaining data-writing-* nodes.
  const writing = data.writing;
  if (writing) {
    $$("[data-writing-name]").forEach((el) => { el.textContent = writing.name; });
    $$("[data-writing-blurb]").forEach((el) => { el.textContent = writing.blurb; });
    $$("[data-writing-description]").forEach((el) => { el.textContent = writing.description; });
    $$("[data-writing-label]").forEach((el) => { el.textContent = writing.label; });
    $$("[data-writing-link]").forEach((el) => { el.href = writing.url; });
    $$("[data-writing-topics]").forEach((el) => {
      el.innerHTML = (writing.topics || []).map((topic) => `<span class="topic">${escapeHtml(topic)}</span>`).join("");
    });
  }

  // Hero headline — types "I design digital experiences." once, then holds it
  // with a blinking cursor. Space is reserved from an invisible sizer so the
  // introduction, name, metadata and buttons never shift as characters appear.
  // Screen readers get the full sentence via the visually-hidden copy; the
  // animated fragments are aria-hidden. Respects prefers-reduced-motion.
  const heroTitle = $("#hero-title");
  if (heroTitle) {
    const typed = heroTitle.querySelector(".hero-title-text");
    const sizer = heroTitle.querySelector(".hero-title-sizer");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sentences = [
      "hey there!",
      "I'm Azeezat",
      "Welcome to my space",
      "I make complex things feel simple.",
      "I turn ideas into useful products.",
      "Simplicity is my superpower.",
    ];
    let timer = null;
    let phrase = 0;
    let index = 0;
    let deleting = false;

    const reserve = () => {
      if (!sizer) return;
      let tallest = 0;
      sentences.forEach((sentence) => {
        sizer.textContent = sentence;
        tallest = Math.max(tallest, sizer.offsetHeight);
      });
      sizer.textContent = sentences[0];
      heroTitle.style.minHeight = `${tallest}px`;
    };

    const showFull = () => {
      clearTimeout(timer);
      timer = null;
      if (typed) typed.textContent = sentences[0];
      heroTitle.classList.add("is-typed");
    };

    const tick = () => {
      const sentence = sentences[phrase];
      if (!deleting) {
        index += 1;
        typed.textContent = sentence.slice(0, index);
        if (index < sentence.length) {
          const character = sentence.charAt(index - 1);
          timer = setTimeout(tick, character === " " ? 110 : 55);
        } else {
          deleting = true;
          timer = setTimeout(tick, 1800);
        }
      } else {
        index -= 1;
        typed.textContent = sentence.slice(0, index);
        if (index > 0) {
          timer = setTimeout(tick, 30);
        } else {
          deleting = false;
          phrase = (phrase + 1) % sentences.length;
          timer = setTimeout(tick, 450);
        }
      }
    };

    const start = () => {
      if (!typed) return;
      if (reduced.matches) { showFull(); return; }
      typed.textContent = "";
      index = 0;
      deleting = false;
      timer = setTimeout(tick, 350);
    };

    reserve();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reserve);
    window.addEventListener("resize", reserve, { passive: true });
    reduced.addEventListener("change", () => {
      clearTimeout(timer);
      timer = null;
      if (reduced.matches) { showFull(); } else { index = 0; deleting = false; start(); }
    });
    start();

    window.addEventListener("pagehide", () => clearTimeout(timer), { once: true });
  }

  // Experience timeline.
  const timeline = $("#timeline");
  if (timeline) {
    timeline.innerHTML = (data.experience || []).map((item) => `<li><h3 class="timeline-role">${escapeHtml(item.role)}</h3><p class="timeline-meta">${escapeHtml(item.employer)}<span class="timeline-sep" aria-hidden="true">|</span>${escapeHtml(item.dates)}</p></li>`).join("");
  }

  // Selected work — cover cards in a two-column grid. Up to four entries are
  // shown; entries flagged `featured: true` in content.js take priority.

  const workGrid = $("#work-grid");
  if (workGrid) {
    const projects = data.projects || [];
    const featured = projects.filter((project) => project.featured);
    const selected = featured.length ? featured.slice(0, 4) : projects.slice(0, 4);

    const cardMarkup = (project) => {
      const journey = project.journey
        ? `<img class="work-journey" data-src="${escapeHtml(project.journey)}" alt="" aria-hidden="true" />`
        : "";
      const cover = project.image
        ? `<div class="work-cover"${project.journey ? " data-journey" : ""}><img src="${escapeHtml(project.image)}" alt="" loading="lazy" />${journey}</div>`
        : `<div class="work-cover" aria-hidden="true"></div>`;
      const tags = [...new Set((project.group && project.children ? project.children.map((child) => child.domain) : [project.industry]).filter(Boolean))];
      const tagList = tags.length ? `<ul class="work-tags">${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>` : "";
      const pending = project.pending ? `<p class="work-pending">Details pending</p>` : "";
      return `<article class="work-card"${project.journey ? " data-journey" : ""}>${cover}<h3 class="work-card-name">${escapeHtml(project.name)}</h3>${pending}${tagList}</article>`;
    };

    workGrid.innerHTML = selected.map(cardMarkup).join("");

    // Journey walkthroughs: hovering (or focusing) a card with a journey asset
    // crossfades the product screen into a muted, looping auto walkthrough.
    // The animated WebP is attached lazily on first activation and detached on
    // leave so nothing decodes at rest. Skipped entirely for reduced motion.
    const journeyReduced = matchMedia("(prefers-reduced-motion: reduce)");
    const journeyCards = () => Array.from(workGrid.querySelectorAll(".work-card[data-journey]"));
    journeyCards().forEach((card) => {
      const journeyImg = card.querySelector(".work-journey");
      const live = (on) => {
        if (on) {
          if (journeyReduced.matches || !journeyImg) return;
          if (!journeyImg.src) journeyImg.src = journeyImg.dataset.src;
          card.classList.add("is-live");
        } else {
          card.classList.remove("is-live");
          if (journeyImg) journeyImg.removeAttribute("src");
        }
      };
      card.addEventListener("pointerenter", () => live(true));
      card.addEventListener("pointerleave", () => live(false));
      card.addEventListener("focusin", () => live(true));
      card.addEventListener("focusout", () => {
        if (!card.contains(document.activeElement)) live(false);
      });
      // Touch: tap the cover to start/stop the walkthrough.
      const cover = card.querySelector(".work-cover");
      if (cover) cover.addEventListener("click", () => {
        eventJourneyToggle(card, cover);
      });
    });

    function eventJourneyToggle(card, cover) {
      const journeyImg = card.querySelector(".work-journey");
      if (!journeyImg) return;
      if (card.classList.contains("is-live")) {
        card.classList.remove("is-live");
        journeyImg.removeAttribute("src");
      } else if (!journeyReduced.matches) {
        if (!journeyImg.src) journeyImg.src = journeyImg.dataset.src;
        card.classList.add("is-live");
      }
      cover.focus();
    }
  }

  // Journaling — latest real articles on the homepage.
  const journalList = $("#journal-list");
  if (journalList) {
    if (articles.length) {
      journalList.innerHTML = articles.slice(0, 4).map((article) => `<a class="journal-row" href="writing/?post=${encodeURIComponent(article.slug)}"><span class="journal-title">${escapeHtml(article.title)}</span><span class="journal-date">${escapeHtml(article.date)}</span></a>`).join("");
    } else {
      journalList.hidden = true;
      const empty = $("#journal-empty");
      if (empty) empty.hidden = false;
    }
  }

  // Writing archive + on-site reader (writing/index.html).
  if (document.body.dataset.page === "writing") {
    const app = $("#writing-app");
    const slug = new URLSearchParams(window.location.search).get("post");
    const findArticle = (s) => articles.find((a) => a.slug === s);
    const archiveHref = "./";

    if (app) {
      if (slug) {
        const article = findArticle(slug);
        if (!article) {
          app.innerHTML = `<p class="kicker">Writing</p><h1>Article not found.</h1><p>That piece may have moved.</p><p class="article-nav"><a class="text-link" href="${archiveHref}">← All writing</a></p>`;
          document.title = "Not found — Simply Zeezoh";
        } else {
          document.title = `${article.title} — Simply Zeezoh`;
          app.innerHTML = `<article class="article"><p class="kicker">Simply Zeezoh</p><h1 class="article-title">${escapeHtml(article.title)}</h1>${article.date ? `<p class="article-date">${escapeHtml(article.date)}</p>` : ""}<div class="article-body">${article.content}</div>${article.url ? `<p class="article-source">Originally published on Substack. <a class="text-link external" href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">View the original <span aria-hidden="true">↗</span></a></p>` : ""}<nav class="article-nav" aria-label="Article navigation"><a class="text-link" href="${archiveHref}">← All writing</a><a class="text-link" href="../">Home</a></nav></article>`;
        }
      } else if (articles.length) {
        app.innerHTML = `<header class="page-intro writing-intro"><p class="kicker">Writing</p><h1 id="notes-title">Simply Zeezoh</h1><p class="lede">${escapeHtml(writing ? writing.blurb : "")}</p></header><div class="archive-list">${articles.map((article) => `<a class="archive-row" href="?post=${encodeURIComponent(article.slug)}"><span class="archive-title">${escapeHtml(article.title)}</span><span class="archive-date">${escapeHtml(article.date)}</span></a>`).join("")}</div>`;
      } else {
        app.innerHTML = `<header class="page-intro writing-intro"><p class="kicker">Writing</p><h1 id="notes-title">Simply Zeezoh</h1></header><p class="archive-empty">All writing lives on Substack. <a class="text-link external" href="${escapeHtml(writing ? writing.url : "https://simplyzeezoh.substack.com/")}" target="_blank" rel="noopener noreferrer">Read it there <span aria-hidden="true">↗</span></a></p>`;
      }
    }
  }

  // Hero avatar — a 3D-like disc built from the existing 2D illustration.
  // GSAP drives a subtle mouse-follow tilt/parallax between the circular
  // background, the portrait and the lighting. It is a flat image with CSS
  // perspective and layered elements — not a real 3D model. Disabled entirely
  // for reduced-motion and touch (static presentation), and scoped to the
  // avatar so no other content reacts to the pointer.
  const avatar = $("#hero-avatar");
  if (avatar) {
    const avatarReduced = matchMedia("(prefers-reduced-motion: reduce)");
    const avatarCanHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

    const setupAvatar = () => {
      const gsap = window.gsap;
      const scene = avatar.querySelector(".hero-avatar-scene");
      const orb = avatar.querySelector(".hero-avatar-orb");
      const back = avatar.querySelector(".hero-avatar-back");
      const sheen = avatar.querySelector(".hero-avatar-sheen");
      const image = avatar.querySelector(".hero-avatar-img");
      if (avatarReduced.matches || !avatarCanHover || !gsap || !orb || !scene) return;

      const quick = (target, prop, duration) => gsap.quickTo(target, prop, { duration: duration || 0.6, ease: "power3.out" });
      const set = {
        rotateY: quick(orb, "rotationY", 0.7),
        rotateX: quick(orb, "rotationX", 0.7),
        orbX: quick(orb, "x"),
        orbY: quick(orb, "y"),
        backX: quick(back, "x", 0.8),
        backY: quick(back, "y", 0.8),
        sheenX: quick(sheen, "x", 0.7),
        sheenY: quick(sheen, "y", 0.7),
        imageX: quick(image, "x", 0.7),
        imageY: quick(image, "y", 0.7)
      };

      const hoverLift = (active) => gsap.to(orb, { scale: active ? 1.07 : 1, z: active ? 28 : 0, duration: 0.55, ease: "power3.out", overwrite: "auto" });
      const idle = gsap.to(scene, { y: -10, duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

      let rect = avatar.getBoundingClientRect();
      let frame = 0;
      let last = null;

      const apply = () => {
        const event = last;
        if (!event) return;
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        set.rotateY(nx * 34);
        set.rotateX(-ny * 34);
        set.orbX(nx * 22);
        set.orbY(ny * 22);
        set.backX(-nx * 44);
        set.backY(-ny * 34);
        set.sheenX(-nx * 26);
        set.sheenY(-ny * 20);
        set.imageX(-nx * 20);
        set.imageY(-ny * 15);
      };

      const onMove = (event) => {
        if (event.pointerType === "touch") return;
        last = event;
        if (frame) return;
        frame = requestAnimationFrame(() => { frame = 0; apply(); });
      };
      const onEnter = (event) => {
        if (event.pointerType === "touch") return;
        rect = avatar.getBoundingClientRect();
        idle.pause();
        hoverLift(true);
      };
      const onLeave = () => {
        last = null;
        idle.play();
        hoverLift(false);
        Object.keys(set).forEach((key) => set[key](0));
      };

      avatar.addEventListener("pointermove", onMove, { passive: true });
      avatar.addEventListener("pointerenter", onEnter, { passive: true });
      avatar.addEventListener("pointerleave", onLeave, { passive: true });

      const teardown = () => {
        avatar.removeEventListener("pointermove", onMove);
        avatar.removeEventListener("pointerenter", onEnter);
        avatar.removeEventListener("pointerleave", onLeave);
        if (frame) cancelAnimationFrame(frame);
        idle.kill();
        gsap.killTweensOf([scene, orb, back, sheen, image].filter(Boolean));
      };
      window.addEventListener("pagehide", teardown, { once: true });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setupAvatar);
    } else {
      setupAvatar();
    }
  }

  // Garden gallery.
  const gallery = $("#garden-gallery");
  if (gallery) {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    const coverMarkup = (item, label) => {
      if (item.coverAsset) {
        return `<img class="garden-image" src="${escapeHtml(asset(item.coverAsset))}" alt="${escapeHtml(label)}" loading="lazy" decoding="async" />`;
      }
      return `<span class="garden-placeholder" role="img" aria-label="Temporary placeholder — no approved image yet"><span>Temporary<br />placeholder</span></span>`;
    };

    // Device/mockup showcase (e.g. Zweka, Bayttaalim, MacBook Pro, Xtrempay): the
    // UI fills a frame sized to the image's own ratio, so it is never stretched or
    // cropped. WebP is served when supported, the GIF otherwise, and the static
    // PNG for reduced-motion or if the animation fails to load.
    const deviceMarkup = (item, label) => {
      const staticSrc = asset(item.coverAsset);
      const webp = item.webpAsset ? `<source srcset="${escapeHtml(asset(item.webpAsset))}" type="image/webp" />` : "";
      const anim = asset(item.gifAsset || item.coverAsset);
      return `<picture class="garden-device"><source srcset="${escapeHtml(staticSrc)}" media="(prefers-reduced-motion: reduce)" />${webp}<img class="garden-device-img" src="${escapeHtml(anim)}" data-static="${escapeHtml(staticSrc)}" alt="${escapeHtml(label)}" loading="lazy" decoding="async" /></picture>`;
    };

    // Intrinsic aspect ratio for a device/mockup frame, so the frame is sized to
    // the image exactly and the screen keeps its own proportions at every width.
    // Validated before reaching the style attribute.
    const frameStyle = (item) => {
      if (/^[0-9.]+ ?\/ ?[0-9.]+$/.test(item.ratio || "")) return ` style="--frame-ratio:${item.ratio}"`;
      return "";
    };

    gallery.innerHTML = (data.garden || []).map((item, index) => {
      const number = String(index + 1).padStart(2, "0");
      const label = item.placeholder
        ? `Placeholder design ${number} — no approved image yet`
        : `${item.title}${item.category ? `, ${item.category}` : ""}`;
      const isDevice = item.device === true;
      const content = isDevice
        ? deviceMarkup(item, label)
        : `${coverMarkup(item, label)}${item.gifAsset ? `<img class="garden-gif" alt="" hidden />` : ""}`;
      const frameClass = isDevice ? "garden-frame garden-frame--device" : "garden-frame";
      const inner = `<span class="${frameClass}"${isDevice ? frameStyle(item) : ""}>${content}</span>`;
      const trigger = item.url
        ? `<a class="garden-trigger" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}">${inner}</a>`
        : `<button class="garden-trigger" type="button" data-garden="${index}" aria-label="${escapeHtml(label)}">${inner}</button>`;
      const cardClass = `garden-card garden-card--${escapeHtml(item.layout || "medium")}${isDevice ? " garden-card--device" : ""}`;
      return `<article class="${cardClass}" data-previewing="false" data-gif="${escapeHtml(isDevice ? "" : item.gifAsset || "")}">${trigger}</article>`;
    }).join("");

    // If the animation cannot load, fall back to the static poster. Delegated so
    // it also covers the device image injected into the preview dialog.
    document.addEventListener("error", (event) => {
      const img = event.target;
      if (!img || !img.classList || !img.classList.contains("garden-device-img")) return;
      if (!img.dataset.static || img.dataset.failed) return;
      img.dataset.failed = "true";
      const fallback = document.createElement("img");
      fallback.className = "garden-device-img";
      fallback.src = img.dataset.static;
      fallback.alt = img.alt;
      img.closest("picture")?.replaceWith(fallback);
    }, true);

    const setPreview = (card, requested) => {
      const gif = card.dataset.gif;
      const active = requested && !reducedMotion.matches;
      const image = card.querySelector(".garden-gif");
      card.dataset.previewing = String(active);
      if (!image) return;
      if (active && gif) { image.src = gif; image.hidden = false; }
      else { image.removeAttribute("src"); image.hidden = true; }
    };

    gallery.addEventListener("pointerover", (event) => { const card = event.target.closest(".garden-card"); if (card && event.pointerType !== "touch") setPreview(card, true); });
    gallery.addEventListener("pointerout", (event) => { const card = event.target.closest(".garden-card"); if (card && !card.contains(event.relatedTarget)) setPreview(card, false); });
    gallery.addEventListener("focusin", (event) => { const card = event.target.closest(".garden-card"); if (card) setPreview(card, true); });
    gallery.addEventListener("focusout", (event) => { const card = event.target.closest(".garden-card"); if (card && !card.contains(event.relatedTarget)) setPreview(card, false); });

    gallery.addEventListener("click", (event) => {
      const button = event.target.closest("[data-garden]");
      if (!button) return;
      const item = data.garden[button.dataset.garden];
      const frame = item.device
        ? `<div class="preview-frame preview-frame--device"${frameStyle(item)}>${deviceMarkup(item, item.title)}</div>`
        : item.gifAsset
        ? `<img class="garden-image" src="${escapeHtml(asset(item.gifAsset))}" alt="" />`
        : `<span class="garden-placeholder preview-placeholder" role="img" aria-label="Placeholder — no approved image yet"><span>Placeholder</span></span>`;
      const body = item.placeholder
        ? `<p>This space is reserved for approved work that is not ready to publish yet.</p>`
        : `<p>${escapeHtml(item.description || "")}</p>`;
      showDialog(`<p class="kicker">${escapeHtml(item.category || "")}</p><h2 id="dialog-title">${escapeHtml(item.title)}</h2><div class="preview-frame">${frame}</div>${body}`);
    });

    // Motion (progressive enhancement): GSAP + ScrollTrigger layered over the
    // static wall. Reveals stagger in as cards enter the viewport, and on
    // pointer-fine desktops a gentle hover lift and cursor parallax add depth.
    // Disabled for reduced-motion and touch; the gallery renders and reads fine
    // without any of it.
    const motionRoot = document.documentElement;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const startGardenMotion = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!motionRoot.classList.contains("motion") || reducedMotion.matches || !gsap || !ScrollTrigger) {
        motionRoot.classList.remove("motion");
        return;
      }
      gsap.registerPlugin(ScrollTrigger);
      gallery.dataset.motionStarted = "true";

      const cards = Array.from(gallery.querySelectorAll(".garden-card"));
      const imageOf = (card) => card.querySelector(".garden-image, .garden-device-img");

      gsap.set(cards, { opacity: 0, y: 28 });
      ScrollTrigger.batch(cards, {
        start: "top 92%",
        once: true,
        batchMax: 3,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.09, overwrite: true })
      });
      window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

      if (!canHover) return;

      // Reusable quickTo setters so cursor parallax stays smooth and allocation-free.
      const setters = new Map();
      const parallaxFor = (image) => {
        if (!setters.has(image)) {
          setters.set(image, {
            x: gsap.quickTo(image, "x", { duration: 0.5, ease: "power3" }),
            y: gsap.quickTo(image, "y", { duration: 0.5, ease: "power3" })
          });
        }
        return setters.get(image);
      };

      cards.forEach((card) => {
        const image = imageOf(card);
        const lift = () => {
          gsap.to(card.querySelector(".garden-trigger"), { y: -6, duration: 0.45, ease: "power2.out" });
          if (image) gsap.to(image, { scale: 1.04, duration: 0.7, ease: "power2.out" });
        };
        const settle = () => {
          gsap.to(card.querySelector(".garden-trigger"), { y: 0, duration: 0.5, ease: "power2.out" });
          if (image) gsap.to(image, { scale: 1, duration: 0.7, ease: "power2.out" });
        };
        card.addEventListener("pointerenter", lift);
        card.addEventListener("pointerleave", settle);
        card.addEventListener("focusin", lift);
        card.addEventListener("focusout", settle);
      });

      let frame = 0;
      gallery.addEventListener("pointermove", (event) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          cards.forEach((card) => {
            const image = imageOf(card);
            if (!image) return;
            const rect = card.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const to = parallaxFor(image);
            to.x(((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 12);
            to.y(((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 10);
          });
        });
      });
      gallery.addEventListener("pointerleave", () => {
        cards.forEach((card) => {
          const image = imageOf(card);
          if (image) { const to = parallaxFor(image); to.x(0); to.y(0); }
        });
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", startGardenMotion);
    } else {
      startGardenMotion();
    }
    // Safety net: never leave the wall hidden if GSAP fails to arrive.
    window.setTimeout(() => {
      if (!gallery.dataset.motionStarted) motionRoot.classList.remove("motion");
    }, 2500);
  }

  // Bookshelf — filterable index of real covers with flip-card notes.
  // Front: cover, title, author, status. Back: description + any real notes.
  const shelf = $("#book-grid");
  if (shelf) {
    const books = data.books || [];
    const SHELF_FILTERS = [
      { id: "all", label: "All" },
      { id: "Design & Creativity", label: "Design & Creativity" },
      { id: "Business", label: "Business" },
      { id: "Faith & Deen", label: "Faith & Deen" },
      { id: "Personal Growth", label: "Personal Growth" },
      { id: "UoPeople & Computer Science", label: "UoPeople & Computer Science" },
      { id: "Engineering", label: "Engineering" }
    ];
    const INITIAL_COUNT = 12;

    const tabsHost = $("#shelf-filters");
    const statusEl = $("#shelf-status");
    const showAllBtn = $("#shelf-showall");
    let activeFilter = "all";
    let showAll = false;

    if (tabsHost) {
      tabsHost.innerHTML = SHELF_FILTERS.map((filter, index) => {
        const on = filter.id === "all";
        return `<button class="shelf-tab" type="button" role="tab" id="shelf-tab-${index}" data-filter="${escapeHtml(filter.id)}" aria-selected="${on}" tabindex="${on ? 0 : -1}">${escapeHtml(filter.label)}</button>`;
      }).join("");
    }

    const coverMarkup = (book) => {
      const fallback = `<span class="book-cover-fallback" hidden><span class="book-cover-title">${escapeHtml(book.title)}</span><span class="book-cover-author">${escapeHtml(book.author)}</span></span>`;
      const image = book.cover
        ? `<img class="book-cover-image" src="${escapeHtml(asset(book.cover))}" alt="Cover of ${escapeHtml(book.title)} by ${escapeHtml(book.author)}" loading="lazy" decoding="async" />`
        : "";
      return `<span class="book-cover">${fallback}${image}</span>`;
    };

    const blockMarkup = (label, text) => text
      ? `<span class="book-block"><span class="book-block-title">${escapeHtml(label)}</span><span class="book-block-text">${escapeHtml(text)}</span></span>`
      : "";

    const backMarkup = (book) => {
      const isRead = book.status === "Read";
      const lessons = (book.lessons || []).filter(Boolean).join(" ");
      const about = book.about ? `<span class="book-about">${escapeHtml(book.about)}</span>` : "";
      return [
        about,
        blockMarkup(isRead ? "Why I picked it up" : "Why I want to read it", book.motivation),
        blockMarkup("What I hope to learn", book.hopes),
        blockMarkup("What stayed with me", lessons),
        blockMarkup("How it shapes my work", book.work)
      ].filter(Boolean).join("");
    };

    const cardMarkup = (book, index) => `<article class="book-card" tabindex="0" role="button" aria-expanded="false" data-book="${index}" aria-label="${escapeHtml(book.title)} by ${escapeHtml(book.author)}. ${escapeHtml(book.status)}. Activate to reveal notes."><div class="book-inner"><div class="book-face book-front">${coverMarkup(book)}<span class="book-caption"><span class="book-title">${escapeHtml(book.title)}</span><span class="book-author">${escapeHtml(book.author)}</span><span class="book-status">${escapeHtml(book.status)}</span></span></div><div class="book-face book-back" aria-hidden="true"><span class="book-theme">${escapeHtml(book.category)}</span>${backMarkup(book)}<span class="book-back-hint" aria-hidden="true">Close</span></div></div></article>`;

    const setOpen = (card, open) => {
      card.classList.toggle("is-open", open);
      card.setAttribute("aria-expanded", String(open));
      const front = card.querySelector(".book-front");
      const back = card.querySelector(".book-back");
      if (front) front.setAttribute("aria-hidden", String(open));
      if (back) back.setAttribute("aria-hidden", String(!open));
    };
    const cards = () => Array.from(shelf.querySelectorAll(".book-card"));

    const render = () => {
      const filtered = activeFilter === "all" ? books : books.filter((book) => book.category === activeFilter);
      const list = activeFilter === "all" && !showAll ? filtered.slice(0, INITIAL_COUNT) : filtered;
      shelf.innerHTML = list.map(cardMarkup).join("");
      shelf.querySelectorAll(".book-cover-image").forEach((image) => {
        image.addEventListener("error", () => {
          image.hidden = true;
          const fallback = image.parentElement.querySelector(".book-cover-fallback");
          if (fallback) fallback.hidden = false;
        });
      });
      if (statusEl) {
        statusEl.textContent = activeFilter === "all"
          ? `Showing ${list.length} of ${books.length} books.`
          : `${list.length} ${list.length === 1 ? "book" : "books"} in ${activeFilter}.`;
      }
      if (showAllBtn) {
        const canToggle = activeFilter === "all" && filtered.length > INITIAL_COUNT;
        showAllBtn.hidden = !canToggle;
        showAllBtn.textContent = showAll ? "Show fewer books" : "Show all books";
      }
    };

    const tabs = () => Array.from((tabsHost || document).querySelectorAll(".shelf-tab"));
    const activate = (filter, focusTab) => {
      activeFilter = filter;
      if (filter !== "all") showAll = false;
      tabs().forEach((tab) => {
        const on = tab.dataset.filter === filter;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        if (on) {
          shelf.setAttribute("aria-labelledby", tab.id);
          if (focusTab) tab.focus();
        }
      });
      render();
    };

    tabs().forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.dataset.filter, false));
      tab.addEventListener("keydown", (event) => {
        const all = tabs();
        const index = all.indexOf(tab);
        let next = null;
        if (event.key === "ArrowRight") next = all[(index + 1) % all.length];
        else if (event.key === "ArrowLeft") next = all[(index - 1 + all.length) % all.length];
        else if (event.key === "Home") next = all[0];
        else if (event.key === "End") next = all[all.length - 1];
        if (next) { event.preventDefault(); activate(next.dataset.filter, true); }
      });
    });

    if (showAllBtn) {
      showAllBtn.addEventListener("click", () => {
        showAll = !showAll;
        showAllBtn.setAttribute("aria-expanded", String(showAll));
        render();
      });
    }

    shelf.addEventListener("click", (event) => {
      const card = event.target.closest(".book-card");
      if (!card) return;
      const open = !card.classList.contains("is-open");
      cards().forEach((c) => { if (c !== card) setOpen(c, false); });
      setOpen(card, open);
      if (open) card.focus();
    });
    shelf.addEventListener("keydown", (event) => {
      const card = event.target.closest(".book-card");
      if (!card) return;
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        const open = !card.classList.contains("is-open");
        setOpen(card, open);
      } else if (event.key === "Escape") {
        setOpen(card, false);
      }
    });

    render();
  }

  // Booking — quiet floating button with an explainer card that links to Calendly.
  // Replace the placeholder once the Calendly event type exists.
  const CALENDLY_URL = "https://calendly.com/contact-byzee/30min";
  if (!$("#book-fab")) {
    const wrap = document.createElement("div");
    wrap.className = "book-widget";
    wrap.innerHTML = `
      <div class="book-card" id="book-card" role="dialog" aria-label="Book a session" hidden>
        <button class="book-close" type="button" aria-label="Close">&times;</button>
        <p class="book-kicker">Booking</p>
        <p class="book-title">Book a session</p>
        <p class="book-copy">Product feedback, UX advice, or design career guidance — pick a time that works for you.</p>
        <a class="book-link" href="${escapeHtml(CALENDLY_URL)}" target="_blank" rel="noopener noreferrer">
          Book a session
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4.5 7.5 12 13l7.5-5.5" /></svg>
        </a>
      </div>
      <button class="book-fab" id="book-fab" type="button" aria-expanded="false" aria-controls="book-card" aria-haspopup="dialog" aria-label="Book a session">
        <span class="book-label" aria-hidden="true">Book a session</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="16" rx="2.5" /><path d="M3.5 9.5h17" /><path d="M8 2.5v4M16 2.5v4" /></svg>
      </button>`;
    document.body.appendChild(wrap);
    const fab = wrap.querySelector(".book-fab");
    const card = wrap.querySelector(".book-card");
    const close = wrap.querySelector(".book-close");
    const setOpen = (open) => {
      card.hidden = !open;
      requestAnimationFrame(() => card.classList.toggle("is-open", open));
      fab.setAttribute("aria-expanded", String(open));
      if (open) close.focus();
      else fab.focus();
    };
    fab.addEventListener("click", () => {
      fab.classList.remove("is-peek");
      setOpen(card.hidden);
    });
    close.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !card.hidden) setOpen(false);
    });
    document.addEventListener("click", (event) => {
      if (!card.hidden && !wrap.contains(event.target)) setOpen(false);
    });
    // one gentle self-peek per session so visitors learn what the button does
    try {
      if (!sessionStorage.getItem("book-peeked")) {
        sessionStorage.setItem("book-peeked", "1");
        setTimeout(() => {
          if (card.hidden) {
            fab.classList.add("is-peek");
            setTimeout(() => fab.classList.remove("is-peek"), 3200);
          }
        }, 2200);
      }
    } catch (error) { /* storage unavailable — skip the peek */ }
  }
})();
