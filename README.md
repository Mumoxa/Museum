# Luchelle's South African Time Machine

A storybook website, *"A journey through the people, places and events that shaped our country"*, for a nine-year-old reader with a parent alongside. It covers prehistory to October 2026.

## Run it

```bash
npm install
npm run dev          # development server on 0.0.0.0:5173
npm run build        # type-check and production build into dist/
npm run preview      # serve dist/ on 0.0.0.0:4173
npm run test:e2e     # headless Chromium checks (needs a running preview server)
```

The end-to-end script uses `puppeteer-core` and looks for a Chromium binary at `CHROME_PATH` (default `/tmp/chromium`). Set `APP_URL` if the app is not on `http://localhost:4173/`.

## What is in the book

- **Book engine**: closed cover, "Open My History Book", two-page spread on wide screens, one page with swipe on phones, page-turn animation that follows the pointer, corner taps, arrow keys, previous and next, contents, bookmarks, and progress restored from `localStorage`.
- **Content**: Prologue, Chapters 1–12 and Epilogue. Each chapter has an opener, a question, short pages, facts with sources, "What would you ask?", a quiz, a handoff mystery, a "Question for Mum or Dad", and "Tell me more" notes. Parent notes appear when switched on.
- **Interactives**: timeline (log-scaled deep time, compressed early period, linear modern period), kingdoms atlas, Cape coast map, sea routes, a "who controlled this area?" tool with caveats, the Castle's five bastions, Robben Island layers, the democracy builder, a voting comparison, portrait name cards, matching and ordering puzzles, and an achievement passport.
- **Narration**: browser Web Speech API. Nothing starts on its own. Play, pause, resume, stop, replay, speed and voice choice, and sentence highlighting. Falls back to a plain message if speech is unavailable.
- **Sound**: restrained page-turn and quiz tones made with Web Audio. Off by default and separate from narration.
- **Certificate**: name entry, PNG download and printing, generated in the browser.
- **Accessibility**: keyboard operation, visible focus, reduced-motion setting (follows the device by default), larger text option, simplified reading mode, and screen-reader labels on the interactives.

## Content and sources

- Written sources for every chapter are in `src/content/sources.ts` and are listed in the app under **Sources**.
- Photographs and their licences are in `public/images/PROVENANCE.md`. Only real photographs from Wikimedia Commons with checked licences are used. No AI-generated or reconstructed images are included.
- Current-affairs material after mid-2026 is labelled as open questions with dates. Check a current news source for updates.

## Data and privacy

Nothing is sent to a server. Progress, bookmarks, quiz answers, badges, the certificate name and written questions are stored in the browser's `localStorage` on the reader's device.
