// services/common.ts
import { z } from "zod";
import { clientHttp } from "@/lib/clientHttp";
import { ParamHeaderType } from "@/components/admin/header-config/types";

// Query params chung
export const CommonQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
});
export type CommonQueryParams = z.infer<typeof CommonQuerySchema>;

export const PageResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  message: z.string().optional(),
  mes: z.string().optional(),
  total: z.number().optional(),
});

export const HeaderService = {
  getList: () =>
    clientHttp(PageResponseSchema, {
      path: "/page",
      method: "GET",
    }),

  getOne: (id: string) =>
    clientHttp(PageResponseSchema, {
      path: `/page/${id}`,
      method: "GET",
    }),

  create: (data: ParamHeaderType) =>
    clientHttp(PageResponseSchema, {
      path: `/page/create`,
      method: "POST",
      body: data,
    }),
  update: (id: string, data: ParamHeaderType) =>
    clientHttp(PageResponseSchema, {
      path: `/page/update/${id}`,
      method: "PUT",
      body: data,
    }),
  delete: (id: string) =>
    clientHttp(PageResponseSchema, {
      path: `/page/delete/${id}`,
      method: "DELETE",
    }),
};
