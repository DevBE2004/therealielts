"use client";

import { BookCopy, ClipboardPen, Goal, MessagesSquare } from "lucide-react";
import Image from "next/image";

const icons = [MessagesSquare, Goal, BookCopy];

type ContentItem = {
  subTitle: string;
  description: string;
};

type Section2 = {
  title: string;
  content: ContentItem[];
  benefit: string;
};

type Props = {
  section2Record4: Section2;
  images2: string[];
};

export default function WhyCheck({ section2Record4, images2 }: Props) {
  const mainImage1 = images2?.[0];
  const mainImage2 = images2?.[1];

  const section2 = section2Record4 || undefined;

  return (
    <section className="w-full bg-[#EDF1F3] pb-16 px-4 md:px-8 lg:px-16 overflow-hidden -mt-24 pt-36">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        {/* Hình ảnh minh họa chính */}
        <div className="relative w-full lg:w-1/3 h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px]">
          {mainImage1 ? (
            <Image
              src={mainImage1}
              alt="Tại sao kiểm tra đầu vào"
              fill
              className="object-contain object-center drop-shadow-xl transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center bg-gray-200 h-full rounded-xl">
              <p className="text-gray-500 italic">Chưa có hình ảnh</p>
            </div>
          )}
        </div>

        {/* Nội dung */}
        <div className="w-full lg:w-2/3 text-[#20376C] flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-[700] mb-2 text-center">
            {section2.title}
          </h2>

          <div className="flex flex-col gap-6">
            {section2.content?.map((item, index) => {
              const Icon = index < icons.length ? icons[index] : ClipboardPen;
              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-shrink-0 bg-[#E6E8FC] p-4 rounded-full">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#20376C]" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {item.subTitle}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Phần mở rộng với hình ảnh phụ và mô tả */}
          <div className="mt-8 w-[85%] mx-auto flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="relative w-full md:w-[160px] h-[120px] flex-shrink-0">
              {mainImage2 ? (
                <Image
                  src={mainImage2}
                  alt="Lộ trình cá nhân hóa"
                  fill
                  className="object-contain object-center drop-shadow-md"
                />
              ) : (
                <div className="flex items-center justify-center bg-gray-200 h-full rounded-xl">
                  <p className="text-gray-500 italic">Chưa có hình ảnh</p>
                </div>
              )}
            </div>
            <div
              className="text-[#03124e] text-sm sm:text-base font-sans font-[400] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section2.benefit }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
