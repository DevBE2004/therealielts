"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import { Comment, CommentSchema } from "@/types/comment";
import { confirmDelete } from "@/utils/confirmDelete";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import Link from "next/link";
import { toast } from "react-toastify";
import { Edit, Plus, Trash2 } from "lucide-react";
import Pagination from "@/components/common/Pagination";

export default function FeedbackManagerPage() {
  const [feedbacks, setFeedbacks] = useState<Comment[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientHttp(ApiResponseSchema(CommentSchema), {
        path: "/comment",
        method: "GET",
        query: { page, limit },
      });
      console.log(res);
      if (res.success && Array.isArray(res?.data) && res.total) {
        setFeedbacks(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error("Fetch Feedback Fail: ", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa feedback?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      await clientHttp(z.any(), {
        path: `/comment/delete/${id}`,
        method: "DELETE",
      });
      toast.success("Xóa thành công");
      setFeedbacks((prev) =>
        prev ? prev.filter((c: Comment) => c?.id !== id) : []
      );
      await fetchFeedbacks();
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      console.error(err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Feedback</h1>
          <Link
            href="/admin/comment/create"
            className="bg-blue-600 hover:bg-blue-700 justify-center text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <Plus className="size-4 mr-2" />
            Tạo Feedback
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Feedback grid */}
        {!loading && feedbacks && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Card header with user info */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                      {feedback?.avatar ? (
                        <img
                          src={feedback.avatar}
                          alt={feedback.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium">
                          {feedback?.name
                            ? feedback.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {feedback?.name || "Ẩn danh"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Công việc hiện tại: {feedback?.job || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-700 line-clamp-4">
                    {feedback.content}
                  </p>
                </div>

                {/* Card footer with date and actions */}
                <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {formatDate(feedback.createdAt)}
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/comment/${feedback.id}`}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit className="size-[18px]" />
                    </Link>
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Xóa"
                    >
                      <Trash2 className="size-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && feedbacks && feedbacks.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có feedback nào
            </h3>
            <Link
              href="/admin/comment/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tạo Feedback
            </Link>
          </div>
        )}
        <Pagination
          currentPage={page}
          total={total} // API trả về
          limit={limit}
          onPageChange={setPage}
        />
      </div>

      <style jsx>{`
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
