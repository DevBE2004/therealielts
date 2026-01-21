import { StudyAbroadService } from "@/services/studyabroad.service";
import { StudyAbroad } from "@/types";

type PageProps = {
  data: StudyAbroad,
};
export const dynamic = "force-dynamic";

// export async function generateMetadata({ data }: PageProps) {
//   const { post } = await params;
//   const studyabroad = await StudyAbroadService.getOne(post);
//   const { data } = studyabroad;

//   if (data) {
//     return {
//       title: `${data.title} | The Real IELTS`,
//       description:
//         data.description?.slice(0, 160) || "Du học cùng The Real IELTS",
//       openGraph: {
//         title: data.title,
//         description: data.description?.slice(0, 160),
//         images: data.images?.[0],
//       },
//     };
//   }
// }

export default async function PackageDetail({ data }: PageProps) {

  return (
    <article className="max-w-6xl mx-auto px-6 py-12 bg-white shadow-lg rounded-2xl my-5">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-sans font-[600] text-gray-900 mb-8 leading-tight tracking-tight text-center">
        {data?.title}
      </h1>

      {/* Images
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Array.isArray(data?.images) && data.images.length > 0 ? (
          data.images.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden w-full flex justify-center rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                src={img}
                alt={`${data.title} image ${index + 1}`}
                className="w-72 h-72 object-cover transform hover:scale-102 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl">
            <span className="text-gray-500 text-sm">
              Chưa có hình ảnh nào
            </span>
          </div>
        )}
      </section> */}

      {/* Description */}
      <section className="prose prose-lg max-w-none text-gray-800 mb-12 leading-relaxed">
        <div
          dangerouslySetInnerHTML={{
            __html:
              data?.description ||
              "<span class='italic text-gray-400'>Không có mô tả</span>",
          }}
        />
      </section>

      <footer className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-500 border-t pt-6 space-y-3 sm:space-y-0">
        <p>
          Ngày tạo:{" "}
          {data?.createdAt
            ? new Date(data.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A"}
        </p>
        <p>
          Cập nhật:{" "}
          {data?.updatedAt
            ? new Date(data.updatedAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A"}
        </p>
      </footer>
    </article>
  );
}
