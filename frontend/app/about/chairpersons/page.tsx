import Image from "next/image";
import chairpersonsData from "../../mock/chairpesons.json";

type Chairperson = {
  id: number;
  name: string;
  designation: string;
};

export default function ChairpersonsPage() {
  return (
    <div className="w-full min-h-screen bg-linear-to-r from-blue-100 via-blue-50 to-white relative">
      {/* Telangana Logo - Top Right */}
      <div className="absolute top-8 right-8 z-10">
        <div className="relative w-24 h-24">
          <Image
            src="/logos/telangana.png"
            alt="Telangana Government"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-teal-800 mb-4">
            LIST OF CHAIRPERSONS
          </h1>
          <div className="w-32 h-1.5 bg-green-600"></div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="bg-linear-to-r from-blue-200 to-blue-100">
                  <th className="px-6 py-5 text-left text-xl font-bold text-teal-800 border-b-2 border-teal-600">
                    Sl.No
                  </th>
                  <th className="px-6 py-5 text-left text-xl font-bold text-teal-800 border-b-2 border-teal-600">
                    Name
                  </th>
                  <th className="px-6 py-5 text-left text-xl font-bold text-teal-800 border-b-2 border-teal-600">
                    Designation & Department
                  </th>
                </tr>
              </thead>



              {/* Table Body */}
              <tbody>
                {chairpersonsData.chairpersons.map((chairperson: Chairperson, index) => (
                  <tr 
                    key={chairperson.id}
                    className={`
                      ${index % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'}
                      hover:bg-blue-200 transition-colors duration-200
                      border-b border-blue-200
                    `}
                  >
                    <td className="px-6 py-6 text-lg font-semibold text-teal-700">
                      {chairperson.id}
                    </td>
                    <td className="px-6 py-6 text-lg font-semibold text-teal-700">
                      {chairperson.name}
                    </td>
                    <td className="px-6 py-6 text-lg text-teal-700">
                      {chairperson.designation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Last Updated: {new Date().toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}``