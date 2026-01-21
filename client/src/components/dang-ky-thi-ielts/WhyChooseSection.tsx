import Image from "next/image";

type section3 = {
  title: string;
  content: string;
  scheduleTitle: string;
};

type Props = {
  section3Record6: section3;
  images3Record6: string[];
};

export default function WhyChooseSection({ section3Record6, images3Record6 }: Props) {
  
  const title =
    section3Record6?.title ||
    "Tại sao nên đăng ký thi IELTS tại Trung tâm khảo thí ANT EDU?";
  const contentHtml = section3Record6?.content;
  const scheduleTitle = section3Record6?.scheduleTitle || "Lịch Thi IELTS";
  const scheduleImage = images3Record6?.[0] || "/images/lich-thi-thang-8.webp";

  return (
    <>
      <section id="tai-sao-dang-ky" className="w-full py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-6">
          <h2 className="text-blue-900 text-2xl md:text-3xl lg:text-4xl font-semibold text-center lg:text-left leading-snug">
            {title}
          </h2>

          <div>
            {contentHtml ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: contentHtml,
                }}
              />
            ) : (
              <div className="p-10 text-center font-[700] text-gray-800 animate-pulse">
                Nội dung chưa được cập nhật!
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="lich-thi-IELTS" className="w-full py-8 md:py-12">
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-4">
          <h2 className="text-blue-900 text-2xl md:text-3xl lg:text-4xl font-semibold text-center lg:text-left leading-snug">
            {scheduleTitle}
          </h2>
          <div className="w-full flex justify-center">
            <Image
              src={scheduleImage}
              alt="Lịch thi IELTS"
              width={1200}
              height={600}
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      </section>
    </>
  );
}
