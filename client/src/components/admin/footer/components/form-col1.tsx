"use client";

import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import uploadImageCloudinary from "@/lib/uploadImageCloudinary";
import { Upload, Trash2 } from "lucide-react";
import TinySimpleEditor from "@/components/editor/TinySimpleEditor";

export default function FormCol1() {
  const { register, setValue, watch } = useFormContext();

  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleUpload =
    (field: "logo" | "image", setPreview: (url: string | null) => void) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      try {
        const url = await uploadImageCloudinary(file);
        setValue(field, url, { shouldValidate: true });
        setPreview(url);
      } catch (err) {
        console.error("Upload error:", err);
      }
    };

  useEffect(() => {
    const logo = watch("logo");
    const image = watch("image");

    if (logo) setPreviewLogo(logo);
    if (image) setPreviewImage(image);
  }, [watch]);

  const removeLogo = () => {
    setPreviewLogo(null);
    setValue("logo", "");
  };

  const removeImage = () => {
    setPreviewImage(null);
    setValue("image", "");
  };

  return (
    <div className="grid gap-4">
      <div className="grid bg-gray-50/90 p-3 shadow-md rounded-xl gap-2">
        <div className="grid gap-2">
          <Label>Logo Footer</Label>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
            <Upload className="h-6 w-6" />
            <span className="text-sm text-gray-600">
              Kéo & thả ảnh hoặc nhấn để chọn
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload("logo", setPreviewLogo)}
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

        <div className="grid gap-2">
          <Label>Link Logo</Label>
          <Input {...register("linkLogo")} placeholder="Link logo" />
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
          <Label>Nhãn</Label>
          <Input {...register("label")} placeholder="Label" />
        </div>

        <div className="grid gap-2">
          <Label>Image Footer</Label>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
            <Upload className="h-6 w-6" />
            <span className="text-sm text-gray-600">
              Kéo & thả ảnh hoặc nhấn để chọn
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload("image", setPreviewImage)}
              className="hidden"
            />
          </label>

          {previewImage && (
            <div className="relative w-60 p-0.5 overflow-hidden rounded-xl bg-[length:20px_20px] bg-[repeating-conic-gradient(#e5e7eb_0_25%,transparent_0_50%)] bg-[white] border-[#D1D1D6] [background-position:0_0]">
              <img src={previewImage} className="w-full object-cover " />
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Link khi click Image</Label>
          <Input {...register("linkImage")} placeholder="Link image" />
        </div>
      </div>
    </div>
  );
}
