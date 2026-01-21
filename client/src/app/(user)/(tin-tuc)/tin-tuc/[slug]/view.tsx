"use client";

import CardNew from "@/components/common/card/card-new";
import { New } from "@/types";

export default function View({ data, slug, categoryName }: { data: New[]; slug: string; categoryName: string }) {
  return (
    <section className="w-full py-10">
      <div className="container mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 capitalize">
          Danh mục: {categoryName}
        </h2>

        {data.length === 0 ? (
          <p className="text-center text-gray-500">
            Không có tin tức nào trong danh mục này.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((item) => (
              <CardNew key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
