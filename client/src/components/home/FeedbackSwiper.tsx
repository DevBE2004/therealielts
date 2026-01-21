"use client";
import { Comment } from "@/types/comment";
import Image from "next/image";
import { Star } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function FeedbackSwiper({ comments }: { comments: Comment[] }) {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      slidesPerView={1}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      className="pb-10"
    >
      {Array.isArray(comments) &&
        comments.map((c) => (
          <SwiperSlide key={c.id}>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col gap-4 border border-gray-100">
              {/* Author */}
              <div className="flex items-center gap-4">
                <Image
                  src={c?.avatar || "/images/default-avatar.png"}
                  alt={c?.name || "Người dùng"}
                  width={90}
                  height={90}
                  className="rounded-full object-cover w-24 h-24 border-2 border-sky-500"
                />
                <div>
                  <h3 className="font-sans font-[500] text-lg lg:text-xl text-gray-800">
                    {c?.name}
                  </h3>
                  <p className="text-base text-gray-500">
                    {c?.job || "Học viên"}
                  </p>
                  <div className="flex gap-1 mt-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-600 leading-relaxed font-sans text-base italic">
                “{c.content}”
              </p>
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
