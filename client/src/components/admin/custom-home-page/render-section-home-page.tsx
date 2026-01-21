"use client";

import { Block, HomePageConfig, Section, TSlotEnum } from "@/types/homepage";
import Image from "next/image";
import { Pencil, Trash2, Plus, ArrowDownFromLine } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface RenderViewPageProps {
  slot: TSlotEnum;
  data: HomePageConfig;
  isAdmin?: boolean;
}

export function RenderSectionHomePage({
  slot,
  data,
  isAdmin = false,
}: RenderViewPageProps) {
  const block = data?.blocks?.find?.((b) => b.slot === slot);

  const sections: Section[] = Array.isArray(block?.items) ? block.items : [];

  const openCreate = () => {
    window.dispatchEvent(
      new CustomEvent("open-section-builder", {
        detail: { slot, mode: "create" },
      })
    );
  };

  const openEdit = (section: Section) => {
    window.dispatchEvent(
      new CustomEvent("open-section-builder", {
        detail: { slot, mode: "edit", section, sections },
      })
    );
  };

  const deleteSection = (section: Section) => {
    if (!confirm("Bạn chắc chắn muốn xoá section này?")) return;

    window.dispatchEvent(
      new CustomEvent("delete-section", {
        detail: { slot, mode: "delete", sectionId: section.id, sections },
      })
    );
  };

  // Không có section
  if (sections.length === 0) {
    return isAdmin ? (
      <div className="py-2 flex justify-center">
        <button className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-4 text-gray-600 hover:border-blue-500 hover:text-blue-600">
          Thêm section cho {slot} phía bên dưới
          <ArrowDownFromLine className="h-8 w-8" />
        </button>
      </div>
    ) : null;
  }

  return (
    <div className="relative">
      {sections.map((section) => (
        <div key={section.id} className="group relative">
          {/* ADMIN ACTIONS */}
          {isAdmin && (
            <div className="absolute inset-0 z-20 hidden gap-2 group-hover:flex items-center justify-center">
              <button
                onClick={() => openEdit(section)}
                className="rounded-lg bg-white/90 py-2 px-5 shadow hover:bg-blue-600 hover:text-white"
              >
                <Pencil className="h-4 w-4" />
              </button>

              <button
                onClick={() => deleteSection(section)}
                className="rounded-lg bg-white/90 py-2 px-5 shadow hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}

          <div
            className={
              isAdmin
                ? "group-hover:opacity-40 transition-opacity duration-200"
                : ""
            }
          >
            <RenderSectionContent section={section} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RenderSectionContent({ section }: { section: Section }) {
  if (section?.images?.length === 0 || section?.images === undefined) {
    return null;
  }

  if (section.images?.length > 1) {
    return (
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
      >
        {section.images.map((img) => (
          <SwiperSlide key={img} className="py-5">
            <div className="relative aspect-[10/5] sm:aspect-[16/5] w-full">
              <Image
                src={img}
                alt={section.alt || section.title}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <div className="mx-auto py-4 md:py-8 w-full max-w-[1250px] px-6">
      <img
        src={section.images?.[0]}
        alt={section.alt || section.title}
        className="h-[225px] sm:h-[400px] w-full cursor-pointer rounded-2xl object-cover shadow-lg"
        onClick={() =>
          section.link &&
          window.open(section.link, section.openInNewTab ? "_blank" : "_self")
        }
      />
    </div>
  );
}
