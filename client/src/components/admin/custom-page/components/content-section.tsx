"use client";

import { Text } from "@/components/ui/text";

interface ContentSectionProps {
  image: string;
  description: string;
  reverse?: boolean;
}

export default function ContentSection({
  image,
  description,
  reverse = false,
}: ContentSectionProps) {
  return (
    <div className="grid max-w-[1250px] m-auto lg:grid-cols-2 gap-12 items-center my-8 px-6">
      {/* Image */}
      <div className={reverse ? "lg:order-2" : "lg:order-1"}>
        <img
          src={image}
          alt="Content image"
          className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
        />
      </div>

      {/* Content */}
      <div className={reverse ? "lg:order-1" : "lg:order-2"}>
        <div className="space-y-6">
          <Text weight="regular" html={description} />
        </div>
      </div>
    </div>
  );
}
