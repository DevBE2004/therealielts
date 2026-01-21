
import { Course, CourseSchema } from "@/types";
import CourseDetailPreview from "./CourseDetailPreview";
import PackageDetailPreview from "./PackageDetailPreview";
import { CommonService } from "@/services/common.service";

export const dynamic = "force-dynamic";

type PageProps = {
  data: Course;
};

export default async function CourseDetail({ data }: PageProps) {

  const categoryName = data?.category?.name;
    const allCourses = await CommonService.getAll(CourseSchema, {
      query: { type: "COURSE", limit: 9999 },
    });
    const dataAllCourses: Course[] = Array.isArray(allCourses.data)
      ? allCourses.data?.filter((c) => c.category.name !== "package")
      : [];
 
  return (
    <>
    {categoryName === "course" && (
      <CourseDetailPreview courses={dataAllCourses} data={data}/>
    )}

    {categoryName === "package" && (
      <PackageDetailPreview courses={dataAllCourses} data={data}/>
    )}
      
    </>
  );
}
