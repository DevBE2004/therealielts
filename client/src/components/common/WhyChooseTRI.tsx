"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Book,
  Users,
  Rocket,
  FileCheck,
  ClipboardList,
  Smile,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Users size={34} strokeWidth={1.8} />,
    title: "Giáo viên chất lượng cao",
    description: [
      "Giáo viên 8.0",
      "IELTS Trợ giảng 6.5+ IELTS",
      "Đội ngũ nhiệt huyết, giàu kinh nghiệm và trải nghiệm",
    ],
    image: (
      <Image
        src="/features/s4-img-1.png"
        alt="Giáo viên chất lượng"
        width={180}
        height={180}
        className="object-contain"
      />
    ),
  },
  {
    id: 2,
    icon: <Rocket size={34} strokeWidth={1.8} />,
    title: "Tối ưu hóa thời gian học tập",
    description: [
      "Lộ trình 0 – 7.5+ IELTS chỉ 16 tháng",
      "Giáo trình tinh gọn, trọng tâm",
      "Kèm thêm 1-1 miễn phí nếu học viên không theo kịp tiến độ học",
    ],
    image: (
      <Image
        src="/features/s4-img-2-300.png"
        alt="Tối ưu học tập"
        width={180}
        height={180}
        className="object-contain"
      />
    ),
  },
  {
    id: 3,
    icon: <Book size={34} strokeWidth={1.8} />,
    title: "Phương pháp LCLT ưu việt",
    description: [
      "Cá nhân hóa giáo trình",
      "Xây dựng tư duy ngôn ngữ",
      "Lấy học viên làm trung tâm của mọi hoạt động giảng dạy",
    ],
    image: (
      <Image
        src="/features/s4-img-3.png"
        alt="Phương pháp LCLT"
        width={180}
        height={180}
        className="object-contain"
      />
    ),
  },
  {
    id: 4,
    icon: <FileCheck size={34} strokeWidth={1.8} />,
    title: "Lớp học nhỏ – Cam kết 100% đầu ra",
    description: [
      "Lớp học nhỏ chỉ 8 – 12 học viên giúp tăng thời gian tương tác trực tiếp giữa giáo viên và học viên",
      "Cam kết đầu ra bằng văn bản. Dạy lại miễn phí hoặc hoàn tiền 100% nếu không đạt cam kết",
    ],
    image: (
      <Image
        src="/features/Lop-hoc-nho.png"
        alt="Lớp học nhỏ"
        width={180}
        height={180}
        className="object-contain"
      />
    ),
  },
  {
    id: 5,
    icon: <ClipboardList size={34} strokeWidth={1.8} />,
    title: "Giáo trình độc quyền",
    description: [
      "Biên tập từ những nguồn uy tín nhất, chọn lọc kỹ càng bởi các cố vấn chuyên môn đến từ Hội đồng Anh và giám khảo chấm thi IELTS.",
      "Bộ đề thi thật cập nhật liên tục theo tháng, quý",
    ],
    image: (
      <Image
        src="/features/giao-trinh.png"
        alt="Giáo trình độc quyền"
        width={180}
        height={180}
        className="object-contain"
      />
    ),
  },
  {
    id: 6,
    icon: <Smile size={34} strokeWidth={1.8} />,
    title: "Lớp học hứng khởi",
    description: [
      "Lớp học của The Real IELTS đem lại sự tập trung cao độ dựa trên sự thú vị, lôi cuốn của bài giảng và năng lượng tích cực của đội ngũ giáo viên tài năng.",
    ],
    image: (
      <Image
        src="/features/Lop-hoc-hung-khoi.png"
        alt="Lớp học hứng khởi"
        width={180}
        height={180}
        className="object-contain"
      />
    ),
  },
];

export default function WhyChooseTRI() {
  return (
    <div
      className="w-full py-10 -mt-2.5"
      aria-label="Ưu điểm nổi bật"
    >
      <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <motion.article
            key={feature.id}
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl shadow-md bg-white hover:bg-indigo-50/70 transition-all duration-300 flex flex-col p-8"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="text-indigo-600">{feature.icon}</span>
              <h2 className="text-xl font-bold text-gray-800 leading-snug">
                {feature.title}
              </h2>
            </div>

            {/* Nội dung */}
            <ul className="list-disc list-inside text-gray-700 text-base space-y-2 flex-1 leading-relaxed">
              {feature.description.map((desc, idx) => (
                <li key={idx}>{desc}</li>
              ))}
            </ul>
            <div className="flex justify-center mt-8">{feature.image}</div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
