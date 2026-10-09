"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/lib/health";

/* Example server-state leaf: Suspense-driven query (no isLoading branch).
   Parent must wrap in <Suspense fallback={...}>; failures bubble to the
   nearest error.tsx boundary as ApiRequestError. */
export function HealthStatus() {
  const { data } = useSuspenseQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <span className="relative flex h-3 w-3" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
      </span>
      <div>
        <p className="font-semibold text-card-foreground">API {data.status}</p>
        <p className="text-sm text-muted-foreground">
          {data.time}
          {data.version ? ` · v${data.version}` : null}
        </p>
      </div>
    </div>
  );
}

export function HealthStatusSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm"
      aria-label="Loading API status"
    >
      <div className="h-5 w-32 rounded bg-muted" aria-hidden />
      <div className="mt-2 h-4 w-48 rounded bg-muted" aria-hidden />
    </div>
  );
}
