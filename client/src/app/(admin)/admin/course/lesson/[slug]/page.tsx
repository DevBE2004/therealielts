"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";

import {
  Plus,
  Edit,
  Trash,
  BookOpen,
  Loader2,
  X,
  NotebookText,
} from "lucide-react";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, Course, CourseSchema } from "@/types";
import {
  Lesson,
  LessonSchema,
  CreateLesson,
  CreateSLessonSchema,
  UpdateLesson,
  UpdateLessonSchema,
} from "@/types/lesson";
import slugify from "slugify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";

// ---------------- Modal -----------------
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <NotebookText className="text-indigo-500" /> {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export default function LessonManagerPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [courseId, setCourseId] = useState<number | undefined>(undefined);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState<Lesson | null>(null);
  const showSessionExpired = useSessionExpiredDialog();

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await clientHttp(ApiResponseSchema(CourseSchema), {
          method: "GET",
          path: `/common/${slug}`,
          query: { type: "COURSE", limit: 9999 },
        });

        if (res.success && res.data) {
          setCourse(res.data);
          setCourseId(res.data.id);
        } else {
          toast.error("Không tìm thấy khóa học!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải khóa học!");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  const fetchLessons = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await clientHttp(ApiResponseSchema(LessonSchema.array()), {
        method: "GET",
        path: `/lesson?commonId=${courseId}`,
        query: { limit: 9999 },
      });
      if (res.success && Array.isArray(res.data)) {
        setLessons([...res.data].sort((a, b) => a.order_index - b.order_index));
      } else {
        setLessons([]);
        toast.info("Chưa có buổi học nào.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách buổi học!");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // ---------------- Delete -----------------
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa buổi học này?")) return;
    try {
      await clientHttp(z.any(), {
        method: "DELETE",
        path: `/lesson/delete/${id}`,
      });
      toast.success("Xóa buổi học thành công!");
      setLessons((prev) => prev.filter((l: Lesson) => l?.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại!");
    }
  };

  // ---------------- Create -----------------
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateLesson>({
    resolver: zodResolver(CreateSLessonSchema),
    defaultValues: { commonId: courseId },
  });

  console.log(errorsCreate);

  const handleCreate = async (data: CreateLesson) => {
    try {
      await clientHttp(ApiResponseSchema(LessonSchema), {
        method: "POST",
        path: "/lesson/create",
        body: { ...data, commonId: courseId },
      });
      toast.success("Thêm buổi học thành công!");
      setOpenCreate(false);
      resetCreate();
      fetchLessons();
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning(err.message.mes);
      }
    }
  };

  // ---------------- Update -----------------
  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<UpdateLesson>({
    resolver: zodResolver(UpdateLessonSchema),
  });

  const handleUpdate = async (data: UpdateLesson) => {
    if (!openUpdate) return;
    try {
      await clientHttp(ApiResponseSchema(LessonSchema), {
        method: "PUT",
        path: `/lesson/update/${openUpdate.id}`,
        body: { ...data, commonId: courseId },
      });
      toast.success("Cập nhật thành công!");
      setOpenUpdate(null);
      resetUpdate();
      fetchLessons();
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning(err.message.mes);
      }
    }
  };

  useEffect(() => {
    if (openUpdate) {
      resetUpdate({
        title: openUpdate.title,
        description: openUpdate.description,
        details: openUpdate.details,
        order_index: openUpdate.order_index,
        commonId: openUpdate.commonId,
      });
    }
  }, [openUpdate, resetUpdate]);

  // ---------------- UI -----------------
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-indigo-600" />
          {course ? `Quản lý buổi học - ${course.title}` : "Đang tải..."}
        </h1>
        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Thêm buổi học
        </button>
      </div>

      {/* Lessons */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex justify-between items-center border rounded-xl p-4 hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold">
                  {lesson.order_index}. {lesson.title}
                </p>
                <p className="text-sm text-gray-500">{lesson.description}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setOpenUpdate(lesson)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={18} />
                </button>
                {lesson.id && (
                  <button
                    onClick={() => handleDelete(lesson.id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Thêm buổi học"
      >
        <form onSubmit={handleSubmitCreate(handleCreate)} className="space-y-4">
          <input
            {...registerCreate("title")}
            placeholder="Tên buổi học"
            className="w-full border rounded-lg px-3 py-2"
          />
          {errorsCreate.title && (
            <p className="text-red-500 text-sm">{errorsCreate.title.message}</p>
          )}
          <textarea
            {...registerCreate("description")}
            placeholder="Mô tả"
            className="w-full border rounded-lg px-3 py-2"
          />
          <textarea
            {...registerCreate("details")}
            placeholder="Chi tiết"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            {...registerCreate("order_index", { valueAsNumber: true })}
            placeholder="Thứ tự"
            className="w-full border rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Lưu
          </button>
        </form>
      </Modal>

      {/* Update Modal */}
      <Modal
        open={!!openUpdate}
        onClose={() => setOpenUpdate(null)}
        title="Cập nhật buổi học"
      >
        <form onSubmit={handleSubmitUpdate(handleUpdate)} className="space-y-4">
          <input
            {...registerUpdate("title")}
            placeholder="Tên buổi học"
            className="w-full border rounded-lg px-3 py-2"
          />
          {errorsUpdate.title && (
            <p className="text-red-500 text-sm">{errorsUpdate.title.message}</p>
          )}
          <textarea
            {...registerUpdate("description")}
            placeholder="Mô tả"
            className="w-full border rounded-lg px-3 py-2"
          />
          <textarea
            {...registerUpdate("details")}
            placeholder="Chi tiết"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            {...registerUpdate("order_index", { valueAsNumber: true })}
            placeholder="Thứ tự"
            className="w-full border rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Cập nhật
          </button>
        </form>
      </Modal>
    </div>
  );
}
