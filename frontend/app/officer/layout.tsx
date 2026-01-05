import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Officer Portal - Ministry of Minority Affairs",
  description: "Officer portal for grievance management",
};

export default function OfficerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Officer pages don't include TopHeader, NavBar, or Footer */}
      {/* They have their own custom layouts */}
      {children}
    </>
  );
}
