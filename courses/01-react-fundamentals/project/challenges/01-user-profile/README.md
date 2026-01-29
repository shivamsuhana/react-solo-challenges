# Challenge 01: User Profile Component

## Overview

Build a user profile component that displays user information with proper React patterns.

## Problem Statement

Create a `UserProfile` component that displays:
- User name
- Email address
- Profile picture (or placeholder)
- A "Follow" button that toggles between "Follow" and "Following"

## Instructions

1. Create a new component file: `src/components/UserProfile.tsx`
2. The component should accept user data as props
3. Implement state management for the follow button
4. Add the component to `src/App.tsx` to display it

## Visual Requirements

- The profile should be visually appealing
- Use proper spacing and layout
- The follow button should have clear visual feedback

## How to Verify

1. Run `npm run dev` and open the app in your browser
2. Navigate to `/challenge/01-user-profile` (or click "View Challenge UI" from the home page)
3. You should see the user profile displayed
4. Click the follow button - it should toggle between "Follow" and "Following"
5. The UI should look clean and professional

---

## Technical Requirements (What Will Be Reviewed)

### Functional Requirements

1. ✅ Component must be named `UserProfile`
2. ✅ Component must accept props: `name`, `email`, `avatar` (optional)
3. ✅ Component must display user name
4. ✅ Component must display user email
5. ✅ Component must display avatar or placeholder
6. ✅ Component must have a "Follow" button
7. ✅ Button must toggle between "Follow" and "Following" states
8. ✅ State must be managed using React hooks (useState)

### Code Quality Requirements

1. ✅ Component must use TypeScript with proper type annotations
2. ✅ Props must be properly typed with TypeScript interface
3. ✅ Component must follow React functional component pattern
4. ✅ Code must pass ESLint checks (no errors, warnings allowed)
5. ✅ No console.log, console.error, or console.warn statements in production code
6. ✅ Code must be readable and well-structured
7. ✅ Variable and function names must be descriptive and follow camelCase convention

### Architecture Requirements

1. ✅ Component must be in `src/components/UserProfile.tsx`
2. ✅ Component must be exported as default export
3. ✅ Component must use proper React patterns (functional component, hooks, props)
4. ✅ No class components allowed - must use functional component
5. ✅ Must use React hooks (useState) for state management
6. ✅ Props must be destructured in function parameters

### Best Practices Requirements

1. ✅ Component must be a functional component (not class component)
2. ✅ Props interface must be defined with TypeScript
3. ✅ Event handlers must be properly named (e.g., `handleFollowClick`, not `onClick`)
4. ✅ State variable names must be descriptive (e.g., `isFollowing`, not `state`)
5. ✅ Conditional rendering must use proper React patterns (ternary or &&)
6. ✅ No hardcoded magic numbers or strings - use constants or props
7. ✅ Code must follow React best practices for component structure
8. ✅ Component must be self-contained and reusable

### Industry Standards

The following industry standards will be checked:

- **TypeScript**: Proper type safety and type annotations
- **React Patterns**: Functional components, hooks, proper state management
- **Code Style**: ESLint compliance, consistent formatting
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components
- **Component Design**: Single responsibility, reusability, proper prop interfaces
- **Error Handling**: Graceful handling of edge cases (optional props, etc.)

**Important**: Review will **ONLY check what's specified above**. No hidden requirements.

---

## Learning Hints (no solution code)

- **State for the button**: Use the React docs for `useState` to store follow/unfollow. The tests expect the button text to change (e.g. "Follow" ↔ "Following").
- **Props**: Type your props (name, email, avatar optional). See Technical Requirements above for exact prop names and types.
- **File and export**: Component must live in `src/components/UserProfile.tsx` and be the default export. The review checks file path and patterns.

## Help & Completion

- **Full guide**: See repo root [README.md](../../../../../README.md) for setup, workflow, and completion policy.
- **Setup**: If you haven't run setup yet, go to repo root and run `npm run setup` to install all dependencies and Playwright browsers.

## Next Steps

1. **Read this file** - All requirements are listed above
2. **Implement the component** - Follow the instructions and requirements
3. **Verify visually** - Run `npm run dev` and check `/challenge/01-user-profile`
4. **Run review** - `npm run review -- --challenge=01-user-profile` to get scored
