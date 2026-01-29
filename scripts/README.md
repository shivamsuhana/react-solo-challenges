# Scripts Directory

Utility scripts for Challenge Engine management.

## Available Scripts

### Setup Scripts
- `setup.js` - Cross-platform setup: install deps for all courses and review engines, Playwright (use: `npm run setup`)
- `setup-all.sh` / `setup-all.bat` - Same via shell (Linux/Mac) or batch (Windows)
- `validate-structure.js` - Validate repository structure

### Validation Scripts
- `health-check.js` - Comprehensive system health check
- `ci-validate.js` - CI/CD pipeline validation

### Review & Progress Scripts
- `run-review-all.sh` / `run-review-all.bat` - Run reviews for all courses
- `run-review-changed.js` - Run review **only for challenges whose code changed** (git diff). Updates progress and README evidence. Use: `npm run review:changed`
- `run-review-course.js` - Run review for one course. Use: `npm run review:course -- --course=<courseId>`
- `run-review-challenge.js` - Run review for one challenge. Use: `npm run review:challenge -- --course=<id> --challenge=<id>`
- `update-progress.js` - Rebuild `learner-results/progress.json` and README evidence from course results. Use: `npm run progress:update`
- `update-readme-evidence.js` - Update README evidence (completion %, average score, pass/fail) in course project READMEs and root README. Called automatically by review engines and `update-progress.js`. Optional: `node scripts/update-readme-evidence.js --course=<courseId>` to update one course only.
- `get-changed-challenges.js` - List challenges affected by changed files (git diff). Outputs JSON. Optional: `--ref origin/main`
- `on-push-review-changed.sh` / `.bat` - Optional git pre-push hook to run review for changed challenges

## Usage

### Setup All Dependencies
```bash
# Linux/Mac
./scripts/setup-all.sh

# Windows
scripts\setup-all.bat
```

### Validate Structure
```bash
node scripts/validate-structure.js
```

### Health Check
```bash
node scripts/health-check.js
```

### CI/CD Validation
```bash
node scripts/ci-validate.js
```

### Run All Reviews
```bash
# Linux/Mac
./scripts/run-review-all.sh

# Windows
scripts\run-review-all.bat
```

### Run Review for Changed Challenges Only
```bash
npm run review:changed
# Optional: compare against a branch
node scripts/run-review-changed.js --ref origin/main
```

### Run Review for One Course or One Challenge
```bash
npm run review:course -- --course=01-react-fundamentals
npm run review:challenge -- --course=01-react-fundamentals --challenge=01-user-profile
```

### Update Progress
```bash
npm run progress:update
```

### Test AI Review Connection
```bash
npm run test:ai-review
```
Requires `GROQ_API_KEY` set. Verifies Groq API is reachable and responding.

### End-to-end test (dashboard + review)
```bash
# Start dashboard first (in another terminal): npm run dashboard
npm run e2e
```
Verifies: GET /api/progress, GET /api/courses, GET challenge detail, POST /api/review. Dashboard must be running on port 7700.

## Notes

- Scripts assume Node.js v20+ is installed
- Some scripts may require dependencies to be installed first
- Review scripts will show warnings if dependencies are missing
