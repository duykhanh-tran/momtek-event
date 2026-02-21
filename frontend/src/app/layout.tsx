import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Script from "next/script"

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
    siteName: 'Momtek - Tet Song',
    images: [
      {
        url: '/images/ME-3.jpg', 
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
        <Analytics />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vf4jsn9isy");
          `}
        </Script>
      </body>
    </html>
  );
}