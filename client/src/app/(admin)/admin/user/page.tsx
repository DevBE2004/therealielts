"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, User, UserSchema } from "@/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { Mail, Phone, Briefcase, CalendarDays } from "lucide-react";
import { confirmDelete } from "@/utils/confirmDelete";
import Pagination from "@/components/common/Pagination";

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientHttp(ApiResponseSchema(UserSchema.array()), {
        path: "/user",
        method: "GET",
        query: { page, limit },
      });
      setUsers(Array.isArray(res.users) ? res.users.flat() : []);
      setTotal(res.total ? res.total : 0);
    } catch {
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa thông tin người dùng?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      const res = await clientHttp(z.any(), {
        path: `/user/delete-user-by-admin/${id}`,
        method: "DELETE",
      });
      if (res.success) {
        toast.success("Xóa người dùng thành công");
        setUsers((prev) => prev.filter((u: User) => u.id !== id));
        await fetchUsers();
      }
    } catch (err: any) {
      setError("Xóa người dùng thất bại");
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      console.error("Lỗi xóa người dùng: ", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Người Dùng</h1>
        <Link
          href="/admin/user/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Thêm Người Dùng
        </Link>
      </div>

      {loading && <p className="text-center text-gray-500">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Cards layout */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <img
                src={user.avatar || "/placeholder.png"}
                alt={user.name}
                className="w-20 h-20 object-cover rounded-full shadow mb-3"
              />

              {/* Name + Role */}
              <h3 className="text-base font-semibold text-gray-800">
                {user.name}
              </h3>
              <span
                className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.role === "ADMIN"
                    ? "bg-blue-100 text-blue-700"
                    : user.role === "EDITOR"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role}
              </span>

              {/* Extra info */}
              <div className="mt-3 text-sm text-gray-600 w-full space-y-1 text-left">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> {user.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> {user.mobile}
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />{" "}
                  {user.occupation || "Chưa cập nhật"}
                </p>
                <p className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays className="w-4 h-4 text-gray-400" />{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/admin/user/${user.id}`}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(user.id || 0)}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Không có người dùng nào.
          </p>
        )}
        <Pagination
          currentPage={page}
          total={total}
          limit={limit}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
