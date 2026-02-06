import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"], // Quan trọng: Hỗ trợ tiếng Việt
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"], // Load đủ độ đậm nhạt
  variable: "--font-nunito", // Biến CSS để dùng trong Tailwind
  display: "swap",
});

export const metadata: Metadata = {
  title: "Momtek English - Luyện phát âm AI",
  description: "Ứng dụng luyện phát âm tiếng Anh thông minh cho mẹ và bé",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${nunito.variable} font-sans antialiased`} >
        {children}
      </body>
    </html>
  );
}
