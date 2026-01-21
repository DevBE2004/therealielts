"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { splitSections } from "@/hooks/splitSections";
import { ChevronLeft, ChevronRight, Check, CircleCheckBig } from "lucide-react";
import { useRef } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


// const coreValueImages = [
//   "https://res.cloudinary.com/dttdgtatr/image/upload/v1759430538/app/s9tcgxrs77nb7lnrb325.jpg",
//   "https://res.cloudinary.com/dttdgtatr/image/upload/v1759430537/app/eozx48sb2ymsguskrb7l.webp",
//   "https://res.cloudinary.com/dttdgtatr/image/upload/v1759501107/app/lzpcsr36ofujpj6isugi.webp",
// ];

type coreValue = {
  title: string;
  description: string;
}

type section3 = {
  items: coreValue[];
}

type Props = {
  section3: section3;
  images3: string[];
}

export default function CoreValuesSection({section3, images3}: Props) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const sectionCoreValue = section3?.items || [];
  const coreValueImages = images3 || [];

  return (
    <section className="w-full bg-gradient-to-br from-[#21366A] to-[#051723] py-16 relative">
      <div className="relative max-w-7xl mx-auto px-6">
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
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
        >
          {sectionCoreValue.map((item, index) => {
            const image = coreValueImages[index];
            const lines = splitSections(item.description);

            // Bỏ qua nếu thiếu ảnh hoặc title
            if (!item || !image) return null;

            return (
              <SwiperSlide key={index}>
                <div className="flex flex-col md:flex-row items-center gap-10">

                  {/* Nội dung */}
                  <div className="w-full md:w-1/2 flex flex-col gap-4 text-white pl-2">
                    <h3 className="text-3xl lg:text-4xl font-sans w-fit font-[700] text-[#99F3EA] px-4 py-2 bg-[#223850] rounded-xl">
                      {item.title}
                    </h3>

                    <div className="space-y-3 text-gray-100 text-base lg:text-lg font-sans font-[500] leading-relaxed pl-1.5">
                      {lines.map((line, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CircleCheckBig className="w-5 h-5 text-[#99f3ea] flex-shrink-0 mt-1" />
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>

                    {/* Nút CTA */}
                    <a
                      href="#dang-ky-tu-van"
                      className="flex items-center justify-center w-44 gap-2 border border-amber-50 text-white font-sans font-[500] px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition duration-300 mt-4"
                    >
                      <span>Đăng ký ngay</span>
                      <ChevronRight className="w-5 h-5 mt-1.5" />
                    </a>
                  </div>

                  {/* Ảnh */}
                  <div className="relative w-full md:w-1/2 h-[260px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={image}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent" />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Nút điều hướng */}
        <button
          ref={prevRef}
          className="absolute top-1/2 -translate-y-1/2 -left-0 xl:-left-6 z-10 
                      w-10 h-10 rounded-full bg-white shadow-lg
                     flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          ref={nextRef}
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
