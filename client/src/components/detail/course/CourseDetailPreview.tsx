import CourseDescriptionCard from "@/components/common/CourseDescriptionCard";
import {
  BookCheck,
  BookOpen,
  CheckCircle,
  History,
  LibraryBig,
  PencilLine,
  Rocket,
  Star,
  Target,
  User,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { formatDateVi } from "@/hooks/formatDate";
import { splitSections } from "@/hooks/splitSections";
import { TeachersSection } from "@/components/common";
import { TeacherService } from "@/services/teacher.service";
import FAQSection from "@/components/common/FAQSection";
import RightCourseList from "@/components/common/RightCourseList";
import HonorSlide from "@/components/ui/HonorSlide";
import { HonorService } from "@/services/honor.service";
import ConsultationForm from "@/components/common/ConsultationForm";
import { Lesson } from "@/types/lesson";
import CourseLessons from "./CourseLessons";
import { Course, Teacher, TeacherSchema } from "@/types";
import { IntroduceService } from "@/services/introduce.service";
import z from "zod";

export const dynamic = "force-dynamic";

type PageProps = {
  courses: Course[];
  data: Course;
};

export default async function CourseDetailPreview({ courses, data }: PageProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center text-center py-20">
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          Không tìm thấy thông tin khóa học.
        </p>
        <p className="text-gray-500">Vui lòng thử lại sau hoặc chọn khóa học khác.</p>
      </main>
    );
  }

  const icons = [
    CheckCircle,
    Target,
    BookOpen,
    Rocket,
    User,
    PencilLine,
    LibraryBig,
  ];

  const dataAllCourses: Course[] = Array.isArray(courses)
    ? courses.filter((c) => c?.category?.name !== "package")
    : [];

  // Fetch honors
  let dataHonors: any[] = [];
  try {
    const allHonors = await HonorService.list(3600);
    if (allHonors?.success && Array.isArray(allHonors.data)) {
      dataHonors = allHonors.data;
    }
  } catch (err) {
    console.error("Lỗi khi fetch honors:", err);
  }

  // Lessons
  let sortedLessons: Lesson[] = [];
  if (Array.isArray(data.lessons) && data.lessons.length > 0) {
    sortedLessons = [...data.lessons].sort(
      (a, b) => a.order_index - b.order_index
    );
  }

  const sectionsCourse = splitSections(data?.description || "");

  // Teachers
  let dataTeachers: Teacher[] = [];
  try {
    const resTeachers = await TeacherService.list();
    if (resTeachers?.success && Array.isArray(resTeachers.teachers)) {
      dataTeachers = resTeachers.teachers.map((t: any) => TeacherSchema.parse(t));
    }
  } catch (err) {
    console.error("Lỗi khi fetch teachers:", err);
  }

  // FAQ
  let faqSection: any;
  try {
    const record3 = await IntroduceService.getOne(z.any(), 3);
    faqSection = record3?.data?.section1;
  } catch (err) {
    console.error("Lỗi khi fetch FAQ:", err);
  }

  return (
    <main id="main" className="w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Course Info */}
          <article className="bg-white rounded-2xl shadow p-8">
            <h1 className="text-4xl uppercase font-extrabold text-gray-900 leading-snug">
              {data?.title || "Title chưa được cập nhật"}
            </h1>

            <div className="flex items-center gap-1 my-5 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-7 h-7 fill-yellow-400 stroke-yellow-400" />
              ))}
              <span className="ml-3 text-lg text-gray-700">
                4.9/5.0 (1400+ đánh giá)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-8 my-6 text-lg text-gray-600">
              <p className="flex items-center gap-2">
                <History className="w-6 h-6 text-blue-600" />
                Cập nhật:{" "}
                {data?.updatedAt
                  ? formatDateVi(new Date(data.updatedAt))
                  : "Chưa cập nhật"}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                1400+ học viên đã học
              </p>
            </div>

            {/* Description */}
            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">
                {data?.title} là khóa học:
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {sectionsCourse.length === 0 ? (
                  <div className="flex items-center gap-3 text-lg text-gray-800 bg-gray-50 rounded-xl p-4">
                    <BookCheck className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                    <span>{data?.description || "Chưa có mô tả khóa học."}</span>
                  </div>
                ) : (
                  sectionsCourse.map((seg, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-lg text-gray-800 bg-gray-50 rounded-xl p-4"
                    >
                      <BookCheck className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                      <span>{seg}</span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Benefits */}
            {Array.isArray(data?.benefit) && data.benefit.length > 0 && (
              <section className="mt-12">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h2 className="text-2xl font-sans font-[600]">
                    Bạn sẽ đạt được gì{" "}
                    <span className="text-blue-700 font-sans font-[700] bg-gray-300 py-1 px-3 rounded-[10px]">
                      sau khóa học
                    </span>
                  </h2>
                  <a
                    href="#dang-ky-tu-van"
                    className="text-base font-semibold uppercase text-white bg-blue-600 px-5 py-3 rounded-xl shadow hover:bg-blue-700 transition"
                  >
                    Đăng ký nhận lộ trình học
                  </a>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.benefit.map((goal, index) => {
                    const Icon = icons[index % icons.length];
                    return (
                      <li key={index} className="group h-full">
                        <div
                          className="rounded-xl p-[1.5px] h-full"
                          style={{
                            background:
                              "conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)",
                          }}
                        >
                          <div
                            tabIndex={0}
                            role="button"
                            className="bg-white rounded-lg p-4 transition-transform duration-200 ease-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-200 h-full flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-start gap-4">
                              <div className="flex-shrink-0 bg-blue-50 rounded-full p-2">
                                <Icon className="w-6 h-6 text-blue-700" />
                              </div>
                              <div>
                                <h3 className="text-[17px] font-sans font-[500] text-[#20376C]">
                                  {goal.title || ""}
                                </h3>
                                <p className="text-[15px] font-sans font-[500] text-[#20376C] mt-1">
                                  {goal.description || ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </article>

          {/* Lessons */}
          <CourseLessons lessons={sortedLessons} />
        </div>

        {/* Right Column */}
        <aside className="lg:col-span-1 space-y-8">
          <CourseDescriptionCard
            urlYoutube={data?.urlYoutube || ""}
            descriptionSidebar={data?.descriptionSidebar || ""}
            title={data?.title}
          />
          <RightCourseList
            title="các khóa học nổi bật khác"
            courses={dataAllCourses}
          />
        </aside>
      </div>

      {/* Teachers */}
      {dataTeachers.length > 0 && (
        <section className="w-full max-w-[1450px] mx-auto px-4 py-8">
          <TeachersSection teachers={dataTeachers} course={data} />
        </section>
      )}

      {/* FAQ + Honors */}
      <section className="flex flex-col md:flex-row gap-6 lg:gap-8 w-full max-w-[1450px] mx-auto px-4 py-8">
        {faqSection && (
          <div className="w-full md:w-[50%] col-span-1">
            <FAQSection section1={faqSection} />
          </div>
        )}
        {dataHonors.length > 0 && (
          <div className="w-full md:w-[50%] col-span-2">
            <HonorSlide
              title="Review học viên khóa IELTS tại TRI"
              honors={dataHonors}
            />
          </div>
        )}
      </section>

      {/* Consultation Form */}
      <section id="dang-ky-tu-van">
        <ConsultationForm />
      </section>
    </main>
  );
}
