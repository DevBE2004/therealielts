"use client";

import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCategory,
  CreateCategorySchema,
  Category,
  CategorySchema,
} from "@/types/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import { z } from "zod";
import { confirmDelete } from "@/utils/confirmDelete";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination";
import slugify from "slugify";

type FormMode = "library" | "news" | "press" | "study"; // 🟢 thêm mode du học

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<FormMode>("news");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateCategory>({
    resolver: zodResolver(CreateCategorySchema),
  });

  const fetchCategories = useCallback(async () => {
    const res = await clientHttp(ApiResponseSchema(z.array(CategorySchema)), {
      path: "/category",
      method: "GET",
      query: {
        page,
        limit,
        search: search || undefined,
      },
    });
    if (res.success && Array.isArray(res.data) && res.total) {
      setCategories(res.data.filter((c) => c.group?.name !== "khóa học"));
      setTotal(res.total);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 🟢 Submit (create / update)
  const onSubmit = async (data: CreateCategory) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      // Gán group tương ứng theo mode
      if (mode === "press") {
        formData.append("group", JSON.stringify({ name: "báo chí" }));
      } else if (mode === "library") {
        if (data.group?.name) {
          formData.append("group", JSON.stringify({ name: data.group.name }));
        }
      } else if (mode === "news") {
        formData.append("group", JSON.stringify({ name: "tin tức" }));
      } else if (mode === "study") {
        formData.append(
          "group",
          JSON.stringify({
            name: "du học",
            slug: slugify(data.name, { lower: true, locale: "vi" }),
          })
        );
      }

      if (data.icon instanceof File) {
        formData.append("icon", data.icon);
      }

      let res;
      if (editing) {
        res = await clientHttp(ApiResponseSchema(CategorySchema), {
          method: "PUT",
          path: `/category/update/${editing.id}`,
          body: formData,
        });
      } else {
        res = await clientHttp(ApiResponseSchema(CategorySchema), {
          method: "POST",
          path: "/category/create",
          body: formData,
        });
      }

      if (res.success) {
        await fetchCategories();
        toast.success(
          editing ? "Cập nhật thành công" : "Tạo phân loại thành công"
        );
        setEditing(null);
        setPreview(null);
        reset();
      }
    } catch (err: any) {
      toast.warning(err.message?.mes || "Lỗi xử lý category");
      console.error("❌ Lỗi khi xử lý category:", err);
    }
  };

  // 🟡 Edit
  const onEdit = (cat: Category) => {
    setEditing(cat);

    if (cat.group?.name === "báo chí") setMode("press");
    else if (cat.group?.name === "du học")
      setMode("study"); // 🟢 nhận diện mode du học khi edit
    else if (cat.group && cat.icon) setMode("library");
    else setMode("news");

    reset({
      name: cat.name,
      group: cat.group ? { name: cat.group.name } : undefined,
    });
    setPreview(cat.icon ?? null);
  };

  // Delete
  const onDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      const res = await clientHttp(ApiResponseSchema(z.any()), {
        method: "DELETE",
        path: `/category/delete/${id}`,
      });
      if (res.success) {
        await fetchCategories();
        toast.success("Xóa phân loại thành công");
      }
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý Phân Loại</h1>

      {/* Toggle chọn loại */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === "library" ? "default" : "outline"}
          onClick={() => {
            setMode("library");
            reset();
            setEditing(null);
            setPreview(null);
          }}
        >
          Bài viết thư viện
        </Button>

        <Button
          variant={mode === "news" ? "default" : "outline"}
          onClick={() => {
            setMode("news");
            reset();
            setEditing(null);
            setPreview(null);
          }}
        >
          Bài viết tin tức
        </Button>

        <Button
          variant={mode === "press" ? "default" : "outline"}
          onClick={() => {
            setMode("press");
            reset();
            setEditing(null);
            setPreview(null);
          }}
        >
          Tin tức báo chí
        </Button>

        {/* 🟢 Thêm nút Du học */}
        <Button
          variant={mode === "study" ? "default" : "outline"}
          onClick={() => {
            setMode("study");
            reset();
            setEditing(null);
            setPreview(null);
          }}
        >
          Bài viết du học
        </Button>
      </div>

      {/* Form create/update */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border p-4 rounded-lg"
      >
        <Input placeholder="Tên category" {...register("name")} />

        {mode === "library" && (
          <>
            <Input placeholder="Tên nhóm" {...register("group.name")} />

            <div className="space-y-2">
              <label className="block text-sm font-medium">Icon</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="file"
                      accept="image/*"
                      id="icon"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                        if (file) setPreview(URL.createObjectURL(file));
                        else setPreview(null);
                      }}
                    />
                  )}
                />
                <label
                  htmlFor="icon"
                  className="block text-gray-500 cursor-pointer"
                >
                  Nhấn để chọn ảnh làm icon
                </label>
              </div>

              {preview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <img
                    src={preview}
                    alt="preview"
                    className="h-20 w-20 object-contain border rounded-md"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <Button type="submit">
          {editing ? "Cập nhật category" : "Tạo category"}
        </Button>
      </form>

      {/* Danh sách category */}
      <div>
        <div className="flex items-center justify-between px-5">
          <h2 className="text-lg font-semibold">Danh sách Phân Loại</h2>
          <div className="items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm phân loại..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="px-4 py-2 border border-gray-700 rounded-lg"
            />
          </div>
        </div>

        <table className="w-full border mt-2">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Tên</th>
              <th className="p-2">Nhóm</th>
              <th className="p-2">Icon</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.group?.name}</td>
                <td className="p-2">
                  {c.icon && <img src={c.icon} alt="" className="h-6" />}
                </td>
                <td className="p-2 flex gap-2">
                  <Button size="sm" onClick={() => onEdit(c)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(c.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full items-center justify-center">
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
