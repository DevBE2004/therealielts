import ButtonBase from "../ui/ButtonBase";
import { HonorService } from "@/services/honor.service";
import HonorSwiper from "./HonorSwiper";

export default async function HonorSlide() {
  const fetchHonors = await HonorService.list(600);

  const dataHonors: any[] = Array.isArray(fetchHonors.data)
    ? fetchHonors.data
    : [];

  if (!dataHonors.length) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl uppercase font-sans font-[800] mb-10 leading-snug text-[#21366B]">
          10.000+ HỌC VIÊN
          <br />
          <span className="text-[#F4C542]">
            đạt thành tích cao sau khi học tại The Real IELTS
          </span>
        </h2>

        {/* Swiper */}
        <HonorSwiper honors={dataHonors} />
        <ButtonBase
          content="Xem thêm Thành tích học viên"
          url="/vinh-danh-hoc-vien"
        />
      </div>
    </section>
  );
}
