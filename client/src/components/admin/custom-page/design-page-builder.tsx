"use client";

import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { Button } from "@/components/ui/button";
import PanelContainer from "@/components/ui/panel-container";
import { clientHttp } from "@/lib/clientHttp";
import { PageService } from "@/services/common-client.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectPage, updatePage } from "@/store/page-slice";
import { ApiResponseSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import z from "zod";
import FormCustomPage from "./form-custom-page";
import PopupDeletePage from "./popup-delete";
import RenderViewPage from "./render-view-page";
import { CustomPageSchema } from "./schema";
import { ZoomWrapper } from "./zoom-custom/zoom-wrapper";

export interface IDesignItem {
  itemId?: string;
  layoutId?: string;
}
interface BuildPageProps {
  id?: string;
}
export const BuildPage = ({ id }: BuildPageProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showSessionExpired = useSessionExpiredDialog();
  const isEdit = Boolean(id);
  const methods = useForm({
    resolver: zodResolver(CustomPageSchema),
  });
  const { data: page } = useAppSelector(selectPage);
  const section = page?.section || [];

  const [loading, setLoading] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  console.log("loading===>", loading);

  const fetchPageData = async () => {
    if (id) {
      const res = await PageService.getOne(id);
      if (res?.success && res?.data) {
        const data = res.data;
        methods.setValue("title", data?.title || "");
        methods.setValue("slug", data?.slug || "");
        const metaData: any = data?.metaData;

        dispatch(
          updatePage({ ...page, section: metaData?.section || [], id: data.id })
        );
      }
    }
  };
  useEffect(() => {
    fetchPageData();
  }, [id]);

  const handleSavePage = async () => {
    const values = methods.getValues();
    try {
      setLoading(true);
      const tabFomatted = section?.map((tab, idx) => ({
        ...tab,
        orderIndex: idx + 1,
      }));
      const param = new FormData();
      param.append("title", values?.title);
      param.append("slug", values?.slug);
      param.append("metaData", JSON.stringify({ section: tabFomatted }));
      param.append("description", "");
      param.append("isActive", values?.isActive ? "true" : "false");
      param.append("type", "PAGE");
      // param.append("categoryId", String(data.categoryId));
      // param.append("images", "");
      if (isEdit && id) {
        handleUpdatePage(param, page?.id as string);
      } else {
        handleCreatePage(param);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  const onDelete = async () => {
    setOpenDelete(true);
  };

  const handleCreatePage = async (formData: FormData) => {
    try {
      const response = await clientHttp(ApiResponseSchema(z.any()), {
        path: "/common/create",
        method: "POST",
        body: formData,
      });

      if (response.success) {
        toast.success("Thêm mới Page thành công");
        // router.push(`/admin/custom-page/detail/${response.data.id}`);
        router.push(`/admin/custom-page`);
      }
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi-VN" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning(err.message.mes);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePage = async (formData: FormData, id: string) => {
    try {
      const response = await clientHttp(ApiResponseSchema(z.any()), {
        path: `/common/update/${id}`,
        method: "PUT",
        body: formData,
      });

      if (response.success) {
        toast.success("Cập nhật page thành công");
      }
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi-VN" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning(err.message.mes);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex rounded-xl bg-white h-full">
        <div className="flex-1 w-[calc(100vh-24rem)]">
          <div className="flex justify-between py-3 px-3">
            {isEdit ? (
              <Button
                variant="outline"
                className="hover:text-red-500 text-red-500 border-[#FC2F2F]"
                // disabled={Boolean(!pageId)}
                onClick={onDelete}
              >
                Xóa page
              </Button>
            ) : (
              <div />
            )}

            <Button
              className="bg-blue-600 hover:bg-blue-700 justify-center text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
              onClick={methods.handleSubmit(handleSavePage)}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu page"}
            </Button>
          </div>
          <div className="relative overflow-hidden h-[calc(100vh-250px)] flex justify-center items-center bg-[length:20px_20px] bg-[repeating-conic-gradient(#e5e7eb_0_25%,transparent_0_50%)] bg-[white] border border-[#D1D1D6] [background-position:0_0]">
            <ZoomWrapper>
              <div
                style={{
                  width: "64rem",
                  background: "white",
                }}
              >
                <div className="flex flex-col w-full">
                  <Suspense fallback={<div>Loading...</div>}>
                    <RenderViewPage data={section} />
                  </Suspense>
                </div>
              </div>
            </ZoomWrapper>
          </div>
        </div>
        <PanelContainer>
          <FormCustomPage />
        </PanelContainer>

        <PopupDeletePage
          open={openDelete}
          onCancel={() => setOpenDelete(false)}
          data={page}
          onReset={() => router.push(`/admin/custom-page`)}
        />
      </div>
    </FormProvider>
  );
};
