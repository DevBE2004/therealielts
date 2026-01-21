import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  UserChangePassword,
  UserCreate,
  UserForgotPassword,
  UserQueryParams,
  UserResetPassword,
  UserSchema,
  UserUpdate,
  UserUpdateProfile,
} from "@/types";

export const UserService = {
  // Lấy danh sách user (CSR)
  getUsers: (query?: UserQueryParams) =>
    clientHttp(ApiResponseSchema(UserSchema.array()), {
      path: "/user",
      method: "GET",
      query,
    }),

  // Lấy user hiện tại
  getCurrent: () =>
    clientHttp(ApiResponseSchema(UserSchema), {
      path: "/user/current",
      method: "GET",
    }),

  // Lấy user theo id
  getUser: (id: string) =>
    clientHttp(ApiResponseSchema(UserSchema), {
      path: `/user/${id}`,
      method: "GET",
    }),

  // Cập nhật profile
  updateProfile: (data: UserUpdateProfile) =>
    clientHttp(ApiResponseSchema(UserSchema), {
      path: "/user/update-profile",
      method: "PUT",
      body: data,
    }),

  // Đổi mật khẩu
  changePassword: (data: UserChangePassword) =>
    clientHttp(ApiResponseSchema(UserSchema), {
      path: "/user/change-password",
      method: "PUT",
      body: data,
    }),

  // Quên mật khẩu
  forgotPassword: (data: UserForgotPassword) =>
    clientHttp(ApiResponseSchema(UserSchema), {
      path: "/user/forgot-password",
      method: "POST",
      body: data,
    }),

  // Reset mật khẩu
  resetPassword: (data: UserResetPassword) =>
    clientHttp(ApiResponseSchema(UserSchema), {
      path: "/user/reset-password",
      method: "POST",
      body: data,
    }),

  // Admin tạo user
  CreateUserByAdmin: (data: UserCreate) =>
    clientHttp(ApiResponseSchema(UserSchema), {
      path: "/user/create",
      method: "POST",
      body: data,
    }),

  // Admin cập nhật user
  UpdateUserByAdmin: (data: UserUpdate) =>
    clientHttp(ApiResponseSchema(UserSchema), {
      path: "/user/update",
      method: "POST",
      body: data,
    }),

  // Admin xóa user
  DeleteUserByAdmin: (id: string) =>
    clientHttp(ApiResponseSchema(UserSchema), {
      path: `/user/${id}`,
      method: "DELETE",
    }),
};
