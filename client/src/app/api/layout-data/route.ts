import { CommonService } from "@/services/common.service";
import { RoadmapService } from "@/services/roadmap.service";
import { CategoryService } from "@/services/category.service";
import { CourseSchema } from "@/types";

export const revalidate = 300;

export async function GET() {
  const [resCourses, resRoadmaps, resCategories] = await Promise.allSettled([
    CommonService.getAll(CourseSchema, {
      query: { type: "COURSE", limit: 9999 },
      revalidate: 300,
      tags: ["course"],
    }),
    RoadmapService.getAll({ limit: 9999 }, 300),
    CategoryService.getAll({
      query: { limit: 9999 },
      revalidate: 300,
      tags: ["category"],
    }),
  ]);

  return Response.json({
    courses: resCourses.status === "fulfilled" ? resCourses.value.data : [],
    roadmaps: resRoadmaps.status === "fulfilled" ? resRoadmaps.value.data : [],
    categories:
      resCategories.status === "fulfilled" ? resCategories.value.data : [],
  });
}
