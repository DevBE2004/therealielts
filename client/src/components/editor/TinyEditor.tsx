"use client";

import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

// Cấu hình Cloudinary
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;

interface TinyMCEEditorProps {
  initialValue?: string;
  height?: number;
  onContentChange?: (content: string) => void;
}

export default function TinyEditor({
  initialValue = "",
  height = 700,
  onContentChange,
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState(initialValue);

  // Hàm update content và callback lên parent nếu cần
  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
    if (onContentChange) onContentChange(newContent);
  };

  return (
    <div className="w-full">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={content}
        init={{
          height,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "link",
            "image",
            "lists",
            "charmap",
            "preview",
            "anchor",
            "pagebreak",
            "searchreplace",
            "wordcount",
            "visualblocks",
            "visualchars",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "emoticons",
            "help",
          ],
          toolbar:
            "undo redo | styles | bold italic | forecolor backcolor emoticons | alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image | print preview media fullscreen | " +
            " help",
          font_formats:
            "Arial=arial | helvetica | sans-serif" +
            "Courier New=courier new,courier;" +
            "Georgia=georgia,palatino;" +
            "Tahoma=tahoma,arial,helvetica;" +
            "Times New Roman=times new roman,times;" +
            "Verdana=verdana,geneva;",
          fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt 72pt",
          content_style:
            "body { font-family:Arial,Helvetica,sans-serif; font-size:16px; line-height:1.6; color:#1F2937; }",
          image_title: true,
          automatic_uploads: true,
          file_picker_types: "image",
          file_picker_callback: function (cb: any, value: any, meta: any) {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.onchange = async function () {
              const file = input.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", UPLOAD_PRESET);

              try {
                const res = await fetch(UPLOAD_URL, {
                  method: "POST",
                  body: formData,
                });
                const data = await res.json();
                cb(data.secure_url, { title: file.name });
              } catch (err) {
                console.error("Cloudinary upload error:", err);
                alert(`Upload ảnh thất bại. Thử lại!`);
              }
            };
            input.click();
          },
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
}
