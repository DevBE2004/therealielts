import type { Metadata } from "next";
import PreviewTestIeltsPage from "./preview";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Test IELTS - Luyện thi & Đánh giá trình độ | The Real IELTS",
  description:
    "Tham gia Test IELTS trực tuyến để đánh giá trình độ của bạn. The Real IELTS cung cấp lộ trình học, mẹo luyện thi, và tài nguyên giúp bạn đạt điểm cao.",
  keywords: [
    "test IELTS",
    "thi thử IELTS",
    "luyện thi IELTS",
    "IELTS online",
    "IELTS practice test",
    "IELTS preparation",
  ],
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


export default function TestIeltsPageOld() {

  return (
    <>
      <PreviewTestIeltsPage/>
    </>
  )
}
