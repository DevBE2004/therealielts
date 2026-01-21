import { http } from '@/lib/http'
import { ApiResponseSchema } from '@/types'
import {
  CreateDocument,
  DocumentQueryParams,
  DocumentSchema,
  UpdateDocument,
} from '@/types/document'

export const DocumentService = {
  create: (data: CreateDocument) =>
    http(ApiResponseSchema(DocumentSchema), {
      path: '/document/create',
      init: {
        method: 'POST',
        body: JSON.stringify(data),
      },
    }),

  update: (id: string, data: UpdateDocument) =>
    http(ApiResponseSchema(DocumentSchema), {
      path: `/document/update/${id}`,
      init: {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    }),

  delete: (id: string) =>
    http(ApiResponseSchema(DocumentSchema), {
      path: `/document/delete/${id}`,
      init: {
        method: 'DELETE',
      },
    }),

  getOne: (id: string) =>
    http(ApiResponseSchema(DocumentSchema), {
      path: `/document/${id}`,
      init: {
        method: 'GET',
      },
    }),

  getAll: (query: DocumentQueryParams = {}, revalidate = 600) =>
    http(ApiResponseSchema(DocumentSchema), {
      path: `/document?${new URLSearchParams({isActive: true, type: 'DOCUMENT',...query as any}).toString()}`,
      init: { next: { revalidate, tags: ['document'] }, method: 'GET' },
    }),
}
