import { RenderSectionHomePage } from "@/components/admin/custom-home-page/render-section-home-page";
import ConsultationForm from "@/components/common/ConsultationForm";
import HomeBanner from "@/components/home/banner";
import BoxHeaderBottom from "@/components/home/box-header-bottom";
import CourseRoadmap from "@/components/home/CourseRoadmap";
import SectionDocument from "@/components/home/DocumentSection";
import Feedback from "@/components/home/Feedback";
import HomeFeatures from "@/components/home/HomeFeatures";
import HonorSlide from "@/components/home/HonorSlide";
import Introduce from "@/components/home/intro";
import LearningApproach from "@/components/home/LearningApproach";
import MediaAboutTRI from "@/components/home/MediaAboutTRI";
import NewView from "@/components/home/NewView";
import StatsSection from "@/components/home/StatsSection";

import TeacherSlide from "@/components/home/TeacherSlide";
import TeachingMethod from "@/components/home/TeachingMethod";
import CourseRoadmapSkeleton from "@/components/skeleton/course-roadmap-skeleton";
import { HomeBannerSkeleton } from "@/components/skeleton/home-banner-skeleton";
import SkeletonSectionDocument from "@/components/skeleton/section-document-skeleton";
import TeacherSkeleton from "@/components/skeleton/teacher-skeleton";
import { parseStringObject } from "@/hooks/parseStringObject";
import { http } from "@/lib/http";
import { BannerService } from "@/services/banner.service";
import { CommonService } from "@/services/common.service";
import { ApiResponseSchema, New, NewSchema } from "@/types";
import { Metadata } from "next";
import { Suspense } from "react";
import slugify from "slugify";
import z from "zod";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "The Real IELTS luyện thi IELTS, tài liệu học IELTS",
    description:
      "The Real IELTS là đơn vị đào tạo IELTS số 1 Việt Nam với lộ trình học rõ ràng và phương pháp LCLT độc quyền cùng đội ngũ chuyên gia giàu kinh nghiệm.",
    openGraph: {
      type: "website",
      url: "https://therealielts.vn",
      title: "The Real IELTS luyện thi IELTS, tài liệu học IELTS",
      description:
        "The Real IELTS là đơn vị đào tạo IELTS số 1 Việt Nam với lộ trình học rõ ràng và phương pháp LCLT độc quyền cùng đội ngũ chuyên gia giàu kinh nghiệm.",
      images: [
        {
          url: `${process.env.DOMAIN_WEB}/images/Uu-diem-vuot-troi-cua-phuong-phap-LCLT.webp`,
          width: 1200,
          height: 630,
          alt: "The Real IELTS",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Real IELTS luyện thi IELTS, tài liệu học IELTS",
      description:
        "The Real IELTS là đơn vị đào tạo IELTS số 1 Việt Nam với lộ trình học rõ ràng và phương pháp LCLT độc quyền cùng đội ngũ chuyên gia giàu kinh nghiệm.",
      images: [
        `${process.env.DOMAIN_WEB}/images/Uu-diem-vuot-troi-cua-phuong-phap-LCLT.webp`,
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords:
      "IELTS, học IELTS, thi IELTS, luyện thi IELTS, tài liệu học IELTS",
    other: {
      "google-site-verification": "goYwOiP3qN3h-sjuhLgnr67_7GbzQzC13eYJg0Vl56c",
    },
  };
}

export const revalidate = 300;

export default async function Home() {
  const [news, record9Introduce] = await Promise.allSettled([
    CommonService.getAll(NewSchema, {
      query: { isActive: true, type: "NEW", limit: 200, page: 1 },
      revalidate: 300,
      tags: ["new"],
    }),
    await http(ApiResponseSchema(z.any()), {
      path: "/introduce/9",
      init: {
        method: "GET",
        next: {
          revalidate: 60,
          tags: ["introduce-9"],
        },
      },
    }),
  ]);
  // end

  const { press, newsList } =
    news.status === "fulfilled" && Array.isArray(news.value.data)
      ? news.value.data.reduce(
          (acc, n) => {
            const group = parseStringObject(n?.category?.group);
            let slug: string = "";
            if (group) {
              slug = slugify(group.name, {
                lower: true,
                locale: "vi",
              });
            }
            if (slug === "bao-chi") {
              acc.press.push(n);
            } else {
              acc.newsList.push(n);
            }

            return acc;
          },
          { press: [] as New[], newsList: [] as New[] }
        )
      : { press: [], newsList: [] };

  // Data Section Home Page
  const dataSectionHomePage =
    record9Introduce.status === "fulfilled" &&
    record9Introduce.value?.data?.section1 !== undefined
      ? record9Introduce.value.data?.section1
      : {};

  const dataSectionStatic =
    record9Introduce.status === "fulfilled" &&
    record9Introduce.value?.data?.section2
      ? record9Introduce.value.data
      : {};

  const fetchBanners = await BannerService.getall({}, 60);
  const dataBanners = Array.isArray(fetchBanners?.data)
    ? fetchBanners.data
    : [];

  return (
    <div id="main" className="flex flex-col">
      <section id="box_header" className="flex flex-col">
        <Suspense fallback={<HomeBannerSkeleton />}>
          <HomeBanner location="trang-chu" dataBanner={dataBanners} />
        </Suspense>
        <BoxHeaderBottom />
      </section>

      <RenderSectionHomePage
        slot="after-box_header"
        data={dataSectionHomePage}
      />

      {dataSectionStatic?.section2?.BlockIntroduce && (
        <Introduce data={dataSectionStatic?.section2?.BlockIntroduce} />
      )}
      <RenderSectionHomePage
        slot="after-introduce"
        data={dataSectionHomePage}
      />

      <HomeFeatures />

      <Suspense fallback={<CourseRoadmapSkeleton />}>
        <CourseRoadmap />
      </Suspense>
      <RenderSectionHomePage
        slot="after-course-roadmap"
        data={dataSectionHomePage}
      />

      <Suspense fallback={<TeacherSkeleton />}>
        <TeacherSlide />
      </Suspense>
      <RenderSectionHomePage
        slot="after-teacher-slide"
        data={dataSectionHomePage}
      />

      {dataSectionStatic?.section2?.BlockLearningMethod && (
        <TeachingMethod
          data={dataSectionStatic?.section2?.BlockLearningMethod}
        />
      )}
      <RenderSectionHomePage
        slot="after-teaching-method"
        data={dataSectionHomePage}
      />

      {dataSectionStatic?.section2 && (
        <LearningApproach
          data={dataSectionStatic?.section2?.BlockLearningApproach}
        />
      )}
      <RenderSectionHomePage
        slot="after-learning-approach"
        data={dataSectionHomePage}
      />

      <Suspense fallback={<div></div>}>
        <HonorSlide />
      </Suspense>

      <RenderSectionHomePage
        slot="after-honor-slide"
        data={dataSectionHomePage}
      />

      <StatsSection />
      <RenderSectionHomePage
        slot="after-stats-section"
        data={dataSectionHomePage}
      />

      {press?.length > 0 && <MediaAboutTRI news={press} />}

      <RenderSectionHomePage
        slot="after-media-about-tri"
        data={dataSectionHomePage}
      />

      <section id="cam-nhan-hoc-vien">
        <Suspense fallback={<div></div>}>
          <Feedback />
        </Suspense>
      </section>
      <RenderSectionHomePage slot="after-feedback" data={dataSectionHomePage} />

      <Suspense fallback={<SkeletonSectionDocument />}>
        <SectionDocument />
      </Suspense>

      {newsList.length > 0 && <NewView news={newsList} />}

      <RenderSectionHomePage slot="after-new-view" data={dataSectionHomePage} />

      <section id="tu-van" className="w-full">
        <ConsultationForm />
      </section>
      <RenderSectionHomePage
        slot="after-consultation-form"
        data={dataSectionHomePage}
      />
    </div>
  );
}
