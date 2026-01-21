import DocumentTOC from "@/components/common/DocumentTOC";
import { Document, DocumentSchema } from "@/types";
import ReusableForm from "@/components/common/ReusableForm";
import Image from "next/image";
import Link from "next/link";
import { Calendar, UserCircle } from "lucide-react";
import { hasWPClass } from "@/utils/hasWPClass";
import { Common, CommonSchema } from "@/types/common";
import { CommonService } from "@/services/common.service";
import slugify from "slugify";
import ButtonBase from "@/components/ui/ButtonBase";
import DocumentDetailMainContent from "./DocumentDetailMainContent";

export const dynamic = "force-dynamic";

// type PageProps = {
//   params: { slug: string };
// };

// export async function generateMetadata({ params }: PageProps) {
//   const { slug } = params;
//   console.log("Generating metadata for slug:", slug);
//   const resCourse = await CommonService.getOne(DocumentSchema, slug, {
//     revalidate: 600,
//     tags: ["document"],
//   });
//   if (!resCourse.success || !resCourse.data) {
//     return {
//       title: "Khóa học không tồn tại | The Real IELTS ANT",
//       description: "Khóa học bạn tìm không tồn tại hoặc đã bị gỡ.",
//     };
//   }

//   const meta = resCourse.data?.metaData;
//   if (!meta) {
//   return generatePageMetadata({
//     title: resCourse.data.title,
//     description: resCourse.data.description?.slice(0, 160) || "",
//     url: `https://therealielts.vn/${slug}`,
//     image:
//       resCourse.data.images?.[1] ||
//       resCourse.data.images?.[0] ||
//       "https://therealielts.vn/images/Logo-TRI-W2-.png",
//     keywords: ["Thư viện IELTS"],
//     type: "article",
//   });
// }
//   return generatePageMetadata({
//     title: meta.metaTitle,
//     description: meta.metaDescription,
//     url: `https://therealielts.vn/${slug}`,
//     image:
//       resCourse.data.images?.[1] ||
//       resCourse.data.images?.[0] ||
//       "https://therealielts.vn/images/Logo-TRI-W2-.png",
//     keywords: meta.metaKeywords?.length ? meta.metaKeywords : ["Thư viện IELTS"],
//     type: "article",
//     publishedTime: resCourse.data.createdAt ? new Date(resCourse.data.createdAt) : undefined,
//     modifiedTime: resCourse.data.updatedAt ? new Date(resCourse.data.updatedAt) : undefined,
//     authorName: "The Real IELTS ANT",
//   });
// }
type PageProps = {
  data: Document;
};

