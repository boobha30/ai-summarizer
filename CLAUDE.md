# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this project is

A small AI text summarizer web app. The user pastes text, the app sends it to
a serverless function, which calls the Claude API and returns a summary. This
is a learning project — code should stay simple and easy to follow over being
clever or highly abstracted.

## Stack

- **React 19 + Vite** for the frontend (`npm run dev`, `npm run build`,
  `npm run preview`).
- **Plain CSS** — no Tailwind, no CSS-in-JS, no UI/component libraries
  (no MUI, no Chakra, no shadcn, etc.). Every visual thing is hand-written
  CSS.
- **One Vercel serverless function**: `api/summarize.js`. This is the only
  backend code. It receives text from the frontend, calls the Claude API
  server-side (so the API key never reaches the browser), and returns the
  summary as JSON.
- `eslint` is configured (`npm run lint`) — run it after changes to JS/JSX.

## Project structure rules

- **One component per file**, living in `src/components/`. Example:
  `src/components/SummaryButton.jsx` exports exactly one component.
- **One CSS file per component**, same name, same folder. Example:
  `SummaryButton.jsx` pairs with `SummaryButton.css`, imported directly in
  that component file (`import "./SummaryButton.css"`).
- Don't put multiple components in one file, and don't share one CSS file
  across multiple components. Shared styles (CSS variables, resets, global
  layout) belong in `src/index.css`, not in a component's own CSS file.
- `App.jsx` composes components; it shouldn't itself grow into a large
  component — pull pieces out into `src/components/` instead.
- Keep the serverless function at `api/summarize.js` — don't split it into
  multiple files or add a backend framework. If it needs a helper, prefer
  inlining it with a comment over adding new files, unless it clearly stops
  being simple.

## Coding style

- Write code for someone learning React/JS — favor clarity over brevity.
- Add short comments explaining *why* a non-obvious step exists (e.g. why a
  value is debounced, why a header is set, why an error is caught). Don't
  comment obvious lines.
- Prefer plain `useState`/`useEffect` and function components. Avoid
  reaching for extra state-management or data-fetching libraries — this app
  is small enough not to need them.
- No UI component libraries, icon libraries, or CSS frameworks — if an icon
  is needed, use an inline SVG (see `public/icons.svg`) or plain text.
- Keep dependencies minimal; think twice before adding anything to
  `package.json` beyond what's already there.

## API key / secrets

- The Claude API key must only be read in `api/summarize.js` via an
  environment variable (e.g. `process.env.ANTHROPIC_API_KEY`), never
  hardcoded and never exposed to frontend code.
- Don't commit `.env` files; they're covered by `.gitignore`.

## When adding a new feature

1. If it needs new UI, add a new component file + its own CSS file under
   `src/components/`.
2. If it needs new backend behavior, extend `api/summarize.js` rather than
   creating a second serverless function, unless the user asks otherwise.
3. Keep the summarization flow simple: textarea → "Summarize" button → call
   `/api/summarize` → show result/loading/error state.
