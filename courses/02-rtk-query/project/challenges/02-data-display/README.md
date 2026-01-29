# Challenge 02: Data Display and Caching

## Overview

Implement data caching, refetching, and display multiple data sources.

## Problem Statement

Extend your RTK Query setup to:
1. Add a `getPosts` endpoint
2. Implement caching with tags
3. Create components to display both users and posts
4. Show how RTK Query automatically caches and refetches data

## Instructions

1. Add `getPosts` endpoint to your API slice (or create a new one)
2. Implement tag-based caching for invalidation
3. Create a `PostsList` component
4. Display both users and posts in the app
5. Demonstrate caching by refetching data

## Visual Requirements

- Display both users and posts
- Show loading states for each query
- Demonstrate that cached data is used on refetch
- Clean, organized layout

## How to Verify

1. Run `npm run dev` and open the app
2. Navigate to `/challenge/02-data-display` (or click "View Challenge UI" from the home page)
3. You should see both users and posts
4. Open Redux DevTools and observe caching
5. Refetch data and verify it uses cache when appropriate

---

## Technical Requirements (What Will Be Reviewed)

### Functional Requirements

1. ✅ Must have `getPosts` endpoint
2. ✅ Must implement tag-based caching
3. ✅ Must define tags for cache invalidation
4. ✅ Must display posts in UI
5. ✅ Must handle multiple queries simultaneously
6. ✅ Must demonstrate caching behavior
7. ✅ Must show loading states for each query

### Code Quality Requirements

1. ✅ Must use TypeScript with proper type annotations
2. ✅ Tags must be properly defined with TypeScript
3. ✅ Code must pass ESLint checks (no errors, warnings allowed)
4. ✅ No console.log, console.error, or console.warn statements in production code
5. ✅ Code must be readable and well-structured
6. ✅ Variable and function names must be descriptive and follow camelCase convention

### Architecture Requirements

1. ✅ Must use RTK Query tag system for caching
2. ✅ Must define `providesTags` for query endpoints
3. ✅ Must define `invalidatesTags` for mutation endpoints (if applicable)
4. ✅ Must handle multiple endpoints properly
5. ✅ Must use proper RTK Query patterns
6. ✅ Components must use appropriate generated hooks
7. ✅ Must use functional component pattern (not class component)

### Best Practices Requirements

1. ✅ Tag names must be descriptive and follow RTK Query conventions
2. ✅ Must implement proper cache invalidation strategy
3. ✅ Must handle multiple queries with proper loading/error states
4. ✅ Component must use destructured hook results properly
5. ✅ Must demonstrate caching behavior (show cached data)
6. ✅ Must use TypeScript interfaces/types for all data structures
7. ✅ Code must follow RTK Query caching best practices
8. ✅ Must handle edge cases (empty data, network errors)
9. ✅ Component structure must be maintainable
10. ✅ Must use proper React patterns for list rendering

### Industry Standards

The following industry standards will be checked:

- **TypeScript**: Proper type safety, tag type definitions
- **RTK Query Patterns**: Tag system, cache invalidation, providesTags
- **Code Style**: ESLint compliance, consistent formatting
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components
- **State Management**: Proper caching strategy, tag-based invalidation
- **Error Handling**: Graceful handling of API errors
- **Component Design**: Proper separation of concerns, reusable patterns

**Important**: Review will **ONLY check what's specified above**. No hidden requirements.

---

## Learning Hints (no solution code)

- **Tag system**: Use `providesTags` in query endpoints to tag cached data. Use `invalidatesTags` in mutations to invalidate related cache.
- **Multiple endpoints**: You can add multiple endpoints to the same API slice or create separate slices.
- **Caching**: RTK Query automatically caches query results. Tags help manage cache invalidation.

## Help & Completion

- **Full guide**: See repo root [README.md](../../../../../README.md) for setup, workflow, and completion policy.
- **Setup**: If you haven't run setup yet, go to repo root and run `npm run setup` to install all dependencies and Playwright browsers.

## Next Steps

1. **Read this file** - All requirements are listed above
2. **Implement caching** - Follow the instructions and requirements
3. **Verify visually** - Run `npm run dev` and check `/challenge/02-data-display`
4. **Run review** - `npm run review -- --challenge=02-data-display` to get scored
