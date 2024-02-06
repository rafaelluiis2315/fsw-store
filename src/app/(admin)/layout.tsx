import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/providers/auth";
import Sidebar from "./dashboard/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FWS Store Admin",
  description: "Onde você controla a maior loja de eletronicos do Brasil!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-full flex-col">
          <AuthProvider>
            <div className="flex h-full">
              <Sidebar />
              {children}
            </div>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
