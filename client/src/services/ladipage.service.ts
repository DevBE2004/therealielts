import { http } from "@/lib/http";
import { ApiResponseSchema } from "@/types";
import z from "zod";

export const LadiPageService = {

  getOne: <T>(
    schema: z.ZodType<T>,
    id: number,
    {
      query = {},
      revalidate = 600,
      tags = [],
    }: { query?: any; revalidate?: number; tags?: string[] } = {}
  ) =>
    http(ApiResponseSchema(schema), {
      path: `/ladi-page/${id}`,
      init: {
        method: "GET",
        query,
        next: { revalidate, tags },
      },
    }),
};