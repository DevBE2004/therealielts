import RenderViewPage from "@/components/admin/custom-page/render-view-page";
import { parseStringObject } from "@/hooks/parseStringObject";
import { generatePageMetadata } from "@/lib/seo";
import { CommonService } from "@/services/common.service";
import { CommonSchema } from "@/types/common";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";

const detailMap = {
  DOCUMENT: nextDynamic(
    () => import("@/components/detail/document/DocumentDetail")
  ),
  COURSE: nextDynamic(() => import("@/components/detail/course/CourseDetail")),
  NEW: nextDynamic(() => import("@/components/detail/new/NewDetail")),
  STUDYABROAD: nextDynamic(
    () => import("@/components/detail/study-abroad/StudyAbroadDetail")
  ),
} as const;

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Metadata động cho từng loại detail
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const res = await CommonService.getOne(CommonSchema, slug, {
    revalidate: 600,
  });

  function stripHtmlTags(str: string = "") {
    return str
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (!res.success || !res.data) {
    return {
      title: "Không tìm thấy dữ liệu | The Real IELTS ANT",
      description: "Trang bạn tìm không tồn tại hoặc đã bị gỡ.",
    };
  }

  const data = res.data;
  const meta = parseStringObject(data.metaData);

  const cleanDescription = stripHtmlTags(
    meta?.metaDescription || data.description || ""
  ).slice(0, 160);

  return generatePageMetadata({
    title: meta?.metaTitle || data.title,
    description: cleanDescription,
    url: `https://therealielts.vn/${slug}`,
    image:
      data.images?.[1] ||
      data.images?.[0] ||
      "https://therealielts.vn/images/Hoc-vien-dau-ra-7.5-IELTS.webp",
    keywords: meta?.metaKeywords ? meta.metaKeywords : "The Real IELTS",
    type: "article",
    publishedTime: data.createdAt ? new Date(data.createdAt) : undefined,
    modifiedTime: data.updatedAt ? new Date(data.updatedAt) : undefined,
    authorName: data.author?.name || "The Real Ielts ANT",
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const res = await CommonService.getOne(CommonSchema, slug, {
    revalidate: 3600,
  });
  const data = res.data;

  if (data?.type === "PAGE" && data?.isActive) {
    return (
      <div className="flex flex-col w-full  bg-white">
        <Suspense fallback={<div />}>
          <RenderViewPage data={data?.metaData?.section || []} />
        </Suspense>
      </div>
    );
  }
  const DetailComponent = detailMap[data?.type as keyof typeof detailMap];
  if (!DetailComponent) return <div>Không tìm thấy dữ liệu</div>;

  if (data) return <DetailComponent data={data} />;
}
