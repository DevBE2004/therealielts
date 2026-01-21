import ConsultationForm from "@/components/common/ConsultationForm";
import HomeBanner from "@/components/home/banner";
import CourseRoadmap from "@/components/home/CourseRoadmap";
import DocumentView from "@/components/home/DocumentView";
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
import { parseStringObject } from "@/hooks/parseStringObject";
import { CommentService } from "@/services/comment.service";
import { CommonService } from "@/services/common.service";
import { HonorService } from "@/services/honor.service";
import { TeacherService } from "@/services/teacher.service";
import { Document, DocumentSchema, New, NewSchema } from "@/types";
import { Comment } from "@/types/comment";
import { BookOpen, CheckCircle2, Route, SquarePen } from "lucide-react";
import slugify from "slugify";
import SectionPlaceholder from "./place-holder";
import { HomePageConfig } from "@/types/homepage";
import { RenderSectionHomePage } from "./render-section-home-page";
import { BannerService } from "@/services/banner.service";

export const dynamic = "force-dynamic";

interface DemoHomePageProps {
  data: HomePageConfig;
  section2: any;
}

export default async function DemoHomePage({
  data,
  section2,
}: DemoHomePageProps) {
  const items = [
    {
      text: "Tư vấn lộ trình",
      href: "#tu-van",
      icon: <Route className="w-6 h-6 shrink-0" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      text: "Đăng ký học thử",
      href: "/xay-dung-lo-trinh",
      icon: <BookOpen className="w-6 h-6 shrink-0" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      text: "Đăng ký thi IELTS",
      href: "/dang-ky-thi-ielts-tai-idp",
      icon: <SquarePen className="w-6 h-6 shrink-0" />,
      color: "from-indigo-500 to-blue-600",
    },
    {
      text: "Free IELTS test",
      href: "/test-ai",
      icon: <CheckCircle2 className="w-6 h-6 shrink-0" />,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  try {
    // Fetch data song song
    const [teachers, honors, news, documents, comments] =
      await Promise.allSettled([
        TeacherService.list({}, 600),
        HonorService.list(600),
        CommonService.getAll(NewSchema, {
          query: { isActive: true, type: "NEW", limit: 200, page: 1 },
          revalidate: 300,
          tags: ["new"],
        }),
        CommonService.getAll(DocumentSchema, {
          query: {
            isActive: true,
            type: "DOCUMENT",
            limit: 10,
            search: "cách",
          },
          revalidate: 300,
          tags: ["document"],
        }),
        CommentService.getAll(),
      ]);
    // end

    const dataTeachers: any[] =
      teachers.status === "fulfilled" && Array.isArray(teachers.value.teachers)
        ? teachers.value.teachers
        : [];

    const dataHonors: any[] =
      honors.status === "fulfilled" && Array.isArray(honors.value.data)
        ? honors.value.data
        : [];

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

    const dataDocuments: Document[] =
      documents.status === "fulfilled" && Array.isArray(documents.value.data)
        ? documents.value.data
        : [];

    const dataComment: Comment[] =
      comments.status === "fulfilled" && Array.isArray(comments.value.data)
        ? comments.value.data
        : [];

    // Check All Data Fetch
    const isAllEmpty =
      !dataTeachers.length &&
      !dataHonors.length &&
      !newsList.length &&
      !dataDocuments.length &&
      !dataComment.length;

    if (isAllEmpty) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            Dữ liệu trang chủ đang được cập nhật
          </h2>
          <p className="text-gray-500 max-w-md">Vui lòng load lại trang!</p>
        </div>
      );
    }

    const fetchBanners = await BannerService.getall({}, 60);
    const dataBanners = Array.isArray(fetchBanners?.data)
      ? fetchBanners.data
      : [];

    return (
      <div id="main" className="flex flex-col">
        <section id="box_header" className="flex flex-col">
          <HomeBanner location="trang-chu" dataBanner={dataBanners} />
          <div
            id="box_header_bottom"
            className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl py-3.5 sm:py-6 px-6 text-white
                        shadow-lg hover:shadow-2xl transition-all duration-300
                        bg-gradient-to-br ${item.color}
                        hover:scale-[1.04]`}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                  <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white shadow-inner group-hover:bg-white/25 transition-all duration-300">
                    {item.icon}
                  </div>

                  {/* Text */}
                  <span className="relative z-10 text-center text-sm md:text-base lg:text-lg font-semibold tracking-wide">
                    {item.text}
                  </span>

                  <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <RenderSectionHomePage slot="after-box_header" data={data} isAdmin />
        <SectionPlaceholder slot="after-box_header" data={data} />
        {section2?.BlockIntroduce && (
          <Introduce data={section2.BlockIntroduce} />
        )}

        <RenderSectionHomePage slot="after-introduce" data={data} isAdmin />
        <SectionPlaceholder slot="after-introduce" data={data} />
        <HomeFeatures />
        <CourseRoadmap />
        <RenderSectionHomePage
          slot="after-course-roadmap"
          data={data}
          isAdmin
        />
        <SectionPlaceholder slot="after-course-roadmap" data={data} />
        <TeacherSlide />
        <RenderSectionHomePage slot="after-teacher-slide" data={data} isAdmin />
        <SectionPlaceholder slot="after-teacher-slide" data={data} />

        {section2?.BlockLearningMethod && (
          <TeachingMethod data={section2.BlockLearningMethod} />
        )}
        <RenderSectionHomePage
          slot="after-teaching-method"
          data={data}
          isAdmin
        />
        <SectionPlaceholder slot="after-teaching-method" data={data} />

        {section2?.BlockLearningApproach && (
          <LearningApproach data={section2.BlockLearningApproach} />
        )}
        <RenderSectionHomePage
          slot="after-learning-approach"
          data={data}
          isAdmin
        />
        <SectionPlaceholder slot="after-learning-approach" data={data} />
        <HonorSlide />
        <RenderSectionHomePage slot="after-honor-slide" data={data} isAdmin />
        <SectionPlaceholder slot="after-honor-slide" data={data} />
        <StatsSection />
        <RenderSectionHomePage slot="after-stats-section" data={data} isAdmin />
        <SectionPlaceholder slot="after-stats-section" data={data} />
        <MediaAboutTRI news={press} />
        <RenderSectionHomePage
          slot="after-media-about-tri"
          data={data}
          isAdmin
        />
        <SectionPlaceholder slot="after-media-about-tri" data={data} />
        <section id="cam-nhan-hoc-vien">
          <Feedback />
        </section>
        <RenderSectionHomePage slot="after-feedback" data={data} isAdmin />
        <SectionPlaceholder slot="after-feedback" data={data} />
        <DocumentView documents={dataDocuments} />
        <NewView news={newsList} />
        <RenderSectionHomePage slot="after-new-view" data={data} isAdmin />
        <SectionPlaceholder slot="after-new-view" data={data} />
        <section id="tu-van" className="w-full">
          <ConsultationForm />
        </section>
        <RenderSectionHomePage
          slot="after-consultation-form"
          data={data}
          isAdmin
        />
        <SectionPlaceholder slot="after-consultation-form" data={data} />
      </div>
    );
  } catch (error) {
    console.error("Error loading About page:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-3">Loading...</h2>
        <p className="text-gray-700">
          Vui lòng load lại trang sau 60 giây hoặc liên hệ bộ phận kỹ thuật.
        </p>
      </div>
    );
  }
}
