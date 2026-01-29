# Next.js App Router Project

This is a **real, runnable Next.js application** where you'll work on challenges by modifying the code.

## 🚀 Getting Started

### 1. Install Dependencies

**Note:** If you haven't run setup yet, go to repo root and run `npm run setup` first to install all dependencies and Playwright browsers.

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Work on Challenges

Challenges are embedded in this project. Each challenge adds or modifies functionality:

- **Challenge 01**: Server Components and Basic Routing (`challenges/01-server-components/README.md`) - **BEGINNER**
- **Challenge 02**: Data Fetching and API Routes (`challenges/02-data-fetching/README.md`) - **INTERMEDIATE**
- **Challenge 03**: Fullstack Features and Metadata (`challenges/03-fullstack-features/README.md`) - **ADVANCED**

### 4. Verify Your Work

**Visual Verification (Primary Method):**
1. Run `npm run dev`
2. Open the app in your browser
3. Interact with your features
4. Confirm everything works as expected visually

**Then Run Review for Scoring:**
```bash
# Review all challenges
npm run review

# Review specific challenge
npm run review -- --challenge=01-server-components
```


## 📊 Progress Evidence

*Auto-updated when you run review. Last run: 1/29/2026, 6:36:33 PM*

| Metric | Value |
|--------|-------|
| Challenges completed | 0 / 3 (0%) |
| Average score | 22.5% |

| Challenge | Status |
|-----------|--------|
| Server Components and Basic Routing | Fail |

## 📋 Challenge Workflow

1. **Read the challenge** in `challenges/{challenge-id}/README.md`
2. **Modify code** in `app/` directory
3. **Run the app** (`npm run dev`) to see your changes
4. **Verify visually** that features work correctly
5. **Run review** (`npm run review`) to get comprehensive scoring

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests (Playwright)

**First-time setup (required once):**
```bash
# Install Playwright browsers (required for E2E tests)
npx playwright install
```

**Run E2E tests:**
```bash
npm run test:e2e
```

E2E tests verify visual output and user interactions that you can see in the browser.

**Note:** If you see "Executable doesn't exist" errors, run `npx playwright install` to download the required browsers (Chromium, Firefox, WebKit).

### Review System

The review system runs:
- ✅ Unit tests (functional correctness)
- ✅ E2E tests (visual/interaction verification)
- ✅ Code quality checks (ESLint)
- ✅ Architecture validation (AST pattern checks)
- ✅ Best practices review
- ✅ AI code review (readability & maintainability)

## 📁 Project Structure

```
project/
├── app/                     → Next.js App Router directory
│   ├── page.tsx            → Home page
│   ├── layout.tsx          → Root layout
│   ├── api/                → API routes
│   └── ...
├── challenges/              → Challenge definitions
│   ├── 01-server-components/    (BEGINNER)
│   ├── 02-data-fetching/         (INTERMEDIATE)
│   └── 03-fullstack-features/    (ADVANCED)
├── tests/                   → Test files
│   ├── challenge-*.test.tsx  → Unit tests
│   └── e2e/                → E2E tests (Playwright)
└── package.json
```

## 🎯 Important Notes

- **This is a real app** - you can see your changes immediately
- **Visual verification first** - run the app to confirm features work
- **Then get scored** - run review for comprehensive evaluation
- **Tests verify requirements** - they check technical correctness, not just visual appearance
- **Progressive difficulty** - Challenges go from basic → intermediate → advanced

## 🔍 Review Output

Results are saved to `../results/`:
- `challenge-results.json` - Individual challenge scores
- `course-summary.json` - Overall course summary
- `ai-feedback.json` - AI review feedback (if available)
