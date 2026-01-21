import { http } from "@/lib/http";
import { ApiResponseSchema, HonorSchema } from "@/types"; 

export const HonorService = {
    list: (revalidate = 600) =>
        http(ApiResponseSchema(HonorSchema.array()), {
            path: '/honor',
            init: { next: { revalidate, tags: ['honor'] } }
        }),

    detail: (id: number, revalidate = 1800) =>
    http(ApiResponseSchema(HonorSchema), {
      path: `/honor/${id}`,
      init: { next: { revalidate, tags: [`honor:${id}`, 'honor'] } }
    })
}