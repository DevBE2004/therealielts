import EventAndSale from "@/components/common/EventAndSale";
import NewsSection from "@/components/common/NewsSection";
import { CommonService } from "@/services/common.service";
import { NewService } from "@/services/new.service";
import { New, NewQueryParams, NewSchema } from "@/types";

import { Metadata } from "next";
import slugify from "slugify";
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sự kiện & Khuyến mãi | The Real Ielts",
    description:
      "Cập nhật nhanh nhất các sự kiện, tin tức khuyến mãi và hoạt động mới nhất từ The Real Ielts. Luôn theo dõi để không bỏ lỡ thông tin quan trọng.",
    openGraph: {
      title: "Sự kiện & Khuyến mãi | The Real Ielts",
      description:
        "Cập nhật nhanh nhất các sự kiện, tin tức khuyến mãi và hoạt động mới nhất từ The Real Ielts.",
      url: `${process.env.DOMAIN_WEB}/su-kien-va-khuyen-mai`,
      type: "website",
      images: [
        {
          url: `${process.env.DOMAIN_WEB}/images/Logo-TRI-W2-.png`,
          width: 1200,
          height: 630,
          alt: "Sự kiện & Khuyến mãi - The Real Ielts",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sự kiện & Khuyến mãi | The Real Ielts",
      description:
        "Tin tức, sự kiện và khuyến mãi mới nhất từ The Real Ielts - cập nhật liên tục.",
      images: [`${process.env.DOMAIN_WEB}/images/Logo-TRI-W2-.png`],
    },
    keywords: `The Real Ielts,
      Tin tức,
      Khuyến mãi,
      Sự kiện,
      IELTS,
      Thi ielts`,
  };
}

export default async function EventAndPromotion() {
  let newsData: New[] = [];

  try {
    const news = await CommonService.getAll(NewSchema, {
      query: { isActive: true, type: "NEW", limit: 50, page: 1 },
      revalidate: 300,
      tags: ["new"],
    });

    if (Array.isArray(news.data) && news.success) {
      newsData = news.data.filter((n: New) => n.isActive === true);
    }
  } catch (error: any) {
    console.error("Lỗi fetch news:", error.message || error);
  }

  return (
    <div className="">
      {newsData.length > 0 ? (
        <EventAndSale data={newsData} />
      ) : (
        <div className="text-center py-12 text-red-600">
          ⚠️ Tin tức đang cập nhật
        </div>
      )}
    </div>
  );
}
