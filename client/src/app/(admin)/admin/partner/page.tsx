"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, Partner, PartnerSchema } from "@/types";
import { z } from "zod";
import { Globe, Handshake, Pencil, Trash2 } from "lucide-react";
import { confirmDelete } from "@/utils/confirmDelete";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination";

export default function PartnerManagerPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientHttp(ApiResponseSchema(PartnerSchema.array()), {
        method: "GET",
        path: "/partner",
        query: { page, limit },
      });
      if (Array.isArray(res.data) && res.total) {
        setPartners(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa đối tác?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      const res = await clientHttp(z.any(), {
        method: "DELETE",
        path: `/partner/delete/${id}`,
      });
      if (res.success) {
        toast.success("Xóa thành công");
        setPartners((prev) => prev.filter((p: Partner) => p?.id !== id));
        await fetchPartners();
      }
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ admin mới có quyền xóa!");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Partner Management</h1>
        <Link
          href="/admin/partner/create"
          className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2 rounded-xl font-medium shadow"
        >
          + Thêm Đối Tác
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : partners.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
            >
              <div className="relative h-44 w-full flex justify-center items-center">
                <img
                  src={partner.images?.[0] || "/placeholder.png"}
                  alt={partner.name}
                  className="h-44 w-44 object-cover object-center rounded-xl mb-2 transition-transform"
                />
              </div>
              <h2 className="text-lg font-sans font-[500] text-gray-800 mb-2 line-clamp-1">
                {partner.name}
              </h2>
              <p className="text-base text-gray-700 mb-2 flex items-center gap-2">
                <Handshake className="size-4" />{" "}
                <span className="">{partner.category || "Chưa phân loại"}</span>
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-5">
                <Globe className="w-4 h-4 text-green-500" /> Site hiển thị:{" "}
                {partner.forWeb}
              </p>

              <div className="mt-auto flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {partner.createdAt
                    ? new Date(partner.createdAt).toLocaleDateString()
                    : "V/I"}
                </span>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/partner/${partner.id}`}
                    className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(partner.id)}
                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Pagination
            currentPage={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No partners found.</p>
      )}
    </div>
  );
}
