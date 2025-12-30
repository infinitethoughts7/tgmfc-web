"use client";

import Image from "next/image";
import Link from "next/link";

type DepartmentCardProps = {
  department: {
    id: number;
    name: string;
    slug: string;
    logos: string;
    externalLink?: string; // Optional external website link
  };
};

export default function DepartmentCard({ department }: DepartmentCardProps) {
  // Determine the link - external or internal
  const href = department.externalLink || `/departments/${department.slug}`;
  const isExternal = !!department.externalLink;

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : ""}
      className="group block"
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out p-6 h-full flex flex-col items-center justify-center text-center hover:bg-green-50 hover:scale-105 cursor-pointer">
        
        {/* Logo */}
        <div className="relative w-24 h-24 mb-4 transition-transform duration-300 group-hover:scale-110">
          <Image
            src={department.logos}
            alt={`${department.name} logo`}
            fill
            className="object-contain"
          />
        </div>

        {/* Department Name */}
        <h3 className="text-gray-800 font-semibold text-base leading-snug group-hover:text-green-700 transition-colors duration-300">
          {department.name}
        </h3>

        {/* View More Link */}
        <p className="text-green-800 text-bold text-sm mt-4 font-large group-hover:text-green-600 transition-colors duration-300">
          View More →
        </p>
      </div>
    </Link>
  );
}