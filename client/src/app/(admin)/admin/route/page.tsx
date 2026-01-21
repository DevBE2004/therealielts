"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { clientHttp } from "@/lib/clientHttp";
import { z } from "zod";
import { confirmDelete } from "@/utils/confirmDelete";
import slugify from "slugify";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import Pagination from "@/components/common/Pagination";

type Goal = { title: string; description: string };
type Route = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  goal: Goal[];
};

export default function RouteManager() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const showSessionExpired = useSessionExpiredDialog();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // load all
  const fetchRoutes = async () => {
    const res = await clientHttp(z.any(), {
      path: "/route",
      method: "GET",
      query: { page, limit },
    });
    if (res.data && res.total) {
      setRoutes(res.data);
      setTotal(res.total);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [page]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setGoals([]);
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = { title, slug, description, goal: goals };
      if (editId) {
        await clientHttp(z.any(), {
          path: `/route/update/${editId}`,
          method: "PUT",
          body: payload,
        });
      } else {
        await clientHttp(z.any(), {
          path: "/route/create",
          method: "POST",
          body: payload,
        });
      }
      await fetchRoutes();
      resetForm();
      setOpen(false);
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning("Tiêu đề đã tồn tại!");
      }
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa lộ trình?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      await clientHttp(z.any(), {
        path: `/route/delete/${id}`,
        method: "DELETE",
      });
      setRoutes((prev) => prev.filter((r) => r?.id !== id));
      await fetchRoutes();
    } catch (err: any) {
      console.error(err);
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
    }
  };

  const handleEdit = (route: Route) => {
    setTitle(route.title);
    setSlug(slugify(route.title, { locale: "vi", lower: true }));
    setDescription(route.description || "");
    setGoals(route.goal || []);
    setEditId(route.id);
    setOpen(true);
  };

  // Goal helpers
  const addGoal = () => {
    setGoals([...goals, { title: "", description: "" }]);
  };

  const updateGoal = (index: number, field: keyof Goal, value: string) => {
    const newGoals = [...goals];
    newGoals[index][field] = value;
    setGoals(newGoals);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Lộ trình</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
            >
              + Tạo Lộ trình
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editId ? "Cập nhật Lộ trình" : "Tạo Lộ trình"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Tiêu đề"
                value={title}
                onChange={(e) => {
                  const val = e.target.value;
                  setTitle(val);
                  setSlug(slugify(val, { lower: true, locale: "vi" }));
                }}
              />
              <Textarea
                placeholder="Mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold">Mục tiêu</h2>
                  <Button type="button" size="sm" onClick={addGoal}>
                    + Thêm
                  </Button>
                </div>
                {goals.map((g, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 gap-2 items-start mb-2"
                  >
                    <Input
                      placeholder="Tiêu đề mục tiêu"
                      value={g.title}
                      onChange={(e) => updateGoal(i, "title", e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Mô tả mục tiêu"
                        value={g.description}
                        onChange={(e) =>
                          updateGoal(i, "description", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeGoal(i)}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleSubmit}>
                {editId ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(routes) &&
          routes.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 space-y-2">
                <h2 className="text-lg font-bold">{r.title}</h2>
                <p className="text-gray-800">{r.description}</p>
                <ul className="list-disc pl-4 text-sm">
                  {r.goal?.map((g, i) => (
                    <li key={i}>
                      <span className="font-semibold">{g.title}:</span>{" "}
                      {g.description}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => handleEdit(r)}>
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(r.id)}
                  >
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      <Pagination
        currentPage={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
