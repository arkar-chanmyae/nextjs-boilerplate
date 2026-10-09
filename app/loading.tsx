import { LoaderCircle } from "lucide-react";

/* Route-level loading state: shown during navigation while the segment loads.
   Keep it generic — Suspense fallbacks own the per-island skeletons. */
export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading page">
      <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground motion-reduce:animate-none" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
