import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/providers/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FWS Store",
  description: "A melhor loja de eletronicos do Brasil!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-full flex-col items-center justify-center">
          <AuthProvider>
            <div className="h-full w-full bg-accent p-5 md:h-auto md:w-[50%] md:rounded-lg">
              {children}
            </div>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
