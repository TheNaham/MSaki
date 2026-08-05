import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TLJquiz",
  description: "본부장급 글로벌 사업 의사결정 트레이닝",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-se-charcoal font-sans text-se-ink antialiased">
        {children}
      </body>
    </html>
  );
}
