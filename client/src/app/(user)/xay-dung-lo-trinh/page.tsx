import { BannerService } from "@/services/banner.service";
import slugify from "slugify";
import RoadmapView from "./RoadmapView";
import { Banner, Course, CourseSchema } from "@/types";
import { Metadata } from "next";
import { CommonService } from "@/services/common.service";
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Lộ trình học - The Real IELTS",
    description:
      "Khám phá lộ trình học tập IELTS chi tiết từ cơ bản đến nâng cao cùng The Real IELTS. Định hướng học tập rõ ràng giúp bạn đạt mục tiêu nhanh chóng.",
    keywords: 
      `lộ trình học,
      học IELTS,
      khóa học The Real IELTS,
      roadmap,
      Luyện thi IELTS`,
    openGraph: {
      type: "website",
      url: "https://therealielts.vn/xay-dung-lo-trinh",
      title: "Lộ trình học - The Real IELTS",
      description:
        "Khám phá lộ trình học tập chi tiết từ cơ bản đến nâng cao cùng SVTech.",
      images: [
        {
          url: `${process.env.DOMAIN_WEB}/images/Uu-diem-vuot-troi-cua-phuong-phap-LCLT.webp`,
          width: 1200,
          height: 630,
          alt: "Lộ trình học The Real IELTS",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Lộ trình học - The Real IELTS",
      description:
        "Khám phá lộ trình học tập IELTS chi tiết từ cơ bản đến nâng cao cùng The Real IELTS.",
      images: [`${process.env.DOMAIN_WEB}/images/Uu-diem-vuot-troi-cua-phuong-phap-LCLT.webp`],
    },
     robots: {
        index: true,
        follow: true,
    }
  };
}


export default async function LearningRoadmap() {

  // Fetch Banner
  const fetchBanner = (await BannerService.getall()).data;
  // const banners: Banner[] = Array.isArray(fetchBanner) ? fetchBanner : [];
  const banners: Banner[] = Array.isArray(fetchBanner)
      ? fetchBanner.filter(
          (b) =>
            b.isActive === true &&
            slugify(b.category || "", { lower: true }) === "xay-dung-lo-trinh"
        )
      : [];

  const fetchCourse = await CommonService.getAll(CourseSchema, {
    query: {type: "COURSE", limit: 9999},
    revalidate: 300,
    tags: ["course"]
  })
  let courses: Course[] = [];
  if (Array.isArray(fetchCourse.data) && fetchCourse.success) {
    courses = fetchCourse.data.filter((c) => c.category?.name !== "package");
  } else {
    console.error("Err:", fetchCourse.message);
  }
  
  return (
    <>
    <RoadmapView 
      dataBanner={banners} 
      dataCourse={courses} 
    />
    </>
  );
}
