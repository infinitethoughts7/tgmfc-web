import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import Footer from "./components/Footer";
import TopHeader from "./components/sections/TopHeader";
import NavBar from "./components/sections/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ministry of Minority Affairs - Telangana",
  description: "Official website of Ministry of Minority Affairs, Government of Telangana. Empowering minority communities through education, welfare, and development initiatives.",
  keywords: "Telangana, Minority Affairs, TGMREIS, Waqf Board, Minority Welfare, Government of Telangana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AccessibilityProvider>
          {/* TopHeader - Available on all pages with scroll behavior */}
          <TopHeader />
          
          {/* NavBar - Available on all pages, becomes sticky on scroll */}
          <NavBar />
          
          {/* Main Content Area - Each page renders here */}
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Footer - Appears on all pages */}
          <Footer />
          
          {/* Google Translate Element Container */}
          <div id="google_translate_element" className="fixed top-4 right-4 z-50 hidden"></div>
        </AccessibilityProvider>
      </body>
    </html>
  );
}