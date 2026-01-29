# Progress Dashboard

Web UI to view pathway and course progress, challenge instructions, last results, and run reviews.

## Quick start

From the **repository root**:

```bash
# Install dashboard server deps (once)
cd dashboard && npm install

# Build the UI (once)
npm run dashboard:build

# Start server (API + UI at http://localhost:7700)
npm run dashboard
```

The dashboard uses **port 7700** by default so it does not conflict with course projects (Vite 5173, Next.js 3000). Override with `DASHBOARD_PORT=8080 npm run dashboard` if needed.

Or from root: `npm run dashboard` (after `npm run dashboard:build` once).

## What the dashboard does

- **Pathway summary** – Overall score, completion %, badge, challenges completed
- **Courses list** – Paginated (20 per page), supports 50+ courses
- **Challenges per course** – Paginated (50 per page), supports 100+ challenges
- **Challenge detail** – Instructions (README), last results, AI feedback
- **Run review** – Trigger review for any challenge from the UI (no code editing in the UI)

Code is edited in your editor; the dashboard is for progress, instructions, and running reviews only.

## API (when server is running)

- `GET /api/progress` – Full progress JSON
- `GET /api/courses?page=1&limit=20` – Courses list (paginated)
- `GET /api/courses/:courseId` – Course detail
- `GET /api/courses/:courseId/challenges?page=1&limit=50` – Challenges (paginated)
- `GET /api/courses/:courseId/challenges/:challengeId` – Challenge detail + instructions + results
- `POST /api/review` – Body: `{ courseId, challengeId }` – Run review, returns updated progress

## Dev mode (hot reload)

From **repository root** (runs API on 7700 + UI with HMR on 5174):

```bash
npm run dashboard:dev
```

- **API**: http://localhost:7700
- **UI with hot reload**: http://localhost:5174 (open this in the browser; `/api` is proxied to 7700)

Or run separately:
- Terminal 1: `npm run dashboard:api` (API on 7700)
- Terminal 2: `npm run dashboard:ui:dev` (Vite dev server on 5174 with HMR)
