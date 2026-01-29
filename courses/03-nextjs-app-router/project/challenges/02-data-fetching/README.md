# Challenge 02: Data Fetching and API Routes

## Overview

Implement data fetching in Server Components and create API routes.

## Problem Statement

Build a data-driven Next.js app that:
1. Fetches data in Server Components using async/await
2. Creates API routes for data endpoints
3. Displays fetched data on pages
4. Handles loading and error states

## Instructions

1. Create API route in `app/api/posts/route.ts`
2. Fetch data in Server Component using async/await
3. Display fetched data on a page
4. Handle loading and error states appropriately
5. Create a posts listing page

## Visual Requirements

- Posts page displays fetched data
- Loading states are handled
- Error states are handled gracefully
- Clean data presentation
- API routes work correctly

## How to Verify

1. Run `npm run dev`
2. Navigate to posts page - should show data
3. Test API route directly (`/api/posts`)
4. Verify data fetching works correctly
5. Check error handling

---

## Technical Requirements (What Will Be Reviewed)

### Functional Requirements

1. ✅ Must have API route (`app/api/posts/route.ts` or similar)
2. ✅ Must fetch data in Server Component using async/await
3. ✅ Must display fetched data on page
4. ✅ Must handle loading states
5. ✅ Must handle error states
6. ✅ API route must return JSON data
7. ✅ Server Component must be async

### Code Quality Requirements

1. ✅ Must use TypeScript with proper type annotations
2. ✅ API routes must be properly typed (request/response types)
3. ✅ Code must pass ESLint checks (no errors, warnings allowed)
4. ✅ No console.log, console.error, or console.warn statements in production code
5. ✅ Code must be readable and well-structured
6. ✅ Variable and function names must be descriptive and follow camelCase convention

### Architecture Requirements

1. ✅ Must use App Router API routes structure (`app/api/.../route.ts`)
2. ✅ Must use async Server Components for data fetching
3. ✅ Must use proper Next.js data fetching patterns (async/await in Server Components)
4. ✅ Must follow Next.js conventions
5. ✅ Must handle errors appropriately (try-catch or error boundaries)
6. ✅ Components must be functional components (not class components)

### Best Practices Requirements

1. ✅ API routes must use proper HTTP methods (GET, POST, etc.)
2. ✅ API routes must return proper JSON responses
3. ✅ Server Components must be async functions
4. ✅ Must handle loading states appropriately
5. ✅ Must handle error states gracefully
6. ✅ Must use TypeScript interfaces/types for API responses
7. ✅ Must follow Next.js data fetching best practices
8. ✅ Code must be maintainable and follow single responsibility principle
9. ✅ Error handling must be implemented (display error messages or fallback UI)
10. ✅ Must use proper Next.js patterns for async Server Components

### Industry Standards

The following industry standards will be checked:

- **TypeScript**: Proper type safety, API response types
- **Next.js Patterns**: App Router, API routes, async Server Components
- **Code Style**: ESLint compliance, consistent formatting
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components
- **Data Fetching**: Proper async/await usage, error handling
- **Error Handling**: Graceful handling of API errors
- **Component Design**: Proper separation of concerns, Server Component patterns

**Important**: Review will **ONLY check what's specified above**. No hidden requirements.

---

## Learning Hints (no solution code)

- **API routes**: Create `app/api/posts/route.ts` with exported functions like `GET`, `POST` for HTTP methods.
- **Server Components**: Make page components async and use `await` to fetch data directly.
- **Error handling**: Use try-catch in Server Components or error boundaries.

## Help & Completion

- **Full guide**: See repo root [README.md](../../../../../README.md) for setup, workflow, and completion policy.
- **Setup**: If you haven't run setup yet, go to repo root and run `npm run setup` to install all dependencies and Playwright browsers.

## Next Steps

1. **Read this file** - All requirements are listed above
2. **Implement API routes and data fetching** - Follow the instructions and requirements
3. **Verify visually** - Run `npm run dev` and check the posts page
4. **Run review** - `npm run review -- --challenge=02-data-fetching` to get scored
