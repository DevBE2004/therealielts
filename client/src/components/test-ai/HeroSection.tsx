"use client";

import { animate, useInView, useMotionValue } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type data = {
  title: string;
  subTitle: string;
  buttonText: string;
}

type section1Record4 = {
  section1Record4: data;
}

export default function HeroSection({section1Record4}: section1Record4) {

  const data = section1Record4 || undefined;

  return (
    <section className="relative bg-[#FAECEC] w-full pt-12 pb-40 sm:pb-44 md:pb-52">
      {/* Nội dung chính */}
      <div className="w-full flex flex-col items-center justify-center text-center px-4 md:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-sans font-[700] text-[#20376C] leading-snug">
          {data.title ?? "Chưa cập nhật"}
        </h1>
        <p className="text-base sm:text-lg md:text-xl xl:text-2xl font-sans font-[500] text-[#20376C] mt-3 mb-6 max-w-[700px]">
          {data.subTitle ?? "subTitle"}
        </p>

        <a
          href="https://ant-edu.ai/"
          target="_blank"
          className="inline-block px-6 py-3 sm:px-8 sm:py-4 rounded-full text-white text-base sm:text-lg md:text-xl xl:text-2xl font-sans font-[700] shadow-md hover:scale-[1.03] transition-transform"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #9B47ED 30%, #7037E9 70%)",
          }}
        >
          {data.buttonText ?? "Button Text"}
        </a>

        <div className="relative w-[80%] sm:w-[55%] md:w-[40%] h-[180px] sm:h-[220px] mt-10">
          <Image
            src="/wp-content/uploads/2024/05/Dieu-nay-rat-quan-trong-1.png"
            alt="Điều này rất quan trọng"
            fill
            className="object-contain object-center transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}

