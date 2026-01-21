"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Honor } from "@/types";

export default function HonorSwiper({ honors }: { honors: Honor[] }) {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      autoplay={{ delay: 1200, disableOnInteraction: false }}
      className="pb-6"
    >
      {Array.isArray(honors) &&
        honors.map((honor) => (
          <SwiperSlide key={honor.id}>
            <div className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
              <img
                src={honor.photo}
                alt={honor.name}
                className="w-full h-64 md:h-72 object-cover rounded-xl"
              />
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
