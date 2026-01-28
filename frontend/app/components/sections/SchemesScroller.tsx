"use client";

import Link from "next/link";
import { CircleDot } from "lucide-react";
import schemesData from "../../mock/schemes.json";

type Scheme = {
  id: string;
  name: string;
  category: string;
  benefit: string;
  benefitAmount?: string;
};

export default function SchemesScroller() {
  const schemes = schemesData.schemes as Scheme[];

  return (
    <div className="w-full bg-white border-b border-gray-100 py-4 mt-2 overflow-hidden">
      <div className="overflow-hidden relative px-6">
        <div className="flex animate-scroll gap-12 whitespace-nowrap">
          {/* First set */}
          {schemes.map((scheme) => (
            <Link
              key={scheme.id}
              href={`/schemes#${scheme.id}`}
              className="inline-flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors shrink-0"
            >
              <CircleDot className="w-4 h-4 text-green-600" />
              <span className="text-base font-medium">{scheme.name}</span>
              {scheme.benefitAmount && (
                <span className="text-sm text-green-700 font-semibold">
                  {scheme.benefitAmount}
                </span>
              )}
            </Link>
          ))}
          {/* Duplicate for seamless loop */}
          {schemes.map((scheme) => (
            <Link
              key={`${scheme.id}-dup`}
              href={`/schemes#${scheme.id}`}
              className="inline-flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors shrink-0"
            >
              <CircleDot className="w-4 h-4 text-green-600" />
              <span className="text-base font-medium">{scheme.name}</span>
              {scheme.benefitAmount && (
                <span className="text-sm text-green-700 font-semibold">
                  {scheme.benefitAmount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
