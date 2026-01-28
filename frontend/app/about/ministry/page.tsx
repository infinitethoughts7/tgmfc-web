export default function MinistryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            About the Ministry
          </h1>
          <div className="w-16 h-1 bg-green-600"></div>
        </div>

        {/* Introduction */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 mb-6">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            The <strong>Department of Minorities Welfare</strong> was created in the year <strong>1993</strong>. The primary objective of the Department is <strong>Socio Economic Development and Educational Advancement of Minorities</strong> in the State.
          </p>
        </div>

        {/* Main Functions Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
            Main Functions of the Department
          </h2>

          <ol className="space-y-3">
            {[
              "Introduce schemes to promote accelerated socio-economic development of minorities",
              "Introduce educational concessions for students of minority communities",
              "Implement schemes for development of women and children of minority communities",
              "Provide training and employment opportunities, thereby tackling the problem of economic backwardness among minorities",
              "Provide guidance to those in the minority communities wanting to set up entrepreneurial ventures",
              "Issue of Marriage Licenses to Christians",
              "Appointment of Khazis in the State",
              "Issue of Minority Status Certificate to all Minority Institutions in the State"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="shrink-0 w-6 h-6 bg-green-600 text-white rounded text-sm flex items-center justify-center font-medium mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm sm:text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Vision */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              Vision
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              To create an inclusive and equitable society where minority communities can realize their full potential and contribute meaningfully to the social, economic, and cultural development of Telangana State.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              Mission
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              To empower minority communities through comprehensive welfare programs that address their socio-economic challenges and promote their overall development.
            </p>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
            Key Focus Areas
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border-l-4 border-green-600 pl-4 py-2">
              <h3 className="font-medium text-gray-900 mb-1">Socio-Economic Empowerment</h3>
              <p className="text-gray-600 text-sm">
                Implement targeted schemes to reduce economic disparities and promote self-reliance among minority communities.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4 py-2">
              <h3 className="font-medium text-gray-900 mb-1">Educational Excellence</h3>
              <p className="text-gray-600 text-sm">
                Provide educational opportunities and concessions to ensure minority students achieve academic success.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4 py-2">
              <h3 className="font-medium text-gray-900 mb-1">Gender Equality</h3>
              <p className="text-gray-600 text-sm">
                Focus on women and children welfare through specialized programs and support services.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4 py-2">
              <h3 className="font-medium text-gray-900 mb-1">Cultural Preservation</h3>
              <p className="text-gray-600 text-sm">
                Support cultural and religious institutions while maintaining social harmony and integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}