# MINARA CAST — Frontend (Netlify-ready)

This is the Next.js frontend only, restructured so it sits at the repo root
with a `netlify.toml` already configured for Netlify's official Next.js
runtime (`@netlify/plugin-nextjs`). No extra settings should be needed.

## Deploy on Netlify

1. Go to app.netlify.com → **Add new site → Import an existing project**
   (or drag-and-drop this folder's zip onto the "Deploy manually" area)
2. If importing via Git: point it at this folder — Netlify will read
   `netlify.toml` automatically and use the correct build command
   (`npm run build`), publish directory (`.next`), and the Next.js plugin
3. Before the first deploy, add these Environment Variables (Site settings →
   Environment variables, or during import):
   - `NEXT_PUBLIC_API_URL` — your deployed backend's URL + `/api`
     (e.g. `https://your-backend.onrender.com/api`)
   - `NEXT_PUBLIC_SOCKET_URL` — your deployed backend's URL
     (e.g. `https://your-backend.onrender.com`)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — `250785952761`
4. Deploy site

If you're using **drag-and-drop deploy** (no Git), Netlify builds in the
browser-based deploy flow too — same environment variables apply, set them
under Site settings → Environment variables and trigger a redeploy afterward
so the build picks them up.

### If the build fails on Netlify

Check the deploy log for the actual error (same principle as before — the
real error is usually a few lines below where `npm install` finishes).
Common ones on a fresh project:
- **Node version mismatch** — already pinned to Node 20 in `netlify.toml`
- **Missing environment variables** — the app builds fine without them, but
  data-fetching sections will just show empty states, not crash

## Deploy on Vercel instead

This same folder also works on Vercel with zero configuration — Root
Directory is irrelevant since this folder *is* the project root. Just
import it as a new project and deploy; no settings to change.

## Backend

The backend (Express + MongoDB + Socket.IO) is a separate, long-running
server and does not go on Netlify or Vercel — deploy it to Render, Railway,
or a VPS. That code lives in the full `minara-cast` project zip, in the
`backend/` folder.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```
