# Challenge 02: First Slice with createSlice

## Goal

Create your first Redux slice using `createSlice` from Redux Toolkit. Add a simple counter slice (state: number, reducers: increment, decrement) and add its reducer to the store.

**In practice:** Slices bundle state, reducers, and generated action creators. Redux Toolkit uses Immer so you can write "mutating" logic in reducers; it's the recommended way to write reducer logic (replacing hand-written switch/case and `createStore`).

---

## What to do

1. **Slice:** Create `src/store/slices/counterSlice.ts`. Use `createSlice` with `name: 'counter'`, `initialState: 0`, and reducers: `increment` (state + 1), `decrement` (state - 1). Export the slice's `reducer` and the generated `actions` (or destructure `increment`, `decrement` from `counterSlice.actions`).
2. **Store:** In `src/store/store.ts`, add the counter reducer to `configureStore`: e.g. `reducer: { counter: counterReducer }`.
3. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- counterSlice uses createSlice with name, initialState, reducers (increment, decrement).
- Store includes the counter reducer.
- Architecture: createSlice, reducers.

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- Create `src/store/slices/counterSlice.ts` with `createSlice` (name, initialState, reducers increment/decrement).
- Export reducer and actions.
- Add counter reducer to the store in `src/store/store.ts`.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=02-first-slice` to get scored.
