import { CategoryService } from "@/services/category.service";
import { CommonService } from "@/services/common.service";
import { StudyAbroad, StudyAbroadSchema } from "@/types";
import slugify from "slugify";
import PreviewPage from "./PreviewPage";

type PageProps = {
  params: Promise<{ category: string }>;
  // searchParams?: { page?: string; orderBy?: string };
};

export const dynamic = "force-dynamic";

// export async function generateMetadata({ params }: PageProps) {
//   const { categoryId } = await params;
//   const studyAbroad = CommonService.getAll(StudyAbroadSchema, {
//     query: {type: "STUDYABROAD", isActive: true, limit: 10, page: 1},
//     revalidate: 600,
//     tags: ["study-abroad"],
//   })

//   if (data) {
//     return {
//       title: `${data.title} | The Real IELTS`,
//       description:
//         data.description?.slice(0, 160) || "Du học cùng The Real IELTS",
//       openGraph: {
//         title: data.title,
//         description: data.description?.slice(0, 160),
//         images: data.images?.[0],
//       },
//     };
//   }
// }

const LIMIT = 12;

export default async function PackageDetail({ params }: PageProps) {
  const { category } = await params;
  // const p = await searchParams;

  // const orderBy = (p?.orderBy as string) || "createdAt,DESC";
  // const page = Number(p?.page ?? 1);

  const fetchCategories = await CategoryService.getAll({
    query: { limit: 9999 },
    tags: ["category"],
  });

  const categoryData =
    Array.isArray(fetchCategories.data) && fetchCategories.data.length > 0
      ? fetchCategories.data
      : [];

  const selectedCategory = categoryData.find(
    (c) => slugify(c.name, { lower: true, locale: "vi" }) === category
  );

  if (!selectedCategory) {
    return <div>Category phân loại du học không tồn tại</div>;
  }

  // const studyAbroad = await CommonService.getAll(StudyAbroadSchema, {
  //   query: {
  //     type: "STUDYABROAD",
  //     isActive: true,
  //     categoryId: selectedCategory?.id,
  //     limit: LIMIT,
  //     page: page,
  //     orderBy: orderBy,
  //   },
  //   revalidate: 600,
  //   tags: ["study-abroad"],
  // });

  // const data: StudyAbroad[] =
  //   Array.isArray(studyAbroad.data) && studyAbroad.data.length > 0
  //     ? studyAbroad.data
  //     : [];

  return (
    <>
      <PreviewPage category={selectedCategory} limit={LIMIT} />
    </>
  );
}
