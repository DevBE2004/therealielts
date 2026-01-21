"use client";

import { StudyAbroad } from "@/types";
import Image from "next/image";
import { Clock, ArrowRight, Search, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";
import { useDebounce } from "@/hooks/useDeBounce";
import { toLowerNonAccent } from "@/hooks/toLowerNonAccent";

// export const dynamic = "force-dynamic";

export default function StudyAbroadPage() {
  const [studyAbroads, setStudyAbroads] = useState<StudyAbroad[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(12);
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt,DESC");
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchStudyAbroads = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          type: "STUDYABROAD",
          limit: limit.toString(),
          page: page.toString(),
          search: toLowerNonAccent(debouncedQuery) || "",
          orderBy: orderBy || "createdAt,DESC",
          tag: "study-abroad",
        });

        const res: { data: StudyAbroad[]; total?: number; success: boolean } =
          await fetch(
            `https://therealielts.vn/api/common?${params.toString()}`,
            {
              cache: "no-store",
            }
          ).then((r) => r.json());
        // console.log("STUDY ABROADS: ", res);

        if (res.success) {
          setTotal(res?.total || 0);
          setStudyAbroads(res.data);
        }
      } catch (error) {
        console.log("STUDY ABROADS: ");
        console.error("Fetch study-abroad fail: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyAbroads();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [page, debouncedQuery, orderBy, limit]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const sortOptions = [
    { label: "Ngày tạo (mới nhất)", value: "createdAt,DESC" },
    { label: "Ngày tạo (cũ nhất)", value: "createdAt,ASC" },
    { label: "Ngày cập nhật (mới nhất)", value: "updatedAt,DESC" },
    { label: "Ngày cập nhật (cũ nhất)", value: "updatedAt,ASC" },
  ];

  const handleClear = () => setQuery("");

  // const studyAbroads = await CommonService.getAll(StudyAbroadSchema, {
  //   query: { isActive: true, type: "STUDYABROAD", limit: 9999 },
  //   revalidate: 600,
  //   tags: ["study-abroad"],
  // });
  // const data: StudyAbroad[] = Array.isArray(res.data)
  //   ? res.data
  //   : [];

  return (
    <section className="container w-full max-w-6xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-[#20376C] leading-tight tracking-tight">
          Khám Phá Các Cơ Hội Du Học
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          Tìm hiểu các chương trình du học uy tín, cập nhật thông tin mới nhất
          và chọn hành trình phù hợp cho bạn.
        </p>
      </header>

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

      {/* List */}
      <div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {studyAbroads.map((article: StudyAbroad) => (
            <li key={article.id}>
              <article className="group relative bg-white shadow-md rounded-2xl overflow-hidden transition-all">
                {/* Thumbnail */}
                <div className="relative h-52 w-full p-3">
                  <Link
                    href={`/${article.slug}`}
                    className="w-full h-full cursor-pointer rounded-xl overflow-hidden"
                  >
                    <Image
                      src={
                        article.images?.[0] ??
                        "https://via.placeholder.com/400x200"
                      }
                      alt={article.title}
                      fill
                      className="object-cover transition-transform"
                    />
                  </Link>
                </div>

                {/* Content */}
                <div className="px-6 pb-5 pt-3">
                  <Link href={`/${article.slug}`}>
                    <h2 className="text-lg font-[500] text-[#c36] hover:text-blue-700 cursor-pointer mb-3 line-clamp-2">
                      {article.title}
                    </h2>
                  </Link>

                  <div
                    dangerouslySetInnerHTML={{ __html: article.description }}
                    className="text-gray-600 text-sm md:text-base mb-4 line-clamp-4 leading-relaxed prose"
                  />

                  {/* Meta */}
                  <div className="flex flex-col text-sm text-gray-500 mb-5">
                    <div className="flex items-center gap-2">
                      <Clock size={16} /> Updated:
                      {article.updatedAt !== undefined ? (
                        <time
                          dateTime={new Date(
                            article.updatedAt
                          ).toLocaleDateString("vi-VN")}
                        >
                          {new Date(article.updatedAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </time>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/${article.slug}`}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Đọc thêm <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <Pagination
        currentPage={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
    </section>
  );
}
