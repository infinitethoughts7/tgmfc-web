import Link from "next/link";
import { Mail, MapPin, Phone, Globe } from "lucide-react";
import { NAV_ITEMS } from "@/app/constants/nav.config";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-green-600 to-green-700 text-white border-t border-green-500">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Ministry Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Ministry of Minority Affairs</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="mailto:tsmfcinfo@gmail.com" className="hover:underline">
                  tsmfcinfo@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <address className="not-italic">
                  1-53, Lakdika pool, Hyderabad<br />
                  Telangana, 500087
                </address>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>+91 XX XXXX XXXX</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.filter(item => !item.children).map((item) => (
                <li key={item.label}>
                  <Link href={item.href!} className="hover:underline hover:text-green-200 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-xl font-bold mb-4">Departments</h3>
            <ul className="space-y-2 text-sm max-h-64 overflow-y-auto pr-2">
              {NAV_ITEMS.find(item => item.label === "Departments")?.children?.map((dept) => (
                <li key={dept.label}>
                  <Link href={dept.href!} className="hover:underline hover:text-green-200 transition-colors">
                    {dept.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Languages */}
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            
            {/* Social Media */}
            <div className="space-y-3 mb-6">
              <a 
                href="https://twitter.com/minority-affairs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
                <span className="text-sm">Minority-Affairs-Official</span>
              </a>

              <a 
                href="https://instagram.com/minority-affairs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm">Minority-Affairs-Official</span>
              </a>

              <a 
                href="https://facebook.com/minority-affairs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm">Minority-Affairs-Official</span>
              </a>
            </div>

            {/* Language Selector */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Select Language
              </h4>
              <select className="w-full bg-white text-gray-800 rounded px-3 py-2 text-sm border-0 focus:ring-2 focus:ring-green-400">
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ur">اردو (Urdu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {new Date().getFullYear()} Ministry of Minority Affairs, Telangana. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:underline hover:text-green-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:underline hover:text-green-200">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:underline hover:text-green-200">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}