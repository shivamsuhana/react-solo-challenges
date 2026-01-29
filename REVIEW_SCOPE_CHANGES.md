# Review Scope Changes - Challenge-Specific Review

## What Changed

The review engine now **ONLY checks what's specified in challenge files**, not generic best practices or concepts not mentioned in the challenge.

## Review Sources

The review engine uses **ONLY** these sources:

1. **`metadata.json`** - Defines:
   - `filesToCheck` - Which files to review
   - `patternsRequired` - Which architecture patterns to check
   - `scoring` - Weight distribution

2. **`README.md`** - Defines (all in one file):
   - Challenge instructions and overview
   - Functional requirements (in "Technical Requirements" section)
   - Code quality requirements
   - Architecture requirements
   - Best practices requirements

## What Each Layer Checks

### 1. Functional Tests (40%)
- ✅ Runs unit tests for the challenge
- ✅ Based on test files in `tests/challenge-*.test.tsx`
- ✅ Verifies functional correctness

### 2. Code Quality (25%)
- ✅ **ONLY checks files in `filesToCheck`** (not all project files)
- ✅ **ONLY runs ESLint if specified in README.md (Technical Requirements section)**
- ✅ If no ESLint requirement, returns 100%

### 3. Architecture (20%)
- ✅ **ONLY checks patterns in `patternsRequired`** from `metadata.json`
- ✅ Uses AST parsing to detect specific patterns
- ✅ If no patterns required, returns 100%

### 4. Best Practices (10%)
- ✅ **ONLY checks requirements from README.md** (Best Practices Requirements section)
- ✅ If no best practices requirements, returns 100%
- ✅ Examples: "No console.log", "Use TypeScript", "Functional component pattern"

### 5. E2E Tests (15%)
- ✅ Runs Playwright tests for visual/interaction verification
- ✅ Based on test files in `tests/e2e/challenge-*.spec.ts`

### 6. AI Review (5%)
- ✅ Reviews code quality, readability, maintainability
- ✅ Uses challenge instructions and requirements as context

## Example: Challenge 01

**metadata.json:**
```json
{
  "filesToCheck": ["src/components/UserProfile.tsx"],
  "patternsRequired": ["functionalComponent", "useState", "props"]
}
```

**README.md (Technical Requirements section):**
- Code Quality: "Code must pass ESLint checks"
- Best Practices: "No console.log statements in production code"

**Result:**
- ✅ Code Quality: 100% (only checks UserProfile.tsx, passes ESLint)
- ✅ Best Practices: 100% (only checks for console.log, none found)
- ⚠️ Architecture: 33.3% (finds useState, but not functionalComponent/props - detection issue, not scope issue)

## Key Principle

**The review ONLY checks what's explicitly mentioned in:**
- Challenge `metadata.json`
- Challenge `README.md` (Technical Requirements section)
- Challenge test files

**The review does NOT check:**
- Generic best practices not in README.md
- Patterns not in `patternsRequired`
- Files not in `filesToCheck`
- Concepts not mentioned in challenge instructions

## Benefits

1. **Fair evaluation** - Only checks what was taught/required
2. **Clear expectations** - Learners know exactly what's checked
3. **No surprises** - No hidden requirements
4. **Challenge-specific** - Each challenge defines its own review criteria
