import { Metadata } from "next";
import IntroSection from "@/components/dang-ky-thi-ielts/IntroSection";
import WhyChooseSection from "@/components/dang-ky-thi-ielts/WhyChooseSection";
import InstructionSection from "@/components/dang-ky-thi-ielts/InstructionSection";
import { IntroduceService } from "@/services/introduce.service";
import z from "zod";
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Đăng ký thi IELTS - The Real IELTS",
    description:
      "Đăng ký thi IELTS trực tuyến tại The Real IELTS. Nhận hướng dẫn chi tiết, chuẩn bị đầy đủ và tối ưu lộ trình để đạt điểm cao.",
    keywords: 
      `đăng ký thi IELTS,
      IELTS test,
      thi IELTS online,
      The Real IELTS,
      luyện thi IELTS`,
    openGraph: {
      type: "website",
      url: "https://therealielts.vn/dang-ky-thi-ielts",
      title: "Đăng ký thi IELTS - The Real IELTS",
      description:
        "Đăng ký thi IELTS tại The Real IELTS và nhận hướng dẫn chi tiết để chuẩn bị tốt nhất cho kỳ thi.",
      images: [
        {
          url: `${process.env.DOMAIN_WEB}/images/Uu-diem-vuot-troi-cua-phuong-phap-LCLT.webp`,
          width: 1200,
          height: 630,
          alt: "Đăng ký thi IELTS tại The Real IELTS",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Đăng ký thi IELTS - The Real IELTS",
      description:
        "Đăng ký thi IELTS trực tuyến tại The Real IELTS, chuẩn bị đầy đủ và tối ưu lộ trình học tập.",
      images: [
        `${process.env.DOMAIN_WEB}/images/Uu-diem-vuot-troi-cua-phuong-phap-LCLT.webp`,
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RegisterIeltsPage() {

  const intro4 = await IntroduceService.getOne(z.any(), 6);
  
      // const section1 = intro4.data?.section1 || {};
      const section2 = intro4.data?.section2 || {};
      const image2 = intro4.data?.images2 || [];

      const section3 = intro4.data?.section3 || {};
      const images3 = intro4.data?.images3 || [];

      const section4 = intro4.data?.section4 || {};

  return (
    <div id="main" className="w-full">
      <IntroSection section2Record6={section2} images2Record6={image2}/>

      {/* Tại sao nên đăng ký thi IELTS tại trung tâm */}
      <WhyChooseSection section3Record6={section3} images3Record6={images3}/>

      {/* Hướng dẫn đăng ký thi IELTS */}
      <InstructionSection section4Record6={section4} page="client"/>
    </div>
  );
}
