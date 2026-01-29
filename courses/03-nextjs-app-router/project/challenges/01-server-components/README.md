# Challenge 01: Server Components and Basic Routing

## Overview

Create your first Next.js App Router page with Server Components and basic routing.

## Problem Statement

Build a simple Next.js app with:
1. A home page using Server Components
2. A basic navigation structure
3. A simple about page
4. Proper Next.js App Router structure

## Instructions

1. Create `app/page.tsx` as the home page (Server Component)
2. Create `app/about/page.tsx` for the about page
3. Add navigation between pages using Next.js `Link` component
4. Use Server Components (default in App Router)
5. Style the pages appropriately

## Visual Requirements

- Home page displays welcome message
- Navigation links work between pages
- About page displays information
- Clean, professional layout
- Proper Next.js routing structure

## How to Verify

1. Run `npm run dev` and open `http://localhost:3000`
2. Navigate between home and about pages
3. Verify pages load correctly
4. Check that navigation works smoothly

---

## Technical Requirements (What Will Be Reviewed)

### Functional Requirements

1. ✅ Must have `app/page.tsx` (home page)
2. ✅ Must have `app/about/page.tsx` (about page)
3. ✅ Must use Server Components (default, no 'use client')
4. ✅ Must use Next.js `Link` component for navigation
5. ✅ Must have proper App Router structure
6. ✅ Pages must render correctly
7. ✅ Navigation must work between pages

### Code Quality Requirements

1. ✅ Must use TypeScript with proper type annotations
2. ✅ Must follow Next.js conventions and best practices
3. ✅ Code must pass ESLint checks (no errors, warnings allowed)
4. ✅ No console.log, console.error, or console.warn statements in production code
5. ✅ Code must be readable and well-structured
6. ✅ Variable and function names must be descriptive and follow camelCase convention

### Architecture Requirements

1. ✅ Must use App Router structure (`app/` directory)
2. ✅ Must use Server Components (no 'use client' directive unless needed)
3. ✅ Must use Next.js `Link` component for navigation (not anchor tags)
4. ✅ Must follow Next.js file-based routing conventions
5. ✅ Must use proper folder structure (`app/page.tsx`, `app/about/page.tsx`)
6. ✅ Components must be functional components (not class components)

### Best Practices Requirements

1. ✅ Must use Server Components by default (no 'use client' unless needed)
2. ✅ Navigation must use Next.js `Link` component (not regular anchor tags)
3. ✅ Page components must be properly exported (default export)
4. ✅ Must follow Next.js App Router file naming conventions
5. ✅ Code must be organized in proper folder structure
6. ✅ Must use TypeScript for all components
7. ✅ Must follow Next.js best practices for Server Components
8. ✅ Code must be maintainable and follow single responsibility principle
9. ✅ Must handle navigation properly (client-side routing)
10. ✅ Components must be properly structured and readable

### Industry Standards

The following industry standards will be checked:

- **TypeScript**: Proper type safety and type annotations
- **Next.js Patterns**: App Router, Server Components, file-based routing
- **Code Style**: ESLint compliance, consistent formatting
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components
- **Component Design**: Server Components, proper Next.js structure
- **Navigation**: Proper use of Next.js Link component
- **File Structure**: Following Next.js App Router conventions

**Important**: Review will **ONLY check what's specified above**. No hidden requirements.

---

## Learning Hints (no solution code)

- **Server Components**: By default, all components in App Router are Server Components. No 'use client' directive needed.
- **Navigation**: Use Next.js `Link` component from `next/link` for client-side navigation.
- **File-based routing**: Create `app/about/page.tsx` to create `/about` route automatically.

## Help & Completion

- **Full guide**: See repo root [README.md](../../../../../README.md) for setup, workflow, and completion policy.
- **Setup**: If you haven't run setup yet, go to repo root and run `npm run setup` to install all dependencies and Playwright browsers.

## Next Steps

1. **Read this file** - All requirements are listed above
2. **Implement the pages** - Follow the instructions and requirements
3. **Verify visually** - Run `npm run dev` and check navigation
4. **Run review** - `npm run review -- --challenge=01-server-components` to get scored
