"use client";

import { BuildPage } from "@/components/admin/custom-page/design-page-builder";
import { useParams, useRouter } from "next/navigation";

export default function UpdateUserPage() {
  const params = useParams();
  const id = params.id as string;

  return <BuildPage id={id} />;
}
