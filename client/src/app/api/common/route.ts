import { CommonService } from "@/services/common.service";
import { CommonSchema } from "@/types/common";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const allowedTypes = ["DOCUMENT", "COURSE", "NEW", "STUDYABROAD"] as const;

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 4);
  const categoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : undefined;
  const typeParam = searchParams.get("type");
  const type = allowedTypes.includes(typeParam as any)
    ? (typeParam as (typeof allowedTypes)[number])
    : "DOCUMENT";

  const search = searchParams.get("search") || undefined;
  const orderBy = searchParams.get("orderBy") || "";
  const tag = searchParams.get("tag") || "";

  const res = await CommonService.getAll(CommonSchema, {
    query: { isActive: true, page, limit, categoryId, type, search, orderBy },
    revalidate: 300,
    tags: [`${tag}`],
  });

  return NextResponse.json(res);
}
