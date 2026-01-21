"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Upload, X, Eye } from "lucide-react";
import HeroSection from "@/components/about/ve-the-real-ielts/HeroSection";

type HeroSectionData = {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  tag: string;
};

interface HeroSectionEditorProps {
  data?: HeroSectionData;
  images?: (string | File)[];
  onChange: (newData: HeroSectionData) => void;
  onImagesChange: (newImages: (string | File)[]) => void;
}

export default function HeroSectionEditor({
  data,
  images = [],
  onChange,
  onImagesChange,
}: HeroSectionEditorProps) {
  const [localData, setLocalData] = useState<HeroSectionData>({
    title: data?.title || "",
    subtitle: data?.subtitle || "",
    description: data?.description || "",
    buttonText: data?.buttonText || "",
    tag: data?.tag || "",
  });

  const [localImages, setLocalImages] = useState<(string | File)[]>(images);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // --- Đồng bộ khi props thay đổi (load từ API) ---
  useEffect(() => {
    if (data) setLocalData(data);
    if (images) setLocalImages(images);
  }, [data, images]);

  // --- Cập nhật text ---
  const handleChange = (key: keyof HeroSectionData, value: string) => {
    setLocalData((prev) => {
      const newData = { ...prev, [key]: value };
      onChange(newData);
      return newData;
    });
  };

  // --- Upload ảnh ---
  const handleImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newImages = [...localImages];
    newImages[index] = file;
    setLocalImages(newImages);
    onImagesChange(newImages);
    e.target.value = "";
  };

  // --- Xóa ảnh ---
  const handleRemoveImage = (index: number) => {
    const newImages = [...localImages];
    newImages[index] = "";
    setLocalImages(newImages);
    onImagesChange(newImages.filter(Boolean));
  };

  // --- Dọn URL khi đóng preview ---
  useEffect(() => {
    if (!isPreviewOpen) return;

    const urls: string[] = localImages.map((img) =>
      typeof img === "string"
        ? img
        : img instanceof File
        ? URL.createObjectURL(img)
        : ""
    );
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [isPreviewOpen, localImages]);

  // --- Render upload card ---
  const renderImageCard = (label: string, index: number) => {
    const img = localImages[index];
    const previewUrl =
      typeof img === "string"
        ? img
        : img instanceof File
        ? URL.createObjectURL(img)
        : "";

    return (
      <div>
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          {label}
        </label>
        <div className="relative border border-gray-200 rounded-lg overflow-hidden group">
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt={label}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                type="button"
                className="absolute top-2 right-2 bg-white/90 rounded-full p-1 text-gray-600 hover:text-red-600 shadow transition"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-50 text-gray-400">
              Chưa có ảnh
            </div>
          )}
          <label className="absolute bottom-2 right-2 bg-white rounded-md px-3 py-1 shadow cursor-pointer hover:bg-gray-100 flex items-center gap-2 text-sm font-medium transition">
            <Upload className="w-4 h-4" /> Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(index, e)}
            />
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6 border border-gray-100 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          🎯 Hero Section
        </h2>

        <button
          type="button"
          onClick={() => setIsPreviewOpen((v) => !v)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-1.5 rounded-md shadow hover:opacity-90 transition"
        >
          <Eye className="w-4 h-4" />
          {isPreviewOpen ? "Ẩn xem trước" : "Xem trước"}
        </button>
      </div>

      {/* --- Form Fields --- */}
      <div className={`${isPreviewOpen ? "hidden" : "grid sm:grid-cols-2 gap-4"}`}>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Tiêu đề chính
          </label>
          <Input
            value={localData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="VD: IELTS 8.0+"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Tiêu đề phụ
          </label>
          <Input
            value={localData.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="VD: The Real IELTS"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Mô tả ngắn
          </label>
          <Textarea
            rows={3}
            value={localData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="VD: Đơn vị đào tạo, luyện thi IELTS uy tín..."
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Nút CTA
          </label>
          <Input
            value={localData.buttonText}
            onChange={(e) => handleChange("buttonText", e.target.value)}
            placeholder="VD: Đăng ký học thử ngay!"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Tag hiển thị
          </label>
          <Input
            value={localData.tag}
            onChange={(e) => handleChange("tag", e.target.value)}
            placeholder="VD: Đội ngũ giảng viên chất lượng"
          />
        </div>
      </div>

      {/* --- Upload ảnh --- */}
      {!isPreviewOpen && (
        <div className="grid sm:grid-cols-2 gap-6 pt-4">
          {renderImageCard("Ảnh nền (Background)", 0)}
          {renderImageCard("Ảnh chính (Main Image)", 1)}
        </div>
      )}

      {/* --- Preview Section --- */}
      {isPreviewOpen && (
        <div className="mt-4 border-t pt-6">
          <HeroSection section1={localData} images1={previewUrls} />
        </div>
      )}
    </div>
  );
}
