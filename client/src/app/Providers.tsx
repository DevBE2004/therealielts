"use client";

import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { UserService } from "@/services/user.service";
import { persistor, store } from "@/store";
import { setCurrent, setLoading, setLogin, setLogout } from "@/store/userSlice";
import { useEffect, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import slugify from "slugify";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthInitializer>{children}</AuthInitializer>
        <ToastContainer position="top-right" autoClose={5000} />
      </PersistGate>
    </Provider>
  );
}

// function AuthInitializer({ children }: { children: React.ReactNode }) {
//   const dispatch = useDispatch();
//   const isLogin = useSelector((state: any) => state.user.isLogin);
//   const showSessionExpired = useSessionExpiredDialog();

//   useEffect(() => {
//     let cancelled = false;
//     async function fetchCurrentUser() {
//       try {
//         const data = await UserService.getCurrent();
//         if (cancelled) return;
//         dispatch(setCurrent({ current: data.user }));
//       } catch (error: any) {
//         console.error("Failed to fetch current user:", error);
//         if (error?.status === 429) {
//           toast.warning("Vượt quá request, vui lòng refresh lại sau 60s");
//         } else {
//           toast.warning(error.message?.message);
//         }
//       }
//     }

//     fetchCurrentUser();

//     return () => {
//       cancelled = true;
//     };
//   }, [isLogin, dispatch, showSessionExpired]);

//   return <>{children}</>;
// }

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const showSessionExpired = useSessionExpiredDialog();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let cancelled = false;

    async function initAuth() {
      dispatch(setLoading(true));

      try {
        const res = await UserService.getCurrent();

        if (cancelled) return;

        dispatch(
          setCurrent({
            current: res.user,
          })
        );
        // dispatch(setLogin({ isLogin: true }));
      } catch (error: any) {
        if (cancelled) return;

        dispatch(setLogout());

        // ❗ chỉ hiển thị dialog khi là lỗi auth
        if (
          slugify(error.message?.message || error.message?.mes, {
            lower: true,
            locale: "vi",
          }) === slugify("bạn chưa đăng nhập.", { lower: true, locale: "vi" })
        ) {
          await showSessionExpired();
        } else if (error?.status === 429) {
          toast.warning("Vượt quá request, vui lòng thử lại sau");
        } else {
          toast.error("Không thể xác thực người dùng");
        }
      } finally {
        dispatch(setLoading(false));
      }
    }

    initAuth();

    return () => {
      cancelled = true;
    };
  }, [dispatch, showSessionExpired]);

  return <>{children}</>;
}
