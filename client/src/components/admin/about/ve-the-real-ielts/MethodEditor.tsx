"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import { splitSections } from "@/hooks/splitSections";
import { BookOpen, GraduationCap, Calendar, BookmarkCheck } from "lucide-react";

const methodIcons = [BookOpen, GraduationCap, Calendar];

type MethodSectionData = {
  titleLine1: string;
  titleLine2: string;
  description: string;
};

type Props = {
  data: MethodSectionData;
  images: (string | File)[];
  onChange: (newData: MethodSectionData) => void;
  onImagesChange: (newImages: (string | File)[]) => void;
};

export default function MethodEditor({ data, images, onChange, onImagesChange }: Props) {
  const [localData, setLocalData] = useState<MethodSectionData>({
    titleLine1: data?.titleLine1 || "",
    titleLine2: data?.titleLine2 || "",
    description: data?.description || "",
  });

  const [localImages, setLocalImages] = useState<(string | File)[]>(images || []);

  useEffect(() => {
    setLocalData({
      titleLine1: data?.titleLine1 || "",
      titleLine2: data?.titleLine2 || "",
      description: data?.description || "",
    });
  }, [data]);

  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  const updateData = (newData: MethodSectionData) => {
    setLocalData(newData);
    onChange(newData);
  };

  const handleChange = (key: keyof MethodSectionData, value: string) => {
    const newData = { ...localData, [key]: value };
    updateData(newData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const updated = [file];
    setLocalImages(updated);
    onImagesChange(updated);
  };

  const handleRemoveImage = () => {
    setLocalImages([]);
    onImagesChange([]);
  };

  const lines = splitSections(localData.description);
  const mainImage = localImages[0];
  const mainPreview =
    typeof mainImage === "string"
      ? mainImage
      : mainImage instanceof File
      ? URL.createObjectURL(mainImage)
      : "";

  return (
    <section className="w-full py-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 px-6">
        Section 5 — Phương pháp giảng dạy (Method Section)
      </h3>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-4">
        {/* 🟦 LEFT: Realtime editable form + preview */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <Input
            value={localData.titleLine1}
            onChange={(e) => handleChange("titleLine1", e.target.value)}
            placeholder="Dòng tiêu đề đầu tiên..."
          />
          <Input
            value={localData.titleLine2}
            onChange={(e) => handleChange("titleLine2", e.target.value)}
            placeholder="Dòng tiêu đề thứ hai..."
          />
          <Textarea
            value={localData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập nội dung mô tả (mỗi đoạn cách nhau bằng xuống dòng)..."
            rows={6}
          />

          {/* ✅ Ảnh chính */}
          <div className="relative w-full h-80 rounded-xl overflow-hidden bg-white border border-gray-200">
            {mainPreview ? (
              <>
                <Image
                  src={mainPreview}
                  alt="Ảnh chính Method"
                  fill
                  className="object-contain object-center"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <label className="bg-white/90 px-3 py-1 rounded shadow text-sm cursor-pointer hover:bg-blue-50">
                    Đổi ảnh
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-white/90 px-2 py-1 rounded shadow text-sm hover:bg-red-50 text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition">
                <UploadCloud className="w-8 h-8 text-gray-500" />
                <span className="text-gray-600 text-sm">Chọn ảnh chính</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        {/* 🟨 RIGHT: Live Preview giống client */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-inner">
          <h2 className="text-2xl font-bold text-gray-900 uppercase leading-snug mb-4">
            {localData.titleLine1}
            <br />
            <span className="text-blue-600">{localData.titleLine2}</span>
          </h2>

          <div className="space-y-5">
            {lines.map((html, index) => {
              const Icon =
                index < 3 && methodIcons[index] ? methodIcons[index] : BookmarkCheck;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <Icon className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                  <div
                    className="text-gray-800 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              );
            })}
          </div>

          {mainPreview && (
            <div className="relative w-full h-56 mt-6 rounded-lg overflow-hidden">
              <Image
                src={mainPreview}
                alt="Preview Method"
                fill
                className="object-contain object-center"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
