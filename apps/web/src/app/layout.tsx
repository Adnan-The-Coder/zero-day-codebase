import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Zero | Proactive Shielding",
  description: "Build a complete risk graph of your software estate to pinpoint and fix critical issues across people and supply chain without the noise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>

  );
}
