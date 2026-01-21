"use client";

import HeaderClientPage from "@/components/admin/header-config/header-client-page";
import { useParams } from "next/navigation";

export default function UpdateUserPage() {
  const params = useParams();
  const id = params.id as string;

  return <HeaderClientPage />;
}
