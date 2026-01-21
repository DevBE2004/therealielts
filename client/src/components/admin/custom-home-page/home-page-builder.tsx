"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { CheckCircle2, ImagePlus, Trash2, Upload } from "lucide-react";

import { DiaLogCustom } from "@/components/ui/dialog-custom/dialog-custom";
import { FormInput } from "@/components/ui/FormInput";
import uploadImageCloudinary from "@/lib/uploadImageCloudinary";
import { Section, SectionSchema, TSlotEnum } from "@/types/homepage";

const allowedImageTypes = ["image/png", "image/webp"];

type SectionBuilderDialogProps = {
  open: boolean;
  slot: TSlotEnum | null;
  mode: "create" | "edit";
  initialData?: Section;
  onClose(): void;
  onSubmit(section: Section): void;
};

export default function SectionBuilderDialog({
  open,
  slot,
  mode,
  initialData,
  onClose,
  onSubmit,
}: SectionBuilderDialogProps) {
  const EMPTY_SECTION: Section = {
    title: "",
    images: [],
    link: "",
    alt: "",
    openInNewTab: false,
  };

  const methods = useForm<Section>({
    resolver: zodResolver(SectionSchema),
    defaultValues: EMPTY_SECTION,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const images = watch("images");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      reset(initialData); // GIỮ ID
    }

    if (mode === "create") {
      reset(EMPTY_SECTION);
    }
  }, [open, mode, initialData, reset]);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (!allowedImageTypes.includes(file.type)) {
        alert("Chỉ cho phép PNG / WEBP");
        continue;
      }

      try {
        const url = await uploadImageCloudinary(file);
        setValue("images", [...images, url].slice(0, 5), {
          shouldDirty: true,
        });
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Upload ảnh thất bại");
      }
    }
  };

  /* ----------------------------------
   * Remove image
   * ---------------------------------- */
  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    setValue("images", next, { shouldDirty: true });
  };

  const submit = (data: Section) => {
    if (mode === "edit" && !data.id) {
      throw new Error("EDIT nhưng section.id bị mất");
    }

    onSubmit(data);
  };

  return (
    <DiaLogCustom
      open={open}
      width="max-w-4xl"
      title={
        initialData ? `Cập nhật Section (${slot})` : `Thêm Section (${slot})`
      }
      textSave="Lưu"
      onCancel={onClose}
      onSave={handleSubmit(submit)}
      content={
        <FormProvider {...methods}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="hidden" {...methods.register("id")} />
            <FormInput
              name="title"
              label="Tên section"
              placeholder="Nhập tên section"
            />

            <FormInput
              name="link"
              label="Link (nếu có)"
              placeholder="https://..."
            />

            {/* Upload images */}
            <section className="md:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
              <header className="mb-5 flex items-center gap-2 border-b pb-3">
                <ImagePlus className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold">Hình ảnh</h2>
              </header>

              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
                <Upload className="h-6 w-6" />
                <span className="text-sm text-gray-600">
                  Kéo & thả ảnh hoặc nhấn để chọn
                </span>
                <input
                  type="file"
                  multiple
                  accept={allowedImageTypes.join(",")}
                  onChange={handleUploadFile}
                  className="hidden"
                />
              </label>

              {errors.images && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.images.message}
                </p>
              )}

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative overflow-hidden rounded-xl border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`image-${idx}`}
                        className="aspect-[4/3] w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute right-2 top-2 rounded-full bg-white p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/40 px-2 py-1 text-xs text-white">
                        <span>Ảnh {idx + 1}</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </FormProvider>
      }
    />
  );
}
