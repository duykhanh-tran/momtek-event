import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.momtek.vn'), 

  title: 'Momtek - Tet Song',
  description: 'Tuyển tập 12 bài hát vui nhộn ngày Tết độc quyền. Học sinh mọi cấp độ nghe, hát, và luyện phát âm với công nghệ đỉnh cao của Microsoft.',

  openGraph: {
    title: 'Momtek - Tet Song',
    description: 'Tuyển tập 12 bài hát vui nhộn ngày Tết độc quyền. Học sinh mọi cấp độ nghe, hát, và luyện phát âm với công nghệ đỉnh cao của Microsoft.',
    url: 'https://www.momtek.vn', 
    siteName: 'Momtek English',
    images: [
      {
        url: '/images/ME-3.png', 
        width: 1200,
        height: 630,
        alt: 'Momtek English Preview',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}