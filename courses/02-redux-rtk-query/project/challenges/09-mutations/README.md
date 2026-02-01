# Challenge 09: Mutations with useMutation

## Goal

Add a mutation endpoint (e.g. createPost or addUser) to your API slice and use the generated `useMutation` hook in a form. On submit, trigger the mutation and invalidate the list query so the UI updates (or use cache tags from Ch08).

**In practice:** Mutations change server state (POST, PUT, DELETE). RTK Query generates `useXMutation()`; you get a trigger function and status. You call the trigger with the payload; then invalidate tags so list queries refetch and the new item appears.

---

## What to do

1. **Mutation endpoint:** In `src/api/apiSlice.ts`, add a mutation (e.g. `addPost: builder.mutation<Post, Omit<Post, 'id'>>({ query: (body) => ({ url: '/posts', method: 'POST', body }), invalidatesTags: [{ type: 'Post', id: 'LIST' }] })`). Use your mock API or baseQuery so the request succeeds.
2. **Form component:** Create `src/components/AddPostForm.tsx`. Use `useAddPostMutation()` (or your hook name). On form submit, call the mutation trigger with the form data. Show loading state while submitting; on success, show a success message or clear the form. Use `data-testid="add-post-form"` and `data-testid="add-post-submit"` for the form and submit button.
3. **App:** Render AddPostForm on `/challenge/09-mutations`.
4. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- API slice has at least one mutation endpoint (builder.mutation).
- AddPostForm (or equivalent) uses useMutation hook and triggers mutation on submit.
- Required data-testids present.
- Architecture: builder.mutation, useMutation.

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- Mutation endpoint in API slice (e.g. addPost).
- Form component uses useMutation and submits; invalidates list tag.
- Route /challenge/09-mutations renders the form.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=09-mutations` to get scored.
