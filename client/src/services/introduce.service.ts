import { http } from "@/lib/http";
import { ApiResponseSchema } from "@/types";
import z from "zod";

export const IntroduceService = {

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
      path: `/introduce/${id}`,
      init: {
        method: "GET",
        query,
        next: { revalidate, tags },
      },
    }),
};