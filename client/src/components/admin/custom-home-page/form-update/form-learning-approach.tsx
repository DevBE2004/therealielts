"use client";

import { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Delete,
  GripVertical,
  ListCollapse,
  PencilLine,
  PlusCircle,
  Trash2,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { BlockLearningApproach, LearningApproach } from "@/types/homepage";
import TinySimpleEditor from "@/components/editor/TinySimpleEditor";
import uploadImageCloudinary from "@/lib/uploadImageCloudinary";

export default function FormLearningApproach() {
  const { control, register, watch, setValue } =
    useFormContext<BlockLearningApproach>();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  const {
    fields: labelFields,
    append: appendLabel,
    remove: removeLabel,
  } = useFieldArray({
    control,
    name: "slide",
  });

  const handleUploadImage =
    (index: number) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // ví dụ upload → trả về url
      const url = await uploadImageCloudinary(file);

      setValue(`slide.${index}.image`, url, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };

  //   useEffect(() => {
  //     const logo = watch("image");

  //     if (logo) setPreviewLogo(logo);
  //   }, [watch]);

  const removeImage = (index: number) => {
    setValue(`slide.${index}.image`, "", {
      shouldDirty: true,
    });
  };

  return (
    <div className="grid rounded-2xl border bg-white shadow-sm">
      <header className="flex items-center justify-between gap-2 border-b p-4">
        <div className="flex items-center gap-2">
          <ListCollapse className="h-4 w-4 text-gray-700" />
          <h2 className="text-lg font-semibold">Menu</h2>
        </div>
        <Button
          type="button"
          className="flex items-center gap-2 bg-blue-500"
          onClick={() =>
            appendLabel({
              image: "",
              title: "",
              content: "",
              subTitle: "",
              textButton: "",
              linkButton: "",
            })
          }
        >
          <PlusCircle className="size-4" /> Thêm Slide
        </Button>
      </header>

      {/* MENU LIST */}
      <ul className="">
        {labelFields.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-medium">
                {item.title || "Chưa có tiêu đề"}
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <Button
                type="button"
                className="bg-slate-200 p-2 rounded-full"
                onClick={() => setEditIndex(index)}
              >
                <PencilLine className="size-4 text-blue-500 shrink-0" />
              </Button>
              <Button
                type="button"
                className="p-2 rounded-full bg-slate-200 "
                onClick={() => {
                  removeLabel(index);
                }}
              >
                <Delete className="size-5 text-red-500 shrink-0" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* POPUP EDIT */}
      <Dialog open={editIndex !== null} onOpenChange={() => setEditIndex(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Label</DialogTitle>
          </DialogHeader>

          {editIndex !== null && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <UILabel>Tiêu đề</UILabel>
                <Input {...register(`slide.${editIndex}.title`)} />
              </div>

              <div className="grid gap-2">
                <UILabel>Tiêu đề phụ</UILabel>
                <Input {...register(`slide.${editIndex}.subTitle`)} />
              </div>

              <div className="grid gap-2">
                <UILabel>Nội dung</UILabel>
                <Controller
                  name={`slide.${editIndex}.content`}
                  defaultValue=""
                  render={({ field }) => (
                    <TinySimpleEditor
                      initialValue={field.value}
                      onContentChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="grid gap-2">
                <UILabel>Text Button</UILabel>
                <Input
                  {...register(`slide.${editIndex}.textButton`)}
                  placeholder="vd: xem thêm"
                />
              </div>

              <div className="grid gap-2">
                <UILabel>Link Click Button</UILabel>
                <Input
                  {...register(`slide.${editIndex}.linkButton`)}
                  placeholder="https://..."
                />
              </div>

              {editIndex !== null &&
                (() => {
                  const image = watch(`slide.${editIndex}.image`);

                  return (
                    <div className="grid bg-gray-50/90 p-3 shadow-md rounded-xl gap-2">
                      <UILabel>Ảnh Chính</UILabel>

                      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
                        <Upload className="h-6 w-6" />
                        <span className="text-sm text-gray-600">
                          Kéo & thả ảnh hoặc nhấn để chọn
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadImage(editIndex)}
                          className="hidden"
                        />
                      </label>

                      {image && (
                        <div className="relative w-40 overflow-hidden rounded-xl border bg-[length:20px_20px] bg-[repeating-conic-gradient(#e5e7eb_0_25%,transparent_0_50%)]">
                          <img src={image} className="w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(editIndex)}
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              {/* <ChildrenList parentIndex={editIndex} /> */}

              <Button className="w-40" onClick={() => setEditIndex(null)}>
                Xong
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
