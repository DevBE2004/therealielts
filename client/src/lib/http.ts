// lib/http.ts
import "server-only";
import { z } from "zod";

type FetcherOpts = {
  path: string;
  init?: RequestInit & {
    next?: {
      revalidate?: number | false;
      tags?: string[];
    };
    cache?: RequestCache;
    query?: Record<string, string | number | boolean | undefined>;
    credentials?: RequestCredentials;
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL)
  throw new Error("Missing NEXT_PUBLIC_BACKEND_URL in environment variables");

/** Build query string giống clientHttp */
function buildQuery(query?: Record<string, any>) {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined) params.append(k, String(v));
  });
  const str = params.toString();
  return str ? `?${str}` : "";
}

/**
 * http<T>
 * Server-side fetch đồng bộ với clientHttp
 */
export async function http<T>(
  schema: z.ZodType<T>,
  { path, init = {} }: FetcherOpts
): Promise<T> {
  try {
    const queryString = buildQuery(init.query);
    let url = `${BASE_URL}${path}${queryString}`;

    // Body + headers
    const headers: HeadersInit = init.headers || {};
    let bodyToSend: BodyInit | undefined = init.body ?? undefined;
    // ép headers thành Record<string, string>
    const normalizedHeaders: Record<string, string> = {
      ...(headers as Record<string, string>),
    };

    if (!(bodyToSend instanceof FormData)) {
      if (bodyToSend !== undefined) bodyToSend = JSON.stringify(bodyToSend);
      normalizedHeaders["Content-Type"] = "application/json";
    } else {
      // FormData không cần Content-Type
      delete normalizedHeaders["Content-Type"];
    }

    // console.log("HTTP request:", {
    //   url,
    //   method: init.method,
    //   headers,
    //   body: bodyToSend instanceof FormData ? "[FormData]" : bodyToSend,
    //   credentials: init.credentials,
    //   next: init.next,
    // });

    const res = await fetch(url, {
      ...init,
      headers,
      body: bodyToSend,
      credentials: init.credentials || "same-origin",
    });

    // if (!res.ok) {
    //   const errText = await res.text().catch(() => "");
    //   throw new Error(`HTTP ${res.status} on ${path}: ${errText}`);
    // }

    const data = await res.json();

    // console.log(`HTTP response data: on ${path}`, data );

    return data;
  } catch (err) {
    console.error("HTTP fetch error:", err);
    throw err;
  }
}
