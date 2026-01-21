"use client";

import { Check, CircleCheckBig, Dot, WifiZero } from "lucide-react";

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
  const splitSections = (text?: string): string[] => {
    if (!text) return [];

    // Làm sạch các wrapper không cần thiết
    const cleanHTML = text
      .replace(/<\/?div[^>]*>/gi, "")
      .replace(/<\/?span[^>]*>/gi, "")
      .trim();

    let parts = cleanHTML
      .split(/(?=<p|<ul|<ol|<h\d|<blockquote)/i)
      .map((b) => b.trim())
      .filter(Boolean);

    // Nếu phần đầu không phải là nội dung, bỏ qua
    if (parts[0] && !/<p|<ul|<ol|<h\d|<blockquote/i.test(parts[0])) {
      parts = parts.slice(1);
    }

    return parts;
  };

  const descriptionItems = splitSections(description || ""); // trả về mảng HTML string

  // const parser = new DOMParser();
  // const doc = parser.parseFromString(description, "text/html");
  // const elements = Array.from(doc.body.children);
  // const descriptionItems = elements.map((el) => el.outerHTML);

  // console.log("descriptionItems: ", descriptionItems);

  return (
    <div
      className={`grid lg:grid-cols-2 gap-12 items-center mb-16 ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div>
        <img
          src={image}
          alt="Content image"
          className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
        />
      </div>
      <div>
        <div className="space-y-6">
          {descriptionItems.map((desc, idx) => {
            // Nếu đoạn này là <ul> thì render từng <li> riêng
            if (desc.startsWith("<ul")) {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = desc;
              const listItems = Array.from(tempDiv.querySelectorAll("li")).map(
                (li) => li.innerHTML
              );

              return (
                <ul key={idx} className="space-y-3">
                  {listItems.map((li, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-start gap-3 text-gray-700 leading-relaxed pl-2"
                    >
                      <Dot
                        className="text-blue-900 mt-1 flex-shrink-0"
                        size={24}
                      />
                      <span dangerouslySetInnerHTML={{ __html: li }} />
                    </li>
                  ))}
                </ul>
              );
            }

            // Mặc định: các đoạn text hoặc <p>
            return (
              <div
                key={idx}
                className="flex items-start gap-3 text-gray-700 leading-relaxed"
              >
                <Check
                  className="text-blue-900 mt-1 flex-shrink-0 bg-[#99F3EA] p-0.5 rounded-full"
                  size={20}
                />
                <span dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
