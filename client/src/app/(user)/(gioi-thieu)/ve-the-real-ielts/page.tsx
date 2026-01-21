// app/about-the-real-ielts/page.tsx
import AcademyOverview from "@/components/about/ve-the-real-ielts/AcademyOverview";
import CoreValuesSection from "@/components/about/ve-the-real-ielts/CoreValuesSection";
import HeroSection from "@/components/about/ve-the-real-ielts/HeroSection";
import MainContent from "@/components/about/ve-the-real-ielts/MainContent";
import PartnerSection from "@/components/about/ve-the-real-ielts/Partner";
import ConsultationForm from "@/components/common/ConsultationForm";
import FAQSection from "@/components/common/FAQSection";
import GoogleFormEmbed from "@/components/common/GoogleFormEmbed";
import IELTSCourseSection from "@/components/common/IELTSCourseSection";
import NewsSection from "@/components/common/NewsSection";
import TeachersSection from "@/components/common/TeachersSection";
import { CommonService } from "@/services/common.service";

import { CourseService } from "@/services/course.service";
import { IntroduceService } from "@/services/introduce.service";
import { NewService } from "@/services/new.service";
import { PartnerService } from "@/services/partner.service";
import { TeacherService } from "@/services/teacher.service";
import { CourseSchema, New, NewSchema, Partner, Teacher, TeacherSchema } from "@/types";
import type { Metadata } from "next";
import z from "zod";
export const dynamic = "force-dynamic";

// --- Metadata SEO ---
export const metadata: Metadata = {
  title: "Giới thiệu The Real IELTS - Trung tâm IELTS uy tín",
  description:
    "The Real IELTS – Trung tâm luyện thi IELTS chất lượng cao với phương pháp Learner Centered và Linguistic Thinking, đội ngũ giáo viên chuyên nghiệp và khóa học hiệu quả.",
  keywords: 
    `The Real IELTS,
    trung tâm IELTS,
    khóa học IELTS,
    giới thiệu IELTS,
    học IELTS online`,
  openGraph: {
    type: "website",
    url: "https://therealielts.vn/ve-the-real-ielts",
    title: "Giới thiệu The Real IELTS - Trung tâm IELTS uy tín",
    description:
      "The Real IELTS – Trung tâm luyện thi IELTS chất lượng cao với phương pháp độc quyền và đội ngũ giáo viên chuyên nghiệp.",
    siteName: "The Real IELTS",
    images: [
      {
        url: `${process.env.DOMAIN_WEB}/images/LINGUISTIC-TKINGKING-2.webp`,
        width: 1200,
        height: 630,
        alt: "The Real IELTS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới thiệu The Real IELTS",
    description:
      "Khám phá trung tâm The Real IELTS, phương pháp học độc quyền và đội ngũ giáo viên chuyên nghiệp.",
    images: [`${process.env.DOMAIN_WEB}/images/LINGUISTIC-TKINGKING-2.webp`],
  },
  alternates: {
    canonical: "https://therealielts.vn/ve-the-real-ielts",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      headline: "Giới thiệu The Real IELTS - Trung tâm IELTS uy tín",
      description:
        "The Real IELTS – Trung tâm luyện thi IELTS chất lượng cao với phương pháp Learner Centered và Linguistic Thinking.",
      url: "https://therealielts.vn/ve-the-real-ielts",
      image: [`${process.env.DOMAIN_WEB}/images/LINGUISTIC-TKINGKING-2.webp`],
      author: { "@type": "Organization", name: "The Real IELTS" },
      publisher: {
        "@type": "Organization",
        name: "The Real IELTS",
        logo: {
          "@type": "ImageObject",
          url: `${process.env.DOMAIN_WEB}/images/Logo-TRI-W2-.png`,
        },
      },
    }),
  },
};

const ggForm = {
  urlForm: 'https://docs.google.com/forms/d/e/1FAIpQLSfyTJjfnFv75Qd_jSMYt_ApiGuNU_PYzaQXGM09cmgIWBcNGw/viewform?usp=dialog',
}

