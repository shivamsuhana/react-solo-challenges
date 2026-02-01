# Challenge 10: Optimistic Updates

## Goal

Implement an optimistic update for a mutation: update the cache immediately when the user triggers the mutation, then roll back if the request fails. Use the mutation's `onQueryStarted` and patch the cache with `queryFulfilled` and a rollback on error.

**In practice:** Optimistic updates make the UI feel instant—e.g. a new post appears in the list before the server responds. If the request fails, you undo the change. RTK Query supports this via `async onQueryStarted(arg, { dispatch, queryFulfilled })` and cache updates with `patchResult.undo()` on catch.

---

## What to do

1. **Mutation with optimistic update:** In your API slice, pick a mutation (e.g. addPost). In that mutation, add `async onQueryStarted(arg, { dispatch, getState, queryFulfilled })`. Inside, use `dispatch(apiSlice.util.updateQueryData('getPosts', undefined, (draft) => { draft.push({ ...arg, id: Date.now() }); }))` (or equivalent) to patch the cache optimistically. Store the patch result and call `patchResult.undo()` in a catch block after `await queryFulfilled` if the request fails.
2. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- At least one mutation has onQueryStarted.
- Cache is updated optimistically (updateQueryData or similar).
- Rollback (undo) on queryFulfilled rejection.
- Architecture: onQueryStarted, queryFulfilled.

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- Mutation with onQueryStarted that patches cache optimistically.
- On failure, undo the cache patch (patchResult.undo() or equivalent).
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=10-optimistic-updates` to get scored.
