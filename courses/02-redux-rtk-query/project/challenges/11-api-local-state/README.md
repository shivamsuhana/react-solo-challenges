# Challenge 11: API and Local State Together

## Goal

Build a view that uses both RTK Query (e.g. getPosts) and a Redux slice (e.g. filter/sort). The same store holds API cache and UI state; the component reads the query result and the filter state, and renders a filtered/sorted list.

**In practice:** Real apps mix server state (RTK Query) and client state (slices). Example: posts from the API + user-selected filter (e.g. "all" vs "mine") or sort order stored in a slice. One store, one Provider; components use both useGetPostsQuery and useSelector.

---

## What to do

1. **Filter slice:** Create `src/store/slices/filtersSlice.ts` with state like `{ sortBy: 'newest' }` or `{ filterUserId: null }`. Add reducers to update it. Add the slice to the store. Ensure your API slice has a `getPosts` query (add it in Ch08 or here if needed).
2. **Component:** Create `src/components/PostsWithFilters.tsx`. Use `useGetPostsQuery()` for posts and `useAppSelector(state => state.filters)` (or your slice name). Compute a derived list: filter/sort the posts based on the slice state. Render the list and controls (dropdown or buttons) to change filter/sort. Use `data-testid="posts-with-filters"` and `data-testid="filter-controls"`.
3. **App:** Render PostsWithFilters on `/challenge/11-api-local-state`.
4. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- filtersSlice exists and is in the store.
- PostsWithFilters uses both useGetPostsQuery (or getPosts) and useSelector for filters.
- Filter/sort applied to displayed list.
- Architecture: useSelector, useGetPostsQuery (or equivalent).

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- filtersSlice with filter/sort state and reducers; added to store.
- PostsWithFilters uses RTK Query for posts and slice for filter/sort; derives and displays filtered/sorted list.
- Route /challenge/11-api-local-state renders the component.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=11-api-local-state` to get scored.
