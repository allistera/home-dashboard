# AGENTS.md

This file gives coding agents the minimum working context for this repository.

## Project Overview

- App: `home-dashboard`
- Stack: Vue 3 + Vite + TypeScript + Vue Router + Pinia + Tailwind CSS 4
- Package manager: `bun` preferred
- Deployment target: Vercel SPA build output from `dist/`

The app is a client-side dashboard project with route-driven views under `src/views/` and reusable UI in `src/components/`.

## Repository Structure

- `src/main.ts`: app bootstrap
- `src/App.vue`: root app shell
- `src/router/index.ts`: route definitions
- `src/views/`: page-level views
- `src/components/`: shared and feature components
- `src/composables/`: reusable Vue composition logic
- `src/assets/main.css`: main global styles
- `public/`: static assets
- `vite.config.ts`: Vite configuration
- `vercel.json`: Vercel deployment config, including SPA rewrite

## Common Commands

Use `bun` unless there is a clear reason not to.

```bash
bun install
bun dev
bun run build
bun run build-only
bun run lint
bun run format
```

## Working Notes

- This is a Vite SPA, so client routes must continue to work with the rewrite in `vercel.json`.
- `bun run lint` uses `eslint --fix`, so expect it to modify files.
- There is currently no unit test script in `package.json`.
- Playwright is installed, but `package.json` does not define a convenience wrapper beyond `test:e2e`.

## Editing Guidance

- Preserve the existing Vue 3 + TypeScript patterns already used in the touched files.
- Prefer small, local changes over broad refactors unless the task clearly requires one.
- Keep routes, imports, and file casing consistent with the existing `src/views/` and `src/components/` layout.
- When changing UI, check both desktop and mobile behavior because the project is dashboard-oriented and layout-heavy.
- Make use of Tailadmin theme and components for styling which are listed here - https://tailadmin.com/docs/components/vue that includes:
  - Alert
  - Avatar
  - Badge
  - Breadcrumb
  - Button
  - Button Group
  - Card
  - Carousel
  - Dropdown
  - Images
  - Links
  - List
  - Modal
  - Notification
  - ProgressBar
  - Pagination
  - Popover
  - Ribbons
  - Spinner
  - Table
  - Tabs
  - Tooltips
  - Videos

## Verification

For most changes, run the narrowest relevant check first:

```bash
bun run lint
bun run build
```

If the task affects browser flows and Playwright coverage exists, also run:

```bash
bun run test:e2e
```
