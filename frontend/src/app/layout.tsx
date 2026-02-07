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
  metadataBase: new URL('https://momtek-event-frontend.vercel.app'), 

  title: 'Momtek English - Luyện phát âm AI',
  description: 'Ứng dụng luyện phát âm tiếng Anh thông minh cho mẹ và bé',

  openGraph: {
    title: 'Momtek English - Luyện phát âm AI',
    description: 'Ứng dụng luyện phát âm tiếng Anh thông minh cho mẹ và bé',
    url: 'https://momtek-event-frontend.vercel.app', 
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