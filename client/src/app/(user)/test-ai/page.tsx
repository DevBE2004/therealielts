import type { Metadata } from "next";
import CounterSection from "@/components/test-ai/CounterSection";
import FormRegister from "@/components/test-ai/FormRegister";
import HeroSection from "@/components/test-ai/HeroSection";
import TestStructure from "@/components/test-ai/TestStructure";
import WhyCheck from "@/components/test-ai/WhyCheck";
import { CommonService } from "@/services/common.service";
import { DocumentSchema } from "@/types";
import DocumentView from "@/components/home/DocumentView";
import ConsultationForm from "@/components/common/ConsultationForm";
import { IntroduceService } from "@/services/introduce.service";
import z from "zod";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Test IELTS - Luyện thi & Đánh giá trình độ | The Real IELTS",
  description:
    "Tham gia Test IELTS trực tuyến để đánh giá trình độ của bạn. The Real IELTS cung cấp lộ trình học, mẹo luyện thi, và tài nguyên giúp bạn đạt điểm cao.",
  keywords:
    "test IELTS, thi thử IELTS, luyện thi IELTS, IELTS online, IELTS practice test, IELTS preparation",
  openGraph: {
    type: "website",
    url: "https://therealielts.vn/test-ai",
    title: "Test IELTS - Luyện thi & Đánh giá trình độ | The Real IELTS",
    description:
      "Làm bài Test IELTS miễn phí, xem kết quả ngay. Nhận lộ trình học cá nhân hóa để đạt mục tiêu IELTS.",
    siteName: "The Real IELTS",
    images: [
      {
        url: `${process.env.DOMAIN_WEB}/images/LINGUISTIC-TKINGKING-2.webp`,
        width: 1200,
        height: 630,
        alt: "Test IELTS Online cùng The Real IELTS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test IELTS - The Real IELTS",
    description:
      "Làm bài Test IELTS miễn phí để đánh giá trình độ, nhận lộ trình học phù hợp.",
    images: [`${process.env.DOMAIN_WEB}/images/LINGUISTIC-TKINGKING-2.webp`],
  },
  alternates: {
    canonical: "https://therealielts.vn/test-ai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function TestIeltsPage() {
  // const documents = await CommonService.getAll(DocumentSchema, {
  //   query: { isActive: true, type: "DOCUMENT", limit: 10, search: "mẹo" },
  //   revalidate: 300,
  //   tags: ["document"],
  // });
  // const dataDocuments = Array.isArray(documents.data)
  //   ? documents.data
  //   : [];

  // const intro4 = await IntroduceService.getOne(z.any(), 4);

  const [documents, intro4] = await Promise.allSettled([
    CommonService.getAll(DocumentSchema, {
      query: { isActive: true, type: "DOCUMENT", limit: 10, search: "mẹo" },
      revalidate: 300,
      tags: ["document"],
    }),
    IntroduceService.getOne(z.any(), 4),
  ]);

  const dataDocuments =
    documents.status === "fulfilled" && Array.isArray(documents.value.data)
      ? documents.value.data
      : [];
  const dataIntro4 = intro4.status === "fulfilled" ? intro4.value?.data : {};

  const section1 = dataIntro4?.section1 || {};
  const section2 = dataIntro4?.section2 || {};
  const section3 = dataIntro4?.section3 || {};

  const images2 = dataIntro4?.images2 || [];
  const images3 = dataIntro4?.images3 || [];

  return (
    <div className="relative">
      <HeroSection section1Record4={section1} />
      <CounterSection />
      <WhyCheck section2Record4={section2} images2={images2} />
      <FormRegister />
      <TestStructure section3Record4={section3} images3={images3} />
      <DocumentView documents={dataDocuments} />
      <ConsultationForm />
    </div>
  );
}
