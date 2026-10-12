/* Build assets/books/inventory.json from content.js (single source of truth).
 * Run: node tools/build-book-inventory.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets", "books");

function loadBooks() {
  const code = readFileSync(path.join(root, "content.js"), "utf8");
  const sandbox = {};
  new Function("window", code)(sandbox);
  return sandbox.PORTFOLIO_CONTENT.books;
}

const FILTERS = ["All", "Design & Creativity", "Business", "Faith & Deen", "Personal Growth", "UoPeople & Computer Science", "Engineering"];
const books = loadBooks();

const sectionOrder = [];
const sections = new Map();
for (const book of books) {
  const key = `${book.section} :: ${book.status}`;
  if (!sections.has(key)) {
    sections.set(key, { section: book.section, status: book.status, category: book.category, books: [] });
    sectionOrder.push(key);
  }
  sections.get(key).books.push(book.id);
}

const byCategory = {};
for (const filter of FILTERS.slice(1)) {
  byCategory[filter] = books.filter((b) => b.category === filter).length;
}
const byStatus = books.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});

const inventory = {
  generatedFrom: "content.js",
  total: books.length,
  filters: FILTERS,
  totals: { books: books.length, byCategory, byStatus },
  sections: sectionOrder.map((key) => sections.get(key)),
  books: books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    section: b.section,
    category: b.category,
    status: b.status,
    isbn: b.isbn || null,
    edition: b.edition || null,
    cover: b.cover,
    coverSource: b.coverSource,
    coverVerified: b.coverVerified === true,
    reflectionStatus: b.reflectionStatus
  }))
};

writeFileSync(path.join(outDir, "inventory.json"), JSON.stringify(inventory, null, 2));
console.log(`Wrote inventory.json — ${inventory.total} books across ${inventory.sections.length} sections.`);
