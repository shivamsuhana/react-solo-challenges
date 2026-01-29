# Challenge Engine - System Documentation

**Complete technical documentation for developers working on the automation system, review engines, and infrastructure.**

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Repository Structure](#repository-structure)
3. [Automation Flow](#automation-flow)
4. [Review Engine Architecture](#review-engine-architecture)
5. [Scoring System](#scoring-system)
6. [Scripts Reference](#scripts-reference)
7. [Dashboard System](#dashboard-system)
8. [Configuration Files](#configuration-files)
9. [Data Flow](#data-flow)
10. [Extending the System](#extending-the-system)
11. [Code Quality & Patterns](#code-quality--patterns)

---

## System Overview

The Challenge Engine is a **production-ready automated skill assessment system** that evaluates learner code through multiple layers of analysis. It supports:

- **Multiple courses** (currently 3: React Fundamentals, RTK Query, Next.js App Router)
- **Multiple challenges per course** (currently 3 per course, scalable to 100+)
- **6-layer evaluation system** (Functional Tests, Code Quality, Architecture, Best Practices, E2E Tests, AI Review)
- **Automated progress tracking** with README evidence updates
- **Dashboard UI** for viewing progress and running reviews
- **Pathway-level aggregation** across all courses

### Key Principles

1. **Deterministic Review**: All scoring is automated and reproducible
2. **No Hidden Requirements**: Everything evaluated is explicitly listed in challenge READMEs
3. **Real Applications**: Learners work in actual runnable projects, not isolated puzzles
4. **Evidence-Based**: All results are stored in JSON files and README evidence sections
5. **Scalable**: Designed to handle 50+ courses and 100+ challenges per course

---

## Repository Structure

```
Challenge-Engine/
├── courses/                          # Course definitions
│   ├── 01-react-fundamentals/
│   │   ├── project/                 # Runnable app (learner workspace)
│   │   │   ├── src/                 # Learner code goes here
│   │   │   ├── challenges/         # Challenge definitions
│   │   │   │   ├── 01-user-profile/
│   │   │   │   │   ├── README.md   # Instructions + Technical Requirements
│   │   │   │   │   └── metadata.json # Challenge config
│   │   │   └── tests/               # Test files (don't edit)
│   │   ├── review-engine/          # Course-specific review engine
│   │   │   ├── index.js            # Main review orchestrator
│   │   │   ├── test-runner.js      # Runs unit tests (Vitest)
│   │   │   ├── e2e-runner.js       # Runs E2E tests (Playwright)
│   │   │   ├── linter.js           # ESLint checks
│   │   │   ├── architecture-checker.js  # AST pattern validation
│   │   │   └── best-practices.js    # Code standards checks
│   │   ├── ai-review/              # AI review module
│   │   │   └── index.js            # Groq API integration
│   │   ├── course-config.json      # Course configuration
│   │   └── results/                 # Auto-generated results
│   │       ├── challenge-results.json
│   │       ├── course-summary.json
│   │       └── ai-feedback.json
│   ├── 02-rtk-query/                # Same structure
│   └── 03-nextjs-app-router/       # Same structure
│
├── global-review/                   # Pathway-level aggregation
│   ├── run-all-reviews.js          # Orchestrates all course reviews
│   ├── course-summary-generator.js # Shared course summary generator
│   ├── scoring-engine/             # Pathway scoring logic
│   │   └── index.js
│   └── ai-review/                  # Pathway AI aggregation
│       └── index.js
│
├── pathway-review/                  # Pathway configuration & results
│   ├── pathway-config.json         # Course weights, badge levels
│   ├── pathway-summary.json        # Auto-generated pathway summary
│   └── skill-breakdown.json        # Skill analysis
│
├── scripts/                         # Utility scripts
│   ├── setup.js                    # One-time setup (all deps)
│   ├── update-progress.js          # Aggregates progress.json
│   ├── update-readme-evidence.js   # Updates README evidence sections
│   ├── run-review-changed.js      # Smart review (git diff)
│   ├── run-review-course.js        # Review one course
│   ├── run-review-challenge.js     # Review one challenge
│   ├── get-changed-challenges.js   # Git diff → challenges
│   ├── health-check.js             # System validation
│   ├── ci-validate.js              # CI/CD validation
│   └── validate-structure.js       # Repo structure check
│
├── dashboard/                       # Dashboard UI + API
│   ├── app/                        # React UI (Vite)
│   │   ├── src/
│   │   └── package.json
│   ├── server.js                   # Express API server
│   └── package.json
│
├── learner-results/                 # Global progress tracking
│   └── progress.json                # Aggregated progress (all courses)
│
├── .github/workflows/               # GitHub Actions
│   └── solo-skill-review.yml       # Auto-review on push
│
└── README.md                        # User-facing documentation
```

---

## Automation Flow

### 1. Review Execution Flow

```
User runs review
    ↓
Review Engine (course-specific)
    ├── Functional Tests (35%) → Vitest
    ├── Code Quality (15%) → ESLint
    ├── Architecture (10%) → AST parsing
    ├── Best Practices (10%) → Heuristics
    ├── E2E Tests (15%) → Playwright
    └── AI Review (15%) → Groq API
    ↓
Calculate weighted score
    ↓
Write challenge-results.json
    ↓
Generate course-summary.json
    ↓
Update progress.json (via update-progress.js)
    ↓
Update README evidence (via update-readme-evidence.js)
```

### 2. Pathway Review Flow

```
User runs global review (npm run review:all)
    ↓
global-review/run-all-reviews.js
    ├── For each course:
    │   ├── Run course review engine
    │   ├── Load course-summary.json
    │   └── Aggregate results
    ├── Aggregate AI feedback
    ├── Calculate pathway score (weighted average)
    ├── Generate pathway-summary.json
    └── Update README evidence (all courses + root)
```

### 3. Smart Review (Changed Files Only)

```
User runs npm run review:changed
    ↓
scripts/get-changed-challenges.js
    ├── Git diff (vs origin/main or HEAD)
    ├── Map files → challenges (file-to-challenge-map.js)
    └── Output: list of affected challenges
    ↓
scripts/run-review-changed.js
    ├── For each changed challenge:
    │   └── Run review for that challenge only
    └── Update progress & evidence
```

### 4. GitHub Actions Automation

```
Push to repository
    ↓
.github/workflows/solo-skill-review.yml
    ├── Checkout code
    ├── Install dependencies (npm run setup)
    ├── Run global review (npm run review:all)
    ├── Commit updated results files
    └── Push results back to repo
```

---

## Review Engine Architecture

### Course Review Engine (`courses/{course}/review-engine/index.js`)

Each course has its own review engine that:

1. **Loads configuration** from `course-config.json`
2. **Determines challenges to review** (all or specific via `--challenge=ID`)
3. **For each challenge:**
   - Runs 6 evaluation layers
   - Calculates weighted score
   - Collects detailed feedback
4. **Generates course summary** (average score, completion %, badge level)
5. **Writes results** to `results/` directory
6. **Updates progress** via `update-progress.js`
7. **Updates README evidence** via `update-readme-evidence.js`

### Evaluation Layers

#### 1. Functional Tests (35% weight)
- **Runner**: `test-runner.js`
- **Framework**: Vitest
- **Location**: `project/tests/challenge-*.test.tsx`
- **Output**: Pass/fail count, test names, error messages
- **Score**: `(passed / total) * 100`

#### 2. Code Quality (15% weight)
- **Runner**: `linter.js`
- **Tool**: ESLint
- **Config**: `project/.eslintrc.json`
- **Output**: Error count, warning count, file:line details
- **Score**: `100 - (errors * 10 + warnings * 2)`, clamped to 0-100

#### 3. Architecture (10% weight)
- **Runner**: `architecture-checker.js`
- **Method**: AST parsing (using `@babel/parser`, `@babel/traverse`)
- **Checks**: Required patterns (e.g., "must use useState", "must export component")
- **Output**: Found patterns, missing patterns
- **Score**: `(found / required) * 100`

#### 4. Best Practices (10% weight)
- **Runner**: `best-practices.js`
- **Method**: Heuristic checks (file structure, naming, imports)
- **Output**: Issues found, recommendations
- **Score**: `100 - (issues * 10)`, clamped to 0-100

#### 5. E2E Tests (15% weight)
- **Runner**: `e2e-runner.js`
- **Framework**: Playwright
- **Location**: `project/tests/e2e/challenge-*.spec.ts`
- **Output**: Pass/fail count, test names, screenshots
- **Score**: `(passed / total) * 100`

#### 6. AI Review (15% weight)
- **Runner**: `ai-review/index.js`
- **API**: Groq API (Llama models)
- **Input**: Challenge README + learner code
- **Output**: Strengths, improvements, readability score
- **Score**: `readabilityScore` (0-100) from AI response
- **Fallback**: If API key missing, score = 0, but other layers still run

### Score Calculation

```javascript
totalScore = (
  functionalTests * 0.35 +
  codeQuality * 0.15 +
  architecture * 0.10 +
  bestPractices * 0.10 +
  e2eTests * 0.15 +
  aiReview * 0.15
)
```

**Pass threshold**: 60% (configurable per course in `course-config.json`)

---

## Scoring System

### Course-Level Scoring

**File**: `courses/{course}/results/course-summary.json`

```json
{
  "courseId": "01-react-fundamentals",
  "courseName": "React Fundamentals",
  "averageScore": 75.5,
  "completionPercentage": 100,
  "totalChallenges": 3,
  "completedChallenges": 3,
  "badgeLevel": "gold",
  "challengeResults": [...],
  "skillStrengths": [...],
  "improvementAreas": [...]
}
```

**Calculation**:
- `averageScore`: Weighted average of all challenge scores
- `completionPercentage`: `(completedChallenges / totalChallenges) * 100`
- `badgeLevel`: Determined by score + completion thresholds

### Pathway-Level Scoring

**File**: `pathway-review/pathway-summary.json`

**Calculation**:
- `overallScore`: Weighted average across all courses (using course weights from `pathway-config.json`)
- `completionPercentage`: `(completedChallenges / totalChallenges) * 100` (across all courses)
- `badgeLevel`: Determined by pathway-level thresholds

**Course Weights** (from `pathway-config.json`):
- React Fundamentals: 0.33
- RTK Query: 0.33
- Next.js App Router: 0.34

### Badge Levels

**Course Badge** (from `course-config.json`):
- Gold: Score ≥ 90% AND Completion = 100%
- Silver: Score ≥ 75% AND Completion ≥ 75%
- Bronze: Score ≥ 60% AND Completion ≥ 50%
- None: Below thresholds

**Pathway Badge** (from `pathway-config.json`):
- Gold: Score ≥ 90% AND Completion = 100%
- Silver: Score ≥ 75% AND Completion ≥ 75%
- Bronze: Score ≥ 60% AND Completion ≥ 50%
- None: Below thresholds

---

## Scripts Reference

### Setup Scripts

#### `scripts/setup.js`
**Purpose**: One-time setup after cloning repository  
**What it does**:
1. Installs dashboard dependencies (`dashboard/app/`)
2. Installs all course project dependencies
3. Installs all review engine dependencies
4. Installs Playwright browsers for E2E tests

**Usage**: `npm run setup` (from repo root)

**Time**: 3-5 minutes

---

### Review Scripts

#### `scripts/run-review-changed.js`
**Purpose**: Review only challenges whose code changed (smart review)  
**What it does**:
1. Gets changed files via git diff
2. Maps files to challenges (`scripts/lib/file-to-challenge-map.js`)
3. Runs review for affected challenges only
4. Updates progress and README evidence

**Usage**: `npm run review:changed` (from repo root)  
**Options**: `--ref origin/main` (compare against branch)

**When to use**: Before/after pushing code, to review only what changed

---

#### `scripts/run-review-course.js`
**Purpose**: Review all challenges in one course  
**What it does**:
1. Calls course review engine (`courses/{course}/review-engine/index.js`)
2. Updates progress and README evidence

**Usage**: `npm run review:course -- --course=01-react-fundamentals`

---

#### `scripts/run-review-challenge.js`
**Purpose**: Review one specific challenge  
**What it does**:
1. Calls course review engine with `--challenge=ID`
2. Updates progress and README evidence

**Usage**: `npm run review:challenge -- --course=01-react-fundamentals --challenge=01-user-profile`

---

#### `global-review/run-all-reviews.js`
**Purpose**: Review all courses and generate pathway summary  
**What it does**:
1. For each course in `pathway-config.json`:
   - Runs course review engine
   - Loads course summary
2. Aggregates AI feedback
3. Calculates pathway-level metrics
4. Generates `pathway-summary.json`
5. Updates README evidence (all courses + root)

**Usage**: `npm run review:all` (from repo root)

---

### Progress Scripts

#### `scripts/update-progress.js`
**Purpose**: Aggregate all course results into global progress  
**What it does**:
1. Reads all `course-summary.json` files
2. Aggregates pathway-level metrics
3. Writes `learner-results/progress.json`
4. Calls `update-readme-evidence.js` to update READMEs

**Usage**: `npm run progress:update` (from repo root)  
**When**: Automatically called by review engines, or manually to refresh progress

**Output**: `learner-results/progress.json`

---

#### `scripts/update-readme-evidence.js`
**Purpose**: Update README evidence sections (completion %, average score, pass/fail)  
**What it does**:
1. **For course READMEs**: Updates `courses/{course}/project/README.md` with:
   - Challenges completed (count and %)
   - Average score
   - Pass/fail per challenge
2. **For root README**: Updates `README.md` with:
   - Pathway challenges completed (count and %)
   - Overall score
   - Pass/fail per course

**Usage**: 
- `node scripts/update-readme-evidence.js` (all READMEs)
- `node scripts/update-readme-evidence.js --course=01-react-fundamentals` (one course)

**When**: Automatically called by review engines and `update-progress.js`

**Note**: No badge levels shown in README evidence (evidence only: completion %, score, pass/fail)

---

### Utility Scripts

#### `scripts/get-changed-challenges.js`
**Purpose**: List challenges affected by changed files (git diff)  
**Output**: JSON array of challenge IDs  
**Usage**: `node scripts/get-changed-challenges.js [--ref origin/main]`

---

#### `scripts/health-check.js`
**Purpose**: Comprehensive system health check  
**What it checks**:
- Repository structure
- Configuration files
- Dependencies installed
- Test files exist

**Usage**: `node scripts/health-check.js`

---

#### `scripts/ci-validate.js`
**Purpose**: CI/CD pipeline validation  
**Usage**: `node scripts/ci-validate.js`

---

#### `scripts/validate-structure.js`
**Purpose**: Validate repository structure  
**Usage**: `node scripts/validate-structure.js`

---

#### `scripts/test-ai-review.js`
**Purpose**: Test Groq API connection  
**Requires**: `GROQ_API_KEY` in `.env`  
**Usage**: `npm run test:ai-review`

---

#### `scripts/e2e-test.js`
**Purpose**: End-to-end test (dashboard + review)  
**Requires**: Dashboard running on port 7700  
**Usage**: `npm run e2e`

---

## Dashboard System

### Architecture

**Frontend**: React + Vite (in `dashboard/app/`)  
**Backend**: Express API server (in `dashboard/server.js`)  
**Port**: 7700 (default, configurable via `DASHBOARD_PORT`)

### API Endpoints

#### `GET /api/progress`
Returns full progress JSON from `learner-results/progress.json`

**Response**:
```json
{
  "lastUpdated": "2026-01-29T...",
  "pathway": {
    "name": "Modern React Engineer",
    "overallScore": 75.5,
    "completionPercentage": 66.7,
    "totalChallenges": 9,
    "completedChallenges": 6
  },
  "courses": { ... }
}
```

---

#### `GET /api/courses?page=1&limit=20`
Returns paginated courses list

**Query params**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response**:
```json
{
  "courses": [...],
  "total": 3,
  "page": 1,
  "limit": 20
}
```

---

#### `GET /api/courses/:courseId`
Returns course detail with challenges

**Response**:
```json
{
  "courseId": "01-react-fundamentals",
  "courseName": "React Fundamentals",
  "challenges": [...],
  "results": { ... }
}
```

---

#### `GET /api/courses/:courseId/challenges?page=1&limit=50`
Returns paginated challenges for a course

**Query params**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)

---

#### `GET /api/courses/:courseId/challenges/:challengeId`
Returns challenge detail with:
- Instructions (README.md content)
- Last results (from `challenge-results.json`)
- AI feedback (if available)

**Response**:
```json
{
  "challengeId": "01-user-profile",
  "challengeName": "User Profile Component",
  "readme": "# Challenge 01...",
  "results": { ... },
  "aiFeedback": { ... }
}
```

---

#### `POST /api/review`
Runs review for a challenge

**Body**:
```json
{
  "courseId": "01-react-fundamentals",
  "challengeId": "01-user-profile"
}
```

**Response**: Updated progress JSON

**Process**:
1. Calls course review engine with `--challenge=ID`
2. Waits for completion
3. Returns updated progress

---

### Building & Running

**Build UI** (one-time):
```bash
npm run dashboard:build
```

**Start server**:
```bash
npm run dashboard
```

**Dev mode** (UI only, from `dashboard/app`):
```bash
npm run dev
```
(API must be running separately: `npm run dashboard` from root)

---

## Configuration Files

### `pathway-review/pathway-config.json`

Pathway-level configuration:

```json
{
  "pathwayName": "Modern React Engineer",
  "pathwayVersion": "1.0.0",
  "courses": [
    {
      "id": "01-react-fundamentals",
      "name": "React Fundamentals",
      "weight": 0.33,
      "required": true
    }
  ],
  "badgeLevels": {
    "gold": { "minScore": 90, "minCompletion": 100 },
    "silver": { "minScore": 75, "minCompletion": 75 },
    "bronze": { "minScore": 60, "minCompletion": 50 }
  }
}
```

---

### `courses/{course}/course-config.json`

Course-level configuration:

```json
{
  "courseId": "01-react-fundamentals",
  "courseName": "React Fundamentals",
  "challenges": [
    {
      "id": "01-user-profile",
      "name": "User Profile Component",
      "weight": 0.33
    }
  ],
  "scoring": {
    "functionalTests": 0.35,
    "codeQuality": 0.15,
    "architecture": 0.10,
    "bestPractices": 0.10,
    "e2eTests": 0.15,
    "aiReview": 0.15
  },
  "requirements": {
    "minScore": 60,
    "minCompletion": 100
  }
}
```

**Note**: Scoring weights must sum to 1.0

---

### `courses/{course}/project/challenges/{challenge}/metadata.json`

Challenge-level metadata:

```json
{
  "challengeId": "01-user-profile",
  "challengeName": "User Profile Component",
  "difficulty": "beginner",
  "estimatedTime": "2 hours"
}
```

---

## Data Flow

### Review Execution → Results

```
Review Engine runs
    ↓
challenge-results.json (per challenge)
    ↓
course-summary.json (aggregated per course)
    ↓
progress.json (aggregated pathway-level)
    ↓
README evidence (human-readable in READMEs)
```

### File Locations

**Challenge results**: `courses/{course}/results/challenge-results.json`  
**Course summary**: `courses/{course}/results/course-summary.json`  
**AI feedback**: `courses/{course}/results/ai-feedback.json`  
**Pathway summary**: `pathway-review/pathway-summary.json`  
**Progress**: `learner-results/progress.json`

### README Evidence

**Course README**: `courses/{course}/project/README.md`  
- Section: `## 📊 Progress Evidence`
- Shows: Challenges completed %, average score, pass/fail per challenge

**Root README**: `README.md`  
- Section: `## 📈 Progress Summary`
- Shows: Pathway completion %, overall score, pass/fail per course

**Auto-updated**: When review runs, evidence is automatically updated

---

## Extending the System

### Adding a New Course

1. **Create course directory**: `courses/{course-id}/`
2. **Create project**: `courses/{course-id}/project/` (runnable app)
3. **Create review engine**: `courses/{course-id}/review-engine/`
   - Copy from existing course (e.g., `01-react-fundamentals`)
   - Adapt test runners, linters, architecture checkers for your tech stack
4. **Create AI review**: `courses/{course-id}/ai-review/index.js`
5. **Create config**: `courses/{course-id}/course-config.json`
6. **Add to pathway**: Update `pathway-review/pathway-config.json`
7. **Update file mapping**: Add to `scripts/lib/file-to-challenge-map.js` (for smart review)

---

### Adding a New Challenge

1. **Create challenge directory**: `courses/{course}/project/challenges/{challenge-id}/`
2. **Create README.md**: Instructions + Technical Requirements section
3. **Create metadata.json**: Challenge metadata
4. **Add tests**: `project/tests/challenge-{id}.test.tsx` and `e2e/challenge-{id}.spec.ts`
5. **Update course config**: Add challenge to `course-config.json`
6. **Update file mapping**: Add to `scripts/lib/file-to-challenge-map.js`

---

### Modifying Scoring Weights

**Course-level**: Edit `courses/{course}/course-config.json` → `scoring` section  
**Pathway-level**: Edit `pathway-review/pathway-config.json` → `scoring` section (if used)

**Important**: Weights must sum to 1.0

---

### Adding a New Evaluation Layer

1. **Create runner**: `courses/{course}/review-engine/{layer-name}.js`
2. **Export function**: `export async function run{LayerName}(challengeId, projectDir)`
3. **Return score**: `{ score: 0-100, details: {...} }`
4. **Integrate**: Add to `review-engine/index.js`:
   - Import runner
   - Call in `reviewChallenge()`
   - Add to score calculation
   - Update `course-config.json` scoring weights

---

### Modifying Dashboard

**UI**: Edit `dashboard/app/src/App.tsx` and components  
**API**: Edit `dashboard/server.js`  
**Build**: `npm run dashboard:build` (from root)

---

## Code Quality & Patterns

### Code Style

- **ES modules**: All scripts use `import/export` (no CommonJS)
- **Async/await**: Prefer over promises
- **Error handling**: Try/catch with meaningful error messages
- **Console output**: Use emojis for visual clarity (✅ ❌ ⚠️ 📊 🔍)
- **File paths**: Use `join()` from `path` module (cross-platform)

### Common Patterns

#### Getting Repo Root
```javascript
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
```

#### Reading JSON Config
```javascript
import { readFileSync, existsSync } from 'fs';
const configPath = join(ROOT_DIR, 'path', 'config.json');
if (!existsSync(configPath)) {
  throw new Error('Config not found');
}
const config = JSON.parse(readFileSync(configPath, 'utf-8'));
```

#### Running Child Processes
```javascript
import { execSync } from 'child_process';
execSync('node script.js', {
  cwd: WORKING_DIR,
  stdio: 'inherit'  // or 'pipe' for silent
});
```

### Redundancy to Avoid

1. **Don't duplicate scoring logic**: Use shared functions from `global-review/scoring-engine/`
2. **Don't duplicate course summary generation**: Use `generateCourseSummary` from `global-review/course-summary-generator.js`
3. **Don't hardcode paths**: Use `join()` and relative paths from config
4. **Don't skip error handling**: Always check file existence, handle API failures
5. **Don't mix concerns**: Keep review logic separate from progress updates

### Shared Modules

**`global-review/course-summary-generator.js`**: Shared function for generating course summaries. All course review engines import this to avoid duplication.

**`global-review/scoring-engine/index.js`**: Shared scoring utilities:
- `calculateWeightedAverage()`: Weighted average across courses
- `determineBadgeLevel()`: Badge level determination
- `aggregateStrengths()`: Aggregate skill strengths
- `aggregateImprovements()`: Aggregate improvement areas

### Testing

- **Unit tests**: Run in course projects (`npm test`)
- **E2E tests**: Run in course projects (`npm run test:e2e`)
- **System tests**: `npm run e2e` (dashboard + review integration)
- **Health checks**: `node scripts/health-check.js`

---

## Troubleshooting for Developers

### Review Engine Not Running

- Check: `course-config.json` exists and is valid JSON
- Check: Review engine dependencies installed (`cd review-engine && npm install`)
- Check: Project dependencies installed (`cd project && npm install`)

### Progress Not Updating

- Check: `update-progress.js` is being called (check console output)
- Check: `learner-results/` directory exists
- Check: Course summaries exist (`courses/{course}/results/course-summary.json`)

### README Evidence Not Updating

- Check: `update-readme-evidence.js` is being called
- Check: README files exist and are writable
- Check: Section markers exist (`## 📊 Progress Evidence` or `## 📈 Progress Summary`)

### Dashboard Not Starting

- Check: Dashboard dependencies installed (`cd dashboard/app && npm install`)
- Check: UI built (`npm run dashboard:build`)
- Check: Port 7700 not in use (or set `DASHBOARD_PORT`)

### AI Review Failing

- Check: `GROQ_API_KEY` set in `.env` file
- Check: API key valid (`npm run test:ai-review`)
- Check: Network connectivity

---

## Summary

This system is designed to be:
- **Modular**: Each course has its own review engine
- **Extensible**: Easy to add courses, challenges, evaluation layers
- **Automated**: Reviews run automatically, progress updates automatically
- **Evidence-based**: All results stored in JSON + README evidence
- **Scalable**: Handles 50+ courses, 100+ challenges per course

For questions or improvements, refer to this documentation and the codebase structure.

---

**Last Updated**: 2026-01-29  
**Version**: 1.0.0
