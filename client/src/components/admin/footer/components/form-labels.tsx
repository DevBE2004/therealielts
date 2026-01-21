"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Delete,
  GripVertical,
  ListCollapse,
  PencilLine,
  PlusCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import ChildrenList from "./children-list";
import { FooterLabelForm } from "../types";

export default function FormLabels() {
  const { control, register } = useFormContext<FooterLabelForm>();
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const {
    fields: labelFields,
    append: appendLabel,
    remove: removeLabel,
  } = useFieldArray({
    control,
    name: "label",
  });

  console.log("labelFields ==> ", labelFields);

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
          onClick={() => appendLabel({ title: "", link: "", children: [] })}
        >
          <PlusCircle className="size-4" /> Thêm Label
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
                <Input {...register(`label.${editIndex}.title`)} />
              </div>

              <div className="grid gap-2">
                <UILabel>Link</UILabel>
                <Input {...register(`label.${editIndex}.link`)} />
              </div>

              <ChildrenList parentIndex={editIndex} />

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
