# Challenge 04: Multiple Slices in the Store

## Goal

Add a second slice (e.g. UI state: theme or sidebar open) and register both slices in the store. The store will have multiple keys in its reducer object (e.g. `counter`, `ui`).

**In practice:** Real apps use one store with multiple "slices" of state. You pass a reducer map to `configureStore`; each key becomes a top-level branch of state (e.g. `state.counter`, `state.ui`). This replaces hand-written `combineReducers` when using RTK.

---

## What to do

1. **Second slice:** Create `src/store/slices/uiSlice.ts`. Use `createSlice` with `name: 'ui'`, `initialState: { sidebarOpen: false }`, and a reducer `toggleSidebar` that flips `state.sidebarOpen`. Export reducer and actions.
2. **Store:** In `src/store/store.ts`, add the UI reducer: `reducer: { counter: counterReducer, ui: uiReducer }`.
3. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- uiSlice exists with createSlice, initialState (sidebarOpen), toggleSidebar reducer.
- Store has both counter and ui reducers.
- Architecture: multiple slices in configureStore.

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- Create `src/store/slices/uiSlice.ts` with createSlice (name 'ui', sidebarOpen, toggleSidebar).
- Add ui reducer to store alongside counter.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=04-multiple-slices` to get scored.
