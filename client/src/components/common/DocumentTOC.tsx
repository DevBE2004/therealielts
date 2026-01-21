"use client";

import { parseTOCFromHTML, TOCItem } from "@/utils/toc";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface DocumentTOCProps {
  content: string; // HTML TinyMCE
  maxLevel?: number;
  className?: string;
}

export default function DocumentTOC({ content, maxLevel = 4, className }: DocumentTOCProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const HEADER_OFFSET = 150;

  useEffect(() => {
    if (!content) return;

    const items = parseTOCFromHTML(content, maxLevel);
    setTocItems(items);

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (!headingElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      {
        root: null,
        rootMargin: `-${HEADER_OFFSET}px 0px -70% 0px`, 
        threshold: 0,
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => headingElements.forEach((el) => observer.unobserve(el));
  }, [content, maxLevel]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
    setActiveId(id);
  };

  return (
     <nav
      className={`overflow-auto bg-white border border-gray-200 rounded-2xl p-4 shadow-sm max-h-[80vh] sticky top-20 ${className}`}
    >
      <h3 className="text-lg xl:text-xl font-semibold text-gray-800 text-center mb-4">
        Mục lục bài viết
      </h3>

      <ul className="space-y-1.5">
        {tocItems.map((item) => {
          const isActive = activeId === item.id;
          const levelPadding = (item.level - 2) * 16;

          return (
            <li
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex items-start gap-2 cursor-pointer rounded-lg px-2 py-1.5 transition-all 
                ${isActive ? "bg-blue-50 text-blue-700 font-[600]" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"}`}
              style={{ paddingLeft: `${levelPadding}px` }}
            >
              <ChevronRight
                className={`w-4 h-4 flex-shrink-0 mt-1 transition-transform ${
                  isActive ? "rotate-90 text-blue-600" : "text-gray-400"
                }`}
              />
              <span className="text-sm leading-snug">{item.text}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
