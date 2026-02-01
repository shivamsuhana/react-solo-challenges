# Challenge 05: Async Logic with createAsyncThunk

## Goal

Handle async logic (e.g. fetching users) with Redux Toolkit's `createAsyncThunk`. Create a thunk that fetches users from the mock API, and a slice that uses `extraReducers` to handle pending, fulfilled, and rejected so the UI can show loading, data, or error.

**In practice:** Middleware (like thunk) lets you dispatch functions. `createAsyncThunk` generates pending/fulfilled/rejected action types and you handle them in `extraReducers`. This is the standard pattern for async before you use RTK Query; RTK Query automates much of this for API calls.

---

## What to do

1. **Thunk and slice:** Create `src/store/slices/usersSlice.ts`. Import `mockApi` from `src/api/mockServer`. Use `createAsyncThunk('users/fetchUsers', () => mockApi.getUsers())`. Use `createSlice` with `name: 'users'`, `initialState: { list: [], loading: false, error: null }`, and `extraReducers(builder)` that handle the thunk's pending (set loading true), fulfilled (set list, loading false), rejected (set error, loading false). Export the thunk and reducer.
2. **Store:** Add the users reducer to the store.
3. **Component (optional for review):** A simple view that dispatches the thunk and shows loading/list/error is enough; or the review can check file content only.
4. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- usersSlice uses createAsyncThunk and extraReducers for pending/fulfilled/rejected.
- Store includes users reducer.
- Architecture: createAsyncThunk, extraReducers.

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- createAsyncThunk that fetches users (e.g. from mockApi.getUsers).
- createSlice with extraReducers handling the thunk's three states.
- Add users reducer to store.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=05-async-thunks` to get scored.
