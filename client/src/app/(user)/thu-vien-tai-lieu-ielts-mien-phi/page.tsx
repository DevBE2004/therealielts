import { Banner } from "@/types";
import HomeBanner from "@/components/home/banner";
import { BannerService } from "@/services/banner.service";
import { CategoryService } from "@/services/category.service";
import slugify from "slugify";
import Image from "next/image";
import DocumentView from "./DocumentView";
import { Category } from "@/types/category";
import { parseStringObject } from "@/hooks/parseStringObject";

export const dynamic = "force-dynamic";

export default async function DocumentPage() {
  const urlWeb = process.env.DOMAIN_WEB || "https://therealielts.vn";

  // Fetch categories
  const categories = await CategoryService.getAll({
    query: { limit: 9999 },
    revalidate: 300,
    tags: ["category"],
  });

  const categoriesParsed: (Category & {
    groupParsed?: { name: string; id?: number };
  })[] = Array.isArray(categories.data)
    ? categories.data.map((c) => ({
        ...c,
        groupParsed: parseStringObject(c.group),
      }))
    : [];

  const categoryData: typeof categoriesParsed = categoriesParsed.filter((c) => {
    const group = c.groupParsed;
    if (!group) return true;
    return (
      group.name !== "báo chí" &&
      group.name !== "tin tức" &&
      group.name !== "khóa học" &&
      group.name !== "du học"
    );
  });

  // Format merged categories (dùng cho mục "Tìm kiếm nổi bật")
  const mergedCategories = [
    ...categoryData
      .filter((c) => c.icon !== null)
      .map((c) => ({
        name: c.name,
        icon: c.icon || "/document_icons/Bai-test-IELSTS.png",
        path: slugify(c.groupParsed?.name || "", { lower: true, locale: "vi" }),
        external: false,
      })),
    {
      name: "Bài test IELTS",
      icon: "/document_icons/Bai-test-IELSTS.png",
      path: "https://ant-edu.ai",
      external: true,
    },
  ];

  const fetchBanners = await BannerService.getall({}, 60);
  const dataBanners = Array.isArray(fetchBanners?.data)
    ? fetchBanners.data
    : [];

  return (
    <div id="main" className="w-full min-h-screen bg-gray-50">
      {/* Banner */}
      <section className="w-full bg-[#20376C] flex flex-col items-center justify-center pb-8">
        <div className="w-full md:w-[75%] lg:py-8 py-5 px-4 lg:px-10">
          <HomeBanner location="thu-vien" dataBanner={dataBanners} />
        </div>
        <div className="w-full max-w-6xl px-3 lg:px-6 flex flex-col items-center justify-center gap-2.5">
          <h1 className="font-sans font-[700] text-2xl sm:text-3xl xl:text-4xl text-white">
            THƯ VIỆN THE REAL IELTS
          </h1>
          <p className="font-sans font-[400] text-base max-w-5xl text-center text-gray-100">
            Thư viện đề thi IELTS chính thức từ British Council, IDP mới nhất và
            luôn được cập nhật liên tục. Tổng hợp các bài mẫu tham khảo
            (Sample&nbsp;answer) IELTS miễn phí, giúp những người đi làm bận rộn
            hoặc học sinh sinh viên có thể dễ dàng tham khảo, tự học & tự luyện
            thi IELTS đạt kết quả cao.
          </p>
        </div>
      </section>

      {/* Categories highlight */}
      <section className="w-full py-8 flex items-center justify-center">
        <div className="w-full max-w-7xl px-4 lg:px-6">
          <h2 className="text-2xl xl:text-3xl font-sans font-[600] mb-6 text-blue-900">
            Tìm kiếm nổi bật
          </h2>

          <div className="grid grid-cols-2 gap-6 lg:flex lg:items-center lg:justify-between">
            {mergedCategories.map((c, i) => {
              const href = c.external
                ? c.path
                : `/thu-vien-tai-lieu-ielts-mien-phi/${c.path}`;
              return (
                <a
                  key={i}
                  href={href}
                  {...(c.external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="flex flex-col items-center gap-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-4 group"
                >
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-blue-50 transition">
                    <Image
                      src={c.icon}
                      alt={c.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-lg font-sans font-[500] text-gray-700 group-hover:text-blue-600 text-center">
                    {c.name}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Document list */}
      <DocumentView categories={categoryData} urlWeb={urlWeb} />
    </div>
  );
}
