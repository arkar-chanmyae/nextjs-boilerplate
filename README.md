# Next.js Boilerplate with Modern Stack

A feature-rich, production-ready Next.js 16 boilerplate with TypeScript, Tailwind CSS v4, and modern tooling for building scalable web applications.

## 🤖 Coding-agent skills (vendored)

Every agent working in this repo must read `AGENTS.md` first. It points to two
version-pinned skill files (most-starred/trending frontend sources, Oct 2026):

- `skills/frontend-design/SKILL.md` — Anthropic's official frontend-design skill
  (~110k weekly installs) + this repo's Tailwind/shadcn bindings.
- `skills/react-best-practices/SKILL.md` — Vercel's 70 React/Next.js performance
  rules + Web Interface Guidelines review flow + composition patterns.

## 🚀 Features

- ⚡ Next.js 16 with App Router + Turbopack
- 🎨 Tailwind CSS v4 + shadcn (`new-york`/`zinc`, class dark mode)
- 🛠️ TypeScript for type safety
- ⚛️ React 19 with Server Components
- 🔄 React Query (TanStack Query) for data fetching + Suspense streaming
- 📋 React Hook Form with Zod validation
- 🎭 Class Variance Authority for component variants
- 🧩 Example ui/ primitives: Steps, OptionCards + modal (`/examples`)
- 📝 ESLint (flat config) for code quality
- 🎯 Absolute Imports configuration
- 🤖 Vendored agent skills (`AGENTS.md` + `skills/`)

## 🛠️ Tech Stack (pinned 2026-10-09 — all latest stable)

- **Framework**: Next.js `16.4.0` (App Router, Turbopack)
- **UI**: React `19.3.0` (View Transitions, Fragment Refs, `browser()` API)
- **Styling**: Tailwind CSS `4.3.3` + shadcn `new-york`/`zinc`
- **State Management**: TanStack Query `5.104.1`
- **Tables**: TanStack Table `9.2.8` (⚠️ major bump from v8 — check migration guide)
- **Form Handling**: React Hook Form `7.89.0` + Zod `4.6.5`
- **HTTP**: Axios `1.20.0`
- **Icons**: lucide-react `1.54.0` (⚠️ major bump from 0.x — some icon names/props changed)
- **UI Components**: shadcn + Custom Components (`src/components/ui/`)
- **Type Safety**: TypeScript `5.9.3` (⚠️ deliberately NOT v7: `7.0.2` breaks
  `eslint-config-next`/`typescript-eslint` — verified 2026-10-09 — and removes `baseUrl`)
- **Linting**: ESLint `10.12.0` (⚠️ major from v9 — flat config already in use, should be compatible)

> Upgrade hazard notes: TanStack Table v8→v9, lucide 0.x→1.x, ESLint 9→10, and
> TS 5→7 are all majors. After `npm install`, run `npm run lint && npm run build`
> and fix codemod-level breakages before committing.

## 🚀 Getting Started

1. Clone the repository
   ```bash
   git clone [your-repo-url]
   cd ai-clinic-frontend
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the development server
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser (examples at `/examples`)

## 🧩 UI components

Primitives live in `src/components/ui/` (shadcn conventions: `cva` variants +
`cn()`, theme tokens in `app/globals.css`, no hardcoded palette):

- `steps.tsx` — vertical numbered steps (`Steps`)
- `option-cards.tsx` — hover-lift option cards + accessible modal
  (`OptionCards`, `OptionCardsSkeleton`), CSS-only animations (no framer-motion)

See them live at `/examples` (`app/examples/page.tsx`).

## 🔌 Data fetching

- Transport: `src/lib/api.ts` — axios instance (`NEXT_PUBLIC_API_URL`, see
  `.env.example`), failures normalized to `ApiRequestError` (zod-validated).
- Domain modules: `src/lib/<domain>.ts` — schema + fetcher, `parse` at the
  boundary (see `src/lib/health.ts` + `app/api/health/route.ts`).
- Client state: TanStack Query via `src/components/providers.tsx`; Suspense
  pattern demo in `src/components/health-status.tsx` + `/examples`.

## 📦 Scripts

- dev: Start development server
- build: Build for production
- start: Start production server
- lint: Run ESLint
- lint:fix: Fix ESLint issues

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.