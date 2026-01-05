"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, User, LogOut, FileText } from "lucide-react";
import Image from "next/image";

type SidebarProps = {
  onLogout: () => void;
};

const navigationItems = [
  { name: "Dashboard", href: "/officer/dashboard", icon: Home },
  { name: "My Grievances", href: "/officer/grievances", icon: List },
  { name: "Profile", href: "/officer/profile", icon: User },
  { name: "Reports", href: "/officer/reports", icon: FileText },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-teal-800 text-white">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 border-b border-teal-700 p-6">
        <div className="relative h-10 w-10">
          <Image
            src="/logos/telangana.png"
            alt="Telangana Logo"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold">Officer Portal</h1>
          <p className="text-xs text-teal-200">Grievance Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-700 text-white"
                  : "text-teal-100 hover:bg-teal-700 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-teal-700 p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-teal-100 transition-colors hover:bg-teal-700 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
