# Challenge 01: Store Setup with configureStore

## Goal

Set up the Redux store using Redux Toolkit's `configureStore` and wrap the app with React-Redux's `Provider` so the rest of the challenges can use Redux state.

**In practice:** Every Redux app has a single store. Redux Toolkit's `configureStore` is the recommended way to create it (the old `createStore` is deprecated). The store holds the full state tree; `Provider` makes it available to all components.

---

## What to do

1. **Store:** In `src/store/store.ts`, use `configureStore` from `@reduxjs/toolkit`. Pass a `reducer` object (can be empty for now, e.g. `reducer: {}`). Export the `store`, and export types `RootState` and `AppDispatch` (e.g. `RootState = ReturnType<typeof store.getState>`, `AppDispatch = typeof store.dispatch`).
2. **Provider:** In `src/main.tsx`, import `Provider` from `react-redux` and your `store`. Wrap `<App />` with `<Provider store={store}>`.
3. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

| Step | What it does |
|------|----------------|
| **Functional tests** | store.ts uses configureStore; main.tsx wraps App with Provider and passes store. |
| **Code quality** | ESLint (no errors/warnings). |
| **Architecture** | AST: configureStore, Provider. |
| **Best practices** | TypeScript, RootState/AppDispatch exported. |
| **E2E** | App loads without error. |

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- Use `configureStore` from `@reduxjs/toolkit` in `src/store/store.ts`.
- Export `store`, `RootState`, and `AppDispatch`.
- In `src/main.tsx`, wrap the app with `<Provider store={store}>` from `react-redux`.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run dev` and open the app; run `npm run review -- --challenge=01-store-setup` to get scored.
