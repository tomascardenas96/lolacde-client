# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Tech Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (via PostCSS), Zustand (state), React Hook Form + Zod (forms/validation), Axios (HTTP).

## Architecture

### Path Alias

`@/*` maps to `./src/*`.

### Route Groups

- `(auth)/` — Login and register pages, wrapped by `GuestGuard` (redirects authenticated users away)
- `(main)/` — Protected pages, wrapped by `AuthInitializer` (validates session on mount) and includes `LogOutBtn`

### Feature-Based Organization (`src/features/`)

Each feature (currently `auth`) contains its own `components/`, `hooks/`, `schemas/`, `services/`, `store/`, `types/`, and `ui/` directories. New features should follow this pattern.

### API Layer

- `src/lib/api-client.ts` — Shared Axios instance (base URL from `NEXT_PUBLIC_API_BASE_URL`, credentials enabled)
- Feature services (e.g., `authService.ts`) centralize all API calls for a feature and handle state updates via Zustand actions
- Backend uses HttpOnly cookies for session management; the client never handles tokens directly

### State Management

Zustand stores live in `src/features/<feature>/store/`. The auth store uses `persist` middleware (localStorage). Store types are co-located in `types/state.types.ts` within the feature.

### Form Pattern

Forms use custom hooks (`useLoginForm`, `useRegisterForm`) that wire up React Hook Form with Zod schemas and handle submission + server error mapping. Zod schemas live in `schemas/` within the feature.

### Environment

Requires `.env.local` with `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:3010/api/v1`).
