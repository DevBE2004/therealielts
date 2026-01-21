"use client";

import { useEffect, useState, useCallback } from "react";
import SectionBuilderDialog from "./home-page-builder";
import { updateHomePageBySlot } from "./update-home-page-by-slot";
import { Section, TSlotEnum } from "@/types/homepage";

type BuilderMode = "create" | "edit";

type OpenBuilderEvent = CustomEvent<{
  slot: TSlotEnum;
  mode: BuilderMode;
  sections: Section[];
  section?: Section;
}>;

type DeleteSectionEvent = CustomEvent<{
  slot: TSlotEnum;
  mode: "delete";
  sectionId: string;
  sections: Section[];
}>;

function upsert(list: Section[], section: Section): Section[] {
  if (!section.id) {
    return [...list, { ...section, id: crypto.randomUUID() }];
  }

  return list.map((s) => (s.id === section.id ? section : s));
}

export function SectionBuilderController() {
  const [open, setOpen] = useState(false);
  const [slot, setSlot] = useState<TSlotEnum | null>(null);
  const [mode, setMode] = useState<BuilderMode>("create");
  const [sections, setSections] = useState<Section[]>([]);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { detail } = e as OpenBuilderEvent;

      if (!detail?.slot || !detail.mode) return;

      setSlot(detail.slot);
      setMode(detail.mode);
      setSections(detail.sections ?? []);

      setEditingSection(detail.mode === "edit" ? detail.section ?? null : null);

      setOpen(true);
    };

    window.addEventListener("open-section-builder", handler);
    return () => window.removeEventListener("open-section-builder", handler);
  }, []);

  /* ---------- DELETE SECTION ---------- */
  useEffect(() => {
    const handler = async (e: Event) => {
      const { slot, sectionId, sections } = (e as DeleteSectionEvent).detail;

      const nextSections = sections.filter((s) => s.id !== sectionId);

      if (nextSections.length === sections.length) return;

      await updateHomePageBySlot({
        slot,
        sections: nextSections,
      });
      setSections(nextSections);

      // nếu đang edit section bị xoá → đóng dialog
      if (editingSection?.id === sectionId) {
        setOpen(false);
        setEditingSection(null);
        setSlot(null);
      }
    };

    window.addEventListener("delete-section", handler);
    return () => window.removeEventListener("delete-section", handler);
  }, [editingSection]);

  const handleSubmit = useCallback(
    async (formData: Section) => {
      if (!slot) throw new Error("Slot not ready");

      let nextSections: Section[];

      if (mode === "edit") {
        if (!formData.id) {
          throw new Error("Edit section nhưng thiếu id");
        }

        nextSections = upsert(sections, formData);
      } else {
        nextSections = [...sections, { ...formData, id: crypto.randomUUID() }];
      }

      await updateHomePageBySlot({
        slot,
        sections: nextSections,
      });

      setOpen(false);
      setEditingSection(null);
      setSlot(null);
    },
    [slot, mode, sections]
  );

  return (
    <SectionBuilderDialog
      open={open}
      slot={slot}
      mode={mode}
      initialData={editingSection ?? undefined}
      onClose={() => {
        setOpen(false);
        setEditingSection(null);
        setSlot(null);
      }}
      onSubmit={handleSubmit}
    />
  );
}
