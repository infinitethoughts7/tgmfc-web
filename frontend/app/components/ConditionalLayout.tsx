"use client";

import { usePathname } from "next/navigation";
import TopHeader from "./sections/TopHeader";
import NavBar from "./sections/NavBar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current route is an officer route
  const isOfficerRoute = pathname.startsWith("/officer");

  return (
    <>
      {/* Only show TopHeader and NavBar for non-officer routes */}
      {!isOfficerRoute && (
        <>
          <TopHeader />
          <NavBar />
        </>
      )}

      {/* Main Content */}
      <main className={isOfficerRoute ? "" : "min-h-screen"}>
        {children}
      </main>

      {/* Only show Footer for non-officer routes */}
      {!isOfficerRoute && <Footer />}
    </>
  );
}
