"use client"
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import LiteYouTubeEmbed from "react-lite-youtube-embed"
type Props = {
  idYoutube: string
}
export default function YouTubeLite({idYoutube}: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <LiteYouTubeEmbed
        id={idYoutube}
        title="video The Real Ielts"
        poster="hqdefault"
      />
    </div>
  )
}
