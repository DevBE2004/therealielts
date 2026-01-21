"use client";

import { Clock9 } from "lucide-react";
import Image from "next/image";

type TestPart = {
  name: string;
  time: string;
  description: string;
};

type Section3 = {
  title: string;
  content: TestPart[];
};

type Props = {
  section3Record4: Section3;
  images3: string[];
};

export default function TestStructure({ section3Record4, images3 }: Props) {
  const mainImage = images3?.[0];
  const section3 = section3Record4 || undefined;
  return (
    <section className="w-full bg-[#0F172A] py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-10 items-center text-white">
        {/* Cột bên trái */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-sans font-[700] text-center lg:text-left text-[#1579F3] leading-tight">
            {section3.title}
          </h2>
          <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
            {mainImage !== undefined ? (
              <Image
                src={mainImage}
                alt={section3.title}
                fill
                className="object-cover object-center transition-transform"
              />
            ) : (
              <p className="text-white text-lg font-sans font-[600] text-center">
                Ảnh chưa được cập nhật
              </p>
            )}
          </div>
        </div>

        {/* Cột nội dung chi tiết */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          {section3.content?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 p-5 gap-5 sm:gap-6 lg:gap-10"
            >
              {/* Ảnh minh họa */}
              <div className="relative w-[140px] h-[140px] flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={images3[index + 1]}
                  alt={item.name}
                  fill
                  className="object-cover object-center transition-transform"
                />
              </div>

              {/* Nội dung */}
              <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                <div className="bg-[#1579F3] hover:bg-[#F6911A] cursor-pointer px-6 py-3 w-44 rounded-full flex items-center justify-center gap-2">
                  <Clock9 className="size-5 text-white shrink-0" />
                  <p className="text-sm text-[#fff] font-sans font-[500] uppercase tracking-wide">
                    {item.time}
                  </p>
                </div>
                <h3 className="text-xl md:text-2xl font-sans font-[600] text-white">
                  {item.name}
                </h3>
                <div
                  className="text-gray-200 text-sm md:text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
