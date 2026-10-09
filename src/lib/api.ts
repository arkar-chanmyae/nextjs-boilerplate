import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { z } from "zod";

/* ============================================================
   Shared API client (axios) + zod-validated error shape.
   - Base URL comes from NEXT_PUBLIC_API_URL; empty string means
     same-origin (Next.js route handlers under app/api/).
   - Every failure is normalized to ApiRequestError (an Error with
     a validated message + optional code/status), so UI code can
     rely on `error.message` without axios imports.
   ============================================================ */

/** Validated shape for every API failure surfaced to UI code. */
export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  status: z.number().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

/** Error thrown by this client. Always an Error; message is zod-validated. */
export class ApiRequestError extends Error {
  code?: string;
  status?: number;

  constructor(err: ApiError) {
    super(err.message);
    this.name = "ApiRequestError";
    this.code = err.code;
    this.status = err.status;
  }
}

function toApiError(error: unknown): ApiRequestError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const parsed = ApiErrorSchema.safeParse(error.response?.data);
    if (parsed.success) {
      return new ApiRequestError({ ...parsed.data, status: parsed.data.status ?? status });
    }
    if (status !== undefined) {
      return new ApiRequestError({
        message: `Request failed with status ${status}`,
        status,
        code: error.code,
      });
    }
    return new ApiRequestError({
      message: error.message || "Network error — check your connection",
      code: error.code,
    });
  }
  if (error instanceof Error) return new ApiRequestError({ message: error.message });
  return new ApiRequestError({ message: "An unexpected error occurred" });
}

export interface ApiClientOptions {
  baseURL?: string;
  /** Return a bearer token when auth is wired up; omit for public clients. */
  getToken?: () => string | null | undefined;
}

/**
 * Resolve the API base URL.
 * - Browser: "" (relative → same origin).
 * - Server: absolute URL required (axios/Node can't do relative), so fall back
 *   to VERCEL_URL, then localhost for `next dev`.
 */
export function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function createApiClient(options: ApiClientOptions = {}): AxiosInstance {
  const { baseURL = resolveBaseUrl(), getToken } = options;
  const client = axios.create({
    baseURL,
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (error: unknown) => Promise.reject(toApiError(error)),
  );

  return client;
}

/** Shared default client (same-origin → Next.js route handlers). */
export const api = createApiClient();

/** Typed request helper — validates nothing, just unwraps `data`. */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await api.request<T>(config);
  return res.data;
}
