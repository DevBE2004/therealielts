"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

type section1 = {
  items: FAQItem[];
};

type Props = {
  data: section1;
  onChange: (newData: section1) => void;
};

export default function FaqEditor({ data, onChange }: Props) {
  const [localData, setLocalData] = useState<section1>({
    items: data?.items || [],
  });

  const [openItems, setOpenItems] = useState<number[]>([]);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setLocalData({ items: data?.items || [] });
  }, [data]);

  const handleItemChange = (id: number, key: keyof FAQItem, value: string) => {
    const updatedItems = localData.items.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    );
    const newData = { items: updatedItems };
    setLocalData(newData);
    onChange(newData);
  };

  const addNewItem = () => {
    const newItem: FAQItem = {
      id: Date.now(),
      question: "",
      answer: "",
    };
    const newData = { items: [...localData.items, newItem] };
    setLocalData(newData);
    onChange(newData);
  };

  const removeItem = (id: number) => {
    const newData = {
      items: localData.items.filter((item) => item.id !== id),
    };
    setLocalData(newData);
    onChange(newData);
  };

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-sm">
      {/* 🔹 Thanh tiêu đề + nút toggle */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Câu hỏi thường gặp (FAQ Section)
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-2"
        >
          {showEditor ? (
            <>
              Ẩn chỉnh sửa <ChevronUp size={16} />
            </>
          ) : (
            <>
              Hiện chỉnh sửa <ChevronDown size={16} />
            </>
          )}
        </Button>
      </div>

      {/* 🔸 Phần nội dung ẩn/hiện */}
      {showEditor && (
        <div className="py-10 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-4">
            {/* 🟦 LEFT: Editable Form */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              {localData.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative"
                >
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={18} />
                  </button>

                  <Input
                    value={item.question}
                    onChange={(e) =>
                      handleItemChange(item.id, "question", e.target.value)
                    }
                    placeholder="Câu hỏi..."
                    className="mb-3"
                  />

                  <Textarea
                    value={item.answer}
                    onChange={(e) =>
                      handleItemChange(item.id, "answer", e.target.value)
                    }
                    placeholder="Câu trả lời..."
                    rows={3}
                  />
                </div>
              ))}

              <Button
                onClick={addNewItem}
                variant="outline"
                className="flex items-center gap-2 self-start"
              >
                <Plus size={18} /> Thêm câu hỏi
              </Button>
            </div>

            {/* 🟨 RIGHT: Live Preview (dựa theo FAQSection) */}
            <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-inner px-6 py-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-3">
                  Câu hỏi thường gặp
                </h2>
                <p className="text-gray-600 text-sm">
                  Giải đáp những thắc mắc phổ biến từ học viên
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl shadow border border-gray-100 overflow-hidden">
                {localData.items.map((item) => (
                  <div key={item.id} className="border-b border-gray-100">
                    {/* Question */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition"
                    >
                      <span className="font-semibold text-gray-800 pr-4">
                        {item.question || "Câu hỏi mới"}
                      </span>
                      <div className="flex-shrink-0">
                        {openItems.includes(item.id) ? (
                          <svg
                            className="w-5 h-5 text-blue-600 transform rotate-45 transition-transform"
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
                            className="w-5 h-5 text-gray-400"
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

                    {/* Answer */}
                    {openItems.includes(item.id) && (
                      <div className="px-5 pb-4 bg-white">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {item.answer || "Nhập nội dung câu trả lời..."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
