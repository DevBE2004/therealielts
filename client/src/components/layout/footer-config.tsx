import Image from "next/image";
import FormFooter from "./FormFooter";
import Link from "next/link";
import { Footer } from "../admin/footer/types";
import { Text } from "../ui/text";

interface FooterProps {
  data: Footer;
}
export default function FooterConfig({ data }: FooterProps) {
  const { col1, col2, col3, col4 } = data;

  return (
    <div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start py-4">
        {/* Cột 1: Logo & Info */}
        {col1 && (
          <div className="flex flex-col gap-4">
            <Link href={col1?.linkLogo || "#"} className="relative">
              <Image
                src={col1.logo || "/images/Logo-TRI-footer.png"}
                alt="Logo footer"
                width={180}
                height={80}
                className="object-contain"
              />
            </Link>
            <h3 className="text-lg md:text-xl font-sans font-[700]  leading-snug">
              {col1.title || "CÔNG TY CỔ PHẦN GIÁO DỤC VÀ ĐÀO TẠO ANT EDU"}
            </h3>
            <div>
              <Text
                weight="regular"
                html={col1.content || ""}
                className="text-white flex flex-col gap-2.5 leading-[22px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-base md:text-lg font-sans font-[600]">
                {col1.label || "THI KHẢO THÍ CÙNG IDP TẠI ANT EDU"}
              </p>
              <Link href={col1?.linkImage || "#"} className="relative">
                <Image
                  src={col1.image || "/images/idp-ielts-footer.webp"}
                  alt="ielts-ant"
                  width={240}
                  height={100}
                  className="object-contain"
                />
              </Link>
            </div>
          </div>
        )}

        {/* Cột 2: Giới thiệu + Khóa học */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="flex-1 flex flex-col gap-4">
            {col2?.label &&
              col2.label.map((item, index) => (
                <div key={index} className="">
                  <Link href={item?.link || "#"}>
                    <h3 className="font-sans font-[600] text-base border-b border-gray-200 pb-3">
                      {item?.title || ""}
                    </h3>
                  </Link>
                  <ul className="space-y-2 font-sans font-[500] mt-1.5">
                    {item?.children !== undefined &&
                      item.children.map((value, indexChildren) => (
                        <li key={indexChildren}>
                          <Link
                            href={value?.link || "#"}
                            className="hover:underline"
                          >
                            {value?.title || ""}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}

            <div className="mt-3">
              <h4 className="uppercase text-base font-sans font-[600] mb-5 border-b border-gray-200 pb-3">
                Kết nối với chúng tôi
              </h4>
              <div className="flex gap-5">
                <a
                  href="https://www.tiktok.com/@thereal.ielts"
                  target="_blank"
                  className="w-12 h-12 bg-white rounded-full relative overflow-hidden"
                >
                  <Image
                    src="/icons/tik-tok.png"
                    alt="tiktok"
                    fill
                    className="object-contain"
                  />
                </a>
                <a
                  href="https://www.facebook.com/realieltsvn"
                  target="_blank"
                  className="w-12 h-12 bg-white rounded-full relative overflow-hidden"
                >
                  <Image
                    src="/icons/fb-icon.png"
                    alt="facebook"
                    fill
                    className="object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Cột 3 */}
          <div className="flex-1 flex flex-col gap-4">
            {col3?.label !== undefined &&
              col3.label.map((item, index) => (
                <div key={index} className="">
                  <Link href={item?.link || "#"}>
                    <h3 className="font-sans font-[600] text-base border-b border-gray-200 pb-3">
                      {item?.title || ""}
                    </h3>
                  </Link>
                  <ul className="space-y-2 font-sans font-[500] mt-1.5">
                    {item?.children !== undefined &&
                      item.children.map((value, indexChildren) => (
                        <li key={indexChildren}>
                          <Link
                            href={value?.link || "#"}
                            className="hover:underline"
                          >
                            {value?.title || ""}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>

        {/* Cột 4: Form & Fanpage */}
        <div className="flex flex-col gap-4">
          {col4.openFormConsultation === true && <FormFooter />}

          {Array.isArray(col4?.label) &&
            col4.label
              .filter((item) => item?.title?.trim() !== "")
              .map((item, index) => (
                <div key={index}>
                  <Link href={item?.link || "#"}>
                    <h3 className="font-sans font-[600] text-base border-b border-gray-200 pb-3">
                      {item.title}
                    </h3>
                  </Link>

                  <ul className="space-y-2 font-sans font-[500] mt-1.5">
                    {Array.isArray(item?.children) &&
                      item.children.map((value, indexChildren) => (
                        <li key={indexChildren}>
                          <Link
                            href={value?.link || "#"}
                            className="hover:underline"
                          >
                            {value?.title || ""}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}

          {col4.openFanpage === true && (
            <div>
              <h3 className="font-bold text-base mb-3 border-b border-gray-200 pb-3">
                FANPAGE
              </h3>
              <iframe
                title="Fanpage Facebook ANT IELTS"
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Frealieltsvn&width=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                width="100%"
                height="100%"
                style={{ border: "none", overflow: "hidden", minHeight: 200 }}
                scrolling="no"
                frameBorder={0}
                allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="w-full mx-auto border-t border-gray-200 pt-2.5 text-center text-blue-50 text-sm">
        © 2024 – The Real IELTS. All Rights Reserved
      </div>
    </div>
  );
}
