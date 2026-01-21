"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useRef } from "react";
import { BlockLearningApproach } from "@/types/homepage";

export default function LearningApproach({
  data,
}: {
  data: BlockLearningApproach;
}) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="w-full bg-gradient-to-br from-[#20376C] to-indigo-900 py-16 relative">
      <div className="relative max-w-7xl mx-auto px-6 ">
        {/* Swiper */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            if (swiper.params.navigation) {
              const nav = swiper.params.navigation as any;
              nav.prevEl = prevRef.current;
              nav.nextEl = nextRef.current;
            }
          }}
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
        >
          {data?.slide.map((item) => (
            <SwiperSlide key={item.title}>
              <div className="flex flex-col md:flex-row items-center gap-10">
                {/* Ảnh */}
                <div className="relative w-full md:w-1/2 h-[260px] md:h-[400px] rounded-2xl overflow-hidden shadow-md">
                  {item?.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform"
                      priority
                    />
                  )}
                </div>

                {/* Nội dung */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <h3 className="text-2xl lg:text-3xl font-sans font-[700] text-white">
                    {item.title}
                  </h3>
                  <p className="text-lg lg:text-xl font-sans font-[600] text-gray-50">
                    {item.subTitle}
                  </p>
                  <div
                    className="text-gray-100 text-base lg:text-lg font-sans font-[450] leading-relaxed prose"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  ></div>
                  <a
                    href={item?.linkButton || "#"}
                    className="flex items-center justify-center w-48 gap-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition duration-300 mt-4"
                  >
                    <span>{item?.textButton || ""}</span>
                    <ChevronRight className="w-5 h-5 mt-0.5" />
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nút điều hướng bên trái/phải */}
        <button
          ref={prevRef}
          aria-label="slide trước"
          className="absolute top-1/2 -translate-y-1/2 -left-0 xl:-left-6 z-10 
                      w-10 h-10 rounded-full bg-white shadow-lg
                     flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          ref={nextRef}
          aria-label="slide sau"
          className="absolute top-1/2 -translate-y-1/2 -right-0 xl:-right-6 z-10 
                      w-10 h-10 rounded-full bg-white shadow-lg
                     flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </section>
  );
}
