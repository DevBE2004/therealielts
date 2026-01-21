"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Plus } from "lucide-react";

type CurriculumItem = {
  imageIndex: number;
  alt: string;
  line1: string;
  line2: string;
};

type CurriculumSectionData = {
  items: CurriculumItem[];
};

type Props = {
  data: CurriculumSectionData;
  images: (string | File)[];
  onChange: (newData: CurriculumSectionData) => void;
  onImagesChange: (newImages: (string | File)[]) => void;
};

export default function CurriculumEditor({
  data,
  images,
  onChange,
  onImagesChange,
}: Props) {
  const [localData, setLocalData] = useState<CurriculumSectionData>({
    items: data?.items || [],
  });
  const [localImages, setLocalImages] = useState<(string | File)[]>(images || []);

  // Đồng bộ props -> local
  useEffect(() => {
    setLocalData({
      items: Array.isArray(data?.items) ? data.items : [],
    });
  }, [data]);

  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  const updateData = (newData: CurriculumSectionData) => {
    setLocalData(newData);
    onChange(newData);
  };

  // --- Upload ảnh ---
  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const updatedImages = [...localImages];
    updatedImages[index] = file;
    setLocalImages(updatedImages);
    onImagesChange(updatedImages);
  };

  // --- Xóa ảnh ---
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...localImages];
    updatedImages[index] = ""; // reset ảnh ở vị trí đó
    setLocalImages(updatedImages);
    onImagesChange(updatedImages);
  };

  // --- Thay đổi nội dung ---
  const handleItemChange = (index: number, key: keyof CurriculumItem, value: string) => {
    const updatedItems = [...localData.items];
    updatedItems[index] = { ...updatedItems[index], [key]: value };
    updateData({ ...localData, items: updatedItems });
  };

  // --- Thêm mục ---
  const handleAddItem = () => {
    const newIndex = localImages.length;
    const newItem: CurriculumItem = {
      imageIndex: newIndex,
      alt: "",
      line1: "",
      line2: "",
    };
    const updatedImages = [...localImages, ""]; // placeholder ảnh
    setLocalImages(updatedImages);
    onImagesChange(updatedImages);
    updateData({ ...localData, items: [...(localData?.items || []), newItem] });
  };

  // --- Xóa mục ---
  const handleRemoveItem = (index: number) => {
    const updatedItems = localData.items.filter((_, i) => i !== index);
    updateData({ ...localData, items: updatedItems });
  };

  return (
    <section className="w-full py-8 bg-gray-50 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 px-6">
        Section 4 — Giáo trình học (Curriculum Section)
      </h3>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-4">
        {/* ✅ Ảnh chính */}
        <div className="w-full lg:w-1/2 p-4">
          <div className="relative w-full h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-md">
            {localImages?.[0] ? (
              <>
                <Image
                  src={
                    typeof localImages[0] === "string"
                      ? localImages[0]
                      : URL.createObjectURL(localImages[0])
                  }
                  alt="Ảnh chính Curriculum"
                  fill
                  className="object-cover object-center"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(0)}
                  className="absolute top-3 right-3 bg-white/90 rounded-full p-1 shadow text-gray-600 hover:text-red-600"
                >
                  <X size={18} />
                </button>
                <label className="absolute bottom-3 left-3 bg-white/90 text-xs px-3 py-1 rounded shadow cursor-pointer">
                  Đổi ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(0, e)}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 cursor-pointer transition">
                <UploadCloud className="w-8 h-8 text-gray-500" />
                <span className="text-gray-600 text-sm">Chọn ảnh chính</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(0, e)}
                />
              </label>
            )}
          </div>
        </div>

        {/* ✅ Các mục con */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {localData?.items?.map((item, index) => {
            const imgSrc = localImages[item.imageIndex];
            const previewUrl =
              typeof imgSrc === "string"
                ? imgSrc
                : imgSrc instanceof File
                ? URL.createObjectURL(imgSrc)
                : "";

            return (
              <div
                key={index}
                className="relative bg-white rounded-xl px-3 py-6 shadow-md border border-gray-100 flex flex-col items-center"
              >
                {/* Nút xóa */}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                >
                  <X size={18} />
                </button>

                {/* Ảnh */}
                <div className="relative w-full h-36 mb-4 overflow-hidden rounded-lg border border-gray-200">
                  {previewUrl ? (
                    <>
                      <Image
                        src={previewUrl}
                        alt={item.alt}
                        fill
                        className="object-contain object-center"
                      />
                      <label className="absolute bottom-2 right-2 bg-white/80 text-xs px-2 py-1 rounded shadow cursor-pointer">
                        Đổi ảnh
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(item.imageIndex, e)}
                          className="hidden"
                        />
                      </label>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 p-4 rounded-lg cursor-pointer transition w-full h-full">
                      <UploadCloud className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-600 text-sm">Thêm ảnh #{index + 1}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(item.imageIndex, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Texts */}
                <div className="space-y-2 w-full">
                  <Input
                    value={item.line1}
                    onChange={(e) => handleItemChange(index, "line1", e.target.value)}
                    placeholder="Dòng đầu tiên..."
                  />
                  <Input
                    value={item.line2}
                    onChange={(e) => handleItemChange(index, "line2", e.target.value)}
                    placeholder="Dòng thứ hai..."
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ➕ Nút thêm mới */}
      <div className="flex justify-center mt-10">
        <Button
          onClick={handleAddItem}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 flex items-center gap-2"
        >
          <Plus size={18} /> Thêm mục mới
        </Button>
      </div>
    </section>
  );
}
