import { BlockIntroduce } from "@/types/homepage";
import { ChevronsRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Introduce({ data }: { data: BlockIntroduce }) {
  return (
    <section id="intro" className="w-full bg-white py-12">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div
            id="Home_intro_img"
            className="relative w-full h-[300px] md:h-[400px] md:w-[55%] rounded-2xl overflow-hidden shadow-lg"
          >
            {data?.image && (
              <Image
                src={data.image}
                alt="intro_img"
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          {/* Nội dung bên phải */}
          <div
            id="Home_intro"
            className="w-full md:w-[45%] flex flex-col gap-4 md:gap-6"
          >
            <h2 className="text-3xl md:text-4xl font-sans font-[800] text-blue-700 leading-snug">
              {data?.title || "THE REAL IELTS"}
            </h2>

            {data?.content && (
              <div className="prose text-gray-700 leading-relaxed font-sans font-[400] text-base md:text-lg">
                <div dangerouslySetInnerHTML={{ __html: data.content }} />
              </div>
            )}

            <div>
              {data?.textButton && (
                <Link
                  href={data?.linkButton || "#"}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-sans font-[600] px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
                >
                  <ChevronsRight className="w-5 h-5 mt-0.5" />
                  {data.textButton}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
