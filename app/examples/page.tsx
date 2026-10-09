import { Suspense } from "react";
import nextDynamic from "next/dynamic";
import { HealthStatus, HealthStatusSkeleton } from "@/components/health-status";
import { Steps } from "@/components/ui/steps";
import { OptionCardsSkeleton } from "@/components/ui/option-cards";
import type { OptionItem } from "@/components/ui/option-cards";

/* Showcase page for the boilerplate's ui/ primitives + Suspense query.
   force-dynamic: HealthStatus self-fetches /api/health at request time,
   so this page streams instead of prerendering at build time. */
export const dynamic = "force-dynamic";

/* Interactive leaf split into its own chunk; skeleton covers the swap. */
const OptionCards = nextDynamic(
  () => import("@/components/ui/option-cards").then((m) => m.OptionCards),
  {
    loading: () => <OptionCardsSkeleton />,
  },
);

const steps = [
  {
    title: "Pick a primitive",
    body: "Steps, OptionCards, and future ui/ components live in src/components/ui/ with cva variants.",
    accent: "terracotta",
  },
  {
    title: "Fetch with validation",
    body: "src/lib/<domain>.ts holds the zod schema + fetcher; the component below streams via useSuspenseQuery.",
    accent: "amber",
  },
  {
    title: "Handle loading + errors once",
    body: "Route-level app/loading.tsx and app/error.tsx cover navigation; Suspense fallbacks cover islands.",
    accent: "violet",
  },
] as const;

const options: OptionItem[] = [
  {
    id: "colocate",
    badge: "Recommended until 3+ apps",
    title: "Colocate in src/components/ui/",
    tagline: "Fastest iteration while the API is still settling.",
    highlights: ["No publishing or versioning overhead", "cva variants + theme tokens", "This page is the living example"],
    details: (
      <div className="space-y-3">
        <p>
          Keep components in this repo while fewer than three apps consume them. You get instant
          refactors, shared lint/build, and no version-drift between apps.
        </p>
        <p>Extract to a package only once the API is stable and reuse is proven.</p>
      </div>
    ),
    accent: "terracotta",
  },
  {
    id: "package",
    badge: "When reuse is proven",
    title: "Extract to a pnpm package",
    tagline: "Independent versioning across apps.",
    highlights: ["Semantic versioning per component", "Ships its own SKILL.md via @tanstack/intent-style pattern", "Costs: publish flow, changelog, drift"],
    details: (
      <div className="space-y-3">
        <p>
          Worth it when three or more apps consume the components and need different upgrade
          cadences. Until then the overhead exceeds the benefit.
        </p>
      </div>
    ),
    accent: "violet",
  },
];

export default function ExamplesPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Boilerplate examples</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Living showcase of the ported ui/ primitives and the Suspense-driven query pattern.
        </p>
      </header>

      <section aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-xl font-semibold">
          Steps
        </h2>
        <div className="mt-5">
          <Steps steps={[...steps]} />
        </div>
      </section>

      <section aria-labelledby="options-heading">
        <h2 id="options-heading" className="text-xl font-semibold">
          Option cards + modal
        </h2>
        <div className="mt-5">
          <OptionCards options={options} />
        </div>
      </section>

      <section aria-labelledby="health-heading">
        <h2 id="health-heading" className="text-xl font-semibold">
          Live API status
        </h2>
        <div className="mt-5">
          <Suspense fallback={<HealthStatusSkeleton />}>
            <HealthStatus />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
