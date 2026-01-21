"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import {
  Clock,
  Lock,
  BookOpen,
  Star,
  User,
  Headphones,
  Shield,
  BadgeCheck,
} from "lucide-react";
import { splitSections } from "@/hooks/splitSections";
import slugify from "slugify";
import { extractYoutubeId } from "@/hooks/extractYoutubeId";

type CourseDescriptionProps = {
  urlYoutube: string;
  descriptionSidebar: string;
  title: string,
};

export default function CourseDescriptionCard({
  urlYoutube,
  descriptionSidebar,
  title,
}: CourseDescriptionProps) {

  // icon lucide tương ứng với các dòng mô tả
  const featureIcons = [Clock, Lock, BookOpen, Star, User, Headphones, Shield];

  const descriptions = splitSections(descriptionSidebar);
  const courseTitle = slugify(title || "", {lower: true, locale: "vi"});
  const videoId = extractYoutubeId(urlYoutube);

  return (
    <article className="rounded-2xl shadow-md overflow-hidden bg-white border border-gray-200">
      {/* Video */}
      <div className="aspect-video w-full">
        {videoId ? (
          <LiteYouTubeEmbed id={videoId} title={`video-khoa-hoc-${courseTitle}`} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
            Video not available
          </div>
        )}
      </div>

      {/* CTA */}
      <a
        href="https://zalo.me/302896296492583331"
        target="_blank"
        className="block text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 hover:opacity-90 transition"
      >
        Nhắn TRI qua Zalo
      </a>

      {/* Features */}
      <ul className="p-4 space-y-3">
        {descriptions.map((line, idx) => {
          const Icon = featureIcons[idx] ?? BadgeCheck;
          return (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <Icon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span>{line}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

// function extractYoutubeId(url: string): string | null {
//   try {
//     const regExp =
//       /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//     const match = url.match(regExp);
//     return match ? match[1] : null;
//   } catch {
//     return null;
//   }
// }