// app/admin/study-abroad/page.tsx
"use client";

import Pagination from "@/components/common/Pagination";
import { useDebounce } from "@/hooks/useDeBounce";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, StudyAbroad, StudyAbroadSchema } from "@/types";
import { confirmDelete } from "@/utils/confirmDelete";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

export default function StudyAbroadManager() {
  const [studyAbroads, setStudyAbroads] = useState<StudyAbroad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(
    searchParams.get("sort") || "createdAt,DESC"
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const debouncedSearch = useDebounce(search, 500);

  const updateQueryParams = useCallback(
    (params: Record<string, string | number | undefined>) => {
      const query = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") query.set(key, String(value));
        else query.delete(key);
      });
      router.replace(`?${query.toString()}`);
    },
    [router, searchParams]
  );

  const sortOptions = [
    { label: "Ngày tạo (mới nhất)", value: "createdAt,DESC" },
    { label: "Ngày tạo (cũ nhất)", value: "createdAt,ASC" },
    { label: "Ngày cập nhật (mới nhất)", value: "updatedAt,DESC" },
    { label: "Ngày cập nhật (cũ nhất)", value: "updatedAt,ASC" },
  ];

  const fetchStudyAbroads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientHttp(
        ApiResponseSchema(StudyAbroadSchema.array()),
        {
          path: "/common",
          method: "GET",
          query: {
            page,
            limit,
            type: "STUDYABROAD",
            search: debouncedSearch || undefined,
            orderBy: sort,
          },
        }
      );
      if (Array.isArray(res.data) && res.total) {
        setStudyAbroads(res.data);
        setTotal(res.total);
      }
    } catch (error) {
      console.error("Failed to fetch study abroad: ", error);
      setError("Failed to fetch study abroad programs: ");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, sort]);

  useEffect(() => {
    fetchStudyAbroads();
  }, [fetchStudyAbroads]);

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa bài du học?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      await clientHttp(z.any(), {
        path: `/common/delete/${id}`,
        method: "DELETE",
      });
      setStudyAbroads((prev) => prev.filter((a) => a?.id !== id));
      await fetchStudyAbroads();
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ admin mới có quyền xóa!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Quản lý Du Học</h1>
        <Link
          href="/admin/study-abroad/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm"
        >
          + Thêm Chương Trình
        </Link>
      </div>

      {loading && <p className="text-center text-gray-500">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Search + Sort */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search input */}
        <input
          type="text"
          placeholder="Tìm kiếm tài liệu..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            setPage(1);
            updateQueryParams({ search: value || undefined, page: 1 });
          }}
          className="px-4 py-2 border rounded-lg flex-1"
        />

        {/* Sort button */}
        <select
          value={sort}
          onChange={(e) => {
            const newSort = e.target.value;
            setSort(newSort);
            setPage(1);
            updateQueryParams({ sort: newSort, page: 1 });
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-blue-400"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-600">
                Hình ảnh
              </th>
              <th className="p-3 text-left font-semibold text-gray-600">
                Tiêu đề
              </th>
              <th className="p-3 text-left font-semibold text-gray-600">
                Mô tả
              </th>
              <th className="p-3 text-left font-semibold text-gray-600">
                Ngày tạo
              </th>
              <th className="p-3 text-center font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {studyAbroads.length > 0 ? (
              studyAbroads.map((program) => (
                <tr key={program.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    {program.images.length > 0 ? (
                      <img
                        src={program.images[0]}
                        alt={program.title}
                        className="h-10 w-20 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-20 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3">{program.title}</td>
                  <td className="p-3">
                    <div
                      className="text-sm text-gray-600 line-clamp-3 mb-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          program.description ||
                          "<span class='italic text-gray-400'>Không có mô tả</span>",
                      }}
                    />
                  </td>
                  <td className="p-3 text-gray-500">
                    {program.updatedAt &&
                      new Date(program.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <Link
                      href={`/admin/study-abroad/${program.slug}`}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => {
                        if (program.id !== undefined) {
                          handleDelete(program.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Không có chương trình nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {studyAbroads.map((program: StudyAbroad) => (
          <div
            key={program.id}
            className="bg-white shadow rounded-lg p-4 flex gap-4"
          >
            {program.images.length > 0 ? (
              <img
                src={program.images[0]}
                className="h-16 w-24 rounded object-cover"
                alt={program.title}
              />
            ) : (
              <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">No image</span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium">{program.title}</h3>
              <div
                className="text-sm text-gray-600 line-clamp-3 mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    program.description ||
                    "<span class='italic text-gray-400'>Không có mô tả</span>",
                }}
              />
              <p className="text-xs text-gray-500">
                Ngày tạo:{" "}
                {program.createdAt &&
                  new Date(program.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-3 mt-2">
                <Link
                  href={`/admin/study-abroad/${program.slug}`}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => {
                    if (program.id) {
                      handleDelete(program.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
