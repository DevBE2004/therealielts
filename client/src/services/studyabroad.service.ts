import { http } from '@/lib/http'
import { ApiResponseSchema } from '@/types'
import {
  CreateStudyAbroad,
  StudyAbroadQueryParams,
  StudyAbroadSchema,
  UpdateStudyAbroad,
} from '@/types/studyAbroad'

export const StudyAbroadService = {
  create: (data: CreateStudyAbroad) =>
    http(ApiResponseSchema(StudyAbroadSchema), {
      path: '/study-abroad/create',
      init: {
        method: 'POST',
        body: JSON.stringify(data),
      },
    }),

  update: (id: string, data: UpdateStudyAbroad) =>
    http(ApiResponseSchema(StudyAbroadSchema), {
      path: `/study-abroad/update/${id}`,
      init: {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    }),

  delete: (id: string) =>
    http(ApiResponseSchema(StudyAbroadSchema), {
      path: `/study-abroad/delete/${id}`,
      init: {
        method: 'DELETE',
      },
    }),

  getOne: (slug: string) =>
    http(ApiResponseSchema(StudyAbroadSchema), {
      path: `/study-abroad/${slug}`,
      init: {
        method: 'GET',
      },
    }),

  getAll: (query: StudyAbroadQueryParams = {}, revalidate = 600) =>
    http(ApiResponseSchema(StudyAbroadSchema), {
      path: `/study-abroad?${new URLSearchParams({isActive: true, type: 'STUDYABROAD', ...query as any}).toString()}`,
      init: { next: { revalidate, tags: ['study-abroad'] }, method: 'GET' },
    }),
}
