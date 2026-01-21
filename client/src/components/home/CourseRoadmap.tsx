import { CommonService } from "@/services/common.service";
import { Course, CourseSchema } from "@/types";
import Image from "next/image";
import Link from "next/link";

const images = [
  "/icons/ielts-kick-off.png",
  "/icons/ielts-advance.png",
  "/icons/ielts-speed-up-1.png",
  "/icons/ielts-modest.png",
  "/icons/ielts-fluent.png",
];

export default async function CourseRoadmap() {
  const fetchCourse = await CommonService.getAll(CourseSchema, {
    query: { type: "COURSE", limit: 9999 },
    revalidate: 300,
    tags: ["course"],
  });

  const courses: Course[] = Array.isArray(fetchCourse.data)
    ? fetchCourse.data.filter((c) => c.category?.name !== "package")
    : [];

  return (
    <section className="w-full py-10 bg-gradient-to-b from-[#e2e9f7] to-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-sans font-[700] text-blue-900 mb-10">
          LỘ TRÌNH 0 - 7.5+ IELTS
        </h2>

        {/* Courses List */}
        <div className="w-full flex flex-wrap items-center justify-center gap-8">
          {Array.isArray(courses) &&
            courses.map((course, index) => {
              const fallbackImage = images[index % images.length];

              return (
                <Link
                  href={`/${course.slug}`}
                  key={course.id}
                  className="bg-white rounded-full p-6 w-52 h-[300px] flex flex-col items-center justify-center group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-sky-200 shadow-sm"
                >
                  {/* Icon */}
                  <div className=" relative w-24 h-24 flex items-center overflow-hidden justify-center rounded-full bg-slate-100 mb-4">
                    <Image
                      src={fallbackImage}
                      alt={course.title}
                      fill
                      className=" object-contain transition-transform p-3.5"
                      sizes="56px"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-sans font-[700] text-[#1e6fd6] uppercase whitespace-nowrap">
                    {course.title}
                  </h3>

                  <p className="text-lg font-sans font-[700] uppercase text-slate-800 mb-2 border-b-2 shadow-border border-b-neutral-400">
                    {course.level?.[0]} - {course.level?.[1]} IELTS
                  </p>

                  <div className="w-full px-3.5 pb-2 break-words">
                    <p className="line-clamp-3 text-sm font-sans font-[400] text-[#21366b]">
                      {course.description}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/xay-dung-lo-trinh"
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Xây dựng lộ trình học cho riêng bạn
          </Link>
        </div>
      </div>
    </section>
  );
}
