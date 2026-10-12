# Bookshelf cover assets

Real book covers used by the Bookshelf page (`/bookshelf/`). Nothing here is a
generated imitation: every file is the actual published cover artwork, downloaded
from a bibliographic catalogue or the publisher's own catalogue/CDN.

## Files

| File | Book | Source type |
| --- | --- | --- |
| `the-design-of-everyday-things-don-norman.jpg` | The Design of Everyday Things | Open Library (ISBN) |
| `don-t-make-me-think-steve-krug.jpg` | Don't Make Me Think | Open Library (ISBN) |
| `sprint-jake-knapp.jpg` | Sprint | Open Library (ISBN) |
| `show-your-work-austin-kleon.jpg` | Show Your Work! | Google Books front cover |
| `steal-like-an-artist-austin-kleon.jpg` | Steal Like an Artist | Google Books front cover |
| `atomic-habits-james-clear.jpg` | Atomic Habits | Open Library (ISBN) |
| `the-subtle-art-of-not-giving-a-f-ck-mark-manson.jpg` | The Subtle Art of Not Giving a F*ck | Open Library (ISBN) |
| `rulings-pertaining-to-the-muslim-woman-salih-al-fawzaan.jpg` | Rulings Pertaining to the Muslim Woman | Darussalam (publisher catalogue) |
| `the-disease-and-the-cure-ibn-al-qayyim.jpg` | The Disease and the Cure | Hikmah Publications cover (rendered from publisher PDF) |
| `my-hifdh-guide-abdulrasaq-bilal-oyeniran.png` | My Hifdh Guide | User-supplied (provided by the designer) |
| `the-personal-mba-josh-kaufman.jpg` | The Personal MBA | Open Library (ISBN) |
| `the-mom-test-rob-fitzpatrick.jpg` | The Mom Test | Open Library (ISBN) |
| `the-lean-startup-eric-ries.jpg` | The Lean Startup | Open Library (ISBN) |
| `the-psychology-of-money-morgan-housel.jpg` | The Psychology of Money | Open Library (ISBN) |
| `inspired-how-to-create-tech-products-customers-love-marty-cagan.jpg` | INSPIRED | Open Library (ISBN) |
| `articulating-design-decisions-tom-greever.jpg` | Articulating Design Decisions | Open Library (ISBN) |
| `deep-work-cal-newport.jpg` | Deep Work | Open Library (ISBN) |
| `essentialism-greg-mckeown.jpg` | Essentialism | Open Library (cover id) |
| `mindset-the-new-psychology-of-success-carol-s-dweck.jpg` | Mindset | Open Library (ISBN) |
| `thinking-in-systems-donella-h-meadows.jpg` | Thinking in Systems | Open Library (ISBN) |
| `thinking-fast-and-slow-daniel-kahneman.jpg` | Thinking, Fast and Slow | Open Library (ISBN) |
| `made-to-stick-chip-heath.jpg` | Made to Stick | Google Books front cover |
| `the-artist-s-way-julia-cameron.jpg` | The Artist's Way | Open Library (cover id) |
| `college-success-amy-baldwin.jpg` | College Success | Open Library (cover id) |
| `think-python-how-to-think-like-a-computer-scientist-allen-b-downey.jpg` | Think Python | Open Library (cover id) |
| `basics-of-python-programming-mohbey-acharya.jpg` | Basics of Python Programming | Google Books front cover |

## Generated manifests

- `sources.json` — exact provenance for every existing file (URL, ISBN/edition,
  dimensions, bytes, verification flag). Regenerate with
  `node tools/fetch-book-covers.mjs`.
- `inventory.json` — the 26-book reading list grouped by the brief's sections,
  with filter totals. Regenerate with `node tools/build-book-inventory.mjs`.

## Regenerating

```sh
node tools/fetch-book-covers.mjs          # download anything missing
node tools/fetch-book-covers.mjs --force  # re-download every cover
node tools/build-book-inventory.mjs
```

## Status and caveats

- **All 26 covers are present.** `My Hifdh Guide` is the designer's own
  user-supplied file (`705 × 1000` PNG); it is not downloaded from a catalogue.
- `The Disease and the Cure` uses the Hikmah Publications cover (the edition whose
  title matches the listed book). Darussalam's English edition of the same work is
  retitled *Purification of the Heart and Soul*. Its cover was reconstructed from
  the publisher's PDF (page 1) rather than a flat catalogue image, so
  `coverVerified` is `false` and it should be spot-checked by eye.
- Covers could not be *viewed* in the build environment, so each download was
  verified programmatically (valid image bytes, plausible dimensions, and a
  placeholder check on colour variance) rather than visually. Spot-check by eye.
- Cover artwork remains the property of the respective publishers/authors; it is
  used here to identify the books, which is normal editorial practice.
