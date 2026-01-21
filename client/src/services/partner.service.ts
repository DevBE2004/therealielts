import { http } from "@/lib/http";
import { ApiResponseSchema, PartnerCreateRequest, PartnerQueryParams, PartnerSchema, PartnerUpdateRequest } from "@/types";
import { NewQueryParams } from "@/types/news";

export const PartnerService = {
  create: (data: PartnerCreateRequest) =>
    http(ApiResponseSchema(PartnerSchema), {
      path: "/partner/create",
      init: {
        method: "POST",
        body: JSON.stringify(data),
      },
    }),

  update: (id: string, data: PartnerUpdateRequest) =>
    http(ApiResponseSchema(PartnerSchema), {
      path: `/partner/update/${id}`,
      init: {
        method: "PUT",
        body: JSON.stringify(data),
      },
    }),

  delete: (id: string) =>
    http(ApiResponseSchema(PartnerSchema), {
      path: `/partner/delete/${id}`,
      init: {
        method: "DELETE",
      },
    }),

  // Lấy bài viết theo slug (dùng server-side + ISR)
  getOne: (id: number) =>
    http(ApiResponseSchema(PartnerSchema), {
      path: `/partner/${id}`,
      init: {
        method: "GET",
        next: { revalidate: 60 },
      },
    }),

  getAll: (query: PartnerQueryParams = {}, revalidate = 600) =>
    http(ApiResponseSchema(PartnerSchema), {
      path: `/partner?${new URLSearchParams({forWeb: "THEREALIELTS", ...query as any,}).toString()}`,
      init: { next: { revalidate, tags: ['partner'] }, method: 'GET' },
    }),
};
