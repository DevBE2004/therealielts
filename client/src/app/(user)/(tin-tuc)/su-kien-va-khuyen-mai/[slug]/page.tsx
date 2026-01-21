// src/app/(tin-tuc)/su-kien-va-khuyen-mai/[slug]/page.tsx
import { NewService } from "@/services/new.service";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CourseService } from "@/services/course.service";
import ConsultationForm from "@/components/common/ConsultationForm";
import slugify from "slugify";
import { generatePageMetadata } from "@/lib/seo";
import { Course } from "@/types";
import NewsDetailView from "@/components/detail/new/NewDetailView";

type PageProps = { 
  params: Promise<{slug: string}>
 };
export const dynamic = "force-dynamic";

// export async function generateMetadata({ params }: PageProps) {
//   const { slug } = await params;
//   const resNew = await NewService.getOne(slug);

//   if (!resNew || !resNew.success) return {};

//   const dataNew = resNew.data;
//   if(dataNew) {
//   return generatePageMetadata({
//     title: dataNew.title,
//     description: dataNew.description.slice(0, 160) ?? "",
//     url: `${process.env.NEXT_PUBLIC_API_URL}/su-kien-va-khuyen-mai/${dataNew.slug}`,
//     image: dataNew.images?.[0] ?? "/images/Logo-TRI-W2-.png",
//     type: "article",
//     publishedTime: dataNew.createdAt,
//     modifiedTime: dataNew.updatedAt,
//     authorName: "The Real IELTS",
//     keywords: [dataNew.category ? dataNew.category : "", dataNew.title],
//   });
//   }
// }

export default async function NewsDetail({ params }: PageProps) {
  const resAllNews = await NewService.getAll({ limit: 9999 });
  const allNews = resAllNews.data;

  const { slug } = await params;
  const resNew = await NewService.getOne(slug);
  if (!resNew || !resNew.success) return notFound();
  const dataNew = resNew.data;

  const currentCategoryNew = slugify(dataNew?.category?.name ? dataNew.category.name : "", { lower: true });

  const relatedNewsAll = Array.isArray(allNews) ? allNews.filter(
    (n) =>
      slugify(n.category, { lower: true }) === currentCategoryNew &&
      n.id !== dataNew?.id && dataNew?.isActive === true
  ) : [];
  const relatedNews = relatedNewsAll.slice(-6);

  const resCourses = await CourseService.getall();
  const dataCourses = resCourses.data;

  return (
    <div id="main" className="w-full">
      {/* <NewsDetailView dataNew={dataNew} dataCourses={dataCourses} titleRightCourse="THÔNG TIN KHÓA HỌC" /> */}

      <section
        id="tin-tuc-lien-quan"
        className="w-full py-10 bg-gray-50 flex justify-center"
      >
        <div className="w-full max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-start mb-6 text-blue-900">
            Tin tức liên quan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedNews.map((news) => (
              <div
                key={news.id}
                className="flex flex-col border rounded-xl bg-white shadow-sm hover:shadow-md transition p-4"
              >
                {news.images?.[0] && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={news.images[0]}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Nội dung */}
                <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-gray-800">
                  {news.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {news.description}
                </p>

                <span className="text-xs text-gray-400 mb-4">
                  Cập nhật:{" "}
                  {new Date(news.updatedAt).toLocaleDateString("vi-VN")}
                </span>
                <a
                  href={`/su-kien-va-khuyen-mai/${news.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Xem chi tiết
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dang-ky-tu-van" className="w-full">
        <ConsultationForm />
      </section>
    </div>
  );
}
