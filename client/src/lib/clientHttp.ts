// src/lib/client-http.ts
import { ZodSchema } from "zod";

type ClientHttpOptions = {
  path: string;
  method?: string;
  body?: any;
  headers?: HeadersInit;
  query?: Record<string, string | number | boolean | undefined>;
};

export async function clientHttp<T>(
  schema: ZodSchema<T>,
  { path, method = "GET", body, headers = {}, query }: ClientHttpOptions
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  let url = path;

  // --- 1) Build query params ---
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) params.append(key, String(value));
    }
    url += `?${params.toString()}`;
  }

  // --- 2) GET/HEAD -> không gửi body ---
  let finalBody: BodyInit | undefined = undefined;
  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (method !== "GET" && method !== "HEAD") {
    if (body instanceof FormData) {
      finalBody = body;
    } else if (body !== undefined) {
      finalBody = JSON.stringify(body);
      finalHeaders["Content-Type"] = "application/json";
    }
  }

  const res = await fetch(`${baseUrl}${url}`, {
    method,
    headers: finalHeaders,
    body: finalBody,
    credentials: "include",
  });
  console.log("check", res);

  if (!res.ok) {
    const errText = await res.json();
    throw {
      success: false,
      message: errText || "Có lỗi xảy ra",
      status: res.status,
    };
  }

  const json = await res.json();
  if (!json || typeof json !== "object") {
    throw new Error("Invalid JSON input");
  }
  return json;
}
