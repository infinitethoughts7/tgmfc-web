"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { Officer } from "@/app/lib/types/grievance";

type OfficerLayoutProps = {
  children: ReactNode;
  officer: Officer;
};

export default function OfficerLayout({ children, officer }: OfficerLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("officer_token");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {officer.name}
              </h1>
              <p className="text-sm text-gray-600">
                {officer.designation} | Level {officer.level}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{officer.role.replace(/_/g, " ").toUpperCase()}</p>
                <p className="text-xs text-gray-500">{officer.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {officer.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
