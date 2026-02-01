# Challenge 07: Query Endpoints and useQuery Hooks

## Goal

Use the RTK Query API slice's generated hook (e.g. `useGetUsersQuery`) in a component. Display users with loading and error states so the UI reflects the request lifecycle.

**In practice:** RTK Query generates a hook per query endpoint. You use it in a component; it returns `{ data, isLoading, isError, error }`. You render loading UI, error UI, or the list based on these flags—no manual dispatch or useEffect for the request.

---

## What to do

1. **API slice:** Ensure `src/api/apiSlice.ts` has a `getUsers` query endpoint that returns user data (name, email, username or similar). Use your mock API or fetchBaseQuery as in Ch06.
2. **Component:** In `src/components/UsersList.tsx`, use `useGetUsersQuery()` (or the hook name your API slice generates). Destructure `{ data, isLoading, error }`. Render: loading state (e.g. "Loading..."), error state (e.g. error message), or a list of users (name, email, username). Use `data-testid="users-list"` on the list container and `data-testid="users-loading"` / `data-testid="users-error"` if you show loading/error.
3. **App:** Render UsersList on `/challenge/07-queries`.
4. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- API slice has getUsers query endpoint.
- UsersList uses the generated useGetUsersQuery hook.
- Loading and error states handled; user data displayed.
- Architecture: useGetUsersQuery (or equivalent), builder.query.

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- getUsers query endpoint in API slice.
- UsersList uses generated query hook and handles loading, error, and data.
- Route /challenge/07-queries renders UsersList.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=07-queries` to get scored.
