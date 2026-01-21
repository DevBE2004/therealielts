"use client";

import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import uploadImageCloudinary from "@/lib/uploadImageCloudinary";
import { Upload, Trash2 } from "lucide-react";
import TinySimpleEditor from "@/components/editor/TinySimpleEditor";
import { BlockIntroduce } from "@/types/homepage";

export default function FormIntroduce() {
  const { register, setValue, watch } = useFormContext<BlockIntroduce>();
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  const handleUpload =
    (setPreview: (url: string | null) => void) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      try {
        const url = await uploadImageCloudinary(file);
        setValue("image", url, { shouldValidate: true });
        setPreview(url);
      } catch (err) {
        console.error("Upload error:", err);
      }
    };
  useEffect(() => {
    const logo = watch("image");

    if (logo) setPreviewLogo(logo);
  }, [watch]);
  const removeLogo = () => {
    setPreviewLogo(null);
    setValue("image", "");
  };

  return (
    <div className="grid gap-4">
      <div className="grid bg-gray-50/90 p-3 shadow-md rounded-xl gap-2">
        <div className="grid gap-2">
          <Label>Ảnh Chính</Label>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
            <Upload className="h-6 w-6" />
            <span className="text-sm text-gray-600">
              Kéo & thả ảnh hoặc nhấn để chọn
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload(setPreviewLogo)}
              className="hidden"
            />
          </label>

          {previewLogo && (
            <div className="relative w-40 overflow-hidden rounded-xl border bg-[length:20px_20px] bg-[repeating-conic-gradient(#e5e7eb_0_25%,transparent_0_50%)] bg-[white] border-[#D1D1D6] [background-position:0_0]">
              <img src={previewLogo} className="w-full object-cover" />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid bg-gray-50/90 p-3 shadow-md rounded-xl gap-2">
        <div className="grid gap-2">
          <Label>Tiêu đề</Label>
          <Input {...register("title")} placeholder="Nhập tiêu đề" />
        </div>

        <div className="grid gap-2">
          <Label>Nội dung</Label>
          <Controller
            name="content"
            defaultValue=""
            render={({ field }) => (
              <TinySimpleEditor
                initialValue={field.value}
                onContentChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="grid bg-gray-50/90 p-3 shadow-md rounded-xl gap-2">
        <div className="grid gap-2">
          <Label>Text button</Label>
          <Input {...register("textButton")} placeholder="VD: tìm hiểu thêm" />
        </div>

        <div className="grid gap-2">
          <Label>Link Click Button</Label>
          <Input {...register("linkButton")} placeholder="https://..." />
        </div>
      </div>
    </div>
  );
}
