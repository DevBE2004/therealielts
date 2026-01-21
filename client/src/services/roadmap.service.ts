import { http } from "@/lib/http";
import { ApiResponseSchema } from "@/types";
import {
  CreateRoadmap,
  RoadmapQueryParams,
  RoadmapSchema,
  UpdateRoadmap,
} from "@/types/roadmap";

export const RoadmapService = {
  create: (data: CreateRoadmap) =>
    http(ApiResponseSchema(RoadmapSchema), {
      path: "/route/create",
      init: {
        method: "POST",
        body: JSON.stringify(data),
      },
    }),

  update: (id: string, data: UpdateRoadmap) =>
    http(ApiResponseSchema(RoadmapSchema), {
      path: `/route/update/${id}`,
      init: {
        method: "PUT",
        body: JSON.stringify(data),
      },
    }),

  delete: (id: string) =>
    http(ApiResponseSchema(RoadmapSchema), {
      path: `/route/delete/${id}`,
      init: {
        method: "DELETE",
      },
    }),

  getOne: (slug: string) =>
      http(ApiResponseSchema(RoadmapSchema), {
        path: `/route/${slug}`,
        init: {
          method: "GET",
          next: { revalidate: 60 },
        },
      }),

  getAll: (query?: RoadmapQueryParams, revalidate = 600) =>
    http(ApiResponseSchema(RoadmapSchema), {
      path: `/route?${new URLSearchParams(query as any).toString()}`,
      init: { next: { revalidate, tags: ["route"] }, method: "GET" },
    }),
};
