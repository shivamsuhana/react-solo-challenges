# Challenge Engine - Complete Guide

**Production-ready automated skill assessment system for hands-on developer learning.**

---

## 🚀 Quick Start (3 Steps)

### Step 0: Initial Setup (One-Time, After Cloning)

**Run this once after cloning the repository:**

```bash
# Install all dependencies and Playwright browsers
npm run setup
```

This will:
- ✅ Install dashboard dependencies
- ✅ Install all course project dependencies
- ✅ Install all review engine dependencies
- ✅ Install Playwright browsers for E2E tests

**Takes 3-5 minutes** - grab a coffee ☕

### Step 1: Start Dashboard (Keep Running)

Open **Terminal 1** (or Command Prompt) at the repository root:

```bash
# Build dashboard UI (one-time, takes 1-2 minutes)
npm run dashboard:build

# Start dashboard (keep this running)
npm run dashboard
```

✅ Dashboard is now running at **http://localhost:7700**

**Keep this terminal open** - the dashboard stays running.

### Step 2: Work on a Course

Open **Terminal 2** (new terminal) and pick a course:

```bash
# Course 1: React Fundamentals
cd courses/01-react-fundamentals/project
npm run dev

# OR Course 2: RTK Query
cd courses/02-rtk-query/project
npm run dev

# OR Course 3: Next.js App Router
cd courses/03-nextjs-app-router/project
npm run dev
```

