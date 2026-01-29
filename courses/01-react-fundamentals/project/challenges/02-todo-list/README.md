# Challenge 02: Todo List Application

## Overview

Build a functional todo list where users can add, complete, and delete tasks.

## Problem Statement

Create a todo list application with the following features:
- Input field to add new todos
- List of todos with checkboxes to mark as complete
- Delete button for each todo
- Visual distinction between completed and active todos

## Instructions

1. Create a `TodoList` component in `src/components/TodoList.tsx`
2. Implement state management for the list of todos
3. Each todo should have: `id`, `text`, `completed`
4. Add the component to `src/App.tsx`

## Visual Requirements

- Completed todos should be visually distinct (strikethrough, different color)
- Clear input field and add button
- Each todo item should have a delete button
- Clean, organized layout

## How to Verify

1. Run `npm run dev` and open the app
2. Navigate to `/challenge/02-todo-list` (or click "View Challenge UI" from the home page)
3. Add a new todo - it should appear in the list
4. Check a todo - it should show as completed (strikethrough)
5. Click delete - the todo should be removed
6. All interactions should work smoothly

---

## Technical Requirements (What Will Be Reviewed)

### Functional Requirements

1. ✅ Component must be named `TodoList`
2. ✅ Must manage array of todos with state
3. ✅ Each todo must have: `id`, `text`, `completed` properties
4. ✅ Must be able to add new todos
5. ✅ Must be able to toggle completion status
6. ✅ Must be able to delete todos
7. ✅ Completed todos must be visually distinct
8. ✅ Must use proper React state management

### Code Quality Requirements

1. ✅ Must use TypeScript with proper type annotations
2. ✅ Todo interface/type must be defined with TypeScript
3. ✅ Must handle edge cases (empty input, duplicate todos, etc.)
4. ✅ Code must pass ESLint checks (no errors, warnings allowed)
5. ✅ No console.log, console.error, or console.warn statements in production code
6. ✅ Code must be readable and well-structured
7. ✅ Variable and function names must be descriptive and follow camelCase convention

### Architecture Requirements

1. ✅ Component must be in `src/components/TodoList.tsx`
2. ✅ Component must be exported as default export
3. ✅ Must use useState for state management (array of todos)
4. ✅ Must use proper array methods (map, filter, etc.)
5. ✅ Event handlers must be properly defined and named
6. ✅ Must use controlled components for input fields
7. ✅ Must use functional component pattern (not class component)

### Best Practices Requirements

1. ✅ Component must be a functional component (not class component)
2. ✅ Todo type/interface must be properly defined with TypeScript
3. ✅ Event handlers must be properly named (e.g., `handleAddTodo`, `handleToggleTodo`, `handleDeleteTodo`)
4. ✅ State variable names must be descriptive (e.g., `todos`, not `items`)
5. ✅ Must use proper React patterns for list rendering (map with keys)
6. ✅ Input must be controlled (value + onChange)
7. ✅ Must handle empty state appropriately
8. ✅ Code must follow React best practices for state updates
9. ✅ No direct state mutations - must use setState properly
10. ✅ Component must be self-contained and maintainable

### Industry Standards

The following industry standards will be checked:

- **TypeScript**: Proper type safety, interface definitions
- **React Patterns**: Functional components, hooks, controlled components
- **Code Style**: ESLint compliance, consistent formatting
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components
- **State Management**: Proper useState usage, immutable updates
- **Array Operations**: Proper use of map, filter, spread operator
- **Component Design**: Single responsibility, proper separation of concerns

### Scoring

- Functional correctness: 40%
- Code quality: 25%
- Architecture: 20%
- Best practices: 10%
- AI review: 5%

**Important**: Review will **ONLY check what's specified above**. No hidden requirements.

---

## Learning Hints (no solution code)

- **State for the list**: Use `useState` with an array of items. Each item needs `id`, `text`, `completed` (see Technical Requirements above).
- **Adding todos**: Controlled input + button or form submit. Tests look for an input (placeholder "add todo") and a button with name matching /add/i.
- **Toggling and deleting**: Update state by id (toggle `completed`, or filter out for delete). Completed items must be visually distinct (e.g. strikethrough).

## Help & Completion

- **Full learner guide**: See repo root [LEARNER_GUIDE.md](../../../../../LEARNER_GUIDE.md).
- **Setup**: If you haven't run setup yet, go to repo root and run `npm run setup` to install all dependencies and Playwright browsers.

## Next Steps

1. **Read this file** - All requirements are listed above
2. **Implement the component** - Follow the instructions and requirements
3. **Verify visually** - Run `npm run dev` and check `/challenge/02-todo-list`
4. **Run review** - `npm run review -- --challenge=02-todo-list` to get scored
