"use client";

import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface BannerCustomProps {
  banners: string[];
}
export default function BannerCustom({ banners }: BannerCustomProps) {
  const handleOpen = (url: string) => {
    if (url) window.open(url, "_blank");
  };

  return (
    <div id="box_header_start" className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
        className="w-full"
      >
        {banners?.map((slide) => (
          <SwiperSlide key={slide}>
            <div
              // onClick={() => handleOpen(slide.url)}
              className="
                relative w-full 
                aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4]
                xl:aspect-auto xl:h-[500px] 2xl:h-[650px]
                cursor-pointer
              "
            >
              <Image
                src={slide || ""}
                alt={slide}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center rounded-none select-none transition-transform duration-700 ease-in-out hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
