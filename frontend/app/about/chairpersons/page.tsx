import chairpersonsData from "../../mock/chairpesons.json";

type Chairperson = {
  id: number;
  name: string;
  designation: string;
};

export default function ChairpersonsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            List of Chairpersons
          </h1>
          <div className="w-16 h-1 bg-green-600"></div>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="bg-green-600">
                  <th className="px-6 sm:px-8 py-5 sm:py-6 text-left text-base sm:text-lg font-semibold text-white w-24 sm:w-32">
                    Sl.No
                  </th>
                  <th className="px-6 sm:px-8 py-5 sm:py-6 text-left text-base sm:text-lg font-semibold text-white">
                    Name
                  </th>
                  <th className="px-6 sm:px-8 py-5 sm:py-6 text-left text-base sm:text-lg font-semibold text-white">
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
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      hover:bg-green-50 transition-colors duration-150
                      border-b border-gray-200
                    `}
                  >
                    <td className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-medium text-gray-900">
                      {chairperson.id}
                    </td>
                    <td className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-medium text-gray-900">
                      {chairperson.name}
                    </td>
                    <td className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg text-gray-700">
                      {chairperson.designation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
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