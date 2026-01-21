"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import { z } from "zod";
import { Lesson, LessonSchema } from "@/types/lesson";
import { toast } from "react-toastify";

export default function LessonManager() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientHttp(ApiResponseSchema(LessonSchema.array()), {
        method: "GET",
        path: "/lesson",
      });
      if (Array.isArray(res.data)) {
        setLessons(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa bài học này?")) return;
    try {
      await clientHttp(z.any(), {
        method: "DELETE",
        path: `/lesson/delete/${id}`,
      });
      fetchLessons();
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lesson Management</h1>
        <Link
          href="/admin/lesson/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Thêm Bài Học Mới
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="w-64 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Index
                </th>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course ID
                </th>
                <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.length ? (
                lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate">
                      {lesson.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate">
                      {lesson.description || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {lesson.order_index || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {lesson.commonId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {lesson.createdAt
                        ? new Date(lesson.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 flex space-x-2">
                      <Link
                        href={`/admin/lesson/edit?id=${lesson.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(lesson.id ?? 0)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-4 text-center text-sm text-gray-500"
                  >
                    No lessons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
