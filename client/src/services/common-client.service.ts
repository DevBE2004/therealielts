// services/common.ts
import { z } from "zod";
import { clientHttp } from "@/lib/clientHttp";

// Query params chung
export const CommonQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  type: z.enum(["DOCUMENT", "COURSE", "NEW", "STUDYABROAD", "PAGE"]).optional(),
  isActive: z.boolean().optional(),
  categoryId: z.number().optional(),
  sort: z.string().optional(),
});
export type CommonQueryParams = z.infer<typeof CommonQuerySchema>;

export const PageResponseSchema = z.object({
  success: z.boolean(),
  data: z.object(),
  message: z.string().optional(),
  mes: z.string().optional(),
  total: z.number().optional(),
});

export const PageService = {
  getPage: (query: CommonQueryParams) =>
    clientHttp(PageResponseSchema, {
      path: "/common",
      method: "GET",
      query,
    }),

  getOne: (id: string) =>
    clientHttp(PageResponseSchema, {
      path: `/common/${id}`,
      method: "GET",
    }),
};
