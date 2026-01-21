"use client";

import { nanoid } from "nanoid";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";

import z from "zod";
import {
  Block,
  BlockSchema,
  HomePageConfig,
  Section,
  TSlotEnum,
} from "@/types/homepage";

async function fetchHomePageConfig(): Promise<HomePageConfig> {
  const res = await clientHttp(ApiResponseSchema(z.any()), {
    path: "/introduce/9",
    method: "GET",
  });

  if (!res.success || !res.data) {
    throw new Error("Không thể lấy HomePageConfig");
  }

  return {
    blocks: Array.isArray(res.data.section1.blocks)
      ? res.data.section1.blocks
      : [],
  };
}

export async function updateHomePageBySlot({
  slot,
  sections,
}: {
  slot: TSlotEnum;
  sections: Section[];
}) {
  const { blocks } = await fetchHomePageConfig();

  let nextBlocks: Block[];

  const existedBlock = blocks.find((b) => b.slot === slot);

  if (!existedBlock) {
    nextBlocks = [
      ...blocks,
      {
        id: crypto.randomUUID(),
        slot,
        items: sections,
      },
    ];
  } else {
    nextBlocks = blocks.map((b) =>
      b.slot === slot ? { ...b, items: sections } : b
    );
  }

  // remove empty block
  //   nextBlocks = nextBlocks.filter((b) => b.items.length > 0);

  //   updateHomePageConfigCache(() => ({ blocks: nextBlocks }));

  await clientHttp(ApiResponseSchema(z.any()), {
    path: "/introduce/update/9",
    method: "PUT",
    body: {
      section1: { blocks: nextBlocks },
    },
  });
}
