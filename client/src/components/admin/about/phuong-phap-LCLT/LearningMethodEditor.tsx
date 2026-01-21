"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  X,
  Plus,
  Eye,
  Check,
  PencilLine,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import TinySimpleEditor from "@/components/editor/TinySimpleEditor";

type Content = {
  imageIndex: number;
  description: string;
};

type LearningMethod = {
  title: string;
  subtitle: string;
  description: string;
  content: Content[];
};

type LearningMethodSection = {
  items: LearningMethod[];
};

type Props = {
  data: LearningMethodSection;
  images: (string | File)[];
  onChange: (newData: LearningMethodSection) => void;
  onImagesChange: (newImages: (string | File)[]) => void;
};

export default function LearningMethodEditor({
  data,
  images,
  onChange,
  onImagesChange,
}: Props) {
  const [localData, setLocalData] = useState<LearningMethodSection>({
    items: data?.items || [],
  });
  const [localImages, setLocalImages] = useState<(string | File)[]>(
    images || []
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(true); // 🟢 Ẩn/hiện form chỉnh sửa

  useEffect(() => {
    setLocalData({ items: Array.isArray(data?.items) ? data.items : [] });
  }, [data]);

  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  const updateData = (newData: LearningMethodSection) => {
    setLocalData(newData);
    onChange(newData);
  };

  // --- Upload ảnh ---
  const handleImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const updatedImages = [...localImages];
    updatedImages[index] = file;
    setLocalImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...localImages];
    updatedImages[index] = "";
    setLocalImages(updatedImages);
    onImagesChange(updatedImages);
  };

  // --- Thay đổi content ---
  const handleContentChange = (
    methodIndex: number,
    contentIndex: number,
    value: string
  ) => {
    const updatedItems = [...localData.items];
    updatedItems[methodIndex].content[contentIndex].description = value;
    updateData({ ...localData, items: updatedItems });
  };

  const handleAddContent = (methodIndex: number) => {
    const newIndex = localImages.length;
    const newContent: Content = { imageIndex: newIndex, description: "" };
    const updatedItems = [...localData.items];
    updatedItems[methodIndex].content.push(newContent);
    updateData({ ...localData, items: updatedItems });

    const updatedImages = [...localImages, ""];
    setLocalImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleRemoveContent = (methodIndex: number, contentIndex: number) => {
    const updatedItems = [...localData.items];
    updatedItems[methodIndex].content.splice(contentIndex, 1);
    updateData({ ...localData, items: updatedItems });
  };

  // --- Thay đổi tab ---
  const handleTabChange = (
    index: number,
    key: "title" | "subtitle" | "description",
    value: string
  ) => {
    const updatedItems = [...localData.items];
    updatedItems[index][key] = value;
    updateData({ ...localData, items: updatedItems });
  };

  // --- Thêm / xóa tab ---
  const handleAddTab = () => {
    const updatedItems = [
      ...localData.items,
      { title: "", subtitle: "", description: "", content: [] },
    ];
    updateData({ ...localData, items: updatedItems });
  };

  const handleRemoveTab = (index: number) => {
    const updatedItems = localData.items.filter((_, i) => i !== index);
    updateData({ ...localData, items: updatedItems });
  };

  return (
    <section className="w-full py-8 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center px-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          🎓 Learning Method Editor
        </h3>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsEditOpen(!isEditOpen)}
            className="flex items-center gap-2"
          >
            {isEditOpen ? (
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
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye size={16} /> {previewMode ? "Ẩn Preview" : "Xem Preview"}
          </Button>

          {!previewMode && (
            <Button onClick={handleAddTab} className="flex items-center gap-2">
              <Plus size={16} /> Thêm Tab
            </Button>
          )}
        </div>
      </div>

      {/* 🟢 Form chỉnh sửa */}
      {isEditOpen && !previewMode && (
        <>
          {localData.items.map((method, methodIndex) => (
            <div
              key={methodIndex}
              className="mb-10 px-6 py-4 bg-white rounded-xl shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">
                  Tab #{methodIndex + 1}
                </h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveTab(methodIndex)}
                >
                  Xóa Tab
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  value={method.title}
                  placeholder="Tiêu đề tab"
                  onChange={(e) =>
                    handleTabChange(methodIndex, "title", e.target.value)
                  }
                />
                <Input
                  value={method.subtitle}
                  placeholder="Tiêu đề phụ"
                  onChange={(e) =>
                    handleTabChange(methodIndex, "subtitle", e.target.value)
                  }
                />
                <Input
                  value={method.description}
                  placeholder="Mô tả"
                  onChange={(e) =>
                    handleTabChange(methodIndex, "description", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {method.content.map((contentItem, contentIndex) => {
                  const imgSrc = localImages[contentItem.imageIndex];
                  const previewUrl =
                    typeof imgSrc === "string"
                      ? imgSrc
                      : imgSrc instanceof File
                      ? URL.createObjectURL(imgSrc)
                      : "";

                  return (
                    <div
                      key={contentIndex}
                      className="relative bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveContent(methodIndex, contentIndex)
                        }
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        <X size={18} />
                      </button>

                      <div className="relative w-full h-36 mb-4 overflow-hidden rounded-lg border border-gray-300">
                        {previewUrl ? (
                          <>
                            <Image
                              src={previewUrl}
                              alt={`Content Image`}
                              fill
                              className="object-contain"
                            />
                            <label className="absolute bottom-2 right-2 bg-white/80 text-xs px-2 py-1 rounded shadow cursor-pointer">
                              Đổi ảnh
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleImageUpload(contentItem.imageIndex, e)
                                }
                                className="hidden"
                              />
                            </label>
                          </>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 p-4 rounded-lg cursor-pointer w-full h-full">
                            <UploadCloud className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-600 text-sm">
                              Chọn ảnh
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(contentItem.imageIndex, e)
                              }
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      <TinySimpleEditor
                        initialValue={contentItem.description}
                        height={200}
                        onContentChange={(val) =>
                          handleContentChange(methodIndex, contentIndex, val)
                        }
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <Button
                  onClick={() => handleAddContent(methodIndex)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} /> Thêm Content
                </Button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* 🟣 Preview Mode */}
      {previewMode && (
        <div className="bg-white rounded-xl shadow-sm px-6 py-10">
          {localData.items.map((method, idx) => (
            <div key={idx} className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  {method.subtitle}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {method.description}
                </p>
              </div>

              {method.content.map((c, i) => {
                const imgSrc = localImages[c.imageIndex];
                const previewUrl =
                  typeof imgSrc === "string"
                    ? imgSrc
                    : imgSrc instanceof File
                    ? URL.createObjectURL(imgSrc)
                    : "";

                const reverse = i % 2 !== 0;
                const descriptionItems = c.description
                  ? c.description
                      .split("<p>")
                      .filter(Boolean)
                      .map((s) => s.replace("</p>", ""))
                  : [];

                return (
                  <div
                    key={i}
                    className={`grid lg:grid-cols-2 gap-12 items-center mb-16 ${
                      reverse ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div>
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Section image"
                          className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
                        />
                      ) : (
                        <div className="w-full h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                          <UploadCloud className="mr-2" /> Chưa có ảnh
                        </div>
                      )}
                    </div>

                    <div>
                      <ul className="space-y-4">
                        {descriptionItems.map((desc, idx2) => (
                          <li key={idx2} className="flex items-start gap-3">
                            <Check
                              className="text-blue-600 mt-1 flex-shrink-0"
                              size={20}
                            />
                            <span
                              className="text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: desc }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
