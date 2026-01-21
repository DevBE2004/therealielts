"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { Star } from "lucide-react";
import { Honor } from "@/types";

type HonorSlideProps = {
  honors: Honor[];
  title?: string;
};

export default function HonorSlide({ honors, title }: HonorSlideProps) {
  return (
    <div className="w-full">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">
          {title}
        </h2>
      )}

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000, // 4s tự động chuyển
          disableOnInteraction: false, // vẫn tiếp tục chạy sau khi user tương tác
        }}
        breakpoints={{
          640: { slidesPerView: 1 },

          1024: { slidesPerView: 2 },
        }}
      >
        {honors.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full group hover:shadow-xl transition">
              {/* Image */}
              <div className="relative w-full flex items-center justify-center overflow-hidden">
                <Image
                  src={item.photo || ""}
                  alt={item.name}
                  height={300}
                  width={288}
                  className="object-cover"
                />
              </div>

           


              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 stroke-yellow-400"
                    />
                  ))}
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>

                {/* Achievement */}
                <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                  {item.achievement}
                </p>

                {/* Button */}
                <a
                  href={`/vinh-danh-hoc-vien/${item.id}`}
                  className="mt-4 inline-block text-center text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Xem chi tiết
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
