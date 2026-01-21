// app/about-learning-method/page.tsx
import type { Metadata } from "next";
import PreviewLearningMethod from "./preview";
import { IntroduceService } from "@/services/introduce.service";
import z from "zod";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Phương pháp học LCLT - Giới thiệu | The Real IELTS",
  description:
    "Khám phá phương pháp học IELTS độc quyền tại The Real IELTS với 2 trụ cột: Learner Centered (Lấy người học làm trọng tâm) và Linguistic Thinking (Xây dựng tư duy ngôn ngữ).",
  keywords:
    `phương pháp học IELTS,
    Learner Centered,
    Linguistic Thinking,
    The Real IELTS,
    cách học IELTS hiệu quả,
    học IELTS online`,
  openGraph: {
    type: "website",
    url: "https://therealielts.vn/ve-phuong-phap-hoc",
    title: "Phương pháp học LCLT - Giới thiệu | The Real IELTS",
    description:
      "The Real IELTS phát triển phương pháp học độc quyền giúp học viên tiết kiệm thời gian và đạt hiệu quả vượt trội.",
    siteName: "The Real IELTS",
    images: [
      {
        url: `${process.env.DOMAIN_WEB}/images/LINGUISTIC-TKINGKING-2.webp`,
        width: 1200,
        height: 630,
        alt: "Phương pháp học IELTS tại The Real IELTS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phương pháp học IELTS - The Real IELTS",
    description:
      "Giới thiệu phương pháp học IELTS độc quyền tại The Real IELTS: Learner Centered & Linguistic Thinking.",
    images: [`${process.env.DOMAIN_WEB}/images/LINGUISTIC-TKINGKING-2.webp`],
  },
  alternates: {
    canonical: "https://therealielts.vn/ve-phuong-phap-hoc",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// --- Component phụ: fallback khi không có dữ liệu ---
const renderFallback = (msg: string) => (
  <div className="w-full py-16 text-center text-gray-500 italic">{msg}</div>
);

export default async function AboutLearningMethod() {
  try {
    // --- Fetch song song, an toàn ---
    const [record2, record3] = await Promise.allSettled([
      IntroduceService.getOne(z.any(), 2),
      IntroduceService.getOne(z.any(), 3),
    ]);

    const data2 = record2.status === "fulfilled" ? record2.value.data : {};
    const data3 = record3.status === "fulfilled" ? record3.value.data : {};

    const section1 = data2?.section1 || {};
    const images1 = data2?.images1 || [];
    const section2 = data2?.section2 || {};
    const images2 = data2?.images2 || [];
    const embedHtml = data3?.section2 || {};

    const isAllEmpty =
      !Object.keys(section1).length &&
      !Object.keys(section2).length &&
      (!images1?.length || images1.length === 0) &&
      (!images2?.length || images2.length === 0) &&
      (!embedHtml || Object.keys(embedHtml).length === 0);

    // --- Nếu tất cả đều trống ---
    if (isAllEmpty) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            Dữ liệu phương pháp học đang được cập nhật
          </h2>
          <p className="text-gray-500 max-w-md">
            Trang này hiện đang được trung tâm The Real IELTS hoàn thiện.  
            Vui lòng quay lại sau ít phút hoặc liên hệ đội ngũ tư vấn để biết thêm chi tiết.
          </p>
        </div>
      );
    }

    // --- Render trang chính ---
    return (
      <>
        {Object.keys(section1).length || Object.keys(section2).length ? (
          <PreviewLearningMethod
            section1={section1}
            images1={images1}
            section2={section2}
            images2={images2}
            section2Rc3={embedHtml}
          />
        ) : (
          renderFallback("Nội dung phương pháp học đang được bổ sung...")
        )}
      </>
    );
  } catch (error) {
    console.error("Error loading learning method:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-3">
          Lỗi khi tải dữ liệu phương pháp học
        </h2>
        <p className="text-gray-600">
          Hệ thống đang tạm thời gián đoạn. Vui lòng thử lại sau ít phút hoặc liên hệ hỗ trợ kỹ thuật.
        </p>
      </div>
    );
  }
}
