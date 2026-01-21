"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Upload, X, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TinyEditor } from "@/components/editor";
import InstructionSection from "@/components/dang-ky-thi-ielts/InstructionSection";

type InstructionStep = {
  instructionTitle: string;
  contentIstruction: string;
};

type InstructionSectionData = {
  title: string;
  subTitle: string;
  note: string;
  step1: InstructionStep;
  step2: InstructionStep;
  step3: InstructionStep;
};

interface InstructionSectionEditorProps {
  data?: InstructionSectionData;
  images?: (string | File)[];
  onChange: (newData: InstructionSectionData) => void;
  onImagesChange: (newImages: (string | File)[]) => void;
}

export default function InstructionSectionEditor({
  data,
  images = [],
  onChange,
  onImagesChange,
}: InstructionSectionEditorProps) {
  const [localData, setLocalData] = useState<InstructionSectionData>({
    title: data?.title || "",
    subTitle: data?.subTitle || "",
    note: data?.note || "",
    step1: data?.step1 || { instructionTitle: "", contentIstruction: "" },
    step2: data?.step2 || { instructionTitle: "", contentIstruction: "" },
    step3: data?.step3 || { instructionTitle: "", contentIstruction: "" },
  });

  const [localImages, setLocalImages] = useState<(string | File)[]>(images);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Đồng bộ khi props thay đổi
  useEffect(() => {
    if (data) setLocalData(data);
  }, [data]);

  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  // Cập nhật text hoặc nội dung Tiny
  const handleChange = (key: keyof InstructionSectionData, value: any) => {
    setLocalData((prev) => {
      const newData = { ...prev, [key]: value };
      onChange(newData);
      return newData;
    });
  };

  // Cập nhật nội dung step
  const handleStepChange = (
    stepKey: "step1" | "step2" | "step3",
    field: keyof InstructionStep,
    value: string
  ) => {
    setLocalData((prev) => {
      const updatedStep = { ...prev[stepKey], [field]: value };
      const newData = { ...prev, [stepKey]: updatedStep };
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

  // Preview URL
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

  // Render card upload ảnh
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
          Chỉnh sửa phần hướng dẫn đăng ký thi IELTS
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

      {/* 🔸 Nội dung chỉnh sửa */}
      {showEditor && (
        <div className="p-6 space-y-8 transition-all duration-300 ease-in-out">
          {!isPreviewOpen && (
            <>
              {/* Phần tiêu đề */}
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Tiêu đề chính
                  </label>
                  <Input
                    value={localData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="VD: Hướng dẫn đăng ký thi IELTS"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Phụ đề
                  </label>
                  <Input
                    value={localData.subTitle}
                    onChange={(e) => handleChange("subTitle", e.target.value)}
                    placeholder="VD: Các bước thực hiện đăng ký nhanh chóng"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Ghi chú
                  </label>
                  <Textarea
                    rows={3}
                    value={localData.note}
                    onChange={(e) => handleChange("note", e.target.value)}
                    placeholder="VD: Vui lòng chuẩn bị giấy tờ cần thiết trước khi bắt đầu."
                  />
                </div>
              </div>

              {/* Các bước hướng dẫn */}
              {[1, 2, 3].map((i) => {
                const stepKey = `step${i}` as "step1" | "step2" | "step3";
                const step = localData[stepKey];
                return (
                  <div key={i} className="border-t pt-6 space-y-3">
                    <h3 className="font-semibold text-gray-700">
                      Bước {i}
                    </h3>

                    <Input
                      value={step.instructionTitle}
                      onChange={(e) =>
                        handleStepChange(stepKey, "instructionTitle", e.target.value)
                      }
                      placeholder={`Tiêu đề bước ${i}`}
                    />

                    <TinyEditor
                      initialValue={step.contentIstruction}
                      onContentChange={(val) =>
                        handleStepChange(stepKey, "contentIstruction", val)
                      }
                      height={300}
                    />
                  </div>
                );
              })}
            </>
          )}

          {/* --- Preview --- */}
          {isPreviewOpen && (
            <div className="mt-6 border-t pt-6">
              <InstructionSection section4Record6={localData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
