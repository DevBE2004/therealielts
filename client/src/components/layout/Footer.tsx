import { http } from "@/lib/http";
import { ApiResponseSchema } from "@/types";
import FooterConfig from "./footer-config";
import z from "zod";

const Footer = async () => {
  const fetchFooter = await http(ApiResponseSchema(z.any()), {
    path: "/introduce/8",
    init: {
      next: {
        revalidate: 300,
      },
    },
  });

  const dataFooter = fetchFooter?.data?.section1;

  return (
    <footer className="bg-[#20376C] text-white py-6 px-4 md:px-8">
      {dataFooter && <FooterConfig data={dataFooter} />}
    </footer>
  );
};

export default Footer;
