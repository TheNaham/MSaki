import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MaxIncome",
  description: "커리어 & 소득 기록",
  robots: { index: false, follow: false },
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
