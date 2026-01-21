"use client";

import { useCallback, useEffect, useState } from "react";
import { Document } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  documents: Document[];
};

export default function DocumentView({ documents }: PageProps) {
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  let visibleCount = 4; // mặc định mobile
  if (isMd && !isLg) visibleCount = 6;
  if (isLg) visibleCount = 8;

  const data: Document[] = Array.isArray(documents)
    ? documents.slice(0, visibleCount)
    : [];

  const hanldeClick = useCallback(
    (item: Document) => {
      router.push(`/${item.slug}`);
    },
    [router]
  );

  return (
    <section className="w-full px-5 py-10 bg-[#20376C]">
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center">
        {/* Header */}
        <div className="flex gap-1.5 w-full items-center justify-between mb-6 pr-0 sm:pr-4 lg:pr-10">
          <h2 className="uppercase text-base sm:text-xl lg:text-2xl font-sans font-[700] text-white border-b-2">
            TIPS CHO NGƯỜI HỌC IELTS MỚI NHẤT
          </h2>
          <Link
            href="/thu-vien-tai-lieu-ielts-mien-phi"
            className="text-white text-center hover:underline hover:decoration-2 hover:underline-offset-4 text-base font-sans font-[500] transition"
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {data.map((d) => (
            <div
              key={d.id}
              className="flex flex-col justify-between bg-white rounded-2xl p-1.5 sm:p-3 shadow-lg overflow-hidden hover:shadow-md transition group"
            >
              {/* Ảnh */}
              {d.images.length > 0 && (
                <div className="relative w-full h-32 sm:h-44 overflow-hidden rounded-[10px] border border-amber-400">
                  <Image
                    src={d.images?.[0]}
                    alt={d.title}
                    fill
                    className="object-cover object-center transition-transform"
                  />
                </div>
              )}

              {/* Nội dung */}
              <div className="px-2 flex flex-col">
                <h3 className="text-[16px] font-sans font-[500] text-[#03124E] my-2 line-clamp-2">
                  {d.title}
                </h3>

                <div
                  className=" px-1 text-[13px] text-gray-500 mt-2 mb-2 line-clamp-4 [&_*]:!text-[13px] [&_*]:!text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html:
                      d.description ||
                      "<span class='italic'>Không có mô tả</span>",
                  }}
                />
              </div>

              {/* Nút */}
              <button
                onClick={() => hanldeClick(d)}
                className="text-start text-base mt-3 cursor-pointer border-t-2 inline-block px-2 pt-1.5 font-medium text-blue-800 hover:text-blue-600 hover:underline hover:decoration-2 hover:underline-offset-4 transition"
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
