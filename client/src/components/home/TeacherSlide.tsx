import TeacherSwiper from "./TeacherSwiper";
import { TeacherService } from "@/services/teacher.service";

export default async function TeacherSlide() {
  const fetchTeachers = await TeacherService.list({}, 600);
  const teachers: any[] = Array.isArray(fetchTeachers.teachers)
    ? fetchTeachers.teachers
    : [];

  if (!teachers.length) {
    return null;
  }

  return (
    <section className="py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Title */}
        <div className="w-full flex flex-col items-center justify-center px-4 py-2 mb-5">
          <h2 className="text-2xl lg:text-3xl font-sans font-[700] text-[#21366B] uppercase mb-1.5">
            đội ngũ giáo viên the real ielts
          </h2>
          <p className="text-sm sm:text-base text-center font-sans font-[400] text-[#000080]">
            Chinh phục IELTS dễ dàng với The Real IELTS Trải nghiệm học tiếng
            Anh cùng đội ngũ giáo viên nhiệt huyết, tận tâm và có bề dày về kinh
            nghiệm giảng dạy
          </p>
        </div>

        {/* Swiper */}
        <TeacherSwiper teachers={teachers} />
      </div>
    </section>
  );
}