// --- Trang giới thiệu ---
export default async function AboutTheRealIelts() {
  const renderFallback = (msg: string) => (
    <div className="w-full py-12 text-center text-gray-500 italic">{msg}</div>
  );

  try {
    // --- Gọi dữ liệu song song ---
    const [teachersRes, coursesRes, partnersRes, intro1, intro3] = await Promise.allSettled([
      TeacherService.list(),
      CommonService.getAll(CourseSchema, { query: { type: "COURSE", limit: 9999 } }),
      PartnerService.getAll(),
      IntroduceService.getOne(z.any(), 1),
      IntroduceService.getOne(z.any(), 3),
    ]);

    // --- Check lỗi fetch ---
    const teachersData: Teacher[] =
      teachersRes.status === "fulfilled" && Array.isArray(teachersRes.value.teachers)
        ? teachersRes.value.teachers.flatMap((t) => (Array.isArray(t) ? t : [t]))
        : [];

    const dataPartners: Partner[] =
      partnersRes.status === "fulfilled" && Array.isArray(partnersRes.value.data)
        ? partnersRes.value.data
        : [];

    const courses = coursesRes.status === "fulfilled" ? coursesRes.value.data || [] : [];

    const introData1 = intro1.status === "fulfilled" ? intro1.value.data : {};
    const introData3 = intro3.status === "fulfilled" ? intro3.value.data : {};

    // --- Giải nén các section (với fallback rỗng an toàn) ---
    const section1 = introData1?.section1 || {};
    const section2 = introData1?.section2 || {};
    const section3 = introData1?.section3 || {};
    const section4 = introData1?.section4 || {};
    const section5 = introData1?.section5 || {};

    const images1 = introData1?.images1 || {};
    const images2 = introData1?.images2 || {};
    const images3 = introData1?.images3 || {};
    const images4 = introData1?.images4 || {};
    const images5 = introData1?.images5 || {};

    const faqSection = introData3?.section1 || {};
    const embedHtml = introData3?.section2 || {};

    // --- Nếu không có bất kỳ section nào có dữ liệu ---
    const isAllEmpty =
      !Object.keys(section1).length &&
      !Object.keys(section2).length &&
      !Object.keys(section3).length &&
      !Object.keys(section4).length &&
      !Object.keys(section5).length &&
      !teachersData.length &&
      !courses.length &&
      !dataPartners.length;

    if (isAllEmpty) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            Dữ liệu giới thiệu đang được cập nhật
          </h2>
          <p className="text-gray-500 max-w-md">
            Hiện tại trung tâm The Real IELTS đang hoàn thiện nội dung cho trang này.
            Vui lòng quay lại sau ít phút nữa.
          </p>
        </div>
      );
    }

    // --- Render page ---
    return (
      <div className="min-h-screen w-full bg-white">
        {Object.keys(section1).length ? (
          <HeroSection section1={section1} images1={images1} />
        ) : (
          renderFallback("Đang cập nhật phần mở đầu...")
        )}

        {Object.keys(section2).length ? (
          <MainContent section2={section2} images2={images2} />
        ) : (
          renderFallback("Nội dung chính sẽ sớm được thêm...")
        )}

        {teachersData.length ? (
          <TeachersSection teachers={teachersData} course={courses[0]} />
        ) : (
          renderFallback("Danh sách giáo viên đang được cập nhật...")
        )}

        {Object.keys(section3).length ? (
          <CoreValuesSection section3={section3} images3={images3} />
        ) : (
          renderFallback("Giá trị cốt lõi đang được bổ sung...")
        )}

        {embedHtml ? (
          <GoogleFormEmbed section2={embedHtml} />
        ) : (
          renderFallback("Biểu mẫu Google Form tạm thời chưa khả dụng.")
        )}

        {Object.keys(section4).length || Object.keys(section5).length ? (
          <AcademyOverview
            section4={section4}
            images4={images4}
            section5={section5}
            images5={images5}
          />
        ) : (
          renderFallback("Thông tin học viện đang được cập nhật...")
        )}

        {dataPartners.length ? (
          <PartnerSection partners={dataPartners} />
        ) : (
          renderFallback("Danh sách đối tác đang được cập nhật...")
        )}

        {Object.keys(faqSection).length ? (
          <FAQSection section1={faqSection} />
        ) : (
          renderFallback("Câu hỏi thường gặp đang được bổ sung...")
        )}

        <section id="dang-ky-tu-van" className="w-full">
          <ConsultationForm />
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error loading About page:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-3">
          Lỗi khi tải dữ liệu
        </h2>
        <p className="text-gray-600">
          Hệ thống đang tạm thời gián đoạn. Vui lòng thử lại sau ít phút hoặc liên hệ bộ phận kỹ thuật.
        </p>
      </div>
    );
  }
}
