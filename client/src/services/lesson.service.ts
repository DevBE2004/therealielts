import { http } from '@/lib/http'
import { ApiResponseSchema } from '@/types'
import { CreateLesson, LessonQueryParams, LessonSchema, UpdateLesson } from '@/types/lesson'

export const LessonService = {
  create: (data: CreateLesson) =>
    http(ApiResponseSchema(LessonSchema), {
      path: '/lesson/create',
      init: {
        method: 'POST',
        body: JSON.stringify(data),
      },
    }),

  update: (id: string, data: UpdateLesson) =>
    http(ApiResponseSchema(LessonSchema), {
      path: `/lesson/update/${id}`,
      init: {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    }),

  delete: (id: string) =>
    http(ApiResponseSchema(LessonSchema), {
      path: `/lesson/delete/${id}`,
      init: {
        method: 'DELETE',
      },
    }),

  getOne: (id: string) =>
    http(ApiResponseSchema(LessonSchema), {
      path: `/lesson/${id}`,
      init: {
        method: 'GET',
      },
    }),

  getAll: (query: LessonQueryParams, revalidate = 600) =>
    http(ApiResponseSchema(LessonSchema), {
      path: `/lesson?${new URLSearchParams(query as any).toString()}`,
      init: { next: { revalidate, tags: ['lesson'] }, method: 'GET' },
    }),
}
