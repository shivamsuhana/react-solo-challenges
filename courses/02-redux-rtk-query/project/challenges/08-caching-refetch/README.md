# Challenge 08: Caching and Cache Tags

## Goal

Use RTK Query's tag system so that when data changes (e.g. after a mutation), the right queries are invalidated and refetched. Add `providesTags` to query endpoints and `invalidatesTags` to mutation endpoints.

**In practice:** RTK Query caches results by endpoint and args. Tags let you say "this query provides data for tag X" and "this mutation invalidates tag X," so after a mutation the cache is invalidated and queries refetch. This keeps the UI in sync without manual refetch calls.

---

## What to do

1. **Tag types:** In your API slice, define `tagTypes: ['User', 'Post']` (or similar) in the `createApi` options.
2. **Query tags:** For each query endpoint (e.g. getUsers, getPosts), add `providesTags: (result) => result ? [...result.map(({ id }) => ({ type: 'User', id })), { type: 'User', id: 'LIST' }] : [{ type: 'User', id: 'LIST' }]` (adjust type and id to your entities).
3. **Mutation invalidation:** For any mutation that changes user/post data, add `invalidatesTags: [{ type: 'User', id: 'LIST' }]` (or the tag type you use) so that after the mutation, getUsers/getPosts refetch. If you don't have a mutation yet, add one (e.g. `addPost`) so you can attach `invalidatesTags`; the form that uses it is in Ch09.
4. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- API slice has tagTypes defined.
- At least one query has providesTags.
- At least one mutation has invalidatesTags (or refetch behavior).
- Architecture: providesTags, invalidatesTags.

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- tagTypes in createApi.
- providesTags on relevant query endpoints.
- invalidatesTags on relevant mutation endpoints.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=08-caching-refetch` to get scored.
