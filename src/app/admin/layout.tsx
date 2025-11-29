import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { ReactNode } from "react";
import { AdminSideBar } from "@/components/admin/side-bar";
import { SidebarProvider } from "@/components/ui/sidebar";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Student Affairs and Services",
  description: "student affairs and services portal for USTP",
};

export default async function studentLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-main antialiased`}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AdminSideBar />
            <div className="flex flex-1 flex-col bg-muted/20">
              <main className="flex-1 p-3">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
  