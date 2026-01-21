import { http } from "@/lib/http";
import { ApiResponseSchema, TeacherQueryParams, TeacherSchema } from "@/types"; 

export const TeacherService = {
    list: (query: TeacherQueryParams = {}, revalidate = 600) =>
        http(ApiResponseSchema(TeacherSchema.array()), {
            path: `/teacher?${new URLSearchParams({forWeb: "THEREALIELTS", ...query as any,}).toString()}`,
            init: { next: { revalidate, tags: ['teacher'] } }
        }),

    detail: (id: number, revalidate = 1800) =>
    http(ApiResponseSchema(TeacherSchema), {
      path: `/teacher/${id}`,
      init: 
      { 
        next: { revalidate, tags: [`teacher:${id}`, 'teacher'] } 
      }
    })
}