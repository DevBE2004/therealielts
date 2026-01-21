"use client";

import { HomePageConfig, Section, TSlotEnum } from "@/types/homepage";
import { Plus } from "lucide-react";

export default function SectionPlaceholder({
  slot,
  height = 160,
  data,
}: {
  slot: TSlotEnum;
  height?: number | string;
  data?: HomePageConfig;
}) {
  const block = data?.blocks?.find?.((b) => b.slot === slot);

  const sections: Section[] = Array.isArray(block?.items) ? block.items : [];

  const openBuilder = () => {
    window.dispatchEvent(
      new CustomEvent("open-section-builder", {
        detail: { slot, mode: "create", sections },
      })
    );
  };

  return (
    <div
      style={{ height }}
      className="relative group w-full border border-dashed border-gray-400 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#e5e7eb_0_1px,transparent_1px_12px)]" />

      {/* hover overlay */}
      <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition z-10" />

      <button
        onClick={openBuilder}
        className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition"
      >
        <Plus className="size-6 text-blue-800" />
        <span className="text-[18px] text-blue-800 font-semibold">
          Thêm Section
        </span>
      </button>

      <span className="relative z-0 text-2xl font-semibold text-slate-800 p-4 bg-white border rounded-full">
        {slot}
      </span>
    </div>
  );
}
