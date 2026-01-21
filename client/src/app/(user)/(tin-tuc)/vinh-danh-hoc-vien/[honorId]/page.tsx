import ConsultationForm from "@/components/common/ConsultationForm";
import RightCourseList from "@/components/common/RightCourseList";
import { CourseService } from "@/services/course.service";
import { HonorService } from "@/services/honor.service";
import { Course, CourseSchema, Honor } from "@/types";
import Image from "next/image";
import { Award } from "lucide-react";
import { splitSections } from "@/hooks/splitSections";
import { CommonService } from "@/services/common.service";

type PageProps = {
  params: Promise<{ honorId: number }>;
};
export const dynamic = "force-dynamic";

export default async function HonorDetail({ params }: PageProps) {
  const { honorId } = await params;
  const res = await HonorService.detail(honorId);
  const honor: Honor | null = res.success && res.data ? res.data : null;

  const courses = await CommonService.getAll(CourseSchema, {
    query: { type: "COURSE", limit: 9999 },
  });
  const dataCourses: Course[] =
    Array.isArray(courses.data) && courses.data.length > 0
      ? courses.data.filter((c) => c.category?.name !== "package")
      : [];

  if (!honor) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center text-gray-600">
        <p>Không tìm thấy thông tin học viên.</p>
      </main>
    );
  }

  return (
    <main id="main" className="w-full min-h-screen bg-white">
      <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-8 px-4 py-12">
        {/* Nội dung chính */}
        <article className="w-full lg:w-3/5">
          {/* Tiêu đề */}
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-sans font-[600] text-gray-900 mb-2">
              {honor.name}
            </h1>
            <p className="text-gray-500">
              Câu chuyện và thành tích nổi bật của học viên
            </p>
          </header>

          {/* Ảnh banner chính */}
          <div className="relative w-full h-72 md:h-[420px] mb-8">
            <Image
              src={honor.photo || "/placeholder.jpg"}
              alt={honor.name}
              fill
              priority
              className="object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Thành tích */}
          <section className="mb-10">
            <h2 className="text-2xl font-sans font-[500] text-gray-800 mb-4">
              Thành tích nổi bật
            </h2>
            <ul className="space-y-3">
              {splitSections(honor.achievement).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <Award className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Mô tả */}
          {honor.description && (
            <section className="prose max-w-none mb-10">
              <h2 className="text-2xl font-sans font-[500] text-gray-800 mb-4">
                Giới thiệu
              </h2>
              <p className="leading-relaxed text-base font-sans font-[400] text-gray-700">
                {honor.description}
              </p>
            </section>
          )}

          {/* Ảnh cuối */}
          <div className="relative w-full h-64 md:h-[350px] mt-10">
            <Image
              src={honor.photo || "/placeholder.jpg"}
              alt={`${honor.name} - second photo`}
              fill
              className="object-cover rounded-xl shadow-md"
            />
          </div>
        </article>

        {/* Side bar */}
        <aside className="w-full lg:w-2/5">
          <RightCourseList title="Các Khóa Học Phù Hợp" courses={dataCourses} />
        </aside>
      </div>
      {/* Form tư vấn */}
      <div className="">
        <ConsultationForm />
      </div>
    </main>
  );
}
