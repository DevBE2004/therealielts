import ReusableForm from "@/components/common/ReusableForm";
import RightCourseList from "@/components/common/RightCourseList";
import { HonorService } from "@/services/honor.service";
import { Course, CourseSchema } from "@/types";
import z from "zod";
import HonorSlide from "./HonorSlide";
import Image from "next/image";
import { CommonService } from "@/services/common.service";
import { HonorsSection } from "@/components/common";
import HeroSection from "@/components/tin-tuc/vinh-danh-hoc-vien/HeroSection";
import ConsultationForm from "@/components/common/ConsultationForm";
export const dynamic = "force-dynamic";

export default async function HonorPage() {
  let dataHonors: any[] = [];
  let dataCourses: Course[] = [];

  try {
    const res = await HonorService.list();
    dataHonors = res?.data ?? [];
  } catch (e) {
    console.error("HonorService.list() failed:", e);
  }

  try {
    const courses = await CommonService.getAll(CourseSchema, {
      query: {type: "COURSE", limit: 9999},
      revalidate: 600,
      tags: ["course"],
    });
    dataCourses = Array.isArray(courses?.data) ? courses.data.filter((c) => c.category?.name !== "package") : [];
  } catch (e) {
    console.error("CourseService.getall() failed:", e);
  }
  return (
    <main id="main" className="w-full min-h-screen bg-white flex flex-col">
      <div className="">
        <HeroSection data={dataHonors}/>
      </div>
      <div className="container mx-auto w-full max-w-[1250px] flex flex-col md:flex-row gap-8 px-4 py-10">
        {/* Nội dung chính */}
        <section className="w-full md:w-3/4 flex flex-col">
          <HonorsSection honors={dataHonors} />
          <div id="banner-honor" className="w-full flex justify-center items-center mt-4 mb-6">
          <div className="min-w-[350px] max-w-3xl flex justify-center items-center shadow-2xl border-gray-300 border rounded-3xl">
              <Image
                src='/images/Banner-phu_1-honorpage.jpg'
                alt="banner-honor-page"
                width={250}
                height={500}
                className="object-contain object-center"
              />
          </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <h2 className="text-xl text-blue-900 font-sans font-[700] underline px-4">Học Viên Điểm Cao</h2>
          <HonorSlide honors={dataHonors}/>
          </div>
        </section>

        {/* Sidebar */}
        <aside
          id="side-bar"
          className="w-full md:w-1/4 flex flex-col gap-10 md:gap-7 px-16 md:px-0 mx-auto"
          aria-label="Sidebar"
        >
          <ReusableForm
            title="ĐĂNG KÝ TƯ VẤN LỘ TRÌNH HỌC IELTS"
            description="Hãy để chúng tôi giúp bạn xây dựng lộ trình học tập phù hợp nhất"
            layout="sidebar"
            fields={[
              { name: "name", label: "Họ tên", type: "text", required: true },
              {
                name: "mobile",
                label: "Số điện thoại",
                type: "tel",
                required: true,
              },
              { name: "email", label: "Email", type: "email", required: true },
              {
                name: "yearOfBirth",
                label: "Năm sinh",
                type: "year",
                required: true,
              },
              {
                name: "goal",
                label: "Mục tiêu học",
                type: "radio",
                options: [
                  { value: "Xét tuyển đại học", label: "Xét tuyển ĐH" },
                  { value: "Phục vụ công việc", label: "Phục vụ công việc" },
                ],
              },
              { name: "difficult", label: "Ghi chú", type: "textarea" },
            ]}
            submitText="Đăng ký ngay"
            apiPath="/consultation/create"
          />
          <RightCourseList title="Khóa Học Nổi Bật" courses={dataCourses} />
        </aside>
      </div>
      <div id="tu-van-lo-trinh">
      <ConsultationForm/>
      </div>
    </main>
  );
}
