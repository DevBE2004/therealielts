// services/auth.actions.ts
import { AuthService } from "@/services/auth.service";
import { SignIn } from "@/types";
import { toast } from "react-toastify";

export async function SignInAction(raw: SignIn): Promise<{ success: boolean; mes?: string; user?: any }> {
  try {
    const res = await AuthService.signIn(raw);

    if (!res.success) {
      return { success: false, mes: res.message };
    }
    return res;

  } catch (err: any) {
    console.log("ERRRR: ", err)
    toast.warning(err.message?.message)
    return { success: false, mes: err.message.mes };
  }
}
