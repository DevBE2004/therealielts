import Image from "next/image";
import { BookOpen, GraduationCap, Calendar, BookmarkCheck } from "lucide-react";
import { splitSections } from "@/hooks/splitSections";
import { FC } from "react";

const methodIcons = [BookOpen, GraduationCap, Calendar];

type methodData = {
    titleLine1?: string;
    titleLine2?: string;
    description?: string;
}
interface MethodProps {
  section5: methodData;
  images5: string[];
}

export default function MethodSection({ section5, images5 }: MethodProps) {
  const { titleLine1, titleLine2 , description } = section5;
  const lines = splitSections(section5?.description || "");
  const hasManyLines = lines.length > 3;

  const mainImage = images5[0] || "/images/default-image.webp";

  return (
     <section className="w-full py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 px-4">
        {/* 🔹 Left content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 relative">
          {/* Tiêu đề */}
          <div className="relative mb-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans font-[700] text-gray-900 leading-tight uppercase">
              {titleLine1}
              <br />
              <span className="text-blue-600">{titleLine2}</span>
            </h2>
            {/* Ảnh trang trí nhỏ */}
              <div className="absolute -top-4 right-0 w-16 h-16">
                <Image
                  src="/about/Layer-80.png"
                  alt="decoration"
                  fill
                  className="object-contain object-center"
                />
              </div>
          </div>

          {/* Danh sách mô tả */}
          <div className="space-y-6">
            {lines?.map((html, index) => {
              const Icon =
                index < 3 && methodIcons[index]
                  ? methodIcons[index]
                  : BookmarkCheck;

              return (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex-shrink-0 mt-1">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div
                    className="text-[#03124e] text-base font-sans font-[400] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔹 Right image */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="relative w-full h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={mainImage}
              alt="phương pháp giảng dạy the real ielts"
              fill
              className="object-contain object-center transition-transform hover:scale-105 duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}