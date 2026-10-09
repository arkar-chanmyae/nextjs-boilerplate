import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   Steps — vertical numbered steps (server component).
   - Each step number sits inside a gradient box.
   - The step's card content sits on the right of its number.
   - Numbers are connected by a vertical line.
   Ported from lazydev-intro to shadcn/cva conventions:
   accents are `cva` variants bound to `--color-brand-*`
   theme tokens (see app/globals.css), not hardcoded classes.
   ============================================================ */

const stepNumberVariants = cva(
  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-base font-bold text-white shadow-md",
  {
    variants: {
      accent: {
        amber: "from-brand-amber to-brand-terracotta",
        violet: "from-brand-violet to-brand-amber",
        terracotta: "from-brand-terracotta to-brand-amber",
      },
    },
    defaultVariants: {
      accent: "terracotta",
    },
  },
);

export interface StepItem extends VariantProps<typeof stepNumberVariants> {
  /** Card heading shown next to the number box. */
  title: string;
  /** Card body on the right of the number (text, lists, code...). */
  body: ReactNode;
}

export function Steps({ steps, className }: { steps: StepItem[]; className?: string }) {
  return (
    <ol className={cn("space-y-5", className)}>
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          {/* Number column: boxed number + vertical connector line */}
          <div className="flex flex-col items-center">
            <span aria-hidden className={cn(stepNumberVariants({ accent: step.accent }))}>
              {i + 1}
            </span>
            {i < steps.length - 1 && <span aria-hidden className="mt-2 w-px flex-1 bg-border" />}
          </div>
          {/* Card content on the right of the number */}
          <div className="flex-1 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="font-semibold text-card-foreground">{step.title}</h3>
            <div className="mt-1 text-sm text-muted-foreground">{step.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
