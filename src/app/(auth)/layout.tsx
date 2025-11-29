import React from "react";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function authLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster  richColors position="bottom-right" />
      </body>
    </html>
  );
}
