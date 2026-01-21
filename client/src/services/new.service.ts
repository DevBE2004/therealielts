import { http } from "@/lib/http";
import { ApiResponseSchema } from "@/types";
import { CreateNew, NewQueryParams, NewSchema, UpdateNew } from "@/types/news";

export const NewService = {
  create: (data: CreateNew) =>
    http(ApiResponseSchema(NewSchema), {
      path: "/new/create",
      init: {
        method: "POST",
        body: JSON.stringify(data),
      },
    }),

  update: (id: string, data: UpdateNew) =>
    http(ApiResponseSchema(NewSchema), {
      path: `/new/update/${id}`,
      init: {
        method: "PUT",
        body: JSON.stringify(data),
      },
    }),

  delete: (id: string) =>
    http(ApiResponseSchema(NewSchema), {
      path: `/new/delete/${id}`,
      init: {
        method: "DELETE",
      },
    }),

  // Lấy bài viết theo slug (dùng server-side + ISR)
  getOne: (slug: string) =>
    http(ApiResponseSchema(NewSchema), {
      path: `/new/${slug}`,
      init: {
        method: "GET",
        next: { revalidate: 60 }, // ISR: revalidate mỗi 60 giây
      },
    }),

  getAll: (query: NewQueryParams = {}, revalidate = 600) =>
    http(ApiResponseSchema(NewSchema), {
      path: `/new?${new URLSearchParams({isActive: true, forWeb: "THEREALIELTS", type: 'NEW', ...query as any,}).toString()}`,
      init: { next: { revalidate, tags: ['new'] }, method: 'GET' },
    }),
};
