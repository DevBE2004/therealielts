// app/sitemap.ts
import { CommonService } from "@/services/common.service";
import { RoadmapService } from "@/services/roadmap.service";
import { TeacherService } from "@/services/teacher.service";
import {
  ApiResponse,
  Course,
  CourseSchema,
  Document,
  DocumentSchema,
  New,
  NewSchema,
  StudyAbroad,
  StudyAbroadSchema,
  Teacher,
} from "@/types";
import { Roadmap } from "@/types/roadmap";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.DOMAIN_WEB || "https://therealielts.vn";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${domain}/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${domain}/ve-the-real-ielts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${domain}/ve-giao-vien`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${domain}/ve-phuong-phap-hoc`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${domain}/su-kien-va-khuyen-mai`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${domain}/vinh-danh-hoc-vien`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${domain}/danh-muc-du-hoc`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${domain}/ladi-page`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${domain}/test-ai`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${domain}/thu-vien-tai-lieu-ielts-mien-phi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${domain}/xay-dung-lo-trinh`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // document
    { url: `${domain}/thu-vien-tai-lieu-ielts-mien-phi/sitemap.xml` },
  ];

  // Helper để tránh lỗi build
  const safeMap = <T, R>(data: unknown, mapper: (item: T) => R): R[] => {
    if (!Array.isArray(data)) return [];
    return data.map(mapper);
  };

  let studyAbroadPages: MetadataRoute.Sitemap = [];
  let coursePages: MetadataRoute.Sitemap = [];
  let newsPages: MetadataRoute.Sitemap = [];
  let roadmapPages: MetadataRoute.Sitemap = [];
  let teacherPages: MetadataRoute.Sitemap = [];

  try {
    const studyAbroads: ApiResponse<any> = await CommonService.getAll(
      StudyAbroadSchema,
      {
        query: { type: "STUDYABROAD", limit: 9999 },
        revalidate: 3600,
        tags: ["study-abroad"],
      }
    );
    studyAbroadPages = safeMap<StudyAbroad, MetadataRoute.Sitemap[number]>(
      studyAbroads?.data,
      (article) => ({
        url: `${domain}/${article.slug}`,
        lastModified: article.updatedAt || now,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    );
  } catch {}

  try {
    const courses: ApiResponse<any> = await CommonService.getAll(CourseSchema, {
      query: { type: "COURSE", limit: 9999 },
      revalidate: 3600,
      tags: ["course"],
    });
    coursePages = safeMap<Course, MetadataRoute.Sitemap[number]>(
      courses?.data,
      (course) => ({
        url: `${domain}/${course.slug}`,
        lastModified: course.updatedAt || now,
        changeFrequency: "monthly",
        priority: 0.9,
      })
    );
  } catch {}

  try {
    const news: ApiResponse<any> = await CommonService.getAll(NewSchema, {
      query: { type: "NEW", isActive: true, limit: 9999 },
      revalidate: 3600,
      tags: ["new"],
    });
    newsPages = safeMap<New, MetadataRoute.Sitemap[number]>(
      news?.data,
      (article) => ({
        url: `${domain}/${article.slug}`,
        lastModified: article.updatedAt || now,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    );
  } catch {}

  try {
    const roadmaps: ApiResponse<any> = await RoadmapService.getAll();
    roadmapPages = safeMap<Roadmap, MetadataRoute.Sitemap[number]>(
      roadmaps?.data,
      (roadmap) => ({
        url: `${domain}/lo-trinh-hoc/${roadmap.slug}`,
        lastModified: roadmap.updatedAt || now,
        changeFrequency: "monthly",
        priority: 0.8,
      })
    );
  } catch {}

  try {
    const teachers: any = await TeacherService.list();
    teacherPages = safeMap<Teacher, MetadataRoute.Sitemap[number]>(
      teachers?.teachers,
      (teacher) => ({
        url: `${domain}/ve-giao-vien/${teacher.id}`,
        lastModified: teacher.updatedAt || now,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    );
  } catch {}

  return [
    ...staticPages,
    ...studyAbroadPages,
    ...coursePages,
    ...newsPages,
    ...roadmapPages,
    ...teacherPages,
  ];
}
