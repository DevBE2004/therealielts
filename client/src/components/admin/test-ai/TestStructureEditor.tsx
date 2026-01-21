"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, Upload, ChevronDown, ChevronUp } from "lucide-react";
import TinySimpleEditor from "@/components/editor/TinySimpleEditor"; // nếu không có thì đổi sang Textarea

type TestPart = {
  name: string;
  time: string;
  description: string;
};

type Section3 = {
  title: string;
  content: TestPart[];
};

type Props = {
  data?: Section3 | null;
  images?: (File | string)[];
  onChange: (newData: Section3) => void;
  onImagesChange?: (newImages: (File | string)[]) => void;
};

export default function TestStructureEditor({
  data,
  images = [],
  onChange,
  onImagesChange,
}: Props) {
  // dữ liệu mặc định an toàn
  const defaultData: Section3 = {
    title: data?.title ?? "Cấu Trúc Của Bài Kiểm Tra Đầu Vào",
    content:
      Array.isArray(data?.content) && data!.content.length > 0
        ? data!.content.map((c) => ({ ...c }))
        : [
            {
              name: "Nghe (Listening)",
              time: "30 - 40 phút",
              description:
                "<strong>Cấu trúc:</strong> ...<br/><strong>Loại câu hỏi:</strong> ...",
            },
            {
              name: "Đọc (Reading)",
              time: "60 phút",
              description:
                "<strong>Cấu trúc:</strong> ...<br/><strong>Loại câu hỏi:</strong> ...",
            },
          ],
  };

  const [local, setLocal] = useState<Section3>(defaultData);
  const [openEditor, setOpenEditor] = useState(false);

  useEffect(() => {
    setLocal({
      title: data?.title ?? defaultData.title,
      content: Array.isArray(data?.content)
        ? data!.content.map((c) => ({ ...c }))
        : defaultData.content,
    });
  }, [data]);

  // helpers
  const pushChange = (next: Section3) => {
    setLocal(next);
    onChange(next);
  };

  const handleTitleChange = (v: string) => {
    pushChange({ ...local, title: v });
  };

  const handlePartChange = (index: number, key: keyof TestPart, value: string) => {
    const content = [...local.content];
    content[index] = { ...content[index], [key]: value };
    pushChange({ ...local, content });
  };

  const addPart = () => {
    const content = Array.isArray(local.content) ? [...local.content] : [];
    content.push({ name: "Phần mới", time: "0 phút", description: "" });
    const nextImages = Array.isArray(images) ? [...images] : [];
    nextImages.push("");
    pushChange({ ...local, content });
    onImagesChange?.(nextImages);
  };

  const removePart = (index: number) => {
    const content = local.content.filter((_, i) => i !== index);
    const nextImages = images.filter((_, i) => i !== index + 1);
    pushChange({ ...local, content });
    onImagesChange?.(nextImages);
  };

  const handleImageChange = (index: number, file: File | null) => {
    const next = Array.isArray(images) ? [...images] : [];
    if (file) next[index] = file;
    else next[index] = undefined as unknown as string;
    onImagesChange?.(next);
  };

  const imgSrc = (i: number) => {
    if (!Array.isArray(images)) return undefined;
  const img = images[i];
  if (!img) return undefined;
  return typeof img === "string" ? img : URL.createObjectURL(img);
  };

  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Test Structure Editor</h3>
          <p className="text-sm text-gray-500">
            Chỉnh sửa cấu trúc phần kiểm tra (Listening, Reading, ...)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpenEditor((s) => !s)}>
          {openEditor ? (
            <span className="flex items-center gap-2">
              Ẩn chỉnh sửa <ChevronUp size={14} />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Hiện chỉnh sửa <ChevronDown size={14} />
            </span>
          )}
        </Button>
      </div>

      {openEditor && (
        <div className="py-8 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT - FORM */}
            <div className="space-y-6">
              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                <Input
                  value={local.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Tiêu đề section"
                />
              </div>

              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh chính (Main Image)
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col items-center gap-3">
                  <div className="relative w-48 h-36 bg-white rounded-md overflow-hidden border">
                    {imgSrc(0) ? (
                      <Image src={imgSrc(0)!} alt="main" fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Chưa có
                      </div>
                    )}
                  </div>
                  <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer">
                    <Upload size={14} /> <span>Tải ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(0, e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>

              {/* Các phần (Listening, Reading...) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Các phần (Parts)</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={addPart}
                    className="flex items-center gap-2"
                  >
                    <Plus size={14} /> Thêm phần
                  </Button>
                </div>

                <div className="space-y-4">
                  {local.content.map((part, idx) => (
                    <div key={idx} className="border rounded-xl p-4 bg-gray-50 relative">
                      <button
                        onClick={() => removePart(idx)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input
                          value={part.name}
                          onChange={(e) => handlePartChange(idx, "name", e.target.value)}
                          placeholder="Tên phần (VD: Nghe)"
                          className="sm:col-span-2"
                        />
                        <Input
                          value={part.time}
                          onChange={(e) => handlePartChange(idx, "time", e.target.value)}
                          placeholder="Thời lượng"
                          className="sm:col-span-1"
                        />
                      </div>

                      {/* Ảnh minh họa cho từng phần */}
                      <div className="mt-3">
                        <label className="block text-sm text-gray-600 mb-2">
                          Ảnh minh họa cho phần này
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="relative w-28 h-28 rounded-md overflow-hidden border bg-white">
                            {imgSrc(idx + 1) ? (
                              <Image
                                src={imgSrc(idx + 1)!}
                                alt={`img-${idx}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                Chưa có
                              </div>
                            )}
                          </div>
                          <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer">
                            <Upload size={14} /> <span>Tải ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageChange(idx + 1, e.target.files?.[0] || null)
                              }
                            />
                          </label>
                        </div>
                      </div>

                      {/* Mô tả */}
                      <div className="mt-3">
                        <label className="block text-sm text-gray-600 mb-2">Mô tả</label>
                        {typeof TinySimpleEditor !== "undefined" ? (
                          <TinySimpleEditor
                            initialValue={part.description}
                            onContentChange={(c) => handlePartChange(idx, "description", c)}
                          />
                        ) : (
                          <Textarea
                            rows={4}
                            value={part.description}
                            onChange={(e) =>
                              handlePartChange(idx, "description", e.target.value)
                            }
                            placeholder="Mô tả phần"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT - LIVE PREVIEW */}
            <div className="space-y-6">
              <div className="bg-[#0F172A] text-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-6">{local.title}</h3>

                {/* Ảnh chính */}
                {imgSrc(0) && (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
                    <Image
                      src={imgSrc(0)!}
                      alt="main preview"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                )}

                {/* Các phần */}
                <div className="space-y-4">
                  {local.content.map((part, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-4 rounded-xl"
                    >
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                        {imgSrc(i + 1) ? (
                          <Image
                            src={imgSrc(i + 1)!}
                            alt={part.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            Ảnh {i + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-blue-200">Thời gian: {part.time}</p>
                        <h4 className="text-lg font-semibold">{part.name}</h4>
                        <div
                          className="text-sm text-gray-200 mt-2"
                          dangerouslySetInnerHTML={{ __html: part.description }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
