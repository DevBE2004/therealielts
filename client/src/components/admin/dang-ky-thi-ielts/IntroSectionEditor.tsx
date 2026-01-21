"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Upload, X, Eye, ChevronDown, ChevronUp } from "lucide-react";
import HeroSection from "@/components/about/phuong-phap-LCLT/HeroSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditor } from "@/components/editor";
import IntroSectionTest from "@/components/dang-ky-thi-ielts/test";

type IntroSectionData = {
  title: string;
  address: string;
  content: string;
  urlYoutube: string;
};

interface HeroSectionEditorProps {
  data?: IntroSectionData;
  images?: (string | File)[];
  onChange: (newData: IntroSectionData) => void;
  onImagesChange: (newImages: (string | File)[]) => void;
}

export default function IntroSectionEditor({
  data,
  images = [],
  onChange,
  onImagesChange,
}: HeroSectionEditorProps) {
  const [localData, setLocalData] = useState<IntroSectionData>({
    title: data?.title || "",
    address: data?.address || "",
    content: data?.content || "",
    urlYoutube: data?.urlYoutube || "",
  });

  const [localImages, setLocalImages] = useState<(string | File)[]>(images);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Đồng bộ khi props thay đổi
  useEffect(() => {
    if (data) setLocalData(data);
  }, [data, images]);

  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  // Cập nhật text
  const handleChange = (key: keyof IntroSectionData, value: string) => {
    setLocalData((prev) => {
      const newData = { ...prev, [key]: value };
      onChange(newData);
      return newData;
    });
  };

  // Upload ảnh
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

  // Xoá ảnh
  const handleRemoveImage = (index: number) => {
    const newImages = [...localImages];
    newImages[index] = "";
    setLocalImages(newImages);
    onImagesChange(newImages.filter(Boolean));
  };

  // Tạo preview URL
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

  // Render 1 card upload ảnh
  const renderImageCard = (label: string, index: number) => {
    const img = localImages?.[index];
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
                width={800}
                height={450}
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
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Chỉnh sửa nội dung phần mở đầu
        </h2>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditor(!showEditor)}
            className="flex items-center gap-2"
          >
            {showEditor ? (
              <>
                Ẩn chỉnh sửa <ChevronUp size={16} />
              </>
            ) : (
              <>
                Hiện chỉnh sửa <ChevronDown size={16} />
              </>
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsPreviewOpen((v) => !v)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
          >
            <Eye className="w-4 h-4" />
            {isPreviewOpen ? "Ẩn xem trước" : "Xem trước"}
          </Button>
        </div>
      </div>

      {/* 🔸 Nội dung ẩn/hiện */}
      {showEditor && (
        <div className="p-6 space-y-6 transition-all duration-300 ease-in-out">
          {!isPreviewOpen && (
            <>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Tiêu đề chính
                  </label>
                  <Input
                    value={localData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="VD: Đăng ký thi IELTS tại IDP"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Địa chỉ
                  </label>
                  <Textarea
                    value={localData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                <div>
                  <TinyEditor
                    // key={data?.content}
                    initialValue={data?.content || ""}
                    onContentChange={(htmlContent) =>
                      handleChange("content", htmlContent)
                    }
                    height={400}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Youtube URL
                  </label>
                  <Input
                    type="text"
                    value={localData.urlYoutube}
                    onChange={(e) => handleChange("urlYoutube", e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: https://www.youtube.com/watch?v=abc123xyz00"
                  />
                </div>
              </div>

              {/* --- Upload ảnh --- */}
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                {renderImageCard("Ảnh 1", 0)}
                {renderImageCard("Ảnh 2", 1)}
              </div>
            </>
          )}

          {/* --- Preview --- */}
          {isPreviewOpen && (
            <div className="mt-6 border-t pt-6">
              <IntroSectionTest
                section2Record6={localData}
                images2Record6={previewUrls}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
