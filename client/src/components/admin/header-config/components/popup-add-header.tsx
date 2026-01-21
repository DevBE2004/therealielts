"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { set, z } from "zod";

import { FormInput } from "@/components/ui/FormInput";
import { DiaLogCustom } from "@/components/ui/dialog-custom/dialog-custom";
import { HeaderConfigType } from "../types";
import { SortableList } from "../../custom-page/section/sort-table-list";
import SectionItem from "../../custom-page/section/section-item";
import { Button } from "@/components/ui/button";
import MenuItem from "./menu-item";
import PopupAddItem from "./popup-add-item";

interface PopupConfigHeaderProps {
  open: boolean;
  data?: HeaderConfigType; // nếu có => edit, không có => create
  onCancel: () => void;
  loading: boolean;
  onSave: (value: {
    type: "CREATE" | "UPDATE";
    id?: string | number | undefined;
    data: HeaderConfigType;
  }) => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  slug: z.string().optional(),
  children: z.array(z.any()).optional(),
});

export default function PopupConfigHeader({
  open,
  data,
  onCancel,
  onSave,
  loading,
}: PopupConfigHeaderProps) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const { setValue, handleSubmit, reset } = methods;
  const children = useWatch({ control: methods.control, name: "children" });

  const [openItem, setOpenItem] = useState<boolean>(false);
  const [dataSelect, setDataSelect] = useState<HeaderConfigType>({});

  /** Load data khi edit */
  useEffect(() => {
    if (data && open) {
      setValue("title", data.title || "");
      setValue("slug", data.slug || "");
      setValue("children", data.children || []);
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
      type: data?.id ? "UPDATE" : "CREATE",
      data: {
        title: values.title,
        slug: values.slug,
        children: values.children,
        orderIndex: data?.orderIndex,
      },
      id: data?.id,
    });
  };

  const handleUpdateSection = (arr: HeaderConfigType[]) => {
    const normalized = arr.map((item, index) => ({
      ...item,
      orderIndex: index + 1,
    }));

    setValue("children", normalized);
  };

  const actionDelete = (orderIndex: number) => {
    const current = methods.getValues("children") || [];

    const filtered = current
      .filter((item: HeaderConfigType) => item.orderIndex !== orderIndex)
      .map((item: HeaderConfigType, idx: number) => ({
        ...item,
        orderIndex: idx + 1,
      }));

    setValue("children", filtered);
  };

  const actionEdit = (value: {
    type: "CREATE" | "UPDATE";
    data: HeaderConfigType;
  }) => {
    if (value.type === "CREATE") {
      const current = methods.getValues("children") || [];
      setValue("children", [
        ...current,
        {
          ...value.data,
          orderIndex: current.length + 1,
        },
      ]);
    } else {
      const current = methods.getValues("children") || [];

      const next = current.map((item: HeaderConfigType) =>
        item.orderIndex === value?.data?.orderIndex ? value?.data : item
      );

      setValue("children", next);
    }
    setOpenItem(false);
  };

  return (
    <DiaLogCustom
      open={open}
      title={data?.id ? "Chỉnh sửa header" : "Thêm header mới"}
      width="max-w-[700px]"
      onCancel={onCancel}
      onSave={handleSubmit(onSubmit)}
      loading={loading}
      textSave={data?.id ? "Cập nhật" : "Thêm mới"}
      content={
        <FormProvider {...methods}>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="title"
              label="Tiêu đề"
              placeholder="Nhập tiêu đề..."
            />

            <FormInput name="slug" label="Link" placeholder="Nhập Link" />

            <section className="col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
              <div className="col-span-2 text-sm text-gray-500">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">
                    {data?.slug === "ielts"
                      ? "Danh sách khóa học"
                      : "Danh sách menu con"}
                  </h2>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 justify-center text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                    onClick={() => {
                      setDataSelect({});
                      setOpenItem(true);
                    }}
                  >
                    {"Thêm mới"}
                  </Button>
                </div>
                <SortableList<HeaderConfigType>
                  items={
                    children
                      ?.slice() // copy để tránh mutate
                      .sort(
                        (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
                      ) || []
                  }
                  onUpdate={handleUpdateSection}
                  renderItem={(item) => (
                    <MenuItem
                      key={item?.orderIndex}
                      indexArr={item?.orderIndex || ""}
                      data={item}
                      actionDelete={() => actionDelete(item.orderIndex!)}
                      actionEdit={(newData) => {
                        setDataSelect(newData);
                        setOpenItem(true);
                      }}
                    />
                  )}
                />
              </div>
            </section>
            <PopupAddItem
              open={openItem}
              onCancel={() => setOpenItem(false)}
              onSave={actionEdit}
              data={dataSelect}
            />
          </div>
        </FormProvider>
      }
    />
  );
}
