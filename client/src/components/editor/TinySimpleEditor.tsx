"use client";

import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinySimpleEditorProps {
  initialValue?: string;
  height?: number;
  onContentChange?: (content: string) => void;
}

export default function TinySimpleEditor({
  initialValue = "",
  height = 250,
  onContentChange,
}: TinySimpleEditorProps) {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState(initialValue);

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
          menubar: false,
          plugins: ["lists", "link", "autolink", "wordcount"],
          toolbar:
            "undo redo | fontfamily fontsize | bold italic underline forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | bullist numlist | removeformat",
          toolbar_mode: "sliding",
          branding: false,
          font_family_formats:
            "Arial=arial,helvetica,sans-serif;" +
            "Georgia=georgia,palatino;" +
            "Tahoma=tahoma,arial,helvetica;" +
            "Times New Roman=times new roman,times;" +
            "Verdana=verdana,geneva;",
          fontsize_formats: "10pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 36pt",
          content_style:
            "body { font-family:Arial,Helvetica,sans-serif; font-size:16px; line-height:1.6; color:#1F2937; }",
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
}
