"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6">
      {/* Animation số 404 */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[120px] font-extrabold leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Tiêu đề */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-3xl font-bold mb-4"
      >
        Ôi! Trang bạn tìm không tồn tại.
      </motion.h2>

      {/* Mô tả */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 mb-8 max-w-md text-center"
      >
        Có thể đường dẫn đã sai hoặc trang này đã bị xóa. Hãy quay về trang chủ
        để tiếp tục trải nghiệm nhé.
      </motion.p>

      {/* Nút quay về */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg font-semibold"
        >
          ⬅ Về trang chủ
        </Link>
      </motion.div>
    </div>
  );
}
