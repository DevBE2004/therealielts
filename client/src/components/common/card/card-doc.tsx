import { Document, New } from "@/types";
import { ArrowRightCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface CardNewProps {
  item: Document;
}
const CardDocument = ({ item }: CardNewProps) => {
  const router = useRouter();
  const getImages = useCallback((item: Document) => {
    if (!item.images) return [];
    if (Array.isArray(item.images)) return item.images;
    try {
      const parsed = JSON.parse(item.images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

    const stripImages = (html: string) => {
    if (typeof window === "undefined") return html;
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("img").forEach((el) => el.remove());
    return doc.body.textContent || "";
  };

  const handleNewsClick = useCallback(
    (item: Document) => {
      router.push(`/${item.slug}`);
    },
    [router]
  );

  const images = getImages(item);
  const mainImage = images[0];

  return (
    <div
      key={item.id}
      style={{
        boxShadow:
          "0 0 10px 0 rgba(107.92343749999999, 107.92343749999999, 107.92343749999999, .5)",
      }}
      className="flex flex-col justify-between bg-white p-3 rounded-[10px] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
      onClick={() => handleNewsClick(item)}
    >
      <div className="flex flex-col">
        {mainImage !== undefined && (
          <div className="relative h-40 w-full overflow-hidden rounded-[10px]">
            <Image
              src={mainImage}
              alt={item.title}
              fill
              className="object-cover transition-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="grid gap-2 mt-3">
          <h4 className="text-[16px] font-sans font-[500] text-[#03124E] mb-2 line-clamp-2">
            {item.title}
          </h4>
          {item.description && (
            // <div
            //   className="text-[13px] text-gray-500 mt-3 line-clamp-4 [&_*]:!text-[13px] [&_*]:!text-gray-500"
            //   dangerouslySetInnerHTML={{ __html: item.description }}
            // />
            <p className="text-[13px] text-gray-500 mt-3 line-clamp-4 [&_*]:!text-[13px] [&_*]:!text-gray-500">
              {stripImages(item.description)}
            </p>
          )}

          <div className="flex justify-between text-[14px] text-gray-500 mt-1">
            <span>
                Updated: 
              {item.updatedAt
                ? new Date(item.updatedAt).toLocaleDateString("vi-VN")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 pt-2 border-t border-[#000] text-[14px] text-[#21366B] font-semibold mt-3">
        <ArrowRightCircle className="size-4 mt-0.5"/> Xem chi tiết
      </div>
    </div>
  );
};

export default CardDocument;