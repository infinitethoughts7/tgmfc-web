import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Department = {
  id: number;
  name: string;
  slug: string;
  logos: string;
  externalLink?: string | null;
};

export default function DepartmentCard({ department }: { department: Department }) {
  const cardContent = (
    <div className="group relative bg-white hover:bg-green-600 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col h-full cursor-pointer hover:scale-[0.98]">
      {/* Icon */}
      <div className="w-12 h-12 relative mb-4 text-red-600">
        <Image
          src={department.logos}
          alt={department.name}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Department Name */}
      <h3 className="text-xl font-bold text-gray-900 group-hover:text-white leading-tight mb-3 flex-grow">
        {department.name}
      </h3>

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
