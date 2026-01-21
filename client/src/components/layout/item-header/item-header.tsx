import { HeaderConfigType } from "@/components/admin/header-config/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ItemHeaderProps {
  data?: HeaderConfigType;
  isMobile?: boolean;
}
const hoverClass =
  "hover:text-blue-200 transition-colors border-b-3 border-[#20376c] hover:border-white pb-1";
const buttonStyle =
  "flex items-center gap-1 border-b-3 border-[#20376c] hover:border-white pb-1";

const ItemHeader = ({ data, isMobile = false }: ItemHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!data) return null;
  if (!data.children || data.children.length === 0) {
    return (
      <Link
        key={data.slug}
        href={data.slug || "#"}
        className="block font-sans font-[500] py-2 text-white hover:text-blue-200"
      >
        {data.title}
      </Link>
    );
  } else {
    return (
      <div className="relative group py-2">
        <button
          className={`${
            isMobile
              ? "flex justify-between w-full py-2 text-white hover:text-blue-200 font-sans font-[500] items-center"
              : buttonStyle + " " + hoverClass
          }`}
          onClick={() => window.open(data.slug, "_self")}
        >
          {data.title}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            onClick={() => isMobile && setIsOpen(!isOpen)}
          />
        </button>
        <div
          className={
            isMobile
              ? "pl-2 overflow-hidden transition-all duration-300 " +
                `${isOpen ? "max-h-[500px]" : "max-h-0"}`
              : "absolute overflow-hidden top-full z-10 left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
          }
        >
          {data?.children
            ?.slice() // copy để tránh mutate
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
            .map((c) => (
              <Link
                key={c.slug}
                href={c.slug || "#"}
                className={
                  isMobile
                    ? "block py-2 text-white hover:text-blue-200"
                    : "block py-2 text-gray-800 hover:bg-gray-100 rounded-md px-3"
                }
              >
                {c.title}
              </Link>
            ))}
        </div>
      </div>
    );
  }
};

export default ItemHeader;
