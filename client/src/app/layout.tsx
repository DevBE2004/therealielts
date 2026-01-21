// import AnalyticsProvider from "@/components/AnalyticsProvider";
import "./globals.css";
import { Providers } from "./Providers";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "ANT IELTS",
  description: "The Ielts ANT is the best",
  other: {
    "preconnect-cloudinary": "https://res.cloudinary.com",
    "preconnect-api": "https://test-server.therealielts.vn",
    "preconnect-fb-static": "https://static.xx.fbcdn.net",
    "preconnect-fb-content": "https://scontent-atl3-2.xx.fbcdn.net",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
        <GoogleAnalytics gaId="G-5Y5BCL72YW" />
        {/* <AnalyticsProvider /> */}
      </body>
    </html>
  );
}
