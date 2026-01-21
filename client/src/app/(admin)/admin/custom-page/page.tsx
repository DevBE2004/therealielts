"use client";

import PopupActivatePage from "@/components/admin/custom-page/popup-activate";
import PopupDeletePage from "@/components/admin/custom-page/popup-delete";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import TableCustom, { TableProps } from "@/components/ui/table/TableCustom";
import { Text } from "@/components/ui/text";
import { PageService } from "@/services/common-client.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Repeat, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  title: z.string().optional(),
  type: z.string().optional(),
});

const PageManagement = () => {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listPage, setListPage] = useState<any[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRequest, setOpenRequest] = useState(false);
  const [dataSelect, setDataSelect] = useState<any>({});

  const getItems = async (param: {
    isActive?: boolean;
    title?: string;
    page?: number;
  }) => {
    console.log("check");
    setPage(page);
    const pages = await PageService.getPage({
      isActive: param?.isActive,
      type: "PAGE",
      limit: 10,
      page: param?.page,
      search: param?.title,
    });
    console.log("page===>", pages);
    if (pages?.success && pages?.data) {
      setListPage(Array.isArray(pages.data) ? pages.data : []);
      setTotal(pages?.total || 0);
    } else {
      setTotal(0);
      setListPage([]);
    }
  };

  useEffect(() => {
    setTotal(15);
    getItems({
      page: 1,
    });
  }, []);

  const onchangePage = (pageChange: number) => {
    const values = methods.getValues();
    getItems({
      page: pageChange,
      title: values?.title,
    });
  };

  const handleDelete = (record: any) => {
    setOpenDelete(true);
    setDataSelect(record);
  };

  const handleActivate = (record: any) => {
    setOpenRequest(true);
    setDataSelect(record);
  };
  const handleCreateCommon = () => {
    router.push(`/admin/custom-page/create`);
  };

  const columns: TableProps<any>[] = [
    { dataIndex: "title", title: "Tiêu đề", key: "title" },
    { dataIndex: "slug", title: "Đường dẫn", key: "slug" },
    { dataIndex: "type", title: "Loại", key: "type" },
    {
      dataIndex: "createdBy",
      title: "Ngày tạo",
      key: "createdBy",
      // align: "center",
      render: (record: any) =>
        record.updatedAt
          ? new Date(record.updatedAt).toLocaleDateString("vi-VN")
          : "N/A",
    },
    {
      dataIndex: "isActive",
      title: "Trạng thái",
      key: "isActive",
      render: (record: any) => {
        return record?.isActive ? (
          <Text weight={"medium"} className="text-green-500">
            Đang hoạt động
          </Text>
        ) : (
          <Text weight={"medium"} className="text-red-500">
            Không hoạt động
          </Text>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (record: any) => {
        return (
          <div className="flex items-center gap-3">
            <div
              key={`EDIT_${record.id}`}
              id={`EDIT_${record.id}`}
              onClick={() =>
                router.push(`/admin/custom-page/detail/${record.slug}`)
              }
              className="text-blue-700 cursor-pointer capitalize"
            >
              <Pencil className="size-4 text-blue-500" />
            </div>

            <div
              className="cursor-pointer capitalize"
              key={`DELETE_${record.id}`}
              id={`DELETE_${record.id}`}
              onClick={() => handleDelete(record)}
            >
              <Trash2 className="size-4 text-red-500" />
            </div>
            <div
              className="cursor-pointer capitalize"
              key={`ACTIVATE_${record.id}`}
              id={`ACTIVATE_${record.id}`}
              onClick={() => handleActivate(record)}
            >
              <Repeat className="size-4 text-gray-500" />
            </div>
          </div>
        );
      },
    },
  ];
  console.log("listPage", listPage);

  const handleSearch = () => {
    const values = methods.getValues();
    console.log("values", values);

    getItems({
      page: 1,
      title: values?.title,
    });
  };
  return (
    <div className="bg-white h-full">
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-3 items-start">
          <FormProvider {...methods}>
            <div className="w-56 relative">
              <Search className="absolute left-3 top-2 transform text-gray-400 w-5 h-5 z-30" />
              <FormInput
                name="title"
                label="Nhập Title"
                placeholder="Tìm kiếm title"
                className="h-[36px] pl-10"
              />
            </div>
          </FormProvider>
          <Button
            className="text-sm 
              bg-gradient-to-r from-blue-50 to-cyan-50 
              border border-cyan-200 
              text-cyan-700 
              flex items-center gap-2 
              py-1.5 px-3 
              rounded-xl 
              font-medium 
              shadow-sm hover:from-blue-100 hover:to-cyan-100 
              hover:border-cyan-300 
              hover:shadow-md 
              transition-all duration-200 ease-out active:scale-95 active:shadow-inner"
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 justify-center text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
          onClick={handleCreateCommon}
        >
          <Plus />
          Tạo mới
        </Button>
      </div>

      <TableCustom
        currentPage={page}
        pageSize={10}
        total={total}
        onChangePage={onchangePage}
        columnTable={columns}
        dataSource={listPage}
      />
      <PopupDeletePage
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        data={dataSelect}
        onReset={() => {
          const values = methods.getValues();
          getItems({
            page: page,
            title: values?.title,
          });
        }}
      />

      <PopupActivatePage
        open={openRequest}
        onCancel={() => setOpenRequest(false)}
        data={dataSelect}
        onReset={() => {
          const values = methods.getValues();
          getItems({
            page: page,
            title: values?.title,
          });
        }}
      />
    </div>
  );
};

export default PageManagement;
