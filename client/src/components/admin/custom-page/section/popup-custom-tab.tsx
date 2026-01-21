"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { FormInput } from "@/components/ui/FormInput";
import { DiaLogCustom } from "@/components/ui/dialog-custom/dialog-custom";
import { TabConfig } from "../type";

interface PopupCustomTabProps {
  open: boolean;
  data?: TabConfig; // nếu có => edit, không có => create
  onCancel: () => void;
  onSave: (value: { type: "CREATE" | "UPDATE"; data: TabConfig }) => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  subTitle: z.string().optional(),
  description: z.string().optional(),
});

export default function PopupCustomTab({
  open,
  data,
  onCancel,
  onSave,
}: PopupCustomTabProps) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const { setValue, handleSubmit, reset } = methods;

  /** Load data khi edit */
  useEffect(() => {
    if (data && open) {
      setValue("title", data.title || "");
      setValue("subTitle", data.subTitle || "");
      setValue("description", data.description || "");
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
        subTitle: values.subTitle,
        description: values.description,
        orderIndex: data?.orderIndex,
      },
    });
    onCancel();
  };

  return (
    <DiaLogCustom
      open={open}
      title={data?.orderIndex ? "Chỉnh sửa tab" : "Thêm tab mới"}
      width="max-w-[700px]"
      onCancel={onCancel}
      onSave={onSubmit}
      textSave={data?.orderIndex ? "Cập nhật" : "Thêm mới"}
      content={
        <FormProvider {...methods}>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="title"
              label="Tiêu đề"
              placeholder="Nhập tiêu đề..."
            />

            <FormInput
              name="subTitle"
              label="Tiêu đề phụ"
              placeholder="Nhập tiêu đề phụ..."
            />

            <div className="col-span-2">
              <FormInput
                name="description"
                label="Mô tả"
                placeholder="Nhập mô tả..."
              />
            </div>
          </div>
        </FormProvider>
      }
    />
  );
}
