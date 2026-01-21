import { BookOpen, CheckCircle2, Route, SquarePen } from "lucide-react";

const items = [
  {
    text: "Tư vấn lộ trình",
    href: "#tu-van",
    icon: <Route className="w-6 h-6 shrink-0" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    text: "Đăng ký học thử",
    href: "/xay-dung-lo-trinh",
    icon: <BookOpen className="w-6 h-6 shrink-0" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    text: "Đăng ký thi IELTS",
    href: "/dang-ky-thi-ielts-tai-idp",
    icon: <SquarePen className="w-6 h-6 shrink-0" />,
    color: "from-indigo-500 to-blue-600",
  },
  {
    text: "Free IELTS test",
    href: "/test-ai",
    icon: <CheckCircle2 className="w-6 h-6 shrink-0" />,
    color: "from-emerald-500 to-teal-500",
  },
];

export default function BoxHeaderBottom() {
  return (
    <div
      id="box_header_bottom"
      className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className={`group relative flex flex-col items-center justify-center rounded-2xl py-3.5 sm:py-6 px-6 text-white
                            shadow-lg hover:shadow-2xl transition-all duration-300
                            bg-gradient-to-br ${item.color}
                            hover:scale-[1.04]`}
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

            <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white shadow-inner group-hover:bg-white/25 transition-all duration-300">
              {item.icon}
            </div>

            {/* Text */}
            <span className="relative z-10 text-center text-sm md:text-base lg:text-lg font-semibold tracking-wide">
              {item.text}
            </span>

            <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
          </a>
        ))}
      </div>
    </div>
  );
}
