import Image from "next/image";
import YouTubeLite from "../YoutubeLite";
import { extractYoutubeId } from "@/hooks/extractYoutubeId";

// const section2 = {
//     title: "Đăng ký thi IELTS tại IDP",
//     address: "Trung tâm khảo thí ANT EDU: Tầng 2, Tòa nhà CT1A, Sevin Office, Nam Đô Complex, 609 Trương Định, Phường Thịnh Liệt, Quận Hoàng Mai, Thành phố Hà Nội, Việt Nam là địa điểm thi IELTS chính thức được đối tác IDP thừa nhận và được Bộ Giáo dục và Đào tạo cấp phép từ ngày 11/06/2024."

// }

type section2 = {
  title: string;
  address: string;
  content: string;
  urlYoutube: string;
};

type Props = {
  section2Record6: section2;
  images2Record6: string[];
};

export default function IntroSection({
  section2Record6,
  images2Record6,
}: Props) {
  const videoId = extractYoutubeId(section2Record6?.urlYoutube || "");
  const image1 = images2Record6?.[0] || "/images/dia-diem-thi-ielts.png";
  const image2 = images2Record6?.[1] || "/images/idp-parners-excellence-awards-2024-1024x512.webp";
  const contentHtml = section2Record6?.content || "Nội dung về chi phí thi chưa được cập nhật";

  return (
    <section id="dang-ky" className="w-full py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Left Column */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-blue-900 text-center lg:text-left text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug">
            {section2Record6?.title || "Tiêu đề chưa cập nhật"}
          </h1>

          {/* Địa điểm */}
          <div className="text-gray-800 bg-gray-300 px-3 md:px-6 lg:px-4 py-5 rounded-2xl text-base lg:text-lg">
            <p>{section2Record6?.address || "Địa chỉ chưa cập nhật"}</p>
          </div>

          {/* Phí thi */}
          <div>
            <div 
              dangerouslySetInnerHTML={{__html: contentHtml}}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* Hình ảnh 1 */}
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
            <Image
              src={image1}
              alt="Trung tâm khảo thí ANT EDU"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Hình ảnh 2 */}
          <div className="relative w-full h-40 md:h-48 lg:h-60 rounded-2xl overflow-hidden">
            <Image
              src={image2}
              alt="IDP IELTS"
              fill
              className="object-cover"
            />
          </div>

          {/* Video YouTubeLite */}
          <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg">
            {videoId ? (
              <YouTubeLite idYoutube={videoId} />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                Video not available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
