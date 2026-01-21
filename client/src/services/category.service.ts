import { http } from '@/lib/http'
import { ApiResponseSchema } from '@/types'
import { z } from "zod";

import { CategoryQueryParams, CategorySchema } from '@/types/category'

export const CategoryService = {

  getAll: (
    {
      query = {},
      revalidate = 600,
      tags = [],
      cache, 
    }: { query?: CategoryQueryParams; revalidate?: number; tags?: string[]; cache?: RequestCache } = {}
  ) =>
    http(ApiResponseSchema(z.array(CategorySchema)), {
      path: `/category`,
      init: {
        method: "GET",
        query: { ...query },
        next: { revalidate, tags },
        cache,
      },
    }),

  getOne:(
    id: number,
    {
      query = {},
      revalidate = 600,
      tags = [],
    }: { query?: CategoryQueryParams; revalidate?: number; tags?: string[] } = {}
  ) =>
    http(ApiResponseSchema(CategorySchema), {
      path: `/category/${id}`,
      init: {
        method: "GET",
        query,
        next: { revalidate, tags },
      },
    }),
};
