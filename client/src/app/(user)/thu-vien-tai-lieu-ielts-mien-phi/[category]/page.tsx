// import { DocumentService } from "@/services/document.service";
// import DocumentTOC from "@/components/common/DocumentTOC";
// import { Document } from "@/types";
// import ReusableForm from "@/components/common/ReusableForm";
// import Image from "next/image";
// import Link from "next/link";
// import { Calendar, UserCircle } from "lucide-react";
// import { hasWPClass } from "@/utils/hasWPClass";

// type PageProps = {
//   params: Promise<{ slug: string }>;
// };
// export const dynamic = "force-dynamic";

// export default async function DocumentDetail({ params }: PageProps) {
//   const { slug } = await params;
//   const document = await DocumentService.getOne(slug);
//   const dataDocument: Document = document.data || ({} as Document);
//   const descriptionHtml = dataDocument?.description || "";

//   const isWP = hasWPClass(descriptionHtml);

//   // Danh sách & lọc tài liệu liên quan
//   const res = await DocumentService.getAll();
//   const documentList: Document[] = Array.isArray(res.data) ? res.data : [];
//   const relatedDocs = documentList
//     .filter(
//       (doc) =>
//         doc.id !== dataDocument.id &&
//         doc?.category?.name === dataDocument?.category?.name &&
//         doc?.category?.group === dataDocument?.category?.group
//     )
//     .slice(0, 6);

//   return (
//     <main className="min-h-screen w-full bg-gray-50">
//       {/* Hero Section */}
//       <section className="relative w-full h-80 bg-gradient-to-tr from-sky-600 via-sky-700 to-sky-900 flex items-end justify-center">
//         <div className="absolute inset-0 bg-black/20" />
//         <div className="relative w-[92%] md:w-[75%] lg:w-[60%] bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-10 text-center -mb-24">
//           <h1 className="text-2xl md:text-4xl xl:text-5xl font-extrabold text-gray-900 leading-snug tracking-tight">
//             {dataDocument?.title}
//           </h1>
//           <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6 text-gray-600 text-sm md:text-base">
//             <div className="flex items-center gap-2">
//               <Calendar className="w-5 h-5 text-sky-600" />
//               <span>
//                 {dataDocument?.updatedAt
//                   ? new Date(dataDocument.updatedAt).toLocaleDateString(
//                       "vi-VN",
//                       {
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "numeric",
//                       }
//                     )
//                   : "Chưa cập nhật"}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <UserCircle className="w-5 h-5 text-sky-600" />
//               <span>{dataDocument?.author?.name || "Chưa xác định"}</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Content Layout */}
//       <div className="w-full max-w-[1350px] mx-auto px-4 md:px-8 xl:px-10 mt-32 flex flex-col xl:flex-row gap-10">
//         {/* Nội dung chính */}
//         <section className="w-full xl:w-4/5 flex flex-col lg:flex-row gap-10">
//           {/* TOC */}
//           <aside className="lg:w-1/4 hidden lg:block">
//             <DocumentTOC
//               content={descriptionHtml}
//               maxLevel={4}
//               className="sticky top-28"
//             />
//           </aside>

//           {/* Document Content */}
//           <article className="flex-1 bg-white rounded-2xl shadow-md overflow-hidden">
//             {dataDocument?.images[0] && (
//               <div className="relative w-full aspect-video">
//                 <Image
//                   src={dataDocument?.images[0]}
//                   alt={dataDocument.title}
//                   fill
//                   priority
//                   className="object-cover object-center"
//                 />
//               </div>
//             )}
//             <div className="p-6 md:p-10 prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-700">
//               <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
//             </div>
//           </article>
//         </section>

