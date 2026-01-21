import { http } from '@/lib/http'
import { ApiResponseSchema } from '@/types'
import { CommentQueryParams, CommentSchema, CreateComment, UpdateComment } from '@/types/comment'

export const CommentService = {
  create: (data: CreateComment) =>
    http(ApiResponseSchema(CommentSchema), {
      path: '/comment/create',
      init: {
        method: 'POST',
        body: JSON.stringify(data),
      },
    }),

  update: (id: string, data: UpdateComment) =>
    http(ApiResponseSchema(CommentSchema), {
      path: `/comment/update/${id}`,
      init: {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    }),

  delete: (id: string) =>
    http(ApiResponseSchema(CommentSchema), {
      path: `/comment/delete/${id}`,
      init: {
        method: 'DELETE',
      },
    }),

  getOne: (id: string) =>
    http(ApiResponseSchema(CommentSchema), {
      path: `/comment/${id}`,
      init: {
        method: 'GET',
      },
    }),

  getAll: (query?: CommentQueryParams, revalidate = 600) =>
    http(ApiResponseSchema(CommentSchema.array()), {
      path: `/comment${query ? `?${new URLSearchParams(query as any).toString()}` : ""}`,
      init: { next: { revalidate, tags: ['comment'] }, method: 'GET' },
    }),
}
