"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDeBounce";
import { Category } from "@/types/category";
import CategoryDocs from "./CategoryDocs";
import { ChevronDown, Search, X } from "lucide-react";

type Props = {
  categories: Category[];
  urlWeb: string;
};

const DocumentView: React.FC<Props> = ({ categories, urlWeb }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1000);
  const [orderBy, setOrderBy] = useState("createdAt,DESC");

  const [visibleCats, setVisibleCats] = useState<Record<number, boolean>>({});

  const handleDocsFetched = (categoryId: number, hasDocs: boolean) => {
    setVisibleCats((prev) => ({ ...prev, [categoryId]: hasDocs }));
  };

  const hasAnyDocs = Object.values(visibleCats).some((v) => v === true);

  const sortOptions = [
    { label: "Ngày tạo (mới nhất)", value: "createdAt,DESC" },
    { label: "Ngày tạo (cũ nhất)", value: "createdAt,ASC" },
    { label: "Ngày cập nhật (mới nhất)", value: "updatedAt,DESC" },
    { label: "Ngày cập nhật (cũ nhất)", value: "updatedAt,ASC" },
  ];

  useEffect(() => {
    setOrderBy("createdAt,DESC");
    if (debouncedQuery === "") {
      setVisibleCats({});
    }
  }, [debouncedQuery]);

  const handleClear = () => setQuery("");

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl font-sans font-[700] text-center text-blue-900 mb-8 tracking-tight">
          Tài liệu IELTS miễn phí
        </h2>

        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 bg-white/80 backdrop-blur-sm border border-gray-200 p-4 rounded-2xl shadow-sm">
          {/* Search */}
          <div className="relative w-full sm:max-w-xl flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm tài liệu theo tiêu đề..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 bg-gray-50 
              focus:bg-white focus:border-[#333399] focus:ring-1 focus:ring-[#333399] outline-none transition-all text-gray-700 placeholder-gray-400"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-64">
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="w-full appearance-none cursor-pointer bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-xl 
              focus:border-[#333399] focus:ring-1 focus:ring-[#333399] px-4 py-2.5 pr-8 transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Category sections */}
        {categories.map((c) => {
          const shouldShow =
            (debouncedQuery === "" || visibleCats[c.id]) ?? true;
          return (
            shouldShow && (
              <CategoryDocs
                key={c.id}
                c={c}
                debouncedQuery={debouncedQuery}
                orderBy={orderBy}
                urlWeb={urlWeb}
                onDocsFetched={handleDocsFetched}
              />
            )
          );
        })}

        {!hasAnyDocs && (
          <div className="text-center text-gray-800 mt-12 text-lg italic animate-pulse">
            Không có bài viết liên quan, vui lòng tìm kiếm bài viết khác.
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentView;
