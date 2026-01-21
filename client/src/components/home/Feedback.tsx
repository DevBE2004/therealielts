import { Comment } from "@/types/comment";
import Image from "next/image";
import { CommentService } from "@/services/comment.service";
import FeedbackSwiper from "./FeedbackSwiper";

export default async function Feedback() {
  const res = await CommentService.getAll();
  const dataComment: Comment[] = Array.isArray(res.data) ? res.data : [];

  if (!dataComment.length) {
    return null;
  }

  return (
    <section className="w-full bg-gray-50 pb-12 pt-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-5 lg:gap-10 px-4 md:px-8">
        {/* Left */}
        <div className="w-full lg:w-[40%] text-center lg:text-left space-y-2">
          <h2 className="font-sans font-[700] text-2xl md:text-3xl lg:text-4xl text-gray-800 leading-snug">
            CẢM NHẬN HỌC VIÊN <br />
            <span className="text-sky-600">ÔN LUYỆN IELTS</span>
          </h2>
          <div className="hidden lg:block">
            <Image
              src="/images/cam-nhan-hoc-vien.png"
              alt="Cảm nhận học viên"
              width={300}
              height={350}
              className="object-contain mx-auto"
            />
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-[60%] lg:flex-1">
          <FeedbackSwiper comments={dataComment} />
        </div>
      </div>
    </section>
  );
}
