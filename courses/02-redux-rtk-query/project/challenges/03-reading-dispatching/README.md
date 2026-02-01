# Challenge 03: Reading and Dispatching in Components

## Goal

Use React-Redux hooks to read state and dispatch actions. Set up typed `useAppSelector` and `useAppDispatch` in `src/store/hooks.ts`, then use them in a `CounterView` component that displays the counter and has Increment/Decrement buttons.

**In practice:** Components read state with `useSelector` and dispatch actions with `useDispatch`. Typed hooks (`useAppSelector`/`useAppDispatch`) give you correct TypeScript types for your store and avoid repeating type assertions.

---

## What to do

1. **Hooks:** In `src/store/hooks.ts`, export `useAppDispatch` and `useAppSelector` typed with `AppDispatch` and `RootState` (e.g. `useDispatch.withTypes<AppDispatch>()`, `useSelector.withTypes<RootState>()`).
2. **Component:** Create `src/components/CounterView.tsx`. Use `useAppSelector` to read `state.counter`. Use `useAppDispatch` and dispatch `increment()` and `decrement()` on button click. Render the count and two buttons (Increment, Decrement). Give the count element `data-testid="counter-value"` and buttons `data-testid="increment-btn"` and `data-testid="decrement-btn"`.
3. **App:** Render `CounterView` on the route `/challenge/03-reading-dispatching`.
4. **Code:** TypeScript, pass ESLint, no `console.*`.

---

## What the review checks

- hooks.ts exports useAppSelector and useAppDispatch (typed).
- CounterView uses useAppSelector for counter and useAppDispatch for increment/decrement.
- Required data-testids present.
- Architecture: useSelector, useDispatch.

Pass threshold: weighted score ≥ 80%.

---

## Technical Requirements

- Typed useAppSelector and useAppDispatch in `src/store/hooks.ts`.
- CounterView displays counter value and has Increment/Decrement buttons with the required data-testids.
- Route `/challenge/03-reading-dispatching` renders CounterView.
- TypeScript; pass ESLint; no console statements.

---

## Verify and submit

Run `npm run review -- --challenge=03-reading-dispatching` to get scored.
