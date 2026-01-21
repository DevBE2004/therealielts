import Curriculum from "./Curriculum";
import Method from "./Method";

  const section = {
    titleLine1: "GIẢNG DẠY VỚI",
    titleLine2: "GIÁO TRÌNH CHUẨN QUỐC TẾ",
    description: `
      <p>Tài liệu được biên soạn bởi đội ngũ giảng viên uy tín từ Học viện Tài chính, Ivy Global School...</p>
      <p>100% tài liệu sử dụng nguồn từ NXB Cambridge, Oxford, Harper Collins...</p>
      <p>Bộ đề thi thật được cập nhật hàng tuần theo định hướng của Hội đồng IELTS.</p>
      <p>Phương pháp học kết hợp công nghệ AI và phân tích dữ liệu học viên.</p>
      <p>Đảm bảo lộ trình cá nhân hóa, đạt kết quả tối ưu.</p>
    `,
  };

  const images = [
    "/about/Ve-Retheielts_vs.5-min.png.webp",
  ];

  

type Props = {
  section4: object;
  images4: string[];
  section5: object;
  images5: string[];
}

export default function AcademyOverview({section4, images4, section5, images5}: Props) {

    return(
        <div className="w-full">
            <Curriculum section4={section4} images4={images4}/>
            <Method section5={section5} images5={images5}/>
        </div>
    );
}