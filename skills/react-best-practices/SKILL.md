---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. Apply when writing, reviewing, or refactoring React/Next.js code — components, pages, data fetching, bundle size, or performance work in this repo.
license: MIT (upstream: vercel-labs/agent-skills)
---

# Vercel React Best Practices

> Vendored summary from `vercel-labs/agent-skills` (`skills/react-best-practices/SKILL.md`,
> MIT) on 2026-10-09. Full rule files live upstream; the quick-reference below is
> pinned here so agents apply it offline.
> Sources:
> - https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
> - https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
> - https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns

Comprehensive performance optimization guide for React and Next.js applications, maintained by Vercel. Contains 70 rules across 8 categories, prioritized by impact to guide automated refactoring and code generation.

## When to Apply

Reference these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |
| 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

## Quick Reference

### 1. Eliminating Waterfalls (CRITICAL)

- `async-cheap-condition-before-await` — check cheap sync conditions before awaiting
- `async-defer-await` — move `await` into the branch where it is used
- `async-parallel` — `Promise.all()` for independent operations
- `async-dependencies` — partial dependencies over sequential awaits
- `async-api-routes` — start promises early, await late in API routes
- `async-suspense-boundaries` — use Suspense to stream content

### 2. Bundle Size Optimization (CRITICAL)

- `bundle-barrel-imports` — import directly, avoid barrel files
- `bundle-analyzable-paths` — prefer statically analyzable import paths
- `bundle-dynamic-imports` — use `next/dynamic` for heavy components
- `bundle-defer-third-party` — load analytics/logging after hydration
- `bundle-conditional` — load modules only when the feature activates
- `bundle-preload` — preload on hover/focus for perceived speed

### 3. Server-Side Performance (HIGH)

- `server-auth-actions` — authenticate server actions like API routes
- `server-cache-react` — use `React.cache()` for per-request deduplication
- `server-cache-lru` — LRU cache for cross-request caching
- `server-dedup-props` — avoid duplicate serialization in RSC props
- `server-hoist-static-io` — hoist static I/O (fonts, logos) to module level
- `server-no-shared-module-state` — no module-level mutable request state in RSC/SSR
- `server-serialization` — minimize data passed to client components
- `server-parallel-fetching` — restructure components to parallelize fetches
- `server-after-nonblocking` — use `after()` for non-blocking work

### 4. Client-Side Data Fetching (MEDIUM-HIGH)

- This repo uses **TanStack Query v5** for client server-state. Prefer it over
  ad-hoc `fetch` in effects; use `staleTime`/`gcTime` deliberately, and
  `useSuspenseQuery` with `<Suspense>` boundaries to stream (see `async-*`).
- `client-event-listeners` — deduplicate global event listeners
- `client-passive-event-listeners` — passive listeners for scroll
- `client-localstorage-schema` — version and minimize localStorage data

### 5. Re-render Optimization (MEDIUM)

- `rerender-defer-reads` — don't subscribe to state only used in callbacks
- `rerender-memo` — extract expensive work into memoized components
- `rerender-derived-state` — subscribe to derived booleans, not raw values
- `rerender-functional-setstate` — functional setState for stable callbacks
- `rerender-lazy-state-init` — pass a function to `useState` for expensive values
- `rerender-transitions` — `startTransition` for non-urgent updates
- `rerender-use-deferred-value` — defer expensive renders, keep input responsive
- `rerender-no-inline-components` — never define components inside components

### 6. Rendering Performance (MEDIUM)

- `rendering-content-visibility` — `content-visibility` for long lists
- `rendering-hoist-jsx` — extract static JSX outside components
- `rendering-conditional-render` — ternary, not `&&`, for conditionals
- `rendering-usetransition-loading` — prefer `useTransition` for loading state

### 7. JavaScript Performance (LOW-MEDIUM)

- `js-batch-dom-css` — group CSS changes via classes or `cssText`
- `js-index-maps` — build a `Map` for repeated lookups
- `js-early-exit` — return early from functions
- `js-set-map-lookups` — `Set`/`Map` for O(1) lookups
- `js-tosorted-immutable` — `toSorted()` for immutability

### 8. Advanced Patterns (LOW)

- `advanced-use-latest` — `useLatest` for stable callback refs
- `advanced-init-once` — initialize app once per app load

## Web Design Guidelines (Vercel) — when reviewing UI

When asked to "review my UI", "check accessibility", or "audit design", fetch the
live guidelines first (they update independently of this repo):

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

then check the target files against every rule and report findings in terse
`file:line` format. Upstream skill:
`vercel-labs/agent-skills/skills/web-design-guidelines`.

## Composition Patterns (Vercel) — when building UI components

Prefer compound components + `cva` variants over boolean-prop sprawl:

```tsx
// Bad: boolean prop hell
<Card fancy large withBorder withShadow center />

// Good: variants + composition
<Card variant="elevated" size="lg">
  <CardHeader>…</CardHeader>
  <CardBody>…</CardBody>
</Card>
```

Upstream skill: `vercel-labs/agent-skills/skills/composition-patterns`.
