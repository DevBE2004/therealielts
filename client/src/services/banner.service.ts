import { http } from "@/lib/http"
import { ApiResponseSchema, BannerSchema, BannerCreateRequest, BannerUpdateRequest, BannerQueryParams } from "@/types"

export const BannerService = {
  // Lấy danh sách (ISR)
  getall: (query: BannerQueryParams = {}, revalidate = 60) =>
    http(ApiResponseSchema(BannerSchema.array()), {
      path: `/banner?${new URLSearchParams({isActive: true,forWeb: "THEREALIELTS", ...query as any,}).toString()}`,
      init: 
      { 
        method: "GET",
        query,
        next: { revalidate, tags: ["banner"] } 
      },
    }),

  // Chi tiết (ISR)
  getone: (slug: string, revalidate = 1800) =>
    http(ApiResponseSchema(BannerSchema), {
      path: `/banner/${slug}`,
      init: { next: { revalidate, tags: [`banner:${slug}`, "banner"] } },
    }),

  // Tạo mới (no-cache)
  create: (data: BannerCreateRequest) =>
    http(ApiResponseSchema(BannerSchema), {
      path: "/banner",
      init: {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store", // mutation -> không cache
      },
    }),

  // Cập nhật (no-cache)
  update: (id: string, data: BannerUpdateRequest) =>
    http(ApiResponseSchema(BannerSchema), {
      path: `/banner/${id}`,
      init: {
        method: "PUT",
        body: JSON.stringify(data),
        cache: "no-store",
      },
    }),

  // Xóa (no-cache)
  delete: (id: string) =>
    http(ApiResponseSchema(BannerSchema), {
      path: `/banner/${id}`,
      init: {
        method: "DELETE",
        cache: "no-store",
      },
    }),
}
