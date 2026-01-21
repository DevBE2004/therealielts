"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSection = {
  items: FAQItem[];
};

type Props = {
  section1: FAQSection;
};

export default function FAQSection({ section1 }: Props) {
  const [openIndex, setOpenIndex] = useState<number[]>([0]); // Mở sẵn item đầu tiên

  const toggleItem = (index: number) => {
    setOpenIndex((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const items = Array.isArray(section1?.items) ? section1.items : [];

  return (
    <div className="container mx-auto px-4 bg-gray-50 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-secondary-50 mb-6 text-blue-900">
          Câu hỏi thường gặp
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Giải đáp những thắc mắc về đội ngũ giáo viên và phương pháp giảng dạy
          tại The Real IELTS
        </p>
      </div>

      {/* FAQ Items */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {items?.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-100 last:border-b-0"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex.includes(index) ? (
                    <svg
                      className="w-6 h-6 text-blue-600 transform rotate-45 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-400 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {/* Answer Content */}
              {openIndex.includes(index) && (
                <div className="px-8 pb-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
