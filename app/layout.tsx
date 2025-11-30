import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { ThemeScript } from "./components/ThemeScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "trendCRM - Instagram Analiz ve Trend CRM",
  description: "Instagram hesap analizi ve haftalık trend içerik takibi için modern CRM paneli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem("theme") || 
                  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                document.documentElement.classList.remove("light", "dark");
                document.documentElement.classList.add(theme);
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-900`}>
        <ThemeScript />
        <div className="min-h-screen">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6 dark:bg-gray-900">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