export default async function DocumentDetail({ data }: PageProps) {
  const descriptionHtml = data?.description || "";
  const categoryId = data.category?.id ?? 1;
  const categoryName = data.category?.name ?? "";

  // Danh sách & lọc tài liệu liên quan
  if (!data.category?.id) return;
  const res = await CommonService.getAll(DocumentSchema, {
    query: {
      isActive: true,
      type: "DOCUMENT",
      limit: 6,
      categoryId: categoryId,
    },
    revalidate: 600,
    tags: ["document"],
  });
  const documentList: Document[] = Array.isArray(res.data) ? res.data : [];

  const categoryGroup = slugify(categoryName, { lower: true, locale: "vi" });
  return (
    <main className="min-h-screen w-full bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-80 bg-gradient-to-tr from-sky-600 via-sky-700 to-sky-900 flex items-end justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative w-[92%] md:w-[75%] lg:w-[60%] bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-10 text-center -mb-24">
          <h1 className="text-2xl md:text-4xl xl:text-5xl font-sans font-[800] text-gray-900 leading-snug tracking-tight">
            {data?.title}
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6 text-gray-600 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              <span>
                {data?.updatedAt
                  ? new Date(data.updatedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-sky-600" />
              <span>{data?.author?.name || "Chưa xác định"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <div className="w-full max-w-[1450px] mx-auto px-4 md:px-8 xl:px-10 mt-32 flex flex-col xl:flex-row gap-10">
        {/* Nội dung chính */}
        {/* <section className="w-full xl:w-4/5 flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-1/4 hidden lg:block">
            <DocumentTOC
              content={descriptionHtml}
              maxLevel={4}
              className="sticky top-28"
            />
          </aside>

          <article className="flex-1 bg-white rounded-2xl shadow-md overflow-hidden">
            {Array.isArray(data?.images) && data.images.length > 0 && (
              <div className="relative w-full aspect-video">
                <Image
                  src={data?.images[0]}
                  alt={data.title}
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>
            )}
            <div className="p-6 md:p-10 prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-700">
              <div id="article-content" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            </div>
          </article>
        </section> */}

        <DocumentDetailMainContent data={data} />

        {/* Sidebar */}
        <aside className="w-full xl:w-1/5 flex items-center justify-center xl:items-start">
          <div
            style={{
              boxShadow:
                "0 0 10px 0 rgba(107.92343749999999, 107.92343749999999, 107.92343749999999, .5)",
            }}
            className="py-3 px-2.5 w-full md:w-4/5 lg:w-3/5 xl:w-full rounded-[10px] bg-white h-fit col-span-3"
          >
            <div className="w-full  flex justify-center items-center">
              <img
                src="/images/Banner-phu_1-honorpage.jpg"
                alt="banner-honor-page"
                className="w-full md:w-[80%] object-contain object-center"
              />
            </div>
            <div className="text-[#333399] text-[20px] text-center font-bold whitespace-pre-line mb-3">
              {"ĐĂNG KÝ TƯ VẤN \nLỘ TRÌNH HỌC IELTS"}
            </div>
            <div className="text-[#333] text-[16px] text-center font-medium whitespace-pre-line">
              Bạn hãy để lại thông tin,{" "}
              <span className="whitespace-nowrap">The Real IELTS</span>
              {"\n"}sẽ liên hệ cho bạn ngay nha!
            </div>

            <ReusableForm
              title=""
              description=""
              layout="main"
              className="border-none shadow-none px-0 hover:shadow-none"
              fields={[
                {
                  name: "name",
                  label: "",
                  placeholder: "Nhập họ và tên",
                  type: "text",
                  required: true,
                },
                {
                  name: "yearOfBirth",
                  placeholder: "Nhập năm sinh",
                  label: "",
                  type: "year",
                  required: true,
                },
                {
                  name: "mobile",
                  label: "",
                  placeholder: "Nhập số điện thoại",
                  type: "tel",
                  required: true,
                },
                {
                  name: "email",
                  label: "",
                  placeholder: "Nhập email",
                  type: "email",
                  required: true,
                },

                {
                  name: "goal",
                  label: "Mục tiêu học",
                  type: "radio",
                  options: [
                    { value: "Xét tuyển đại học", label: "Xét tuyển ĐH" },
                    { value: "Phục vụ công việc", label: "Phục vụ công việc" },
                    { value: "Học tập thi IELTS", label: "Học tập thi IELTS" },
                  ],
                  required: true,
                },
                {
                  name: "difficult",
                  label: "",
                  placeholder: "Thời gian bạn có thể nhận cuộc gọi",
                  type: "text",
                  required: true,
                },
              ]}
              submitText="Hoàn tất đăng ký"
              apiPath="/consultation/create"
            />
          </div>
        </aside>
      </div>

      {/* Related Documents */}
      {documentList.length > 0 && (
        <section className="w-full max-w-[1350px] mx-auto px-4 md:px-8 xl:px-10 my-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8">
            📚 <span className="underline">Tài liệu liên quan</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {documentList.map((doc) => (
              <Link key={doc.id} href={`/${doc.slug}`} className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-xl hover:-translate-y-1 duration-300">
                  <div className="relative w-full h-44">
                    <Image
                      src={doc.images[0] || "/images/default-image.webp"}
                      alt={doc.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-[16px] font-sans font-[500] text-[#03124E] mb-2 line-clamp-2">
                      {doc.title}
                    </h3>
                    <div
                      className="text-[13px] text-gray-500 mt-3 line-clamp-4 [&_*]:!text-[13px] [&_*]:!text-gray-500"
                      dangerouslySetInnerHTML={{
                        __html:
                          doc.description ||
                          "<span class='italic'>Không có mô tả</span>",
                      }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <ButtonBase
            content="Xem thêm tài liệu"
            url={`/thu-vien-tai-lieu-ielts-mien-phi/${categoryGroup}`}
          />
        </section>
      )}
    </main>
  );
}
