"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import {
  BlockIntroduceSchema,
  BlockLearningApproachSchema,
  BlockLearningMethodSchema,
  SectionStatic,
  SectionStaticSchema,
} from "@/types/homepage";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DialogFormWrapper } from "../footer/components/DialogFormWrapper";
import FormIntroduce from "./form-update/form-introduce";
import { DiaLogCustom } from "@/components/ui/dialog-custom/dialog-custom";
import FormLearningMethod from "./form-update/form-learning-method";
import FormLearningApproach from "./form-update/form-learning-approach";

const labels = ["Block Giới Thiệu", "Block Phương Pháp Học", "Block Slide"];

export default function ManagementSectionStatic() {
  const [dataSectionStatic, setDataSectionStatic] = useState<
    SectionStatic | undefined
  >(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<number | null>(null);

  const methodsBlockIntroduce = useForm({
    resolver: zodResolver(BlockIntroduceSchema),
    defaultValues: dataSectionStatic?.section2?.BlockIntroduce
      ? dataSectionStatic?.section2?.BlockIntroduce
      : {},
  });

  const methodsBlockLearningMethod = useForm({
    resolver: zodResolver(BlockLearningMethodSchema),
    defaultValues: dataSectionStatic?.section2?.BlockLearningMethod
      ? dataSectionStatic?.section2?.BlockLearningMethod
      : {},
  });

  const methodsBlockLearningApproach = useForm({
    resolver: zodResolver(BlockLearningApproachSchema),
    defaultValues: dataSectionStatic?.section2?.BlockLearningApproach
      ? dataSectionStatic?.section2?.BlockLearningApproach
      : {},
  });

  const fetchData = async () => {
    const res = await clientHttp(ApiResponseSchema(SectionStaticSchema), {
      method: "GET",
      path: "/introduce/9",
    });
    setDataSectionStatic(res.data);
  };
  // console.log("COLLLL ==> ", dataFooter?.col3?.label);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!dataSectionStatic) return;

    methodsBlockIntroduce.reset(
      dataSectionStatic.section2?.BlockIntroduce || {}
    );

    methodsBlockLearningMethod.reset(
      dataSectionStatic.section2?.BlockLearningMethod || {}
    );

    methodsBlockLearningApproach.reset(
      dataSectionStatic.section2?.BlockLearningApproach || {}
    );
  }, [dataSectionStatic]);

  const getDialogContent = () => {
    if (!dataSectionStatic) return null;

    switch (currentBlock) {
      case 1:
        return (
          <DialogFormWrapper methods={methodsBlockIntroduce}>
            <FormIntroduce />
          </DialogFormWrapper>
        );
      case 2:
        return (
          <DialogFormWrapper methods={methodsBlockLearningMethod}>
            <FormLearningMethod />
          </DialogFormWrapper>
        );
      case 3:
        return (
          <DialogFormWrapper methods={methodsBlockLearningApproach}>
            <FormLearningApproach />
          </DialogFormWrapper>
        );
      //   case 4:
      //     return (
      //       <DialogFormWrapper methods={methodsCol4}>
      //         <FormCol4 />
      //       </DialogFormWrapper>
      //     );
    }
  };

  const onSaveFooter = async () => {
    let payload = {};

    if (currentBlock === 1)
      payload = { BlockIntroduce: methodsBlockIntroduce.getValues() };
    if (currentBlock === 2)
      payload = { BlockLearningMethod: methodsBlockLearningMethod.getValues() };
    if (currentBlock === 3)
      payload = {
        BlockLearningApproach: methodsBlockLearningApproach.getValues(),
      };

    await clientHttp(ApiResponseSchema(SectionStaticSchema), {
      method: "PUT",
      path: "/introduce/update/9",
      body: {
        section2: {
          ...dataSectionStatic?.section2,
          ...payload,
        },
      },
    });

    setOpenDialog(false);
    fetchData();
  };

  const actionEdit = (index: number) => {
    setCurrentBlock(index + 1);
    setOpenDialog(true);
  };

  return (
    <div className="grid">
      <ol className="font-medium space-y-3 text-[16px]">
        {labels.map((item, index) => (
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

      <DiaLogCustom
        width="max-w-4xl"
        open={openDialog}
        textSave="Lưu tất cả"
        onCancel={() => setOpenDialog(false)}
        onSave={onSaveFooter}
        title={`Chỉnh sửa ${currentBlock ? labels[currentBlock - 1] : ""}`}
        content={getDialogContent()}
      />
    </div>
  );
}
