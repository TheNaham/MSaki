import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maxglobalfriends",
  description: "글로벌 인맥 10,000명 프로젝트 기록",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans">{children}</body>
    </html>
  );
}
