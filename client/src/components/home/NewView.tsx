"use client";

import { useEffect, useState } from "react";
import { New } from "@/types";
import Image from "next/image";
import Link from "next/link";
import ButtonBase from "../ui/ButtonBase";
import slugify from "slugify";

// Hook để check media query
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

type PageProps = {
  news: New[];
};

export default function NewView({ news }: PageProps) {
  const isMd = useMediaQuery("(min-width: 768px)");

  let visibleCount = 4;
  if (isMd) visibleCount = 6;

  const data: New[] = Array.isArray(news)
    ? news
        .slice(0, visibleCount)
    : [];

  return (
    <section className="w-full px-5 py-10 bg-gray-100">
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <div className="flex w-full items-center justify-between mb-6">
          <h2 className="uppercase text-xl lg:text-2xl font-bold text-blue-900 border-b-2 border-blue-900">
            Tin tức & sự kiện
          </h2>
        </div>

        {/* Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {data.map((d) => (
            <Link
              key={d.id}
              href={`/${d.slug}`}
              className="bg-white border-cyan-700 border rounded-2xl pb-3 shadow-sm overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg group"
            >
              {/* Ảnh */}
              <div className="relative w-full h-32 sm:h-52 overflow-hidden rounded-[10px]">
                <Image
                  src={d.images?.[0] || "/placeholder.png"}
                  alt={d.title}
                  fill
                  className="object-cover object-center transition-transform"
                />
              </div>

              {/* Title */}
              <div className="px-1.5 py-2.5 md:px-2.5 lg:px-3.5">
                <h3 className="font-sans font-[600] text-blue-900 text-sm sm:text-base line-clamp-3 md:line-clamp-2 uppercase">
                  {d.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <ButtonBase
        content="Tin tức - Sự kiện nổi bật"
        url="/su-kien-va-khuyen-mai"
      />
    </section>
  );
}
