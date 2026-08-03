import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MaHB — 회고",
  description: "폴라로이드로 남기는 나의 순간들",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
