// components/home-banner/HomeBannerSwiper.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/types";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { cancelIdle, requestIdle } from "@/utils/requestIdle";

export default function HomeBannerSwiper({ banners }: { banners: Banner[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestIdle(() => setMounted(true));
    return () => cancelIdle(id);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="absolute inset-0 h-full"
      >
        {banners.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <Link
              href={slide.url}
              target="_blank"
              className="relative block w-full h-full overflow-hidden"
            >
              {slide?.image && (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="
                   (max-width: 640px) 100vw,
                  (max-width: 1024px) 100vw,
                  (max-width: 1536px) 90vw,
                  1600px
                  "
                  loading={index === 0 ? undefined : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding="async"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
