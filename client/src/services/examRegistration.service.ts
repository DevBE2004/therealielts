// src/services/examRegistration.service.ts

import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  ExamRegistrationCreateRequest,
  ExamRegistrationSchema,
  ExamRegistrationUpdateRequest,
} from "@/types";

export const ExamRegistrationService = {
  list: () =>
    clientHttp(ApiResponseSchema(ExamRegistrationSchema.array()), {
      path: "/exam-registration",
      method: "GET",
    }),

  detail: (id: number) =>
    clientHttp(ApiResponseSchema(ExamRegistrationSchema), {
      path: `/exam-registration/${id}`,
      method: "GET",
    }),

  create: (data: FormData | ExamRegistrationCreateRequest) =>
    clientHttp(ApiResponseSchema(ExamRegistrationSchema), {
      path: "/exam-registration/create",
      method: "POST",
      body: data,
    }),

  update: (id: number, data: FormData | ExamRegistrationUpdateRequest) =>
    clientHttp(ApiResponseSchema(ExamRegistrationSchema), {
      path: `/exam-registration/update/${id}`,
      method: "PUT",
      body: data,
    }),

  delete: (id: number) =>
    clientHttp(ApiResponseSchema(ExamRegistrationSchema), {
      path: `/exam-registration/delete/${id}`,
      method: "DELETE",
    }),
};
