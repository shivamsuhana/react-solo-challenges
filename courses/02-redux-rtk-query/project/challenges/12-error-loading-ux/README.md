# Challenge 12: Error and Loading UX

## Goal

Improve the user experience for loading and error states: show a clear loading indicator, a user-friendly error message with a retry option, and ensure at least one list (e.g. UsersList) uses `refetch` so users can retry after a failure.

**In practice:** Production apps handle loading and errors explicitly. RTK Query hooks expose `isLoading`, `isError`, `error`, and `refetch`. You render skeletons or spinners while loading, and an error message with a "Retry" button that calls `refetch()`.

---

## What to do

1. **Error display:** Create `src/components/ErrorDisplay.tsx` that accepts `error` and `onRetry` (optional). Render the error message and a "Retry" button that calls `onRetry`. Use `data-testid="error-display"` and `data-testid="retry-btn"`.
2. **UsersList (or main list):** Ensure your users list (or a main query component) uses the query hook's `refetch`. When there is an error, render ErrorDisplay and pass `refetch` as onRetry. When loading, show a clear loading UI (e.g. "Loading users..." with data-testid="users-loading").
3. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- ErrorDisplay component exists with error message and retry button (data-testids).
- At least one list uses refetch and shows ErrorDisplay on error with onRetry={refetch}.
- Loading state has a visible indicator (data-testid or text).
- Architecture: isLoading, isError, refetch used in component.

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- ErrorDisplay component with error, onRetry, and required data-testids.
- UsersList (or equivalent) uses refetch and ErrorDisplay for errors; loading indicator present.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=12-error-loading-ux` to get scored.
