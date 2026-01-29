# Challenge 01: API Setup and Basic Fetching

## Overview

Set up RTK Query API and create your first data fetching endpoint.

## Problem Statement

Create an RTK Query API slice that fetches users from the mock API. You'll need to:

1. Create an API slice using `createApi` from RTK Query
2. Define a `getUsers` endpoint
3. Integrate the API slice into the Redux store
4. Display the users in the app

## Instructions

1. **Create `src/api/usersApi.ts`** with RTK Query API slice:
   - Import `createApi` and `fetchBaseQuery` from `@reduxjs/toolkit/query/react`
   - Define `baseQuery` using `fetchBaseQuery` (point to mock server or use custom query)
   - Create API slice with `createApi`
   - Define `getUsers` endpoint in the `endpoints` function
   - Export the API slice and generated hooks

2. **Use the mock API** from `src/api/mockServer.ts`:
   - The mock server provides `mockApi.getUsers()` function
   - You can use it directly in a custom `baseQuery`, or configure `fetchBaseQuery` to call it

3. **Add the API reducer** to the store in `src/store/store.ts`:
   - Import your API slice
   - Add the API reducer to the store's `reducer` object

4. **Update `src/components/UsersList.tsx`**:
   - Import and use the generated `useGetUsersQuery` hook from your API slice
   - Handle loading, error, and data states
   - Display the list of users (name, email, username)

5. **Add the component to `src/App.tsx`**:
   - Import `UsersList` component
   - Wrap the app with Redux `Provider` if not already done
   - Render `UsersList` component in the app

## Visual Requirements

- Display a list of users
- Show loading state while fetching
- Show error state if fetch fails
- Display user information (name, email, username)

## How to Verify

1. Run `npm run dev` and open the app
2. Navigate to `/challenge/01-api-setup` (or click "View Challenge UI" from the home page)
3. You should see a list of users displayed
4. Check the Redux DevTools to see the API state
5. Verify loading states appear during fetch

---

## Technical Requirements (What Will Be Reviewed)

### Functional Requirements

1. ✅ Must create RTK Query API slice using `createApi`
2. ✅ Must define `baseQuery` (can use `fetchBaseQuery` or custom)
3. ✅ Must define `getUsers` endpoint
4. ✅ Must integrate API slice reducer into Redux store
5. ✅ Must use generated hooks (`useGetUsersQuery`) in component
6. ✅ Must handle loading state
7. ✅ Must handle error state
8. ✅ Must display user data in the UI

### Code Quality Requirements

1. ✅ Must use TypeScript with proper type annotations
2. ✅ API slice must be properly typed (endpoints, responses)
3. ✅ Code must pass ESLint checks (no errors, warnings allowed)
4. ✅ No console.log, console.error, or console.warn statements in production code
5. ✅ Code must be readable and well-structured
6. ✅ Variable and function names must be descriptive and follow camelCase convention

### Architecture Requirements

1. ✅ API slice must be in `src/api/usersApi.ts` (or appropriate location)
2. ✅ Must use RTK Query patterns (`createApi`, `fetchBaseQuery`)
3. ✅ Store must include API reducer in `reducerPath`
4. ✅ Component must use RTK Query generated hooks (e.g., `useGetUsersQuery`)
5. ✅ Must follow RTK Query best practices
6. ✅ Must use functional component pattern (not class component)

### Best Practices Requirements

1. ✅ API slice must be properly configured with `baseQuery`
2. ✅ Endpoint names must be descriptive and follow RTK Query conventions
3. ✅ Must handle loading, error, and success states properly
4. ✅ Component must use destructured hook results (e.g., `const { data, isLoading, error } = useGetUsersQuery()`)
5. ✅ Error handling must be implemented (display error messages or fallback UI)
6. ✅ Loading states must be shown to users
7. ✅ Must use TypeScript interfaces/types for API responses
8. ✅ Code must follow RTK Query documentation patterns
9. ✅ Store configuration must be correct (API reducer included)
10. ✅ Component must be self-contained and maintainable

### Industry Standards

The following industry standards will be checked:

- **TypeScript**: Proper type safety, API response types
- **RTK Query Patterns**: createApi, fetchBaseQuery, generated hooks
- **Code Style**: ESLint compliance, consistent formatting
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components
- **State Management**: Proper RTK Query integration, store configuration
- **Error Handling**: Graceful handling of API errors
- **Component Design**: Proper separation of concerns, reusable patterns

**Important**: Review will **ONLY check what's specified above**. No hidden requirements.

---

## Learning Hints (no solution code)

- **RTK Query setup**: Use `createApi` from `@reduxjs/toolkit/query/react`. The API slice needs `baseQuery` (use `fetchBaseQuery` or create a custom one that calls `mockApi.getUsers()`).
- **Endpoint definition**: Inside `endpoints`, define `getUsers` as a query endpoint. RTK Query will auto-generate `useGetUsersQuery` hook.
- **Store integration**: Import your API slice and add `[apiSlice.reducerPath]: apiSlice.reducer` to the store's reducer object.
- **Using the hook**: In `UsersList`, call `useGetUsersQuery()`. It returns `{ data, isLoading, error }`. Handle all three states.
- **Mock server**: The `mockServer.ts` file provides `mockApi.getUsers()` which returns a Promise. You can use it in a custom `baseQuery` or configure `fetchBaseQuery` to call it.

## Help & Completion

- **Full guide**: See repo root [README.md](../../../../../README.md) for setup, workflow, and completion policy.
- **Setup**: If you haven't run setup yet, go to repo root and run `npm run setup` to install all dependencies and Playwright browsers.

## Next Steps

1. **Read this file** - All requirements are listed above
2. **Implement the API slice** - Follow the instructions and requirements
3. **Verify visually** - Run `npm run dev` and check `/challenge/01-api-setup`
4. **Run review** - `npm run review -- --challenge=01-api-setup` to get scored
