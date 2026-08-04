import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "고비즈코리아",
  description: "중소기업의 수출 전 과정을 지원하는 고비즈코리아 안내 사이트",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
