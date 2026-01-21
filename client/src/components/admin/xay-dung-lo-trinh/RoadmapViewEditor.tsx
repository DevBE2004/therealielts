"use client";

import FeatureBoxes from "@/components/common/FeatureBoxes";
import WhyChooseTRI from "@/components/common/WhyChooseTRI";
import SlideBase from "@/components/ui/Slide";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Banner, Course } from "@/types";
import ConsultationForm from "@/components/common/ConsultationForm";
export const dynamic = "force-dynamic";

interface IRoadmapUIData {
  section1: {
    title: string;
    subtitle1: string;
    subtitle2: string;
    linkImage: string;
    contentImage: string;
  };
  section2: {
    leftBlock: {
      linkImage: string;
      content: string;
    };
    mainBlock: {
      linkImage: string;
      content: string;
    };
    rightBlock: {
      linkImage: string;
      content: string;
    };
  };
  section3: {
    title: string;
  };
  section4: {
    title: string;
    content: string;
    linkImage: string;
  }[];
}

type Props = {
  dataBanner?: Banner[];
  dataCourse?: Course[];
  record7: IRoadmapUIData;
};

export default function RoadmapViewEditor({ dataBanner, dataCourse }: Props) {
  const breakpoint = useBreakpoint();
  if (breakpoint === null) return null;
  let slideHeight = 500;
  if (breakpoint === "xsMobile") slideHeight = 250;
  if (breakpoint === "mobile") slideHeight = 350;
  if (breakpoint === "tablet") slideHeight = 450;
  if (breakpoint === "desktop") slideHeight = 550;

  return (
    <div id="main" className="flex flex-col min-h-screen">
      <section id="box_header" className="w-full bg-[#20376C] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <header className="w-full md:w-1/2 text-white mb-6 md:mb-0">
            <h1 className="uppercase font-bold text-2xl md:text-3xl lg:text-4xl leading-snug mb-3">
              Xây dựng <br />
              lộ trình học
            </h1>
            <p className="text-base lg:text-lg font-normal">
              Là bước đầu tiên trong quá trình chinh phục điểm cao IELTS.
            </p>
          </header>

          {/* Right Content */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <p className="text-white text-base lg:text-lg font-medium">
              Xây dựng lộ trình <span className="italic">"cá nhân hóa"</span> là
              xây dựng lộ trình học phù hợp với từng học viên.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col-reverse md:flex-col gap-5">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                <a
                  href="#xay-dung-lo-trinh-ca-nhan-hoa"
                  className="bg-gradient-to-r from-orange-100 to-orange-200 text-blue-900 font-medium px-5 py-2.5 rounded-lg shadow-md text-center"
                >
                  Xây lộ trình IELTS cho tôi
                </a>
                <a
                  href="#dang-ky-tu-van"
                  className="bg-gradient-to-r from-sky-200 to-sky-100 text-blue-900 font-medium px-5 py-2.5 rounded-lg shadow-md text-center"
                >
                  Đăng ký nhận tư vấn
                </a>
              </div>

              {/* Achievement */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <a href="/vinh-danh-hoc-vien" className="flex-shrink-0">
                  <img
                    src="/images/unnamed-file.png"
                    alt="Logo thành tích học viên"
                    className="h-11 w-auto object-contain"
                    loading="lazy"
                  />
                </a>
                <div className="text-white">
                  <p className="text-2xl font-bold">1200+</p>
                  <p className="text-base font-semibold -mt-1">
                    Học viên đạt IELTS 7.0+
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="banner-xay-dung-lo-trinh"
        className="w-full flex flex-col bg-[#20376C]"
      >
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-6xl lg:w-[80%]">
            <SlideBase items={dataBanner} height={slideHeight} />
          </div>
        </div>
        <div className="w-full">
          <FeatureBoxes />
        </div>
      </section>

      <section id="xay-dung-lo-trinh-ca-nhan-hoa" className="w-full">
        <div className="w-full">
          <h2 className="text-center font-bold text-5xl text-sky-950">
            Xây Lộ Trình Học IELTS Cá Nhân Hóa
          </h2>
          <p className="p-5 bg-blue-200">Logic & Giao diện xây dựng lộ trình</p>
        </div>
      </section>

      <section
        id="why-choose-TRI"
        className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
      >
        <div className="w-full">
          <h2 className="text-center font-bold text-4xl text-sky-950 uppercase mt-4">
            Vì sao bạn nên lựa chọn the real ielts?
          </h2>
          <WhyChooseTRI />
        </div>
      </section>
      <section id="dang-ky-tu-van" className="w-full">
        <ConsultationForm />
      </section>
    </div>
  );
}
