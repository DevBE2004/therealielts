import { NewService } from "@/services/new.service";
import { New, NewSchema } from "@/types";
import slugify from "slugify";
import View from "./view";
import { CommonService } from "@/services/common.service";

type PageProps = { 
  params: Promise<{slug: string}>
 };
export const dynamic = "force-dynamic";

export default async function NewCategoryPage({ params }: PageProps ) {
  const { slug } = await params;

  // Lấy toàn bộ news
  const res = await CommonService.getAll(NewSchema, {
    query: {type: "NEW", isActive: true, limit: 9999},
    revalidate: 300,
    tags: ["new"],
  });
  const newList: New[] = Array.isArray(res.data) ? res.data : [];

  // Lọc theo category.slug
  let categoryName: string = "";
  const data: New[] = newList.filter(
    (item) => slugify(item.category?.name || "", { lower: true, locale: "vi" }) === slug
  );

  if (data.length > 0 && data[0].category?.name) {
  categoryName = data[0].category.name;
}

  return <View data={data} slug={slug} categoryName={categoryName} />;
}
