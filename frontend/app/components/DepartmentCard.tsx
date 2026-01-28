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
    <div className="group relative bg-white hover:bg-green-600 rounded-lg shadow-md hover:shadow-lg transition-colors duration-300 p-6 h-48 cursor-pointer overflow-hidden">
      {/* Default State */}
      <div className="flex flex-col h-full group-hover:hidden">
        <div className="w-12 h-12 relative mb-4">
          <Image
            src={department.logos}
            alt={department.name}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          {department.name}
        </h3>
      </div>

      {/* Hover State */}
      <div className="hidden group-hover:flex flex-col h-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 relative shrink-0">
            <Image
              src={department.logos}
              alt={department.name}
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-base font-bold text-white leading-tight line-clamp-2">
            {department.name}
          </h3>
        </div>
        <p className="text-sm text-white/90 leading-relaxed line-clamp-5">
          {department.description}
        </p>
      </div>

      {/* Arrow - positioned absolutely */}
      <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-green-700 group-hover:text-white transition-colors duration-300" />
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
