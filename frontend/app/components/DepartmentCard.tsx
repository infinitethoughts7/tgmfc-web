import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Department = {
  id: number;
  name: string;
  slug: string;
  logos: string;
  externalLink?: string | null;
  description?: string;
};

export default function DepartmentCard({ department }: { department: Department }) {
  const cardContent = (
    <div className="group relative bg-white hover:bg-green-600 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col h-full cursor-pointer hover:scale-[0.98]">
      {/* Default State - Icon centered */}
      <div className="w-12 h-12 relative mb-4 group-hover:hidden">
        <Image
          src={department.logos}
          alt={department.name}
          fill
          className="object-contain"
        />
      </div>

      {/* Hover State - Logo and Name in row */}
      <div className="hidden group-hover:flex items-center gap-3 mb-3">
        <div className="w-8 h-8 relative shrink-0">
          <Image
            src={department.logos}
            alt={department.name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-base font-bold text-white leading-tight">
          {department.name}
        </h3>
      </div>

      {/* Default State - Department Name */}
      <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 flex-grow group-hover:hidden">
        {department.name}
      </h3>

      {/* Hover State - Description */}
      {department.description && (
        <p className="hidden group-hover:block text-sm font-semibold text-white/90 leading-relaxed flex-grow">
          {department.description}
        </p>
      )}

      {/* Arrow Icon */}
      <div className="flex items-center justify-start mt-auto">
        <ArrowRight className="w-6 h-6 text-green-700 group-hover:text-white transition-all duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  );

  if (department.externalLink) {
    return (
      <a href={department.externalLink} target="_blank" rel="noopener noreferrer">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={`/departments/${department.slug}`}>
      {cardContent}
    </Link>
  );
}
