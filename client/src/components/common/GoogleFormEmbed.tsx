"use client"

interface GoogleFormEmbed {
  embedHtml: string // đoạn HTML nhúng gốc từ Google Form
}

type Props = {
  section2: GoogleFormEmbed;
}

export default function GoogleFormEmbed({ section2 }: Props) {

  const embedHtml = section2?.embedHtml || "";

  if (!embedHtml) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 italic">
          ⚠️ Chưa có mã nhúng Google Form (embedHtml)
        </p>
      </section>
    )
  }

  return (
    <section className="bg-gray-50 py-0">
      <div
        className="container mx-auto px-4 w-full flex justify-center"
        dangerouslySetInnerHTML={{
          __html: embedHtml,
        }}
      />
    </section>
  )
}

function sanitizeIframe(html: string): string {

  if (!html) return "" // tránh lỗi undefined

  return html
    .replace(/width="\d+"/, 'width="100%"')
    .replace(/height="\d+"/, 'height="100%"')
    .replace(/frameborder="\d+"/, 'frameborder="0"')
    .replace(/marginheight="\d+"/, '')
    .replace(/marginwidth="\d+"/, '')
    // .replace(
    //   "<iframe",
    //   `<iframe style="width:100%; min-height:100vh; border:0; overflow:hidden;" scrolling="no"`
    // )
}
