"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

type Section1 = {
  title: string;
  subTitle: string;
  buttonText: string;
};

type Props = {
  data: Section1;
  onChange: (newData: Section1) => void;
};

export default function HeroSectionEditor({
  data,
  onChange,
}: Props) {
  const [localData, setLocalData] = useState<Section1>(
    data || { title: "", subTitle: "", buttonText: "" }
  );
  const [showEditor, setShowEditor] = useState(false);

  console.log("DATAA: ", data)

  // Cập nhật local state khi prop thay đổi
  useEffect(() => {
    setLocalData(data || { title: "", subTitle: "", buttonText: "" });
   
  }, [data]);

  // Cập nhật field text
  const handleChange = (key: keyof Section1, value: string) => {
    const newData = { ...localData, [key]: value };
    setLocalData(newData);
    onChange(newData);
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-sm overflow-hidden">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/60">
        <h3 className="text-lg font-semibold text-gray-800">
          🎯 Hero Section - Kiểm Tra Trình Độ
        </h3>
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
      </div>

      {/* 🔸 Nội dung chỉnh sửa */}
      {showEditor && (
        <div className="py-10 px-4 md:px-10 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
            {/* 🟦 LEFT: Form chỉnh sửa */}
            <div className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tiêu đề chính
                </label>
                <Input
                  value={localData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Nhập tiêu đề chính..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phụ đề
                </label>
                <Textarea
                  value={localData.subTitle}
                  onChange={(e) => handleChange("subTitle", e.target.value)}
                  placeholder="Nhập nội dung phụ đề..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nút CTA (Button)
                </label>
                <Input
                  value={localData.buttonText}
                  onChange={(e) => handleChange("buttonText", e.target.value)}
                  placeholder="Nhập nội dung nút..."
                />
              </div>
            </div>

            {/* 🟨 RIGHT: Preview trực quan */}
            <div className="relative rounded-2xl overflow-hidden shadow-md bg-[#0F172A] text-white flex items-center justify-center px-6 py-12">
              <div className="relative text-center z-10 max-w-xl mx-auto space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  {localData.title || "Tiêu đề hero hiển thị ở đây"}
                </h2>
                <p className="text-gray-200 text-base md:text-lg">
                  {localData.subTitle ||
                    "Phụ đề mô tả ngắn về bài kiểm tra đầu vào."}
                </p>
                {localData.buttonText && (
                  <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                    {localData.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
