"use client";

import { Honor } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useRef } from "react";

export default function HonorSlide({ honors }: { honors?: Honor[] }) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="py-4 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4">

        {/* Swiper */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              (swiper.params.navigation as any).prevEl = prevRef.current;
              (swiper.params.navigation as any).nextEl = nextRef.current;
            }}
            className="pb-4"
          >
            {Array.isArray(honors) &&
              honors.map((honor) => (
                <SwiperSlide key={honor.id}>
                  <div className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full">
                    {/* Image */}
                    <div className="relative w-full aspect-[4/3]">
                      {honor.photo ? (
                        <Image
                          src={honor.photo}
                          alt={honor.name}
                          fill
                          className="object-cover rounded-t-2xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold rounded-t-2xl">
                          {honor.name?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Stars */}
                      <div className="flex justify-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                        {honor.name || "Chưa rõ tên"}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                        {honor.description || "Chưa có mô tả"}
                      </p>

                      <Link
                        href={`/vinh-danh-hoc-vien/${honor.id}`}
                        className="mt-4 inline-block text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
                      >
                        Xem chi tiết →
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>

          {/* Custom navigation absolute */}
          <button
            ref={prevRef}
            className="absolute top-1/2 -translate-y-1/2 -left-6 z-10 w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="size-5 text-white"/>
          </button>
          <button
            ref={nextRef}
            className="absolute top-1/2 -translate-y-1/2 -right-6 z-10 w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors"
          >
            <ArrowRight className="size-5 text-white"/>
          </button>
        </div>
      </div>
    </section>
  );
}
