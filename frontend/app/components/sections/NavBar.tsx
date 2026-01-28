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
    <header className={`${isSticky ? 'sticky top-0 shadow-md' : 'relative shadow-sm'} z-50 w-full bg-white transition-all duration-300`}>
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
                      ? "bg-green-600 text-white scale-105" 
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
                    <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-white shadow-xl">
                      {item.children.map((child) =>
                        child.externalLink ? (
                          <a
                            key={child.label}
                            href={child.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-3 text-sm font-medium text-black hover:bg-green-100 hover:text-green-800"
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

        {/* Right: Social Icons + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://twitter.com/minority-affairs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-900 transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/minority-affairs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-900 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://facebook.com/minority-affairs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-900 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded hover:bg-green-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6 text-green-700" /> : <Menu className="h-6 w-6 text-green-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white px-4 py-3 shadow-inner">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {!item.children ? (
                  <Link
                    href={item.href!}
                    className={`block rounded px-3 py-2 font-semibold transition ${
                      isActive(item.href)
                        ? "bg-green-500 text-white"
                        : "text-green-800 hover:bg-green-600 hover:text-white"
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
                        : "text-green-800 hover:bg-green-600 hover:text-white"
                    }`}>
                      {item.label}
                      <ChevronDown className="h-4 w-4 text-green-600 group-open:rotate-180 transition-transform" />
                    </summary>
                    <ul className="ml-3 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          {child.externalLink ? (
                            <a
                              href={child.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded px-2 py-1 text-sm text-green-700 hover:bg-green-100 hover:text-green-900"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label} <span className="text-xs text-green-500">→</span>
                            </a>
                          ) : (
                            <Link
                              href={child.href}
                              className={`block rounded px-2 py-1 text-sm ${
                                isActive(child.href)
                                  ? "bg-green-500 text-white"
                                  : "text-green-700 hover:bg-green-100 hover:text-green-900"
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