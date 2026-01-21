"use client";

import DocumentTOC from "@/components/common/DocumentTOC";
import RightCourseList from "@/components/common/RightCourseList";
import { Course, New } from "@/types";
import Image from "next/image";

type PageProps = {
  dataNew: New;
  dataCourses?: Course[];
  titleRightCourse: string;
};

export default function NewsDetailView({
  dataNew,
  dataCourses,
  titleRightCourse,
}: PageProps) {
  const descriptionHtml = dataNew?.description || "";

  return (
    <main className="min-h-screen w-full bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-40 md:h-64 bg-gradient-to-tr from-sky-600 via-sky-700 to-sky-900 flex items-end justify-center">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative w-[92%] md:w-[75%] lg:w-[65%] bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10 text-center -mb-16">
          <h1 className="text-2xl md:text-4xl xl:text-5xl font-extrabold text-gray-900 leading-snug tracking-tight">
            {dataNew?.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="w-full max-w-[1350px] mx-auto px-4 md:px-8 xl:px-10 mt-24 flex flex-col xl:flex-row gap-10">
        {/* Left - TOC + Content */}
        <section className="w-full xl:w-4/5 flex flex-col lg:flex-row gap-10">
          {/* TOC */}
          <aside className="lg:w-1/4 hidden lg:block">
            <DocumentTOC
              content={descriptionHtml}
              maxLevel={4}
              className="sticky top-28"
            />
          </aside>

          {/* Main Content */}
          <article className="flex-1 bg-white rounded-2xl shadow-md overflow-hidden p-6 md:p-10">
            {Array.isArray(dataNew?.images) && dataNew.images?.length > 0 && (
              <div className="relative w-full max-w-3xl mx-auto h-[300px] md:h-[400px] mb-8 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={dataNew.images[0]}
                  alt={dataNew.title}
                  fill
                  priority
                  className="object-cover object-center rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 70vw"
                />
              </div>
            )}
            <div className="prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            </div>
          </article>
        </section>

        {/* Right - Course Sidebar */}
        <aside className="w-full xl:w-1/5">
         <div className="shadow-lg w-full sticky top-28">
            <RightCourseList title={titleRightCourse} courses={dataCourses} />
        </div>
        </aside>
      </div>
    </main>
  );
}
