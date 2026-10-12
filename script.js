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

  // Experience timeline.
  const timeline = $("#timeline");
  if (timeline) {
    timeline.innerHTML = (data.experience || []).map((item) => `<li><div class="timeline-meta">${escapeHtml(item.dates)}<br>${escapeHtml(item.type)}</div><div><h3>${escapeHtml(item.employer)}</h3><p>${escapeHtml(item.role)}${item.context ? ` · ${escapeHtml(item.context)}` : ""}</p><p>${escapeHtml(item.scope)}</p></div></li>`).join("");
  }

  // Work — grouped, filterable project index rendered entirely from content.js.
  const projectPanel = $("#project-list");
  if (projectPanel) {
    const projects = data.projects || [];
    const tabs = $$(".work-tab");
    const status = $("#work-status");
    const pendingLabel = `<span class="work-pending">Details pending</span>`;
    const slugify = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const matchesFilter = (project, filter) => filter === "all" || (project.classification || "pending") === filter;

    const mainMarkup = (project) => {
      const metaBits = [project.role, project.employment, project.dates].filter(Boolean).map(escapeHtml);
      const meta = metaBits.length ? `<span class="work-meta">${metaBits.join(" · ")}</span>` : "";
      const desc = project.description ? `<span class="work-desc">${escapeHtml(project.description)}</span>` : "";
      const pending = project.pending ? pendingLabel : "";
      const proposed = (project.pending && project.proposed)
        ? `<span class="work-proposed">Proposed: ${escapeHtml(project.proposed.classification)} · ${escapeHtml(project.proposed.industry)} (pending confirmation)</span>`
        : "";
      return `<span class="work-main"><span class="work-name">${escapeHtml(project.name)}${pending}</span>${meta}${desc}${proposed}</span>`;
    };

    const childMarkup = (child) => {
      const name = `${escapeHtml(child.name)}${child.pending ? ` ${pendingLabel}` : ""}`;
      const desc = child.description ? `<span class="work-desc">${escapeHtml(child.description)}</span>` : "";
      const domain = child.domain ? `<span class="work-child-domain">${escapeHtml(child.domain)}</span>` : "";
      return `<li class="work-child"><span class="work-main"><span class="work-child-name">${name}</span>${desc}</span><span class="work-side">${domain}</span></li>`;
    };

    const entryMarkup = (project) => {
      const industry = project.industry ? `<span class="work-industry">${escapeHtml(project.industry)}</span>` : "";
      if (project.group && project.children && project.children.length) {
        const id = `work-children-${slugify(project.name)}`;
        const children = project.children.map(childMarkup).join("");
        return `<li class="work-entry work-entry--group"><button class="work-row" type="button" aria-expanded="false" aria-controls="${id}">${mainMarkup(project)}<span class="work-side">${industry}<span class="work-arrow" aria-hidden="true">›</span></span></button><div class="work-children" id="${id}" role="region" aria-label="${escapeHtml(project.name)} product areas" hidden><ul class="work-child-list">${children}</ul></div></li>`;
      }
      return `<li class="work-entry"><div class="work-row work-row--static">${mainMarkup(project)}<span class="work-side">${industry}</span></div></li>`;
    };

    let activeFilter = "all";
    const renderList = (filter) => {
      const visible = projects.filter((project) => matchesFilter(project, filter));
      if (visible.length) {
        projectPanel.innerHTML = `<ul class="work-list">${visible.map(entryMarkup).join("")}</ul>`;
      } else {
        projectPanel.innerHTML = `<p class="work-empty">No projects in this category yet. Projects whose context is proposed but not yet confirmed are kept under “Details pending”.</p>`;
      }
      if (status) status.textContent = `${visible.length} ${visible.length === 1 ? "project" : "projects"} shown.`;
    };

    const activate = (filter, moveFocus) => {
      activeFilter = filter;
      tabs.forEach((tab) => {
        const on = tab.dataset.filter === filter;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        if (on) {
          projectPanel.setAttribute("aria-labelledby", tab.id);
          if (moveFocus) tab.focus();
        }
      });
      renderList(activeFilter);
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.dataset.filter, false));
      tab.addEventListener("keydown", (event) => {
        const index = tabs.indexOf(tab);
        let next = null;
        if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        else if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
        else if (event.key === "Home") next = tabs[0];
        else if (event.key === "End") next = tabs[tabs.length - 1];
        if (next) { event.preventDefault(); activate(next.dataset.filter, true); }
      });
    });

    projectPanel.addEventListener("click", (event) => {
      const button = event.target.closest(".work-row[aria-expanded]");
      if (!button) return;
      const region = document.getElementById(button.getAttribute("aria-controls"));
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      if (region) region.hidden = open;
    });

    renderList(activeFilter);
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

    gallery.innerHTML = (data.garden || []).map((item, index) => {
      const number = String(index + 1).padStart(2, "0");
      const label = item.placeholder
        ? `Placeholder design ${number} — no approved image yet`
        : `${item.title}${item.category ? `, ${item.category}` : ""}`;
      const gif = item.gifAsset ? `<img class="garden-gif" alt="" hidden />` : "";
      const inner = `<span class="garden-frame">${coverMarkup(item, label)}${gif}</span>`;
      const trigger = item.url
        ? `<a class="garden-trigger" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}">${inner}</a>`
        : `<button class="garden-trigger" type="button" data-garden="${index}" aria-label="${escapeHtml(label)}">${inner}</button>`;
      return `<article class="garden-card garden-card--${escapeHtml(item.layout || "medium")}" data-previewing="false" data-gif="${escapeHtml(item.gifAsset || "")}">${trigger}</article>`;
    }).join("");

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
      const frame = item.gifAsset
        ? `<img class="garden-image" src="${escapeHtml(asset(item.gifAsset))}" alt="" />`
        : `<span class="garden-placeholder preview-placeholder" role="img" aria-label="Placeholder — no approved image yet"><span>Placeholder</span></span>`;
      const body = item.placeholder
        ? `<p>This space is reserved for approved work that is not ready to publish yet.</p>`
        : `<p>${escapeHtml(item.description || "")}</p>`;
      showDialog(`<p class="kicker">${escapeHtml(item.category || "")}</p><h2 id="dialog-title">${escapeHtml(item.title)}</h2><div class="preview-frame">${frame}</div>${body}`);
    });
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
})();