✅ Course app opens in browser (Vite: http://localhost:5173, Next.js: http://localhost:3000)

**Note**: Dependencies are already installed from Step 0, so you can directly run `npm run dev`

**Now you have:**
- ✅ Dashboard running at http://localhost:7700 (Terminal 1)
- ✅ Course app running in browser (Terminal 2)
- ✅ Hot reload enabled - changes appear instantly

---

## 📋 Your Workflow

### 1. Pick a Challenge

- **Option A**: Open dashboard → Click course → Click challenge → Read instructions
- **Option B**: Open `project/challenges/01-xxx/README.md` in your editor

### 2. Implement the Challenge

- Edit code in `src/` (or `app/` for Next.js)
- See changes instantly (hot reload)
- Test visually in the browser

### 3. Run Review (Get Scored)

**Two ways to run review:**

#### Option A: From Dashboard UI
1. Open dashboard: http://localhost:7700
2. Click course → Click challenge → Click **"Run review"** button
3. Wait for review to complete (shows progress)
4. See results immediately in dashboard

#### Option B: From Command Line
In Terminal 2 (course project directory):
```bash
# Review all challenges in this course
npm run review

# Review one specific challenge
npm run review -- --challenge=01-user-profile
```

Or from repo root:
```bash
# Review one challenge
npm run review:challenge -- --course=01-react-fundamentals --challenge=01-user-profile

# Review only changed challenges (smart - only reviews what you modified)
npm run review:changed
```

### 4. See Results

- **Dashboard**: Refresh or results appear automatically
- **Files**: Check `courses/01-react-fundamentals/results/challenge-results.json`

**Note**: Review scores are based **ONLY** on what's specified in each challenge's `README.md` (Technical Requirements section). See `REVIEW_SCOPE_CHANGES.md` for details.
- **Progress**: See `PROGRESS.md` in repo root (auto-updated)

### 5. Continue Working

- Fix issues based on review feedback
- Run review again
- Repeat until you pass (score ≥ 60%)

---

## 🎯 What Gets Evaluated

Each challenge is scored using **6 layers**:

| Layer | Weight | What It Checks |
|-------|--------|----------------|
| **Functional Tests** | 35% | Unit/integration tests (Vitest) |
| **Code Quality** | 20% | ESLint checks |
| **Architecture** | 15% | Pattern validation (AST parsing) |
| **Best Practices** | 10% | Code standards & heuristics |
| **E2E Tests** | 15% | Visual/interaction tests (Playwright) |
| **AI Review** | 5% | Readability & maintainability (Groq AI) |

**Total Score**: Weighted average of all layers. **Pass = 60%+**

---

## 📊 Dashboard Features

When dashboard is running (http://localhost:7700), you can:

- ✅ **View pathway summary** - Overall score, completion %, badge level
- ✅ **Browse all courses** - Paginated list (supports 50+ courses)
- ✅ **Browse challenges** - Per-course, paginated (supports 100+ challenges)
- ✅ **Read instructions** - Challenge README with **markdown formatting** (headings, code blocks, lists)
- ✅ **View results** - Last review scores, test details, AI feedback
- ✅ **Run reviews** - Click "Run review" button (no need to use terminal)
- ✅ **Track progress** - See which challenges passed/failed, last run time

**No code editing in dashboard** - edit in your editor, use dashboard to view progress and run reviews.

---

## 🔧 Setup (First Time Only)

### Install All Dependencies

From repo root:

```bash
npm run setup
```

This installs:
- All course project dependencies
- All review engine dependencies
- Playwright browsers (for E2E tests)

**Or manually:**
```bash
# Each course project
cd courses/01-react-fundamentals/project && npm install && cd ../../..
cd courses/02-rtk-query/project && npm install && cd ../../..
cd courses/03-nextjs-app-router/project && npm install && cd ../../..

# Each review engine
cd courses/01-react-fundamentals/review-engine && npm install && cd ../../..
cd courses/02-rtk-query/review-engine && npm install && cd ../../..
cd courses/03-nextjs-app-router/review-engine && npm install && cd ../../..
```

### Enable AI Review (Optional)

AI review provides qualitative feedback (5% of score). To enable:

1. Get a Groq API key: https://console.groq.com
2. Create `.env` file in repo root:
   ```bash
   GROQ_API_KEY=your_key_here
   ```
3. Test connection:
   ```bash
   npm run test:ai-review
   ```

If AI key is not set, AI review is skipped (score = 0) and other layers still run.

---

## 📝 Common Commands

### From Repo Root

| Command | What It Does |
|---------|--------------|
| `npm run dashboard:build` | Build dashboard UI (one-time) |
| `npm run dashboard` | Start dashboard server (port 7700) |
| `npm run review:all` | Review all courses (pathway-level) |
| `npm run review:changed` | Review only challenges whose code changed (smart) |
| `npm run review:course -- --course=01-react-fundamentals` | Review all challenges in one course |
| `npm run review:challenge -- --course=01-react-fundamentals --challenge=01-user-profile` | Review one challenge |
| `npm run progress:update` | Rebuild progress.json and PROGRESS.md |
| `npm run test:ai-review` | Test AI review connection |
| `npm run setup` | Install all dependencies (first-time setup) |

### From Course Project Directory

| Command | What It Does |
|---------|--------------|
| `npm run dev` | Start dev server (hot reload enabled) |
| `npm run review` | Review all challenges in this course |
| `npm run review -- --challenge=01-user-profile` | Review one challenge |
| `npm test` | Run unit tests only |
| `npm run test:e2e` | Run E2E tests only |

---

## 🎓 How Challenges Work

**Challenges are embedded in the project, not separate puzzles.**

- Each course has **one runnable app**
- Every challenge **adds or modifies functionality** inside that app
- You work in the **real codebase** (`project/src/` or `project/app/`)
- You **run the app** to see your changes (`npm run dev`)
- Tests verify **technical requirements** (not visual behavior)

**Workflow:**
1. **Run app** (`npm run dev`) → See changes visually
2. **Verify functionality** → Interact with features in browser
3. **Run review** (dashboard or command) → Get comprehensive scoring

**Important**: Review will **ONLY check what's specified** in each challenge's `README.md` file (Technical Requirements section). All code quality guidelines, best practices, and industry standards are clearly listed in the README. No hidden requirements!

---

## 📚 Course Structure

Each course has:

```
courses/01-react-fundamentals/
├── project/              → Runnable app (your workspace)
│   ├── src/              → Edit code here
│   ├── challenges/       → Challenge instructions
│   │   ├── 01-user-profile/
│   │   │   ├── README.md        → Instructions (markdown)
│   │   │   └── README.md  → Instructions + Technical Requirements (all in one file)
│   │   │   └── metadata.json    → Challenge config
│   └── tests/            → Test files (don't edit)
├── review-engine/        → Automated review system
└── results/              → Auto-generated review results
```

---

## 🛡️ Help vs Completion

### We Help With:
- ✅ Setup instructions
- ✅ Workflow guidance
- ✅ Requirements documentation
- ✅ Challenge instructions (what to build)
- ✅ Troubleshooting

### We Do NOT Provide:
- ❌ Solution code
- ❌ Implementation examples
- ❌ Step-by-step code walkthroughs

**Completion is strict**: Your code must pass the automated review (score ≥ 60%). See [LEARNER_GUIDE.md](./LEARNER_GUIDE.md) for details.

---

## 🔍 Review Results

After running a review, results are saved to:

- **Challenge level**: `courses/{course}/results/challenge-results.json`
- **Course level**: `courses/{course}/results/course-summary.json`
- **AI feedback**: `courses/{course}/results/ai-feedback.json`
- **Pathway level**: `pathway-review/pathway-summary.json`
- **Progress**: `learner-results/progress.json` and `PROGRESS.md`

**View in dashboard** or open JSON files to see detailed scores.

---

## 🚨 Troubleshooting

### Dashboard Issues

**"Build UI: cd dashboard/app && npm install && npm run build"**
→ Run `npm run dashboard:build` first

**Port 7700 already in use**
→ Use different port: `DASHBOARD_PORT=8080 npm run dashboard`

**No progress shown in dashboard**
→ Run at least one review first, or: `npm run progress:update`

### Review Issues

**Tests fail to run**
→ Install dependencies: `npm run setup` or `cd {course}/project && npm install`

**E2E tests fail**
→ Install Playwright browsers: `cd {course}/project && npx playwright install`
→ This is a one-time setup. After installation, E2E tests will work.
→ See `REVIEW_SCORING_EXPLAINED.md` for details on why E2E score might be 0%

**Review scores seem low**
→ Review **ONLY checks what's in challenge `README.md` (Technical Requirements section)** - no hidden requirements
→ See `REVIEW_SCOPE_CHANGES.md` for how review scope works
→ All code quality guidelines and best practices are listed in README files

**AI review shows 0%**
→ Set `GROQ_API_KEY` in `.env` file (see "Enable AI Review" above)

**Review command not found**
→ Make sure you're in the course project directory, or use root commands with `--course=` flag

### Course App Issues

**Port 5173 or 3000 already in use**
→ Kill the process using that port, or change port in `vite.config.ts` / `next.config.js`

**Hot reload not working**
→ Check that `npm run dev` is running and browser console for errors

**Changes not appearing**
→ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📖 More Documentation

- **[LEARNER_GUIDE.md](./LEARNER_GUIDE.md)** - Help vs strict completion policy
- **[QUICK_START.md](./QUICK_START.md)** - Quick workflow guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[COMMANDS.md](./COMMANDS.md)** - Complete command reference
- **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** - Environment variables (GROQ_API_KEY)
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Detailed troubleshooting
- **[dashboard/README.md](./dashboard/README.md)** - Dashboard-specific docs

---

## 🎯 System Overview

This system provides:

- ✅ **3 courses** with real, runnable applications
- ✅ **9 challenges** (3 per course) - basic to advanced progression
- ✅ **Automated review** - 6-layer comprehensive evaluation
- ✅ **Progress tracking** - Auto-updated progress.json and PROGRESS.md
- ✅ **Dashboard UI** - View progress, instructions, run reviews
- ✅ **AI review** - Qualitative feedback via Groq API (optional)
- ✅ **Hot reload** - Instant feedback while coding
- ✅ **Production-ready** - Scalable to 50+ courses, 100+ challenges per course

---

## 📝 License

This repository is part of the SOLO Challenge Engine system.

---

## 🚀 Ready to Start?

1. **Start dashboard**: `npm run dashboard:build` then `npm run dashboard` (Terminal 1)
2. **Open course**: `cd courses/01-react-fundamentals/project && npm install && npm run dev` (Terminal 2)
3. **Work on challenge**: Edit code, see changes, run review from dashboard or command
4. **See results**: Check dashboard or results files
5. **Continue**: Fix issues, run review again, repeat until you pass

**Happy coding! 🎉**
