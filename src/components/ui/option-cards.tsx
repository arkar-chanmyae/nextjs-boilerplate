"use client";

import { cva } from "class-variance-authority";
import { ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/* ============================================================
   OptionCards + Modal — reusable "pick one of N options" UI.
   - Options render as cards with a hover lift effect.
   - Each card ends with an explicit "view more details" action.
   - Clicking opens an accessible modal with the full details.
   Ported from lazydev-intro to shadcn/cva conventions:
   - framer-motion replaced with CSS-only enter animations
     (tw-animate-css `animate-in` utilities + motion-reduce guards).
   - Accents are `cva` variants bound to `--color-brand-*`
     theme tokens (see app/globals.css).
   - Modal: Esc-to-close, scroll lock, focus close-button on open,
     restores previous focus on close.
   ============================================================ */

export type OptionAccent = "amber" | "violet" | "terracotta";

export interface OptionItem {
  id: string;
  /** Small pill above the title, e.g. "Recommended". */
  badge?: string;
  title: string;
  /** One-line pitch shown on the card. */
  tagline: string;
  /** Short bullet highlights shown on the card. */
  highlights: string[];
  /** Full details rendered inside the modal (static markup only). */
  details: ReactNode;
  accent?: OptionAccent;
}

const cardVariants = cva(
  "group flex cursor-pointer flex-col rounded-3xl border border-border bg-card p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  {
    variants: {
      accent: {
        amber: "hover:border-brand-amber/60",
        violet: "hover:border-brand-violet/60",
        terracotta: "hover:border-brand-terracotta/60",
      },
    },
    defaultVariants: { accent: "terracotta" },
  },
);

const dotVariants = cva("mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full", {
  variants: {
    accent: {
      amber: "bg-brand-amber",
      violet: "bg-brand-violet",
      terracotta: "bg-brand-terracotta",
    },
  },
  defaultVariants: { accent: "terracotta" },
});

const moreVariants = cva(
  "mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none",
  {
    variants: {
      accent: {
        amber: "text-brand-amber",
        violet: "text-brand-violet",
        terracotta: "text-brand-terracotta",
      },
    },
    defaultVariants: { accent: "terracotta" },
  },
);

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      accent: {
        amber: "bg-brand-amber/15 text-brand-amber",
        violet: "bg-brand-violet/15 text-brand-violet",
        terracotta: "bg-brand-terracotta/15 text-brand-terracotta",
      },
    },
    defaultVariants: { accent: "terracotta" },
  },
);

function Modal({
  title,
  badge,
  accent = "terracotta",
  onClose,
  children,
}: {
  title: string;
  badge?: string;
  accent?: OptionAccent;
  onClose: () => void;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  // Client-only: true after hydration, false during SSR/prerender.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose]);

  // Guard: createPortal needs document (never render during SSR/prerender).
  if (!mounted) return null;

  return createPortal(
    <div
      className="animate-in fade-in fixed inset-0 z-[70] flex items-end justify-center p-4 duration-200 motion-reduce:animate-none sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl duration-200 motion-reduce:animate-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {badge && <span className={cn(badgeVariants({ accent }))}>{badge}</span>}
            <h3 id={titleId} className="mt-2 text-xl font-bold tracking-tight text-card-foreground">
              {title}
            </h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">{children}</div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}

export function OptionCards({ options, columns = 2 }: { options: OptionItem[]; columns?: 2 | 3 }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const close = useCallback(() => setOpenId(null), []);
  const open = options.find((o) => o.id === openId) ?? null;

  return (
    <>
      <div className={cn("grid gap-5", columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {options.map((option) => {
          const accent = option.accent ?? "terracotta";
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setOpenId(option.id)}
              aria-haspopup="dialog"
              className={cn(cardVariants({ accent }))}
            >
              {option.badge && <span className={cn(badgeVariants({ accent }))}>{option.badge}</span>}
              <span className="mt-2 text-lg font-bold tracking-tight text-card-foreground">
                {option.title}
              </span>
              <span className="mt-1 text-sm text-muted-foreground">{option.tagline}</span>
              <span className="mt-4 space-y-2">
                {option.highlights.map((h) => (
                  <span key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={cn(dotVariants({ accent }))} />
                    {h}
                  </span>
                ))}
              </span>
              <span className={cn(moreVariants({ accent }))}>
                Click to view more details
                <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </button>
          );
        })}
      </div>
      {open && (
        <Modal title={open.title} badge={open.badge} accent={open.accent} onClose={close}>
          {open.details}
        </Modal>
      )}
    </>
  );
}

/** Skeleton for `next/dynamic` loading states and Suspense fallbacks. */
export function OptionCardsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="grid animate-pulse gap-5 md:grid-cols-2" aria-label="Loading options">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-border bg-card p-6" aria-hidden>
          <div className="h-4 w-24 rounded-full bg-muted" />
          <div className="mt-3 h-6 w-2/3 rounded bg-muted" />
          <div className="mt-2 h-4 w-full rounded bg-muted" />
          <div className="mt-4 h-4 w-5/6 rounded bg-muted" />
          <div className="mt-2 h-4 w-4/6 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
