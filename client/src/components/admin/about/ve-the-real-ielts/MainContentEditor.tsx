'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, Eye, EyeOff } from 'lucide-react';
import TinySimpleEditor from '@/components/editor/TinySimpleEditor';
import { splitSections } from '@/hooks/splitSections';

type SectionData = {
  heading: string;
  description: string;
};

type Props = {
  data: SectionData;
  images: (string | File)[];
  onChange: (newData: SectionData) => void;
  onImagesChange: (newImages: (string | File)[]) => void;
};

export default function MainContentEditor({
  data,
  images,
  onChange,
  onImagesChange,
}: Props) {
  const [localData, setLocalData] = useState<SectionData>(data);
  const [localImages, setLocalImages] = useState<(string | File)[]>(images);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => setLocalData(data), [data]);
  useEffect(() => setLocalImages(images), [images]);

  // --- Handle field ---
  const handleChange = (key: keyof SectionData, value: string) => {
    const newData = { ...localData, [key]: value };
    setLocalData(newData);
    onChange(newData);
  };

  // --- Image upload ---
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

  const previewUrl =
    localImages.length > 0
      ? typeof localImages[0] === 'string'
        ? localImages[0]
        : URL.createObjectURL(localImages[0])
      : '';

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-xl font-semibold text-gray-800">
          Section 2 — Về The Real IELTS
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4" /> Ẩn xem trực tiếp
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" /> Xem trực tiếp
            </>
          )}
        </Button>
      </div>

      {/* Upload ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Ảnh minh họa
        </label>

        {previewUrl ? (
          <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden border group">
            <Image
              src={previewUrl}
              alt="Ảnh section 2"
              fill
              className="object-cover"
            />
            <button
              onClick={handleRemoveImage}
              type="button"
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-gray-700 hover:text-red-600 shadow transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-blue-400 transition">
            <UploadCloud className="h-7 w-7 text-gray-500" />
            <span className="text-gray-600">Nhấn để chọn ảnh</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Tiêu đề */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Tiêu đề (heading)
        </label>
        <Input
          value={localData.heading}
          onChange={(e) => handleChange('heading', e.target.value)}
          placeholder="Nhập tiêu đề section 2..."
        />
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Mô tả (description)
        </label>
        <TinySimpleEditor
          initialValue={localData.description}
          onContentChange={(content) => handleChange('description', content)}
        />
        <p className="text-sm text-gray-400 mt-1">
          Dùng dấu xuống dòng để tách thành các gạch đầu dòng trong phần hiển thị.
        </p>
      </div>

      {/* Real-time Preview */}
      {showPreview && (
        <div className="pt-8 border-t">
          <LivePreview
            heading={localData.heading}
            description={localData.description}
            imageUrl={previewUrl}
          />
        </div>
      )}
    </div>
  );
}

// 🧩 Component hiển thị xem trực tiếp (giống SectionMainContent)
function LivePreview({
  heading,
  description,
  imageUrl,
}: {
  heading: string;
  description: string;
  imageUrl: string;
}) {
  const bulletPoints = splitSections(description);

  return (
    <section className="py-10 bg-gray-50 rounded-xl border shadow-inner">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-secondary-50 mb-4">
            Về The Real IELTS
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview Image"
                className="rounded-2xl shadow-2xl w-full"
              />
            ) : (
              <div className="aspect-video flex items-center justify-center text-gray-400 border rounded-2xl">
                (Chưa chọn ảnh)
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
              {heading || 'Tiêu đề...'}
            </h3>

            <ul className="space-y-4">
              {bulletPoints.length > 0 ? (
                bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-5 h-5 border-2 border-secondary-50 rounded-md flex items-center justify-center mt-1">
                      <svg
                        className="h-5 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: point }}
                    />
                  </li>
                ))
              ) : (
                <p className="text-gray-400 italic">
                  (Chưa có nội dung mô tả hiển thị)
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
