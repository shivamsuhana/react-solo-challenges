# Review Scoring Explained

## Understanding Review Scores

The review system evaluates challenges across multiple dimensions. Here's what each score means:

### Score Breakdown

1. **Functional Tests (40% weight)** - Unit tests verify your code works correctly
2. **Code Quality (25% weight)** - ESLint checks for code style and errors
3. **Architecture (20% weight)** - AST parsing verifies required patterns are used
4. **Best Practices (10% weight)** - Checks for common React/TypeScript best practices
5. **E2E Tests (15% weight)** - Playwright tests verify visual/interaction behavior
6. **AI Review (5% weight)** - AI evaluates code quality, readability, and maintainability

### Why Scores Might Be Lower

#### Code Quality (50% example)
- **Reason**: ESLint checks all project files, not just challenge files
- **Impact**: Errors in test files or other components can lower the score
- **Note**: This is expected behavior - the linter ensures overall code quality
- **Your challenge file**: If your challenge file has 0 errors, it's correct!

#### Architecture (33.3% example)
- **Reason**: AST pattern detection looks for specific code patterns
- **Patterns checked**: 
  - `functionalComponent` - Component must be a function (not class)
  - `useState` - Must use React hooks for state
  - `props` - Component must accept props
- **Why lower**: The checker looks for exact patterns. If you use arrow functions vs function declarations, or if patterns are nested differently, detection may vary
- **Note**: As long as functional tests pass (100%), your implementation is correct!

#### E2E Tests (0% if browsers not installed)
- **Reason**: Playwright browsers need to be installed first
- **Fix**: Run `npx playwright install` in the course project directory
- **Note**: This is a setup issue, not a code issue

### What Matters Most

**Functional Tests (100%)** = Your code works correctly ✅  
**AI Review (88%)** = Your code is well-written ✅  
**Overall Score (60%+)** = Challenge passed ✅

The other scores (code quality, architecture) are additional quality checks. Lower scores in these areas don't mean your code is wrong - they indicate areas for improvement in code style and patterns.

### Improving Scores

- **Code Quality**: Fix ESLint errors/warnings in your challenge files
- **Architecture**: Ensure you're using the required patterns (check README.md Technical Requirements section)
- **E2E Tests**: Install Playwright browsers: `npx playwright install`
- **Best Practices**: Follow React/TypeScript conventions

### Passing Threshold

- **Minimum Score**: 60% to pass a challenge
- **Functional Tests**: Must pass (100%) for challenge to be considered complete
- **AI Review**: Only runs if functional tests pass
