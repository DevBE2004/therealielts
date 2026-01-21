import { TeachersSection } from "@/components/common";
import ConsultationForm from "@/components/common/ConsultationForm";
import FAQSection from "@/components/common/FAQSection";
import GoogleFormEmbed from "@/components/common/GoogleFormEmbed";
import IELTSCourseSection from "@/components/common/IELTSCourseSection";
import NewsSection from "@/components/common/NewsSection";
import { CommonService } from "@/services/common.service";
import { CourseService } from "@/services/course.service";
import { IntroduceService } from "@/services/introduce.service";
import { NewService } from "@/services/new.service";
import { TeacherService } from "@/services/teacher.service";
import { CourseSchema, New, NewSchema, Teacher, TeacherSchema } from "@/types";
import z from "zod";
export const dynamic = "force-dynamic";

export default async function AboutTeachers() {
  const teachersRes = await TeacherService.list();
  const courses = await CommonService.getAll(CourseSchema, {
    query: {type: "COURSE", limit: 9999},
    revalidate: 300,
    tags: ["course"]
  });
  const newsRes = await CommonService.getAll(NewSchema, {
    query: {isActive: true, type: "NEW", limit: 10},
    revalidate: 300,
    tags: ["new"]
  });

  const dataTeachers: Teacher[] = Array.isArray(teachersRes.teachers)
    ? teachersRes.teachers.flatMap((t) => (Array.isArray(t) ? t : [t]))
    : [];
  const dataCourses = courses.data;
  const dataNews: New[] = Array.isArray(newsRes.data)
    ? newsRes.data.flatMap((n) => (Array.isArray(n) ? n : [n]))
    : [];

  const record3 = await IntroduceService.getOne(z.any(), 3);
  const faqSection = record3?.data?.section1;
  const formUrl = record3?.data?.section2;

  return (
    <div className="min-h-screen relative w-full bg-white">
      {/* Teachers Section */}

      <TeachersSection teachers={dataTeachers} />

      {/* News Section */}
      <NewsSection data={dataNews} />

      {/* IELTS Course Section */}
      <IELTSCourseSection />

      {/* GG FORM */}  
      <div className="py-10">     
      <GoogleFormEmbed section2={formUrl}/>
      </div>

      {/* FAQ Section */}
      <FAQSection section1={faqSection}/>

      <ConsultationForm />
    </div>
  );
}
