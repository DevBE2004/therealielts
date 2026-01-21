'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function IELTSCourseSection() {
  return (
    <section
  className="relative py-16 bg-cover bg-center bg-no-repeat overflow-hidden"
  style={{
    backgroundImage: "url('/images/woman-wearing-headphones-watches-online-video-call-living-room.png')",
  }}
>
  {/* Overlay mờ để làm nổi chữ */}
  {/* <div className="absolute inset-0 bg-gradient-to-r from-[#0a1831]/90 via-[#0a1831]/80 to-[#0a1831]/70"></div> */}

  <div className="relative container mx-auto px-6 md:px-10 z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      {/* === LEFT: Text content === */}
      <div className="text-center lg:text-left space-y-5">
        <h2 className="text-3xl lg:text-5xl font-sans font-[700] text-white leading-tight drop-shadow-md">
          Khóa học IELTS <br /> Tăng band kỹ năng
        </h2>
        <p className="text-lg font-sans text-blue-100 leading-relaxed max-w-lg mx-auto lg:mx-0">
          Chinh phục IELTS với phương pháp học tập hiệu quả, được thiết kế bởi đội ngũ chuyên gia hàng đầu.
        </p>
      </div>

      {/* === RIGHT: Video button === */}
      <div className="flex flex-col items-center lg:items-end gap-5">
        {/* Play Button */}
        <div className="relative group">
          <Link
            href="https://youtu.be/kfNT9JZOB5o?si=9cL8KyRMEo90eq-v"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-24 h-24 bg-red-600 rounded-xl shadow-2xl hover:shadow-blue-400/40 transition-transform transform hover:scale-110 active:scale-95 relative"
          >
            {/* Play triangle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[18px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1.5"></div>
            </div>
            {/* Ripple glow */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all"></div>
          </Link>
        </div>

        {/* Xem video link */}
        <Link
          href="https://youtu.be/kfNT9JZOB5o?si=9cL8KyRMEo90eq-v"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white hover:text-blue-200 transition"
        >
          <span className="font-semibold text-base">Xem video</span>
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>

    {/* === FEATURE ICONS === */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
      {[
        {
          iconBg: "bg-blue-600",
          title: "Lộ trình rõ ràng",
          desc: "Từ cơ bản đến nâng cao với mục tiêu cụ thể",
        },
        {
          iconBg: "bg-cyan-500",
          title: "Giáo viên chuyên môn",
          desc: "Đội ngũ giảng viên IELTS 8.0+ giàu kinh nghiệm",
        },
        {
          iconBg: "bg-indigo-500",
          title: "Thống kê chi tiết",
          desc: "Theo dõi tiến độ học tập và cải thiện liên tục",
        },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div
            className={`w-12 h-12 ${item.iconBg} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-black/20`}
          >
            {i === 0 && (
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {i === 1 && (
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            )}
            {i === 2 && (
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-blue-100">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
  )
}