//         {/* Sidebar */}
//         <aside className="w-full xl:w-1/5">
//           <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
//             <ReusableForm
//               title="Đặt Lịch Tư Vấn"
//               description="Nhận tư vấn miễn phí và xây dựng lộ trình học tập phù hợp nhất."
//               layout="sidebar"
//               fields={[
//                 { name: "name", label: "Họ tên", type: "text", required: true },
//                 {
//                   name: "mobile",
//                   label: "Số điện thoại",
//                   type: "tel",
//                   required: true,
//                 },
//                 {
//                   name: "email",
//                   label: "Email",
//                   type: "email",
//                   required: true,
//                 },
//                 {
//                   name: "yearOfBirth",
//                   label: "Năm sinh",
//                   type: "year",
//                   required: true,
//                 },
//                 {
//                   name: "goal",
//                   label: "Mục tiêu học",
//                   type: "radio",
//                   options: [
//                     { value: "Xét tuyển đại học", label: "Xét tuyển ĐH" },
//                     { value: "Phục vụ công việc", label: "Phục vụ công việc" },
//                   ],
//                 },
//                 { name: "difficult", label: "Ghi chú", type: "textarea" },
//               ]}
//               submitText="Đăng ký ngay"
//               apiPath="/consultation/create"
//             />
//           </div>
//         </aside>
//       </div>

//       {/* Related Documents */}
//       {relatedDocs.length > 0 && (
//         <section className="w-full max-w-[1350px] mx-auto px-4 md:px-8 xl:px-10 my-24">
//           <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8">
//             📚 Tài liệu liên quan
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {relatedDocs.map((doc) => (
//               <Link
//                 key={doc.id}
//                 href={`/thu-vien/${doc.slug}`}
//                 className="group"
//               >
//                 <div className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-xl hover:-translate-y-1 duration-300">
//                   <div className="relative w-full h-44">
//                     <Image
//                       src={doc.images[0]}
//                       alt={doc.title}
//                       fill
//                       className="object-cover group-hover:scale-105 transition duration-300"
//                     />
//                   </div>
//                   <div className="p-5">
//                     <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-sky-600 transition">
//                       {doc.title}
//                     </h3>
//                     <div
//                       className="text-sm text-gray-500 mt-3 line-clamp-3 prose"
//                       dangerouslySetInnerHTML={{
//                         __html:
//                           doc.description ||
//                           "<span class='italic'>Không có mô tả</span>",
//                       }}
//                     />
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>
//       )}
//     </main>
//   );
// }

import { CommonService } from "@/services/common.service";
import CategoryView from "./CategoryView";
import { DocumentService } from "@/services/document.service";
import { Document, DocumentSchema } from "@/types";
import { Category } from "@/types/category";
import { CategoryService } from "@/services/category.service";
import slugify from "slugify";
import { parseStringObject } from "@/hooks/parseStringObject";

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ page?: string; search?: string }>;
};

export const dynamic = "force-dynamic";

export default async function CourseDetail({
  params,
  searchParams,
}: PageProps) {
  const { category } = await params;
  const sp = await searchParams;
  const page = Number(sp?.page || 1);
  const search = sp?.search || "";
  console.log("SEARCH: ", search);
  const limit = 10;

  const categories = await CategoryService.getAll({
    query: { limit: 9999 },
    revalidate: 10,
    tags: ["category"],
  });
  const selectCategory: Category | undefined = Array.isArray(categories.data)
    ? categories.data.find((c) => {
        const group = parseStringObject(c.group);
        if (!group) return false;
        return slugify(group.name, { lower: true, locale: "vi" }) === category;
      })
    : undefined;

  const documents = await CommonService.getAll(DocumentSchema, {
    query: {
      isActive: true,
      type: "DOCUMENT",
      limit,
      page,
      categoryId: selectCategory?.id,
      search,
    },
    revalidate: 600,
    tags: ["document"],
  });

  const documentData: Document[] = Array.isArray(documents.data)
    ? documents.data
    : [];
  const total = documents.total || 0;

  const group = parseStringObject(selectCategory?.group);
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <CategoryView
        documents={documentData}
        categoryTitle={group?.name}
        page={page}
        total={total}
        limit={limit}
        search={search}
      />
    </div>
  );
}
