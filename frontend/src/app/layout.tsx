import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { PortfolioAPI } from "@/services/api";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const res = await PortfolioAPI.getProfile();
  const title = res.success && res.data ? `${res.data.name} | Portfolio` : "Sabari Portfolio";
  return {
    title,
    description: "Full Stack Developer Portfolio",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profileRes = await PortfolioAPI.getProfile();
  const profileName = profileRes.success && profileRes.data ? profileRes.data.name : "Sabari Portfolio";

  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans">
        <Navbar title="Sabari Portfolio" />
        {children}
      </body>
    </html>
  );
}
