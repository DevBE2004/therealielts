"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import { Banner } from "@/types";

interface SlideBaseProps {
  items?: Banner[];
  height?: number;
}

export default function SlideBase({ items, height = 500 }: SlideBaseProps) {
  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      autoplay={{ delay: 3000 }}
      navigation
      loop
      className="rounded-t-2xl shadow-lg"
    >
      {items ? items.map((item, idx) => (
        <SwiperSlide key={idx} className="flex justify-center items-center">
          <div className="relative w-full" style={{ height }}>
            <Image
              src={item?.image || ""}
              alt={item?.title || `slide-${idx}`}
              fill
              className="object-cover rounded-t-2xl"
            />
          </div>
        </SwiperSlide>
      )) : ""}
    </Swiper>
  );
}
