"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Teacher } from "@/types";

export default function TeacherSwiper({ teachers }: { teachers: Teacher[] }) {
  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      spaceBetween={40}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      navigation
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      className="pb-8"
    >
      {Array.isArray(teachers) &&
        teachers.map((teacher) => (
          <SwiperSlide key={teacher.id}>
            <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-96">
              {/* Teacher Image */}
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-full h-full object-center"
              />

              {/* Overlay + Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <a
                  href={`/ve-giao-vien/${teacher.id}`}
                  className="px-4 py-2 bg-white text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  Xem chi tiết
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
