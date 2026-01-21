"use client";

import DocumentTOC from "@/components/common/DocumentTOC";
import { Document } from "@/types";
import { injectHeadingIds } from "@/utils/injectHeadingIds";
import Image from "next/image";

type Props = {
  data: Document;
};

export default function DocumentDetailMainContent({ data }: Props) {
  const descriptionHtml = injectHeadingIds(data?.description);

  return (
    <section className="w-full xl:w-4/5 flex flex-col lg:flex-row gap-10">
      {/* TOC */}
      <aside className="lg:w-1/4 hidden lg:block">
        <DocumentTOC
          content={descriptionHtml}
          maxLevel={4}
          className="sticky top-28"
        />
      </aside>

      {/* Document Content */}
      <article className="flex-1 bg-white rounded-2xl shadow-md overflow-hidden">
        {Array.isArray(data?.images) && data.images.length > 0 && (
          <div className="relative w-full aspect-video">
            <Image
              src={data?.images[0]}
              alt={data.title}
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        )}
        <div className="p-6 md:p-10 prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-700">
          {descriptionHtml !== undefined ? (
            <div
              id="article-content"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <div className="text-center text-gray-800 mt-12 text-lg italic animate-pulse">
              Không có bài viết liên quan, vui lòng tìm kiếm bài viết khác.
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
