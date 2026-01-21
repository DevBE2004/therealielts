"use client";

import { New } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import slugify from "slugify";

type PageProps = {
  data?: New[];
};

export default function NewsSection({ data }: PageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // console.log("data", data);

  const router = useRouter();
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleInputChange = useCallback(
    (value: string) => setSearchTerm(value),
    []
  );

  // Lọc news theo search term
  const filteredNews = useMemo(() => {
    if (!debouncedSearchTerm) return data;
    return data?.filter((item) =>
      item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [data, debouncedSearchTerm]);

  // Nhóm news theo category
  const groupedNews = useMemo(() => {
    const groups: Record<string, { title: string; items: New[] }> = {};
    filteredNews?.forEach((item) => {
      const category =
        (item.category?.name as string | undefined)?.trim() || "Khác";
      const slug = slugify(category, { lower: true });
      if (!groups[slug]) groups[slug] = { title: category, items: [] };
      if (groups[slug].items.length < 3) groups[slug].items.push(item);
    });
    return Object.values(groups);
  }, [filteredNews]);

  const getImages = useCallback((item: New) => {
    if (!item.images) return [];
    if (Array.isArray(item.images)) return item.images;
    try {
      const parsed = JSON.parse(item.images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const handleNewsClick = useCallback(
    (item: New) => {
      router.push(`/${item.slug}`);
    },
    [router]
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-50 mb-6">
            Tin tức & Sự kiện
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Các tin tức & sự kiện nổi bật của The Real IELTS
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <form className="flex gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Tìm kiếm tin tức..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </form>
        </div>

        {/* Grouped News */}
        {groupedNews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {debouncedSearchTerm
              ? `Không tìm thấy tin tức cho "${debouncedSearchTerm}"`
              : "Chưa có tin tức nào"}
          </div>
        ) : (
          groupedNews.map((group) => (
            <div key={group.title} className="mb-16">
              {/* Category Header + Link */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {group.title}
                </h3>
                <a
                  href={`/${slugify(group.title, { lower: true })}-page`}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                >
                  Xem tất cả
                </a>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.items.map((item) => {
                  const images = getImages(item);
                  const mainImage = images[0] || null;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                      onClick={() => handleNewsClick(item)}
                    >
                      {mainImage && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={mainImage}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h4 className="text-xl font-sans font-[600] text-[#03124E] mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                          {item.title}
                        </h4>
                        {item.description && (
                          <div className="text-gray-600 mb-4 line-clamp-3">
                            <div dangerouslySetInnerHTML={{__html: item.description}}/>
                          </div>
                        )}
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
