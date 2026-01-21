import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const urlWeb = process.env.DOMAIN_WEB || "https://therealielts.vn";

  return (
    <>
      <Header urlWeb={urlWeb} />
      <main>
        <ScrollToTop />
        {children}
      </main>
      <Suspense fallback={<div></div>}>
        <Footer />
      </Suspense>
    </>
  );
}
