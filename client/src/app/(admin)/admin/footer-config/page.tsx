"use client";

import { DialogFormWrapper } from "@/components/admin/footer/components/DialogFormWrapper";
import FormCol1 from "@/components/admin/footer/components/form-col1";
import FormCol4 from "@/components/admin/footer/components/form-col4";
import FormLabels from "@/components/admin/footer/components/form-labels";
import {
  schemaCol1,
  schemaCol4,
  schemaLabels,
} from "@/components/admin/footer/schema";
import { Footer } from "@/components/admin/footer/types";
import { DiaLogCustom } from "@/components/ui/dialog-custom/dialog-custom";
import { Text } from "@/components/ui/text";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, ListCollapse, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const footerCols = ["Cột 1", "Cột 2", "Cột 3", "Cột 4"];

export default function FooterConfigPage() {
  const [dataFooter, setDataFooter] = useState<Footer | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCol, setCurrentCol] = useState<number | null>(null);

  const methodsCol1 = useForm({
    resolver: zodResolver(schemaCol1),
    defaultValues: dataFooter?.col1 || {},
  });

  const methodsLabel2 = useForm({
    resolver: zodResolver(schemaLabels),
    defaultValues: dataFooter?.col2?.label
      ? { label: dataFooter.col2.label }
      : { label: [] },
  });

  const methodsLabel3 = useForm({
    resolver: zodResolver(schemaLabels),
    defaultValues: dataFooter?.col3?.label
      ? { label: dataFooter?.col3?.label }
      : { label: [] },
  });

  const methodsCol4 = useForm({
    resolver: zodResolver(schemaCol4),
    defaultValues: dataFooter?.col4 || {},
  });

  const fetchDataFooter = async () => {
    const res = await clientHttp(ApiResponseSchema(z.any()), {
      method: "GET",
      path: "/introduce/8",
    });
    setDataFooter(res.data.section1);
  };
  console.log("COLLLL ==> ", dataFooter?.col3?.label);

  useEffect(() => {
    fetchDataFooter();
  }, []);

  useEffect(() => {
    if (!dataFooter) return;

    methodsLabel2.reset({
      label: dataFooter.col2?.label || [],
    });

    methodsLabel3.reset({
      label: dataFooter.col3?.label || [],
    });

    methodsCol1.reset(dataFooter.col1);
    methodsCol4.reset(dataFooter.col4);
  }, [dataFooter]);

  const getDialogContent = () => {
    if (!dataFooter) return null;

    switch (currentCol) {
      case 1:
        return (
          <DialogFormWrapper methods={methodsCol1}>
            <FormCol1 />
          </DialogFormWrapper>
        );
      case 2:
        return (
          <DialogFormWrapper methods={methodsLabel2}>
            <FormLabels />
          </DialogFormWrapper>
        );
      case 3:
        return (
          <DialogFormWrapper methods={methodsLabel3}>
            <FormLabels />
          </DialogFormWrapper>
        );
      case 4:
        return (
          <DialogFormWrapper methods={methodsCol4}>
            <FormCol4 />
          </DialogFormWrapper>
        );
    }
  };

  const onSaveFooter = async () => {
    let payload = {};

    if (currentCol === 1) payload = { col1: methodsCol1.getValues() };
    if (currentCol === 2) payload = { col2: methodsLabel2.getValues() };
    if (currentCol === 3) payload = { col3: methodsLabel3.getValues() };
    if (currentCol === 4) payload = { col4: methodsCol4.getValues() };

    await clientHttp(ApiResponseSchema(z.any()), {
      method: "PUT",
      path: "/introduce/update/8",
      body: {
        section1: {
          ...dataFooter,
          ...payload,
        },
      },
    });

    setOpenDialog(false);
    fetchDataFooter();
  };

  const actionEdit = (index: number) => {
    setCurrentCol(index + 1);
    setOpenDialog(true);
  };

  return (
    <div className="w-full grid">
      <Text weight={"semibold"} className="mb-6 text-lg">
        Chỉnh sửa Footer
      </Text>
      <section className="col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
        <header className="mb-5 flex items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <ListCollapse className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
        </header>
        <div className="grid">
          <ol className="font-medium space-y-3 text-[16px]">
            {footerCols.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="gap-1 flex items-center">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  {item}
                </div>
                <button
                  className={`bg-slate-300 p-2 rounded-full cursor-pointer`}
                  onClick={() => actionEdit(index)}
                >
                  <PencilLine className={`size-4 text-blue-500`} />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <DiaLogCustom
        width="max-w-4xl"
        open={openDialog}
        textSave="Lưu tất cả"
        onCancel={() => setOpenDialog(false)}
        onSave={onSaveFooter}
        title={`Chỉnh sửa ${currentCol ? footerCols[currentCol - 1] : ""}`}
        content={getDialogContent()}
      />
    </div>
  );
}
