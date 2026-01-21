"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, PlusCircle } from "lucide-react";

type CoreValue = {
  title: string;
  description: string; // nhiều dòng
};

type CoreValueSection = {
  items: CoreValue[];
};

type Props = {
  data: CoreValueSection;
  images: (string | File)[];
  onChange: (newData: CoreValueSection) => void;
  onImagesChange: (newImages: (string | File)[]) => void;
};

export default function CoreValueEditor({
  data,
  images,
  onChange,
  onImagesChange,
}: Props) {
  const [localValues, setLocalValues] = useState<CoreValue[]>(data?.items || []);
  const [localImages, setLocalImages] = useState<(string | File)[]>(images || []);

  // 🔄 Đồng bộ dữ liệu từ props
  useEffect(() => {
    if (Array.isArray(data?.items)) setLocalValues(data.items);
  }, [data]);

  useEffect(() => {
    if (Array.isArray(images)) setLocalImages(images);
  }, [images]);

  // ✏️ Cập nhật nội dung
  const handleValueChange = (index: number, key: keyof CoreValue, value: string) => {
    setLocalValues((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      onChange({ items: updated });
      return updated;
    });
  };

  // 📤 Upload ảnh
  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalImages((prev) => {
      const updated = [...prev];
      updated[index] = file;
      onImagesChange(updated);
      return updated;
    });
  };

  // ❌ Xóa ảnh
  const handleRemoveImage = (index: number) => {
    setLocalImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onImagesChange(updated);
      return updated;
    });
  };

  // ➕ Thêm mục mới
  const handleAddValue = () => {
    const newValues = [...localValues, { title: "", description: "" }];
    const newImages = [...localImages, ""];
    setLocalValues(newValues);
    setLocalImages(newImages);
    onChange({ items: newValues });
    onImagesChange(newImages);
  };

  // 🗑️ Xóa mục
  const handleRemoveValue = (index: number) => {
    const updatedValues = localValues.filter((_, i) => i !== index);
    const updatedImages = localImages.filter((_, i) => i !== index);
    setLocalValues(updatedValues);
    setLocalImages(updatedImages);
    onChange({ items: updatedValues });
    onImagesChange(updatedImages);
  };

  // 🧩 UI
  return (
    <section className="bg-white rounded-xl shadow p-6 space-y-8">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-xl font-semibold text-gray-800">
          Section 3 — Giá trị cốt lõi (Core Values)
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddValue}
          className="flex items-center gap-1"
        >
          <PlusCircle className="w-4 h-4" />
          Thêm mục
        </Button>
      </div>

      {localValues.length === 0 && (
        <p className="text-gray-500 italic text-center py-4">
          Chưa có mục nào. Nhấn “Thêm mục”.
        </p>
      )}

      <div className="space-y-6">
        {localValues.map((item, index) => {
          const previewUrl =
            typeof localImages[index] === "string"
              ? (localImages[index] as string)
              : localImages[index] instanceof File
              ? URL.createObjectURL(localImages[index] as File)
              : "";

          return (
            <div
              key={index}
              className="relative border rounded-lg bg-gray-50 p-5 space-y-4 shadow-sm hover:shadow-md transition"
            >
              <button
                onClick={() => handleRemoveValue(index)}
                className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-1 text-gray-600 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Ảnh minh họa */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Ảnh minh họa #{index + 1}
                </label>
                {previewUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={previewUrl}
                      alt={`core-${index}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <label className="bg-white/90 px-3 py-1 rounded shadow text-sm cursor-pointer hover:bg-blue-50">
                        Đổi ảnh
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="bg-white/90 px-2 py-1 rounded shadow text-sm hover:bg-red-50 text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-blue-400 transition">
                    <UploadCloud className="h-7 w-7 text-gray-500" />
                    <span className="text-gray-600 text-sm">Nhấn để chọn ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Tiêu đề */}
              <Input
                value={item.title}
                onChange={(e) => handleValueChange(index, "title", e.target.value)}
                placeholder="Nhập tiêu đề..."
              />

              {/* Mô tả (textarea, mỗi dòng là một mô tả) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Mô tả (mỗi dòng là một ý riêng)
                </label>
                <textarea
                  rows={4}
                  value={item.description}
                  onChange={(e) =>
                    handleValueChange(index, "description", e.target.value)
                  }
                  placeholder="Nhập mô tả, mỗi ý xuống dòng..."
                  className="w-full border rounded-lg p-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
