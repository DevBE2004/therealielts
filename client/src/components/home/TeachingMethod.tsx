import Image from "next/image";
import { Users, Headphones, Clock } from "lucide-react";
import { BlockLearningMethod } from "@/types/homepage";

export default function TeachingMethod({
  data,
}: {
  data: BlockLearningMethod;
}) {
  return (
    <section id="teaching_method" className="w-full bg-white py-12">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Hình ảnh bên trái */}
          <div
            style={{
              boxShadow: "2px 2px 5px 0px rgba(0, 0, 0, 0.5)",
            }}
            className="relative w-full md:w-[50%] h-[420px] md:h-[620px] rounded-[50px] overflow-hidden"
          >
            {data?.image && (
              <Image
                src={data.image}
                alt="Phương pháp LCLT"
                fill
                className="object-cover object-center transition-transform"
                priority
              />
            )}
          </div>

          {/* Nội dung bên phải */}
          <div className="w-full md:w-[50%] flex flex-col gap-6">
            {/* Tiêu đề */}
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl uppercase font-sans font-[600] text-[#21366B]">
                {data?.title || "PHƯƠNG PHÁP GIẢNG DẠY"}
              </h2>
              <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-sans font-[700] text-[#21366B]">
                {data?.mainTitle || ""}
              </p>
              <p className="text-lg md:text-xl font-sans font-[500] text-[#21366B] mt-1">
                {data?.subTitle || ""}
              </p>
            </div>

            {/* Danh sách ưu điểm */}
            <div className="flex flex-col gap-6">
              {data?.content ? (
                <div
                  className="prose text-gray-700 leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              ) : (
                <>
                  {/* Ưu điểm 1 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Khai thác tối đa điểm mạnh của học viên
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        Giúp học viên phát huy điểm mạnh và có định hướng cụ thể
                        để học viên khắc phục điểm yếu. Hoặc một cách tích cực,
                        chủ động trong không khí hào hứng của lớp học chính là
                        chìa khoá để các bạn học viên phát huy tốt nhất khả năng
                        tiếp thu và vận dụng ngôn ngữ của mình.
                      </p>
                    </div>
                  </div>

                  {/* Ưu điểm 2 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Phát triển toàn diện 4 kỹ năng IELTS
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        Hướng học viên đến bản chất của ngôn ngữ Anh, giúp học
                        viên hình thành tư duy rõ ràng, linh hoạt. Từ đó, học
                        viên có thể vận dụng kiến thức một cách nhuần nhuyễn, tự
                        tin, đồng đều cả 4 kỹ năng nghe, nói, đọc, viết thay vì
                        chỉ giỏi hai kỹ năng kém chủ động là nghe và đọc.
                      </p>
                    </div>
                  </div>

                  {/* Ưu điểm 3 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Tiết kiệm 1/3 thời gian học so với các phương pháp thông
                        thường.
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        Sử dụng công nghệ trong việc học IELTS có thể giúp bạn
                        tiết kiệm thời gian và học tập hiệu quả hơn. Các công cụ
                        học tập trực tuyến như khóa học trực tuyến, ứng dụng học
                        tập và cộng đồng học tập online có thể giúp bạn học tập
                        mọi lúc, mọi nơi, với các bài học ngắn gọn, dễ hiểu và
                        được thiết kế riêng cho mục tiêu của bạn.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
