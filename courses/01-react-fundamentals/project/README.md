# React Fundamentals Project

This is a **real, runnable React application** where you'll work on challenges by modifying the code.

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

The app will open at `http://localhost:5173`

### 3. Work on Challenges

Challenges are embedded in this project. Each challenge adds or modifies functionality:

- **Challenge 01**: User Profile Component (`challenges/01-user-profile/README.md`)
- **Challenge 02**: Todo List Application (`challenges/02-todo-list/README.md`)
- **Challenge 03**: State Management with Context (`challenges/03-state-management/README.md`)

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
npm run review -- --challenge=01-user-profile
```


## 📊 Progress Evidence

*Auto-updated when you run review. Last run: 1/29/2026, 7:52:16 PM*

| Metric | Value |
|--------|-------|
| Challenges completed | 1 / 3 (33.3%) |
| Average score | 77.3% |

| Challenge | Status |
|-----------|--------|
| User Profile Component | Pass |

## 📋 Challenge Workflow

1. **Read the challenge** in `challenges/{challenge-id}/README.md`
2. **Modify code** in `src/` directory
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
├── src/                    → Your code goes here
│   ├── components/         → React components
│   ├── contexts/           → React contexts
│   └── ...
├── challenges/             → Challenge definitions
│   ├── 01-user-profile/
│   ├── 02-todo-list/
│   └── 03-state-management/
├── tests/                  → Test files
│   ├── challenge-*.test.tsx  → Unit tests
│   └── e2e/                → E2E tests (Playwright)
└── package.json
```

## 🎯 Important Notes

- **This is a real app** - you can see your changes immediately
- **Visual verification first** - run the app to confirm features work
- **Then get scored** - run review for comprehensive evaluation
- **Tests verify requirements** - they check technical correctness, not just visual appearance

## 🔍 Review Output

Results are saved to `../results/`:
- `challenge-results.json` - Individual challenge scores
- `course-summary.json` - Overall course summary
- `ai-feedback.json` - AI review feedback
