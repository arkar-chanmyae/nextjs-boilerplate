# AGENTS.md — Next.js Boilerplate (agent entrypoint)

> Every coding agent working in this repo MUST read the two skill files below
> before writing or editing any user-facing code. They are vendored (offline,
> version-pinned) from the most-starred/trending frontend skill sources as of
> 2026-10-09.

## Mandatory skills (always refer to these)

1. **`skills/frontend-design/SKILL.md`**
   Anthropic's official `frontend-design` skill (from `anthropics/skills` —
   the most widely adopted UI skill, ~110k weekly installs across Claude Code /
   Codex / Gemini CLI). Design philosophy + two-pass workflow + this repo's
   Tailwind v4 / shadcn bindings in the Appendix.
2. **`skills/react-best-practices/SKILL.md`**
   Vercel Engineering's React/Next.js performance rules (70 rules, from
   `vercel-labs/agent-skills`, MIT) + Web Interface Guidelines review flow +
   composition-patterns guidance. Apply on every component/page/data-fetch change.

Other high-signal sources consulted (fetch live when needed, do NOT vendor —
they update faster than this boilerplate):
- `obra/superpowers` (~280k★) — full plan→implement→review lifecycle.
- `mattpocock/skills` — small composable skills (`grill-me`, `tdd`, `diagnose`).
- `vercel-labs/web-interface-guidelines` (live URL in the react skill file).
- `github/awesome-copilot` → `premium-frontend-ui` skill.

## Stack (pinned 2026-10-09)

- Next.js `16.4.0` (App Router, Turbopack) · React `19.3.0` / React-DOM `19.3.0`
  (stable View Transitions, Fragment Refs, `browser()` API)
- Tailwind CSS `4.3.3` + `@tailwindcss/postcss` `4.3.3` + `tw-animate-css` `1.4.0`
- shadcn `new-york` / `zinc`, class-based dark mode (`components.json`)
- Forms: `react-hook-form` `7.89.0` + `@hookform/resolvers` `5.9.1` + `zod` `4.6.5`
- Data: `@tanstack/react-query` `5.104.1`, `@tanstack/react-table` `9.2.8` (major from v8 — check migration), `axios` `1.20.0`
- UI utils: `cva` `0.7.1`, `clsx` `2.1.1`, `tailwind-merge` `3.7.0`, `lucide-react` `1.54.0`
- Tooling: TypeScript `5.9.3` (pinned to v5 — v7 `7.0.2` verified 2026-10-09 to break
  `eslint-config-next`/`typescript-eslint` ("does not support TS 7.0") and removes
  `baseUrl`; do NOT upgrade until typescript-eslint supports it), ESLint `10.12.0`,
  `eslint-config-next` `16.4.0`, `@types/node` `26.6.4` — see upgrade notes in README.

## Repo layout

```
app/            Next.js App Router (globals.css tokens, layout, pages)
app/api/        route handlers (example: health)
app/examples/   living showcase: Steps, OptionCards, Suspense query
src/components/ custom components → primitives in src/components/ui/
src/components/providers.tsx  client QueryClientProvider boundary
src/lib/        utils (cn()), api client, per-domain fetchers + zod schemas
src/hooks/      client hooks (per components.json alias)
skills/         vendored agent skills (this file's mandatory reading)
```

Aliases (`components.json` + `tsconfig.json`): `@/components`, `@/lib`, `@/hooks`, `@/components/ui`.

## Commands

```bash
npm run dev    # start dev server (Turbopack)
npm run build  # production build
npm run lint   # eslint
npm run lint:fix
```

## Rules for agents

1. Read both skill files before UI work; follow the frontend-design two-pass
   process (short design plan → build → self-critique, remove one decoration).
2. New primitives → `src/components/ui/<name>.tsx` with `cva` variants + `cn()`;
   no hardcoded palette hexes — extend `app/globals.css` `@theme` tokens.
3. Server Components by default; `"use client"` only at the interactive leaf.
   Parallelize server fetches (`Promise.all`), stream with `<Suspense>`.
4. Client server-state via TanStack Query; forms via RHF + zod resolver.
   Domain modules live in `src/lib/<domain>.ts` (schema + fetcher, `parse`
   at the boundary); shared transport in `src/lib/api.ts` (axios instance,
   `NEXT_PUBLIC_API_URL`, failures normalized to `ApiRequestError`).
5. `next/dynamic` for heavy/interactive leaves (see `app/examples/page.tsx`:
   aliased import when the file also sets `export const dynamic`); direct
   imports, no barrel files.
6. Loading + errors, three layers (see `app/loading.tsx`, `app/error.tsx`):
   - `app/loading.tsx` — generic spinner for route navigation only.
   - Per-island `<Suspense fallback={<…Skeleton>}>` for streamed content
     (e.g. `useSuspenseQuery` leaves); each island exports its own Skeleton.
   - `app/error.tsx` (`"use client"` + `reset()`) — catches query/render
     failures per segment. Query failures arrive as `ApiRequestError`.
   - Pages that self-fetch same-origin endpoints at request time must set
     `export const dynamic = "force-dynamic"` (prerender has no server to
     call); `resolveBaseUrl()` in `src/lib/api.ts` handles server-vs-client.
7. Verify with `npm run lint` and `npm run build`; keep diffs small and typed
   (`tsc --noEmit` clean).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
