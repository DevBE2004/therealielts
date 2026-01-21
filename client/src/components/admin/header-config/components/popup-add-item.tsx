"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { FormInput } from "@/components/ui/FormInput";
import { DiaLogCustom } from "@/components/ui/dialog-custom/dialog-custom";
import { HeaderConfigType } from "../types";

interface PopupConfigHeaderProps {
  open: boolean;
  data?: HeaderConfigType; // nếu có => edit, không có => create
  onCancel: () => void;
  onSave: (value: {
    type: "CREATE" | "UPDATE";
    data: HeaderConfigType;
  }) => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  slug: z.string().optional(),
});

export default function PopupAddItem({
  open,
  data,
  onCancel,
  onSave,
}: PopupConfigHeaderProps) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const { setValue, handleSubmit, reset } = methods;

  /** Load data khi edit */
  useEffect(() => {
    if (data && open) {
      setValue("title", data.title || "");
      setValue("slug", data.slug || "");
    }
  }, [data, open]);

  /** Reset form khi popup đóng */
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  const onSubmit = () => {
    const values = methods.getValues();
    onSave({
      type: data?.orderIndex ? "UPDATE" : "CREATE",
      data: {
        title: values.title,
        slug: values.slug,
        orderIndex: data?.orderIndex,
      },
    });
  };

  return (
    <DiaLogCustom
      open={open}
      title={data?.orderIndex ? "Chỉnh sửa header" : "Thêm header mới"}
      width="max-w-[700px]"
      onCancel={onCancel}
      onSave={handleSubmit(onSubmit)}
      textSave={data?.orderIndex ? "Cập nhật" : "Thêm mới"}
      content={
        <FormProvider {...methods}>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="title"
              label="Tiêu đề"
              placeholder="Nhập tiêu đề..."
            />

            <FormInput name="slug" label="Link" placeholder="Nhập Link" />
          </div>
        </FormProvider>
      }
    />
  );
}
