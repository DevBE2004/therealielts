"use client";

import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { clientHttp } from "@/lib/clientHttp";
import { setLogout } from "@/store/userSlice";
import { useAppDispatch, useAppSelector } from "@/store";

export default function useSessionExpiredDialog() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.user); //check loading từ redux
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      await clientHttp(z.any(), {
        path: "/user/sign-out",
        method: "GET",
      });
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      dispatch(setLogout());
      router.replace("/login");
    }
  }, [dispatch, router]);

  const showDialog = useCallback(async (): Promise<boolean> => {
    if (loading) return false; // ✅ không hiển thị nếu đang loading
    if (isOpen) return false; // tránh mở nhiều lần

    setIsOpen(true);

    const result = await Swal.fire({
      title: "Phiên đăng nhập đã hết hạn",
      text: "Nhấn OK để quay về trang login",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    setIsOpen(false);

    if (result.isConfirmed) {
      await handleSignOut();
      return true;
    }

    return false;
  }, [isOpen, handleSignOut, loading]);

  return showDialog;
}
