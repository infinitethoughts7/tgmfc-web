import Image from "next/image";
import Link from "next/link";

type Department = {
  id: number;
  name: string;
  slug: string;
  logos: string;
  externalLink?: string | null;
};

export default function DepartmentCard({ department }: { department: Department }) {
  const cardContent = (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center h-full cursor-pointer">
      <div className="w-20 h-20 relative mb-4">
        <Image
          src={department.logos}
          alt={department.name}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-sm font-semibold text-gray-800 leading-tight">
        {department.name}
      </h3>
      {department.externalLink && (
        <span className="mt-2 text-xs text-green-600">Visit Website ↗</span>
      )}
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