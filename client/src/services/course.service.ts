import { http } from "@/lib/http";
import { ApiResponseSchema, CourseQueryParams, CourseSchema } from "@/types";

export const CourseService = {
    // list: (revalidate = 600) =>
    //     http(ApiResponseSchema(CourseSchema.array()), {
    //         path: '/course',
    //         init: { next: { revalidate, tags: ['course'] } }
    //     }),
    getall: (query: CourseQueryParams = {}, revalidate = 600) =>
  http(ApiResponseSchema(CourseSchema.array()), {
    path: `/course?${new URLSearchParams({type: 'COURSE', ...query as any}).toString()}`,
    init: { next: { revalidate, tags: ["course"] }, method: "GET" },
  }),

    getone: (slug: string, revalidate = 1800) =>
    http(ApiResponseSchema(CourseSchema), {
      path: `/course/${slug}`,
      init: { next: { revalidate, tags: [`course:${slug}`, 'course'] } }
    })

}