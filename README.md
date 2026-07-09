# MartinEdu — SEAG Practice Platform

A friendly, low-cognitive-load practice site for a P7 pupil preparing for the
Northern Ireland **SEAG** transfer test. Pick **Maths** or **English**, take a
**Full Test (56)** or **Mini-Test (16)**, rate your confidence on every
question, then get a pedagogically-grounded report and interactive mini-lessons.

Static site — deploys straight to GitHub Pages / `martinedu.co.uk`.

---

## What the real SEAG looks like (verified)

The assessment is **two papers, each 60 minutes, 56 questions**, sat on separate
Saturdays. Each paper actually **mixes both English and Maths**; across the whole
assessment there are roughly **56 English + 56 Maths** questions. Format is
**mostly multiple choice (five options, A–E)** with some short written answers;
spelling/punctuation sections use an "N — no mistake" option. Marked by GL
Assessment, reported as a standardised age score.

This site lets the pupil practise **one subject at a time** (a sensible teaching
choice), with the Full Test sized to a realistic single-subject paper (56) and
a Mini-Test (16) for daily practice. Both numbers live in `js/data.js → MODES`
and can be changed in one place.

## What's built and working

- **Subject → mode flow**: Maths / English, Full (56 Q) or Mini (16 Q).
- **SEAG-style questions**: five-option multiple choice (A–E) plus typed numeric
  answers for Maths (auto-checked; tolerant of `£`, `%`, spaces, decimals).
- **Visual questions** (new): inline-SVG figures for bar charts, pictograms,
  angles, triangles, rectangles (perimeter/area), coordinate grids, clocks and
  shaded fraction bars — the visual styles SEAG relies on.
- **Reading comprehension**: four longer, original passages (fiction, non-fiction,
  poetry, biography) with literal, inferential and vocabulary-in-context questions.
- **Confidence gauge** on every question: *No idea · Not so sure · Neutral ·
  Quite sure · Very sure*.
- **Diagnostic report**: overall score + per-topic breakdown; confidence
  calibration matrix (Secure / Confident-slip / Fragile / Gap); **confident slips**
  flagged explicitly; **priority revision plan**; full per-question review with
  explanations; **Download as PDF**.
- **Interactive mini-lessons for every topic** (new): all 15 topics now have an
  authored, child-friendly guided lesson (theory + practice with instant
  feedback), several using diagrams.
- **Minimalist, age-appropriate design**: rounded *Nunito* font, calm palette,
  large touch targets, generous whitespace; figures print cleanly in the PDF.

## Pedagogy behind the report

- **Retrieval practice & spacing** (Roediger & Karpicke, 2006).
- **Metacognitive calibration** (Flavell; Dunlosky & Rawson, 2012) — does
  confidence match accuracy? Mismatches are surfaced.
- **Hypercorrection effect** (Butterfield & Metcalfe, 2001) — high-confidence
  errors, once corrected, are especially well remembered, so they are prioritised.
- **Address misconceptions before fluency** — a confidently-held wrong rule is
  ranked above a simple gap.

Priority score per topic = *teaching-need* `(1 − accuracy) × 100` + *misconception
boost* `(confident-wrong × 30)`, with a low-evidence caveat when a topic had < 3
questions in that test.

## Honest coverage (please read)

Exact counts in this build, and **how each was checked** — nothing here is
estimated or claimed without verification:

| Subject | Total questions | Per topic |
|---|---|---|
| **Maths** | **192** (19 with diagrams) | Number 28 · Fractions/Decimals/% 43 · Ratio 19 · Algebra 28 · Measures 15 · Shape & Space 22 · Money 19 · Data & Probability 18 |
| **English** | **151** | Comprehension 32 (4 passages) · Synonyms/Antonyms 41 · Spelling 21 · Cloze 15 · Grammar 15 · Vocabulary 15 · Punctuation 12 |

- **Mini-lessons:** all **15** topics have a fully authored guided lesson.
- **How Maths was verified:** every Maths question is produced by a generator
  that *computes* its own answer, so answers are correct by construction. An
  **independent** checker (`build/verify-maths.js`) then re-derives 45+ answers
  straight from the question text and checks every item structurally (answer is
  among the options, options are unique, ≥4 options). All checks pass.
- **How English was verified:** English is **hand-authored** (correctness there is
  semantic, not arithmetic) and every item passes structural checks
  (`build/verify-english.js`: answer present, options unique, no blanks). The
  wording and answers were written and read for correctness; if you spot any
  phrasing you'd tighten to exam-specialist standard, it's a one-line data edit.
- **Scale vs. repetition — honest note.** Every topic has more questions than a
  single Full Test needs, so one test never repeats a question, and you can sit a
  few different tests before overlap becomes noticeable. This is **not yet** a
  bank so large that 15 tests run with near-zero repetition — reaching that is
  just more of the same authoring (the generators make Maths easy to scale;
  English needs curated items). Say the word and I'll grow it further.

## How to grow the bank further

The app is fully data-driven — **no code changes needed** to add questions:

- Add objects to `data/maths/questions.json` / `data/english/questions.json`,
  or add passages to `data/english/comprehension.json`.
- Question schema: `id`, `topic`, `type` (`mcq` | `numeric`), `difficulty`
  (1–3), `stem`, optional `figure` (inline SVG string for a diagram),
  `options` (mcq), `answer`, `accept` (extra numeric forms), `unit`,
  `explanation`, `skill`.
- Topic IDs must match those in `js/data.js → MartinData.TOPICS`.
- Maths questions and diagrams can be regenerated/extended from the scripts in
  `build/` (`generate-maths.js`, `figures.js`), which verify as they build.
- To add or edit a lesson, drop/edit `data/lessons/<topicId>.json`
  (copy the shape of `fdp.json`).

## Run locally

The app loads JSON with `fetch`, so serve it over http (not `file://`):

```bash
cd MartinEdu
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to martinedu.co.uk (GitHub Pages)

1. Commit this folder to your GitHub repo and push.
2. Repo → **Settings → Pages** → deploy from your default branch, root.
3. The `CNAME` file already contains `martinedu.co.uk`; point your domain's DNS
   at GitHub Pages.
4. All paths are relative, so it works from a repo subpath or a custom domain.

*Note:* the PDF download uses the html2pdf.js CDN; if a network blocks it, the
button falls back to the browser's "Print → Save as PDF".

## Project structure

```
MartinEdu/
├── index.html            App shell + hash router mount
├── css/styles.css        Design system (Nunito, calm palette, figure + print styles)
├── js/
│   ├── data.js           Topic taxonomy, loading, test assembly, answer checking
│   ├── quiz.js           Test runner + confidence gauge (renders figures)
│   ├── report.js         Marking + diagnostic report (pedagogy)
│   ├── lessons.js        Interactive lessons (all topics authored)
│   ├── pdf.js            PDF export (html2pdf + print fallback)
│   └── app.js            Router, home & mode-select views
├── build/                Question generators + verifiers (dev-time; not served)
└── data/
    ├── maths/questions.json
    ├── english/questions.json
    ├── english/comprehension.json
    └── lessons/*.json     (15 topic lessons)
```
