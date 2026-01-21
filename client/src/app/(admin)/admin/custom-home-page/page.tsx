import DemoHomePage from "@/components/admin/custom-home-page/demo-home-page";
import ManagementSectionStatic from "@/components/admin/custom-home-page/manage-section-static";
import { SectionBuilderController } from "@/components/admin/custom-home-page/section-builder-controller";
import { ZoomWrapper } from "@/components/admin/custom-page/zoom-custom/zoom-wrapper";
import { http } from "@/lib/http";
import { ApiResponseSchema } from "@/types";
import { ListCollapse } from "lucide-react";
import { Suspense } from "react";
import z from "zod";

export const dynamic = "force-dynamic";

export default async function HomePageConfig() {
  const fetchData = await http(ApiResponseSchema(z.any()), {
    path: "/introduce/9",
    init: {
      method: "GET",
      cache: "no-store",
    },
  });

  const blocks =
    fetchData.data?.section1 !== undefined ? fetchData.data.section1 : {};
  const dataSection2 = fetchData.data?.section2 ? fetchData.data?.section2 : {};

  return (
    <div className="flex">
      <div className="relative flex-1 max-w-3xl">
        <div className="h-[calc(100vh-200px)] overflow-y-auto flex bg-[length:20px_20px] bg-[repeating-conic-gradient(#e5e7eb_0_25%,transparent_0_50%)] bg-[white] border border-[#D1D1D6] [background-position:0_0]">
          <ZoomWrapper>
            <div
              style={{
                width: "64rem",
                background: "white",
              }}
            >
              <div className="flex flex-col w-full justify-center">
                <Suspense fallback={<div>Loading...</div>}>
                  <DemoHomePage data={blocks} section2={dataSection2} />
                </Suspense>
              </div>
            </div>
          </ZoomWrapper>
        </div>
      </div>
      <div className="pl-4 p-2 space-y-4 w-full">
        <div className="flex gap-2.5 items-center">
          <ListCollapse className="h-5 w-5 text-gray-700" />
          <h2 className="text-gray-700 font-sans font-semibold text-base">
            Quản Lý Các Section Tĩnh
          </h2>
        </div>
        <ManagementSectionStatic />
      </div>
      <SectionBuilderController />
    </div>
  );
}
