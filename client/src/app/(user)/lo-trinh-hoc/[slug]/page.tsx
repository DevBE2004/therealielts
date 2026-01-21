import { RoadmapService } from "@/services/roadmap.service";
import Image from "next/image";
import { notFound } from "next/navigation";
import YouTubeLite from "../../../../components/YoutubeLite";
import { BookOpen, CheckCircle, Rocket, Target, User } from "lucide-react";
import { Metadata } from "next";
import ConsultationForm from "@/components/common/ConsultationForm";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const res = await RoadmapService.getOne(slug);

  if (!res.success) {
    return {
      title: "Lộ trình học IELTS - The Real IELTS",
      description:
        "Khám phá lộ trình học IELTS phù hợp với bạn tại The Real IELTS",
    };
  }

  const roadmap = res.data;

  return {
    title: `${roadmap?.title} | Lộ trình học IELTS - The Real IELTS`,
    description:
      roadmap?.description.slice(0, 160) ||
      "Khám phá lộ trình học IELTS phù hợp với bạn tại The Real IELTS",
    openGraph: {
      title: roadmap?.title,
      description: roadmap?.description,
      type: "article",
      url: `https://therealielts.com/lo-trinh-hoc/${roadmap?.slug}`,
      images: [
        {
          url: "/images/LEARNER-CENTERED-1.webp",
          width: 1200,
          height: 630,
          alt: roadmap?.title,
        },
      ],
    },
  };
}

export default async function CourseDetail({ params }: PageProps) {
  const { slug } = await params;

  const resRoadmap = await RoadmapService.getOne(slug);
  if (!resRoadmap.success) return notFound();
  const dataRoadmaps = resRoadmap.data;
  const goals = dataRoadmaps?.goal || [];
  console.log("ROADMAP DETAIL: ", dataRoadmaps);

  const icons = [CheckCircle, Target, BookOpen, Rocket, User];
  return (
    <main>
      <section className="relative w-full">
        <div className="bg-blue-900 w-full h-[600px] rounded-b-[120px] md:rounded-b-[200px] relative overflow-hidden"></div>

        {/* Nội dung */}
        <div className="absolute top-0 right-0 left-0 w-full h-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
          {/* Text */}
          <div className="text-white md:w-1/2 mt-20 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Thông tin về
              <span className="text-cyan-400"> {dataRoadmaps?.title}</span> của
              The Real IELTS
            </h1>
            <p className="text-base md:text-lg mb-6 line-clamp-4 lg:line-clamp-5">
              {dataRoadmaps?.description}
            </p>
            <a
              href="#dang-ky-lo-trinh"
              className="bg-pink-600 px-6 py-3 rounded-lg text-white font-semibold hover:bg-pink-700 transition"
            >
              Đăng ký ngay
            </a>
          </div>
          {/* Hình ảnh */}
          <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-white shadow-lg">
              <Image
                src="/images/image-lo-trinh.png"
                alt="Giảng viên"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className=" w-full py-12">
        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1450px] items-center mx-auto px-4 justify-center">
          {/* Left: YouTube embed */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <YouTubeLite idYoutube="4htUoKXBorU" />
          </div>

          {/* Right: Goals */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {goals && goals.length > 0
                ? Object.values(goals[0])[0] || "Mục tiêu của lộ trình học"
                : "Mục tiêu của lộ trình học"}
            </h2>

            {goals && goals.length > 0 && goals[0] ? (
              <p className="text-base text-gray-600">
                {Object.values(goals[0])[1] || ""}
              </p>
            ) : null}

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal, index) => {
                const Icon = icons[index % icons.length];
                const goalValues = Object.values(goal);
                return (
                  <li key={index} className="group">
                    <div
                      className="rounded-xl p-[1.5px]"
                      style={{
                        background:
                          "conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)",
                      }}
                    >
                      <div
                        tabIndex={0}
                        role="button"
                        className="bg-white rounded-lg p-4 transition-transform duration-200 ease-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 bg-blue-50 rounded-full p-2">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {goalValues[0] || ""}
                            </h3>
                            {goalValues[1] && (
                              <p className="text-sm text-gray-600 mt-1">
                                {goalValues[1]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/xay-dung-lo-trinh"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition font-medium"
            >
              Xây Dựng Lộ Trình Cho Riêng Bạn
            </Link>
          </div>
        </div>
      </section>
      <section id="dang-ky-lo-trinh" className="w-full">
        <ConsultationForm />
      </section>
    </main>
  );
}
