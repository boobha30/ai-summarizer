# AI Text Summarizer

A small web app that turns long text into a short summary. Paste in some text,
pick a length, click **Summarize**, and Google Gemini writes a shorter version
for you.

This is a learning project, so the code is kept simple and commented.

## Features

- **Three summary lengths**
  - **Short:** exactly 3 bullet points.
  - **Medium:** one paragraph.
  - **Detailed:** 4-8 bullet points.
- **Clean output:** bullet lines from the model are shown as a real list, and
  line breaks are kept.
- **Length stat** under each summary, e.g. "170 words → 45 words (74% shorter)".
- **Copy button:** copies the summary with "•" bullets and shows "Copied ✓" for
  2 seconds.
- **History:** your last 20 summaries are saved in your browser
  (`localStorage`). Click one to show it again, or clear them all.
- **Clear states:** the button shows "Summarizing…" while waiting, and errors
  appear in a friendly message box.
- **Works on phones:** the layout fits narrow screens with no sideways scrolling.

## Tech stack

- **React 19 + Vite** for the frontend
- **Plain CSS**, with one CSS file per component and no CSS frameworks or UI
  libraries
- **One Vercel serverless function** (`api/summarize.js`) as the backend
- **Google Gemini** through the official `@google/genai` package
  (model: `gemini-3.5-flash-lite`, which is on the free tier)

## Run it locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

3. Create a `.env` file in the project root:

   ```
   GEMINI_API_KEY=your-key-here
   ```

4. Start the app with the Vercel CLI:

   ```bash
   npx vercel dev
   ```

   The first run asks you to log in and link the project.

5. Open <http://localhost:3000>.

> **Why not `npm run dev`?** It starts only the Vite frontend. The
> `api/summarize.js` function wouldn't run, so summarizing would fail.
> `vercel dev` runs both together.

## Security

The Gemini API key never reaches the browser.

- The frontend never talks to Gemini directly. It sends your text to this app's
  own `/api/summarize` endpoint.
- That endpoint is a Vercel serverless function running on the server. It reads
  the key from the `GEMINI_API_KEY` environment variable, calls Gemini, and sends
  back only the summary.
- The key isn't in any frontend code, so it's never in the JavaScript bundle the
  browser downloads, and it can't be seen in DevTools.
- `.env` is listed in `.gitignore`, so the key is never committed to git. When
  you deploy, set `GEMINI_API_KEY` in your Vercel project's environment variable
  settings instead.
