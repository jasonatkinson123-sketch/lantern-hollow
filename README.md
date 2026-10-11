# Lantern Hollow

A self-contained, adaptive woodland math game for short, low-pressure practice. Ten encounters make one journey; there is no countdown, lost life, or endless practice queue.

## Play

Open the deployed Site. Start a trail, select an answer with a click/tap (or keys 1–4), read the feedback, and continue. Pip offers a hint. Orin's guardian riddles change the framing of familiar ideas. The tenth encounter ends at camp. An unfinished journey resumes after closing the tab.

The Parent journal is in the upper right. It includes skill estimates, independent transfer successes, recent errors, per-session history, and progress backup/restore. It is deliberately not PIN protected. Progress belongs to this browser and origin; it does not sync between devices. A private window or cleared storage can lose it. Use a JSON backup to move progress. The app reports storage failures instead of silently promising to save.

## Educational scope

The supplied October 2026 ISEE analysis motivated a narrow first release: fractional parts, equivalent fractions/decimals/percents, percent amounts, ratios, direct proportions, reverse percents, and inverse relationships. Performance in that report was mixed, including successful proportion and converse-percent items alongside errors in related representations. Consequently the game does not declare any skill mastered or deficient from a single test item. Neither the report nor identifying student data is shipped.

Seven skill estimates start with a low-confidence 0.18 prior. Unseen skills display an em dash. For an independent correct response:

`score += 0.095 * (1 - score) + (transfer ? 0.035 : 0)`

Errors subtract 0.105; scores stay within 0.05–0.97. Hinted answers and immediate guided-retry successes do not increase the estimate. Four difficulty bands use thresholds 0.38, 0.62, and 0.82. “Growing strong” also requires two independent transfer successes and two representations. These are transparent heuristics, not a calibrated psychometric model, ISEE score predictor, or validated learning intervention.

Selection balances unseen skills, lower estimates, and time since practice. An error or hinted answer queues an easier immediate encounter and a later transfer retry after intervening attempts. A failed immediate retry does not trigger an endless chain of the same skill. Due reviews persist across sessions. Encounters five and ten normally become transfer challenges; necessary support takes precedence. Every session ends after exactly ten encounters, including guided retries. The 8–10 minute duration is a pacing target, not enforced or yet measured with a child.

Questions vary among short stories, fraction bars, paired tables, decimals/percents, and symbolic proportions. Advanced items introduce successive percent changes, total-to-ratio-part inference, reverse percent increases, and inverse relationships. Guardian questions include remaining amounts, discount prices, equivalent-share comparisons, part-to-whole versus part-to-part, and direction-of-change reasoning.

## Repository

- `dist/index.html` — entry page
- `dist/style.css` — responsive, reduced-motion-aware presentation
- `dist/art.mjs` — original vector woodland, fox, owl, and trail
- `dist/engine.mjs` — generators, skill estimates, scheduler, save validation
- `dist/app.mjs` — UI, local persistence, journal, backup/restore
- `tests/` — generator and simulated-DOM gameplay checks
- `.openai/hosting.json` — static hosting configuration

There are no production dependencies, API keys, external fonts, analytics, or network calls in the game. Serve `dist/` over HTTP; no build step is required. Do not open the HTML as a `file:` URL because ES modules require an HTTP origin.

## Tests

Node.js 22 or later recommended. Install development dependencies with `npm install`, then run `npm test`. The engine suite can run without dependencies: `node --test tests/engine.test.mjs`.

Tests cover 16,800 generator variants, independent mathematical checks, transfer calculations, unique choices, mastery progression, limited credit for assistance, delayed review, all-error termination, corrupted saves, start/hints/errors, pause/reload, final-answer reload, keyboard choices, HTML escaping, disabled storage, backup restore, parent history, and exactly-once session completion.

Validation limitation: simulated-DOM tests verify behavior, not pixel layout or real-device browser rendering. Managed browser-preview capability was unavailable during this implementation. Real-device visual QA and observing the first few child sessions are the remaining practical checks.

## Design

Synonym Forest's published source inspired the finite encounters, friendly woodland creatures, simple answer controls, and persistent learning. Lantern Hollow uses original SVG scenery, a warm daylight palette, its own characters and adaptive math logic. Six destinations rotate as completed journeys accumulate. Lanterns reward participation and persistence; math evidence is recorded separately.
