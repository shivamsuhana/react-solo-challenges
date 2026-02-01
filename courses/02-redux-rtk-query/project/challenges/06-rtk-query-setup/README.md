# Challenge 06: RTK Query Setup and API Slice

## Goal

Set up RTK Query by creating an API slice with `createApi` and `fetchBaseQuery` (or a custom baseQuery that uses your mock API). Add the API slice's reducer and middleware to the store so later challenges can use generated hooks.

**In practice:** RTK Query is built for data fetching and caching. You create one or more API slices with `createApi`; each slice gets its own reducer and middleware. The store must include both the reducer and the middleware for RTK Query to work.

---

## What to do

1. **API slice:** Create `src/api/apiSlice.ts`. Use `createApi` from `@reduxjs/toolkit/query/react` with `baseQuery` (e.g. `fetchBaseQuery({ baseUrl: '/' })` or a custom function). Define at least one query endpoint (e.g. `getUsers`) that returns a list. For the mock API, you can use `queryFn: async () => ({ data: await mockApi.getUsers() })` instead of `query`; export the API slice and its hooks (e.g. `useGetUsersQuery`).
2. **Store:** In `src/store/store.ts`, add the API reducer: `[apiSlice.reducerPath]: apiSlice.reducer`. Add the API middleware: `middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)`.
3. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- apiSlice uses createApi and baseQuery (fetchBaseQuery or custom).
- At least one query endpoint (e.g. getUsers).
- Store includes API reducer and API middleware.
- Architecture: createApi, fetchBaseQuery, endpoints.

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- Create `src/api/apiSlice.ts` with createApi, baseQuery, and at least one query endpoint.
- Add API reducer and middleware to store.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=06-rtk-query-setup` to get scored.
