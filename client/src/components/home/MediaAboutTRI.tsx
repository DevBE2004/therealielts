"use client";

import { New } from "@/types";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const MediaAboutTRI = ({ news }: { news?: New[] }) => {
  const newsList = news ?? [];

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-sans font-[700] text-center mb-10 text-blue-900 tracking-tight">
        BÁO CHÍ NÓI GÌ VỀ THE REAL IELTS
      </h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={newsList.length >= 3}
        slidesPerView={1}
        spaceBetween={16}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
      >
        {newsList.map((item, index) => (
          <SwiperSlide key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full h-full overflow-hidden rounded-[10px] p-2 border border-gray-200 hover:scale-105 duration-300 bg-white shadow-2xl transition-all"
            >
              {/* Icon nhỏ phía trên */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="relative w-[64px] h-[64px] bg-white border border-gray-200 rounded-full">
                  <Image
                    src={item.images?.[2] || "/images/anh-bao-chi-mac-dinh.png"}
                    alt={`${item.title} logo`}
                    fill
                    className="object-contain object-center rounded-full"
                  />
                </div>
                <p className="text-base lg:text-lg font-sans font-[500] text-gray-700 line-clamp-2">
                  {item.title}
                </p>
              </div>

              {/* Ảnh chính */}
              <div className="relative w-full h-56 mt-5 overflow-hidden shadow-border">
                <Image
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.title}
                  fill
                  priority={index < 3}
                  className="object-cover object-center transition-transform border-2"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MediaAboutTRI;
