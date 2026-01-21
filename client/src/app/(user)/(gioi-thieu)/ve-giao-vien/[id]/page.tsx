import { splitSections } from "@/hooks/splitSections";
import { generatePageMetadata } from "@/lib/seo";
import { TeacherService } from "@/services/teacher.service";
import {
  Award,
  BookOpen,
  Calendar,
  Edit3,
  Mail,
  Phone,
  Star,
} from "lucide-react";

type PageProps = {
  params: Promise<{ id: number }>;
};
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const teacher = await TeacherService.detail(id);

  if (!teacher || !teacher.success) {
    return generatePageMetadata({
      title: "Giáo viên | The Real IELTS",
      description: "Đội ngũ giáo viên luyện thi IELTS tại The Real IELTS",
      url: `https://therealielts.com/ve-giao-vien/${id}`,
      image: "/images/default-avatar.jpg",
      keywords: "IELTS, giáo viên IELTS, giảng viên IELTS",
      type: "website",
    });
  }

  if (teacher.teacher) {
    return generatePageMetadata({
      title: `${teacher.teacher.name} - Giáo viên IELTS tại The Real IELTS`,
      description: `Giáo viên IELTS với điểm số ${teacher.teacher.ieltsScore} IELTS tại The Real IELTS`,
      url: `https://therealielts.com/ve-giao-vien/${teacher.teacher.id}`,
      image: teacher.teacher.avatar || "/images/default-avatar.jpg",
      keywords: `${teacher.teacher.name}, IELTS, giáo viên IELTS, The Real IELTS`,
      type: "website",
      authorName: teacher.teacher.name,
      publishedTime: teacher.teacher.createdAt
        ? new Date(teacher.teacher.createdAt)
        : undefined,
      modifiedTime: teacher.teacher.updatedAt
        ? new Date(teacher.teacher.updatedAt)
        : undefined,
    });
  }
}

const TeacherDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const teacher = await TeacherService.detail(id);

  if (!teacher || !teacher.success) {
    return <div>Không tìm thấy thông tin giáo viên</div>;
  }

  const {
    name,
    email,
    mobile,
    avatar,
    bio,
    education,
    ieltsScore,
    yearsOfExperience,
    teachingStyle,
    createdAt,
    updatedAt,
  } = teacher.teacher ?? {};

  const sections = splitSections(bio);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0 p-6 flex justify-center items-center">
              <div className="h-48 w-48 md:h-64 md:w-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={avatar || "/default-avatar.png"}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

                  <div className="mt-2 text-lg text-gray-600 italic space-y-1">
                    {sections.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
                {yearsOfExperience !== undefined ? (
                  <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                    {yearsOfExperience} {yearsOfExperience > 1 ? "năm" : "năm"}{" "}
                    kinh nghiệm
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                    Chưa cập nhật kinh nghiệm
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2 text-blue-500" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2 text-blue-500" />
                  <a
                    href={`tel:${mobile}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {mobile}
                  </a>
                </div>
              </div>

              {ieltsScore !== undefined ? (
                <div className="mt-6 flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(ieltsScore / 2)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-lg font-semibold text-gray-900">
                    IELTS {ieltsScore.toFixed(1)}
                  </span>
                </div>
              ) : (
                <span className="ml-2 text-lg text-gray-500">
                  Chưa cập nhật điểm IELTS
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Education and Experience */}
          <div className="md:col-span-2 space-y-8">
            {/* Teaching Style */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Edit3 className="h-5 w-5 mr-2 text-blue-500" />
                Phong cách giảng dạy
              </h2>
              <p className="text-gray-700 leading-relaxed">{teachingStyle}</p>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                Học vấn
              </h2>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5"></div>
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 font-medium">{education}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-8">
            {/* IELTS Score Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Điểm IELTS
              </h2>
              <div className="text-center py-4">
                <div className="text-5xl font-bold">
                  {ieltsScore !== undefined
                    ? ieltsScore.toFixed(1)
                    : "Chưa cập nhật"}
                </div>
                <p className="mt-2 text-blue-100">Overall Band Score</p>
              </div>
              <div className="mt-4 text-sm text-blue-100">
                <p>Kỹ năng chuyên môn được chứng nhận bởi Hội đồng Anh</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Hoạt động
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tham gia từ</p>
                  <p className="text-gray-900 font-medium">
                    {createdAt
                      ? new Date(createdAt).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cập nhật gần nhất</p>
                  <p className="text-gray-900 font-medium">
                    {updatedAt
                      ? new Date(updatedAt).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailPage;
