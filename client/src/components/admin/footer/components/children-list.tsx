"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

export default function ChildrenList({ parentIndex }: { parentIndex: number }) {
  const { control, register } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `label.${parentIndex}.children`,
  });

  return (
    <div className="space-y-3 p-1.5 bg-gray-50 rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-semibold">Items</p>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => append({ title: "", link: "" })}
        >
          <PlusCircle className="size-4" />
          Thêm item
        </Button>
      </div>

      {fields.map((child, i) => (
        <div
          key={child.id}
          className="flex items-start gap-3 border rounded-lg p-3 bg-white"
        >
          <div className="grid gap-2 flex-1">
            <Input
              {...register(`label.${parentIndex}.children.${i}.title`)}
              placeholder="Title"
            />
            <Input
              {...register(`label.${parentIndex}.children.${i}.link`)}
              placeholder="Link"
            />
          </div>

          <Button
            size="icon"
            variant="outline"
            type="button"
            onClick={() => remove(i)}
            className="bg-gray-300 rounded-full"
          >
            <Trash2 className="size-4 shrink-0 text-red-600" />
          </Button>
        </div>
      ))}
    </div>
  );
}
