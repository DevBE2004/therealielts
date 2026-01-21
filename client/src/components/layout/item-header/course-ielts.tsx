import { HeaderConfigType } from "@/components/admin/header-config/types";
import { Course } from "@/types";
import { Roadmap } from "@/types/roadmap";
import { BadgeCheck, ChevronDown, GraduationCap } from "lucide-react";
import Link from "next/link";

const hoverClass =
  "hover:text-blue-200 transition-colors border-b-3 border-[#20376c] hover:border-white pb-1";
const buttonStyle =
  "flex items-center gap-1 border-b-3 border-[#20376c] hover:border-white pb-1";

interface ItemHeaderProps {
  data: HeaderConfigType;
  roadmaps: Roadmap[];
  courses: Course[];
}
const CourseIelts = ({ data, roadmaps, courses }: ItemHeaderProps) => {
  return (
    <div className="relative group py-2">
      <button className={`${buttonStyle} ${hoverClass}`}>
        {data.title || "Khóa học IELTS"} <ChevronDown className="w-4 h-4" />
      </button>

      {/* Mega menu full width toàn màn hình */}
      <div
        className="fixed left-0 right-0 top-[72px]
      w-screen text-[#20376C] shadow-2xl z-50
      opacity-0 invisible group-hover:opacity-100 group-hover:visible
      transition-all duration-300 ease-out
      ring-1 ring-black/5 rounded-b-2xl"
      >
        <div className="w-full mx-auto flex bg-white">
          {/* Tiêu đề */}
          <div className="w-2/3 pb-12 pl-12 pr-8">
            <div className="py-6 border-b border-gray-200">
              <h3 className="uppercase text-2xl font-sans font-[700] text-[#20376c] tracking-wide">
                {data.title || "Khóa học IELTS"}
              </h3>
            </div>

            {/* Danh sách lộ trình + khóa học */}
            <div className="flex flex-wrap justify-between gap-10 pt-8">
              {roadmaps?.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="flex-1 min-w-[250px] max-w-[300px]"
                >
                  {/* Tiêu đề lộ trình */}
                  <Link
                    href={`/lo-trinh-hoc/${roadmap.slug}`}
                    className="block text-lg font-[600] font-sans text-[#20376c] mb-4 uppercase hover:text-[#D1228A] transition"
                  >
                    {roadmap.title}
                  </Link>

                  {/* Danh sách khóa học */}
                  <ul className="space-y-2 text-[16px] font-sans font-[500] leading-relaxed">
                    {courses
                      ?.filter((c) => c.routeId === roadmap.id)
                      .map((course) => (
                        <li
                          key={course.id}
                          className="flex items-center gap-2 group/item hover:translate-x-[3px] transition-transform"
                        >
                          <BadgeCheck
                            size={16}
                            className="shrink-0 text-[#20376c] group-hover/item:text-[#D1228A] transition-colors"
                          />
                          <Link
                            href={`/${course.slug}`}
                            className="hover:text-[#D1228A] transition-colors"
                          >
                            {course.category?.name === "course" ? "IELTS" : ""}{" "}
                            {course.title} {course.level?.[0]} -{" "}
                            {course.level?.[1] || ""}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/3 bg-[#DDE7FF] pb-12 px-6 flex flex-col">
            <div className="py-6 border-b border-[#b5c5e9]">
              <h3 className="uppercase text-xl font-sans font-[700] text-[#20376c] tracking-wide">
                Các khóa học khác
              </h3>
            </div>
            <div className="py-6 px-4 overflow-auto max-h-fit">
              <ul className="space-y-2 text-[16px] xl:text-[18px] font-sans font-[500] leading-relaxed">
                {data.children
                  ?.slice() // copy để tránh mutate
                  .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                  .map((child) => (
                    <li key={child?.slug} className="flex gap-2 items-center">
                      <GraduationCap className="size-6 shrink-0 text-[#20376c]" />
                      <Link
                        href={child?.slug || "#"}
                        target="_blank"
                        className="hover:text-[#D1228A] transition-colors text-[#20376c]"
                      >
                        {child.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseIelts;
