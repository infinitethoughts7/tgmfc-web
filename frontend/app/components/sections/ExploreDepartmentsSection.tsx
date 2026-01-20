import DepartmentCard from "../DepartmentCard";
import departmentsData from "../../mock/department-names.json";
import { Building2 } from "lucide-react";

type Department = {
  id: number;
  name: string;
  slug: string;
  logos: string;
  externalLink?: string | null;
};

export default function ExploreDepartmentsSection() {
  return (
    <section className="w-full bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-teal-800">
                Explore Our Departments
              </h2>
            </div>
            <div className="w-24 h-1 bg-green-600"></div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {departmentsData.departments.map((department: Department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </div>
      </div>
    </section>
  );
}
