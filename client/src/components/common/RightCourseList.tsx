// components/RightCourseList.tsx
import { Course } from "@/types";
import Image from "next/image";
import Link from "next/link";

type RightCourseListProps = {
  title: string;
  courses?: Course[];
};

export default function RightCourseList({ title, courses }: RightCourseListProps) {
  return (
    <div className="col-span-12 md:col-span-3 border p-4 rounded-xl sticky top-20 h-fit bg-white shadow-sm">
      {/* Title */}
      <h2 className="font-sans font-[700] text-center mb-2.5 text-blue-900 uppercase tracking-wide border-b pb-2">
        {title}
      </h2>

      {/* List */}
      <ul className="divide-y divide-gray-200">
        {courses?.map((course) => (
          <Link
            href={`/${course.slug}`}
            key={course.id || course.title}
            className="flex items-center gap-3 py-3 cursor-pointer group transition px-0 sm:px-3 lg:px-5 xl:px-0"
          >
            {/* Image */}
            <div className="relative w-16 h-16 sm:w-24 xl:w-[70px] flex-shrink-0 rounded-lg overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src={course.images[0]}
                alt={course.title}
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Text */}
            <div className="flex-1">
              <strong className="block uppercase text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                {course.title}
              </strong>
              <p className="text-gray-600 text-sm font-sans font-[400] line-clamp-3">
                {course.description}
              </p>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
}
