# Challenge 03: Fullstack Features and Metadata

## Overview

Implement advanced Next.js features including Client Components, metadata, and form handling.

## Problem Statement

Build a complete fullstack feature that:
1. Uses Client Components for interactivity
2. Implements metadata for SEO
3. Creates forms with Server Actions or API routes
4. Handles form submissions
5. Shows dynamic content based on user input

## Instructions

1. Create a form page with Client Component
2. Implement Server Actions or API route for form submission
3. Add metadata (title, description) to pages
4. Handle form validation
5. Display success/error messages
6. Use dynamic routing if needed

## Visual Requirements

- Form page with proper styling
- Form validation feedback
- Success/error messages
- Proper metadata in page head
- Smooth user experience

## How to Verify

1. Run `npm run dev`
2. Fill out and submit the form
3. Verify form submission works
4. Check page metadata in browser dev tools
5. Test form validation

---

## Technical Requirements (What Will Be Reviewed)

### Functional Requirements

1. ✅ Must have Client Component with 'use client' directive
2. ✅ Must implement Server Actions or API route for form handling
3. ✅ Must add metadata (title, description) to pages
4. ✅ Must handle form validation
5. ✅ Must display success/error messages
6. ✅ Form submission must work correctly
7. ✅ Must handle form state properly

### Code Quality Requirements

1. ✅ Must use TypeScript with proper type annotations
2. ✅ Form handling must be properly typed (form data, validation)
3. ✅ Code must pass ESLint checks (no errors, warnings allowed)
4. ✅ No console.log, console.error, or console.warn statements in production code
5. ✅ Code must be readable and well-structured
6. ✅ Variable and function names must be descriptive and follow camelCase convention

### Architecture Requirements

1. ✅ Must use 'use client' directive appropriately (only where needed)
2. ✅ Must use Server Actions or API routes for form handling
3. ✅ Must use Next.js metadata API (export metadata or generateMetadata)
4. ✅ Must follow Next.js best practices
5. ✅ Must separate Server and Client Components properly
6. ✅ Components must be functional components (not class components)

### Best Practices Requirements

1. ✅ Client Components must have 'use client' directive at the top
2. ✅ Server Actions must be properly defined and typed
3. ✅ Form validation must be implemented (client-side and/or server-side)
4. ✅ Must handle form state properly (controlled components)
5. ✅ Must display success/error messages to users
6. ✅ Metadata must be properly configured (title, description)
7. ✅ Must use TypeScript interfaces/types for form data
8. ✅ Error handling must be implemented (display error messages)
9. ✅ Must follow Next.js form handling best practices
10. ✅ Code must be maintainable and follow single responsibility principle

### Industry Standards

The following industry standards will be checked:

- **TypeScript**: Proper type safety, form data types
- **Next.js Patterns**: Server Actions, Client Components, metadata API
- **Code Style**: ESLint compliance, consistent formatting
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components
- **Form Handling**: Proper validation, error handling, state management
- **Error Handling**: Graceful handling of form errors
- **Component Design**: Proper separation of Server and Client Components

**Important**: Review will **ONLY check what's specified above**. No hidden requirements.

---

## Learning Hints (no solution code)

- **Client Components**: Add 'use client' directive at the top of files that need interactivity (forms, event handlers).
- **Server Actions**: Create async functions in Server Components or separate files, marked with 'use server'.
- **Metadata**: Export `metadata` object or `generateMetadata` function from page files.

## Help & Completion

- **Full guide**: See repo root [README.md](../../../../../README.md) for setup, workflow, and completion policy.
- **Setup**: If you haven't run setup yet, go to repo root and run `npm run setup` to install all dependencies and Playwright browsers.

## Next Steps

1. **Read this file** - All requirements are listed above
2. **Implement fullstack features** - Follow the instructions and requirements
3. **Verify visually** - Run `npm run dev` and test the form
4. **Run review** - `npm run review -- --challenge=03-fullstack-features` to get scored
