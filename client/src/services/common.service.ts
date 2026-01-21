// services/common.ts
import { z } from "zod";
import { http } from "@/lib/http";
import { ApiResponseSchema } from "@/types";

// Query params chung
export const CommonQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  type: z.enum(["DOCUMENT", "COURSE", "NEW", "STUDYABROAD", "PAGE"]).optional(),
  isActive: z.boolean().optional(),
  categoryId: z.number().optional(),
  sort: z.string().optional(),
  orderBy: z.string().optional(),
});
export type CommonQueryParams = z.infer<typeof CommonQuerySchema>;

export const CommonService = {
  getAll: <T>(
    schema: z.ZodType<T>,
    {
      query = {},
      revalidate = 600,
      tags = [],
      cache,
    }: {
      query?: CommonQueryParams;
      revalidate?: number;
      tags?: string[];
      cache?: RequestCache;
    } = {}
  ) =>
    http(ApiResponseSchema(z.array(schema)), {
      path: `/common`,
      init: {
        method: "GET",
        query: { ...query },
        next: { revalidate, tags },
        cache,
      },
    }),

  getOne: <T>(
    schema: z.ZodType<T>,
    slug: string,
    {
      query = {},
      revalidate = 600,
      tags = [],
    }: { query?: CommonQueryParams; revalidate?: number; tags?: string[] } = {}
  ) =>
    http(ApiResponseSchema(schema), {
      path: `/common/${slug}`,
      init: {
        method: "GET",
        query,
        next: { revalidate, tags },
      },
    }),
};
