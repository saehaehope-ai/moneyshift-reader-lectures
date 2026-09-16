import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "머니시프트 | 김새해",
  description: "머니시프트 전자책 - 김새해",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
