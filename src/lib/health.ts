import { z } from "zod";
import { request } from "@/lib/api";

/* Example domain module: fetch + validate at the boundary.
   Convention: one file per domain in src/lib with its zod schemas,
   a fetcher per endpoint, and <domain>Schema.parse(data) before return. */

export const HealthSchema = z.object({
  status: z.string(),
  time: z.string(),
  version: z.string().optional(),
});

export type Health = z.infer<typeof HealthSchema>;

export async function fetchHealth(): Promise<Health> {
  const data = await request<unknown>({ url: "/api/health" });
  return HealthSchema.parse(data);
}
