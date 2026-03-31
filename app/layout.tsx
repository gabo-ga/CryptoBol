import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoBol - Cotizaciones en vivo e Informacion relevante",
  description: "CryptoBol te ofrece cotizaciones en tiempo real de las diferentes cryptos para Bolivia asi como informacion relevante del mundo crypto.",
  openGraph: {
    images: ["/og-image.png"],
    url: "https://cryptobol.com",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://cryptobol.com",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
