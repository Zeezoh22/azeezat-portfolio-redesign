# Azeezat Portfolio Redesign

An independent personal-first portfolio and digital journal for Azeezat Ogunwande, built with plain HTML, CSS, and vanilla JavaScript.

## Pages

- `index.html` — one continuous editorial homepage: introduction, experience timeline, an index of every documented project, Journaling (latest Simply Zeezoh posts), and contact.
- `writing/index.html` — the on-site writing archive and article reader (`?post=<slug>`), backed by the generated `writing-data.js`.
- `garden/index.html` — a minimal image-led visual archive of interface studies.
- `bookshelf/index.html` — an interactive reading room: category filter tabs, real book covers, and flip cards (cover on the front, notes on the back), with a “Show all books” control.

## Updating content

Edit `content.js` for the experience timeline, project index, Garden records, Bookshelf records, and the writing configuration. Placeholder records are intentionally marked and must be replaced only with approved material.

### Bookshelf

Each entry in `books` carries `id`, `title`, `author`, `section` (the original
listing section), `category` (the visible filter tab — Design & Product maps to
**Design & Creativity**, Thinking & Communication to **Personal Growth**), `status`
(`Read` or `To read`), a local `cover`, `coverSource`, `coverVerified`, optional
`isbn`/`edition`, and the note fields `about`, `motivation`, `hopes`, `lessons`,
`work`. Tabs render from this data; the initial view shows the first 12 books and
“Show all books” reveals the whole list. Empty note blocks are hidden.

Reflection fields (`lessons`, `work`) are **empty by design**: the workspace holds
no genuine personal reflections and none are invented. `motivation`/`hopes` reuse
the neutral, editable starter copy from earlier revisions — never first-person
claims. Do not present starter copy or placeholders as real reflections.

Covers live in `assets/books/` with provenance in `assets/books/sources.json` and
the grouped list in `assets/books/inventory.json` (see `assets/books/README.md`).
Regenerate with:

```sh
node tools/fetch-book-covers.mjs
node tools/build-book-inventory.mjs
```

The user-supplied `My Hifdh Guide` cover is present at
`assets/books/my-hifdh-guide-abdulrasaq-bilal-oyeniran.png` (705 × 1000 PNG);
if it is ever removed, the Bookshelf falls back to a labelled typographic tile.

### Work index

Each entry in `projects` is either a parent (`group: true`, with `children` product areas) or a single project. `classification` (`professional`, `independent`, `volunteer`, or `pending`) drives the five filter tabs; role, employment, and date details are only set where they are documented. The tabs, counts, and expandable rows all render from this data — no project details are duplicated in interaction code. Never invent metrics, links, or context.

### Writing (Simply Zeezoh)

Article content is generated at build time because the Substack feed sends no CORS
headers, so browser-side fetching is unreliable on a static site. Run:

```sh
node tools/import-substack.mjs
```

This fetches `https://simplyzeezoh.substack.com/feed`, sanitises each post, downloads
its inline images into `writing/images/`, and writes `writing-data.js`
(`window.WRITING_ARTICLES.articles`). The importer leaves `writing-data.js`
untouched if the feed is unreachable, and the site remains usable without it.

The canonical publication URL lives in `content.js` as `writing.url`
(`https://simplyzeezoh.substack.com/`) and is applied to every writing link on
the site. Each article keeps a discreet link back to its original Substack post.

### Garden

For a Garden card, set `coverAsset` (static cover image), optional `gifAsset`
(motion preview shown only on hover/focus when the card has a destination or is
previewed), and `url` (destination link; when absent, the card opens an
accessible larger preview dialog). Reduced-motion preferences suppress previews.
Placeholder cards use a neutral CSS tile and are never presented as real client work.

## Deployment

- Source lives at `github.com/Zeezoh22/azeezat-portfolio-redesign`.
- The site is static (plain HTML, CSS, and vanilla JS) with no build step; the
  repository root is the site root, so it deploys to Vercel as-is.
- It is kept separate from `Zeezoh22/azeezat-portfolio` and its Vercel deployment.
- No `.vercel` metadata, credentials, or deployment configuration are committed.

## Preview locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`. (Some restricted sandboxes block local
socket binding; run this in a normal terminal if that happens.)
