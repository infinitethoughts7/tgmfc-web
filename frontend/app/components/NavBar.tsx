"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_ITEMS } from "@/app/constants/nav.config";
import { ChevronDown, Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="w-full border-b bg-green-600 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Left: Logo / Title */}
        <Link href="/" className="font-semibold text-lg">
          Ministry of Minority Affairs
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {!item.children ? (
                <Link
                  href={item.href!}
                  className="hover:underline focus:outline-none"
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === item.label ? null : item.label
                      )
                    }
                    className="flex items-center gap-1 focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openDropdown === item.label && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-white text-black shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm hover:bg-green-100"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Search (Desktop) */}
        <div className="hidden md:flex items-center gap-2 rounded bg-white px-2 py-1 text-black">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-32 bg-transparent text-sm focus:outline-none"
          />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-green-700 px-4 py-3">
          <div className="mb-3 flex items-center gap-2 rounded bg-white px-2 py-1 text-black">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>

          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {!item.children ? (
                  <Link
                    href={item.href!}
                    className="block py-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between py-1">
                      {item.label}
                      <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                    </summary>
                    <ul className="ml-3 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className="block text-sm"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
