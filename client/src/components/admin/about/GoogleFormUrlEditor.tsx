"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Globe, FileCode, ChevronDown, ChevronUp } from "lucide-react"
import GoogleFormEmbed from "@/components/common/GoogleFormEmbed"

type SectionForm = {
  formUrl?: string
  embedHtml: string
}

type Props = {
  data: SectionForm
  onChange: (newData: SectionForm) => void
}

export default function GoogleFormUrlEditor({ data, onChange }: Props) {
  const [localData, setLocalData] = useState<SectionForm>({
    embedHtml: data?.embedHtml || "",
  })

  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => {
    setLocalData({
      formUrl: data?.formUrl || "",
      embedHtml: data?.embedHtml || "",
    })
  }, [data])

  const handleChange = (key: keyof SectionForm, value: string) => {
    const updated = { ...localData, [key]: value }
    setLocalData(updated)
    onChange(updated)
  }

  const handleConvertUrlToEmbed = () => {
    if (!localData.formUrl) return
    let url = localData.formUrl
    if (!url.includes("embedded=true")) {
      const separator = url.includes("?") ? "&" : "?"
      url = `${url}${separator}embedded=true`
    }
    const embedHtml = `<iframe src="${url}" width="100%" height="2000" frameborder="0" marginheight="0" marginwidth="0">Đang tải…</iframe>`
    handleChange("embedHtml", embedHtml)
  }

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-sm">
      {/* 🔹 Thanh tiêu đề cố định */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Google Form Embed Editor
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-2"
        >
          {showEditor ? (
            <>
              Ẩn chỉnh sửa <ChevronUp size={16} />
            </>
          ) : (
            <>
              Hiện chỉnh sửa <ChevronDown size={16} />
            </>
          )}
        </Button>
      </div>

      {/* 🔸 Nội dung chỉnh sửa (ẩn/hiện) */}
      {showEditor && (
        <div className="py-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-4">
            {/* 🟦 LEFT: Nhập dữ liệu */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <label className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <Globe size={18} /> Nhập URL Google Form
                </label>
                <Input
                  value={localData.formUrl}
                  onChange={(e) => handleChange("formUrl", e.target.value)}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                />

                <Button
                  onClick={handleConvertUrlToEmbed}
                  variant="outline"
                  className="mt-3"
                >
                  Tạo mã nhúng tự động
                </Button>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <label className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <FileCode size={18} /> Hoặc dán đoạn mã nhúng HTML
                </label>
                <Textarea
                  rows={6}
                  value={localData.embedHtml}
                  onChange={(e) => handleChange("embedHtml", e.target.value)}
                  placeholder={`<iframe src="https://docs.google.com/forms/d/e/.../viewform?embedded=true" width="640" height="2795" frameborder="0" marginheight="0" marginwidth="0">Đang tải…</iframe>`}
                />
              </div>
            </div>

            {/* 🟨 RIGHT: Xem trước */}
            <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-inner p-4">
              <h4 className="text-lg font-semibold text-center text-blue-900 mb-4">
                Xem trước Google Form
              </h4>
              {localData.embedHtml ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <GoogleFormEmbed section2={localData} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 italic">
                  Chưa có mã nhúng hoặc URL hợp lệ
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
