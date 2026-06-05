import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "서류 합격률 트래커",
  description: "취업 지원 내역과 서류 합격률을 관리하는 웹 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
