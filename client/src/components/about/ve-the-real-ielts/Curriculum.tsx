"use client";

import Image from "next/image";

type CurriculumItem = {
  imageIndex: number;
  alt: string;
  line1: string;
  line2: string;
};

type section4 = {
  items?: CurriculumItem[];
};

type Props = {
  section4: section4;
  images4: string[];
}

export default function CurriculumSection({section4, images4}: Props) {

  const CurriculumValue = section4?.items || [];
  const CurriculumImages = images4 || [];

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-4">
        {/* 🔹 Left main image */}
        <div className="w-full lg:w-1/2 p-4">
          <div className="relative w-full h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={CurriculumImages[0] || "/images/default-image.webp"}
              alt="Ảnh chính Curriculum"
              fill
              className="object-cover object-center transition-transform hover:scale-105 duration-700"
            />
          </div>
        </div>

        {/* 🔹 Right grid dynamic section */}
        <div
          className="
            w-full lg:w-1/2 
            grid grid-cols-1 sm:grid-cols-2 
            gap-6 md:gap-8
          "
        >
          {CurriculumValue?.map((item, index) => (
            <div
              key={index}
              className="
                bg-white rounded-xl px-3 py-6 shadow-md hover:shadow-lg 
                transition-all duration-300 text-center border border-gray-100
                flex flex-col items-center
              "
            >
              <div className="relative w-full h-36 mb-4 overflow-hidden">
                <Image
                  src={CurriculumImages[item.imageIndex]}
                  alt={item.alt}
                  fill
                  className="object-contain object-center"
                />
              </div>

              <p className="font-sans font-[400] text-[#03124E] text-[20px] leading-snug">
                {item.line1}
                <br />
                <span className="font-[600]">{item.line2}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
