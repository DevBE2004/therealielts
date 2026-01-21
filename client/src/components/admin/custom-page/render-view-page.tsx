"use client";
import BannerCustom from "./components/banner";
import ContentSection from "./components/content-section";
import TabCustom from "./components/tab-custom";
import { SectionType } from "./type";

interface RenderViewPageProps {
  data: SectionType[];
}
const RenderViewPage = ({ data }: RenderViewPageProps) => {
  return (
    <>
      {[...(data || [])]
        .sort((a: SectionType, b: SectionType) => {
          const orderA = a.orderIndex ?? 0;
          const orderB = b.orderIndex ?? 0;
          return orderA - orderB;
        })
        .map((item: SectionType) => {
          switch (item?.type) {
            case "BANNER":
              return (
                <BannerCustom
                  key={item.name}
                  banners={item.images as string[]}
                />
              );

            case "CONTENT_LEFT":
              return (
                <ContentSection
                  key={item.name}
                  description={item.text || ""}
                  reverse={false}
                  image={item.images?.[0] as string}
                />
              );

            case "CONTENT_RIGHT":
              return (
                <ContentSection
                  key={item.name}
                  description={item.text || ""}
                  reverse={true}
                  image={item.images?.[0] as string}
                />
              );

            case "TAB":
              return <TabCustom key={item.name} data={item?.tab || []} />;

            case "IMAGE":
              return (
                <div
                  key={item.name}
                  className="grid w-full max-w-[1250px] m-auto gap-12 mb-16 px-6"
                >
                  <img
                    src={item.images?.[0]}
                    alt="Content image"
                    className="w-full h-[400px] object-cover rounded-2xl shadow-lg cursor-pointer"
                    onClick={() => window.open(item?.link, "_blank")}
                  />
                </div>
              );

            default:
              return null;
          }
        })}
    </>
  );
};

export default RenderViewPage;
