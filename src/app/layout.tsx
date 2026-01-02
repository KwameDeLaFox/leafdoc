import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeafDoc - Your AI Plant Doctor",
  description: "Diagnose plant issues and get care recommendations instantly.",
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Replace with your real Google AdSense ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen pt-16`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-2xl">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
