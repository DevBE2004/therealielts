import { Document, New } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface CardNewProps {
  item: New;
}
const CardNew = ({ item }: CardNewProps) => {
  const router = useRouter();
  const getImages = useCallback((item: New) => {
    if (!item.images) return [];
    if (Array.isArray(item.images)) return item.images;
    try {
      const parsed = JSON.parse(item.images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const handleNewsClick = useCallback(
    (item: New) => {
      router.push(`/${item.slug}`);
    },
    [router]
  );

  const images = getImages(item);
  const mainImage = images[0] || null;

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
        {mainImage && (
          <div className="relative h-48 w-full overflow-hidden rounded-[10px]">
            <Image
              src={mainImage}
              alt={item.title}
              fill
              className="object-cover transition-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="grid gap-4 mt-3">
          <h4 className="text-[18px] font-semibold text-[#03124E]  line-clamp-2">
            {item.title}
          </h4>
          {item.description && (
            <div
              className="text-gray-600 text-[14px] line-clamp-6"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          )}

          <div className="flex justify-between text-[14px] text-gray-500">
            <span>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
      <div className="pt-2 border-t border-[#000] text-[14px] text-[#21366B] font-semibold mt-3">
        Xem thêm
      </div>
    </div>
  );
};

export default CardNew;