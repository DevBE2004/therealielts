import { splitSections } from "@/hooks/splitSections";
import { CommonService } from "@/services/common.service";
import { Course, CourseSchema } from "@/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  courses: Course[];
  title: string;
  levelFrom: number;
  levelTo: number;
};

export default function CoursePackageSection({ courses, title, levelFrom, levelTo }: Props) {

      const dataAllCourses: Course[] = Array.isArray(courses)
        ? courses.filter((c) => c.category.name !== "package" && c.level?.[0] >= levelFrom && c.level?.[1] <= levelTo) 
        : [];

  return (
    <section className="w-full bg-[#0F172A] pt-12 pb-64 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* --- Header --- */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {title} từ {levelFrom === 0 ? levelFrom : levelFrom.toFixed(1)} đến {levelTo.toFixed(1)} IELTS
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Lộ trình được thiết kế bài bản giúp bạn đạt mục tiêu nhanh và hiệu quả nhất.
          </p>
        </div>

        {/* --- Grid Courses --- */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.isArray(dataAllCourses) &&
            dataAllCourses.map((course) => {
              const sectionsCourse = splitSections(course?.description);
              const firstLine = sectionsCourse?.[0] || "Khóa học IELTS toàn diện.";
              const imageSrc = course?.images?.[0] || "/images/default-image.webp";

              return (
                <article
                  key={course.id}
                  className="group bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden hover:border-[#7B00FB] transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative w-56 h-40 overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={course.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-[#7B00FB] transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{firstLine}</p>
                    </div>

                    {/* CTA */}
                    <div className="mt-4">
                      <Link
                        href={`/${course.slug}`}
                        className="inline-flex items-center justify-center w-full py-2 rounded-xl bg-[#7B00FB] hover:bg-[#9E3DFF] text-white font-medium transition-all duration-300"
                      >
                        Chi tiết +
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}
