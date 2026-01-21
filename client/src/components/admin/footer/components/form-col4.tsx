"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FormLabels from "./form-labels";

export default function FormCol4() {
  const { register, watch, control } = useFormContext();

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <Label>Mở Form Tư Vấn</Label>
        <Controller
          name="openFormConsultation"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Hiển thị Fanpage</Label>
        <Controller
          name="openFanpage"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      {/* LABELS của col4 */}
      <div className="border rounded-xl p-4 bg-gray-50">
        <p className="font-semibold mb-3">Danh sách Label</p>
        <FormLabels />
      </div>
    </div>
  );
}
