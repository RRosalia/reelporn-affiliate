import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleTagManager from "@/components/GoogleTagManager";
import EchoProvider from "@/components/EchoProvider";
import MainLayout from "@/components/MainLayout";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Affiliate Panel",
  description: "Affiliate management panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EchoProvider>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </EchoProvider>
      </body>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </html>
  );
}
