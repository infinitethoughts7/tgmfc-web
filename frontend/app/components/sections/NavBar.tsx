"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { NAV_ITEMS } from "@/app/constants/nav.config";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if a nav item is active
  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Check if any child in dropdown is active
  const hasActiveChild = (children?: Array<{ href: string }>) => {
    if (!children) return false;
    return children.some(child => isActive(child.href));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Make navbar sticky when scrolled past a certain point
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${isSticky ? 'sticky top-0 shadow-md' : 'relative'} z-50 w-full border-b bg-white transition-all duration-300`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        {/* Desktop Navigation */}
        <nav ref={dropdownRef} className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative">
              {!item.children ? (
                <Link
                  href={item.href!}
                  className={`rounded px-3 py-2 font-semibold transition-all duration-200 hover:bg-green-600 hover:text-white hover:scale-105 ${
                    isActive(item.href) 
                      ? "bg-green-500 text-white scale-105" 
                      : "text-black"
                  }`}
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
                    className={`flex items-center gap-1 rounded px-3 py-2 font-semibold transition-all duration-200
                      ${
                        openDropdown === item.label || hasActiveChild(item.children)
                          ? "bg-green-500 text-white scale-105"
                          : "text-black hover:bg-green-600 hover:text-white hover:scale-105"
                      }`}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === item.label ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {openDropdown === item.label && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-white shadow-lg border border-gray-200">
                      {item.children.map((child, index) =>
                        child.externalLink ? (
                          <a
                            key={child.label}
                            href={child.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block px-4 py-3 text-sm font-medium text-black hover:bg-green-100 hover:text-green-800 ${
                              index !== item.children!.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label} <span className="text-xs">→</span>
                          </a>
                        ) : (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`block px-4 py-3 text-sm font-medium ${
                              isActive(child.href)
                                ? "bg-green-500 text-white"
                                : "text-black hover:bg-green-100 hover:text-green-800"
                            } ${
                              index !== item.children!.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Toggle */}
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
        <div className="md:hidden border-t bg-white px-4 py-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {!item.children ? (
                  <Link
                    href={item.href!}
                    className={`block rounded px-3 py-2 font-semibold transition ${
                      isActive(item.href)
                        ? "bg-green-500 text-white"
                        : "text-black hover:bg-green-600 hover:text-white"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <details className="group">
                    <summary className={`flex cursor-pointer items-center justify-between rounded px-3 py-2 font-semibold transition ${
                      hasActiveChild(item.children)
                        ? "bg-green-500 text-white"
                        : "hover:bg-green-600 hover:text-white"
                    }`}>
                      {item.label}
                      <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                    </summary>
                    <ul className="ml-3 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          {child.externalLink ? (
                            <a
                              href={child.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded px-2 py-1 text-sm text-black hover:bg-green-100"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label} <span className="text-xs">→</span>
                            </a>
                          ) : (
                            <Link
                              href={child.href}
                              className={`block rounded px-2 py-1 text-sm ${
                                isActive(child.href)
                                  ? "bg-green-500 text-white"
                                  : "text-black hover:bg-green-100"
                              }`}
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          )}
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