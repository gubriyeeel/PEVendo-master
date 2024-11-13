import "./ui/global.css";
import { inter } from "@/app/ui/fonts";
import { type Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/app/ui/sections/Footer";
import Header from "@/app/ui/sections/HeaderA";

export const metadata: Metadata = {
  title: "PEVendo",
  description: "TUPC's unofficial student portal",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
