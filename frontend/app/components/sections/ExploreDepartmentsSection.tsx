import DepartmentCard from "../DepartmentCard";
import departmentsData from "../../mock/department_names.json";

type Department = {
  id: number;
  name: string;
  slug: string;
  logos: string;
  externalLink?: string;
};

export default function ExploreDepartmentsSection() {
  return (
    <section className="w-full bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Explore Our Departments
          </h2>
          <p className="text-gray-600 text-lg">
            Discover the various departments and their services
          </p>
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