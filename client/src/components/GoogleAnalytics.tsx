"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const GA_ID = "G-5Y5BCL72YW";

export default function GoogleAnalyticsDelayed() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !pathname) return;

    const initGA = () => {
      if (initialized.current) return;

      window.dataLayer = window.dataLayer || [];

      window.gtag = (...args: any[]) => {
        window.dataLayer?.push(args);
      };

      window.gtag("js", new Date());
      window.gtag("config", GA_ID, {
        page_path: pathname,
      });

      initialized.current = true;
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(initGA, { timeout: 3000 });
    } else {
      setTimeout(initGA, 3000);
    }
  }, [pathname]);

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      strategy="afterInteractive"
    />
  );
}
