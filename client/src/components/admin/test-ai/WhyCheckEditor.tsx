"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import TinySimpleEditor from "@/components/editor/TinySimpleEditor";

type ContentItem = {
  subTitle: string;
  description: string;
};

type Section2 = {
  title: string;
  content: ContentItem[];
  benefit: string;
};

type Props = {
  data: Section2;
  images: (File | string)[];
  onChange: (newData: Section2) => void;
  onImagesChange: (newImages: (File | string)[]) => void;
};

export default function WhyCheckEditor({
  data,
  images,
  onChange,
  onImagesChange,
}: Props) {
  const [localData, setLocalData] = useState<Section2>(data);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Cập nhật trường
  const handleFieldChange = (key: keyof Section2, value: any) => {
    const newData = { ...localData, [key]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const handleContentChange = (
    index: number,
    key: keyof ContentItem,
    value: string
  ) => {
    const updated = localData.content.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    handleFieldChange("content", updated);
  };

  const addContentItem = () => {
    handleFieldChange("content", [
  ...(Array.isArray(localData?.content) ? localData.content : []),
  { subTitle: "", description: "" },
]);
  };

  const removeContentItem = (index: number) => {
    const updated = localData.content.filter((_, i) => i !== index);
    handleFieldChange("content", updated);
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...(images || [])];
    if (file) newImages[index] = file;
    onImagesChange(newImages);
  };

  const mainImage1 = images?.[0];
  const mainImage2 = images?.[1];

  const iconClasses = [
    "bg-[#E6E8FC] text-[#20376C]",
    "bg-[#F3E8FF] text-[#7C3AED]",
    "bg-[#E0F2FE] text-[#0369A1]",
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="text-blue-600" size={18} />
          WhyCheck Section Editor
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

      {showEditor && (
        <div className="py-10 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-6">
            {/* LEFT: FORM */}
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              {/* Title */}
              <div>
                <label className="font-semibold text-gray-700 mb-2 block">
                  Tiêu đề chính
                </label>
                <Input
                  value={localData?.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="Nhập tiêu đề..."
                />
              </div>

              {/* Content List */}
              <div className="space-y-6">
                {localData?.content?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm relative hover:shadow-md transition-all duration-200"
                  >
                    <button
                      onClick={() => removeContentItem(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X size={18} />
                    </button>

                    <Input
                      value={item.subTitle}
                      onChange={(e) =>
                        handleContentChange(index, "subTitle", e.target.value)
                      }
                      placeholder="Tiêu đề phụ..."
                      className="mb-3"
                    />
                    <Textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) =>
                        handleContentChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Mô tả ngắn..."
                    />
                  </div>
                ))}

                <Button
                  onClick={addContentItem}
                  variant="outline"
                  className="flex items-center gap-2 self-start"
                >
                  <Plus size={18} /> Thêm mục nội dung
                </Button>
              </div>

              {/* Benefit */}
              <div>
                <label className="font-semibold text-gray-700 mb-2 block">
                  Nội dung mô tả cuối (benefit)
                </label>
                <TinySimpleEditor
                    initialValue={localData?.benefit}
          onContentChange={(content) => handleFieldChange('benefit', content)}
                />
               
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-3"
                  >
                    <label className="text-sm text-gray-600">Ảnh {i + 1}</label>
                    <div className="relative w-40 h-40 bg-gray-50 rounded-lg overflow-hidden">
                      {images?.[i] ? (
                        <Image
                          src={
                            typeof images[i] === "string"
                              ? (images[i] as string)
                              : URL.createObjectURL(images[i] as File)
                          }
                          alt={`Ảnh ${i + 1}`}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          Chưa có ảnh
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <Upload size={16} />
                      <span>Tải ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(i, e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: PREVIEW */}
            <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-inner px-6 py-8 border border-gray-100">
              <h2 className="text-center text-2xl font-bold text-[#20376C] mb-6">
                {localData?.title || "Tại sao phải kiểm tra đầu vào?"}
              </h2>

              <div className="flex flex-col gap-6">
                {localData?.content?.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-5 rounded-xl shadow-sm"
                  >
                    <div
                      className={`flex-shrink-0 p-4 rounded-full ${
                        iconClasses[i % 3]
                      } text-center flex items-center justify-center`}
                    >
                      <span className="font-bold text-lg">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-[#20376C]">
                        {item?.subTitle || "Tiêu đề phụ..."}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {item?.description || "Mô tả nội dung..."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-xl text-sm text-gray-700">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      localData?.benefit ||
                      "Nhập nội dung phần cuối (benefit)...",
                  }}
                />
              </div>

              {/* Image Preview */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {images?.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden"
                  >
                    {img ? (
                      <Image
                        src={
                          typeof img === "string"
                            ? img
                            : URL.createObjectURL(img)
                        }
                        alt={`preview ${i + 1}`}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center text-gray-400 h-full">
                        Ảnh {i + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
