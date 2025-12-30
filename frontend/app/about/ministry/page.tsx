export default function MinistryPage() {
    return (
      <div className="w-full bg-linear-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-teal-800 mb-4">
              OVERVIEW
            </h1>
            <div className="w-24 h-1.5 bg-green-600"></div>
          </div>
  
          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                The <span className="font-semibold text-teal-800">Department of Minorities Welfare</span> was created in the year <span className="font-semibold">1993</span>. The primary objective of the Department is <span className="font-semibold text-teal-800">Socio Economic Development and Educational Advancement of Minorities</span> in the State.
              </p>
  
              {/* Main Functions Section */}
              <div className="mt-8">
                <h2 className="text-3xl font-bold text-teal-800 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-green-600 rounded"></span>
                  Main Functions of the Department
                </h2>
                
                <div className="space-y-4">
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
                    <div key={index} className="flex items-start gap-4 p-4 bg-linear-to-r from-teal-50 to-blue-50 rounded-lg border-l-4 border-green-600 hover:shadow-md transition-shadow">
                      <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 text-base leading-relaxed pt-1">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Vision Section */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-teal-800 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-green-600 rounded"></span>
                  Vision
                </h2>

                <div className="bg-linear-to-r from-blue-50 to-teal-50 p-6 rounded-lg border-l-4 border-blue-600">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    To create an <span className="font-semibold text-teal-800">inclusive and equitable society</span> where minority communities can realize their full potential and contribute meaningfully to the social, economic, and cultural development of Telangana State.
                  </p>
                </div>
              </div>

              {/* Mission Section */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-teal-800 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-green-600 rounded"></span>
                  Mission
                </h2>

                <div className="bg-linear-to-r from-teal-50 to-green-50 p-6 rounded-lg border-l-4 border-teal-600">
                  <p className="text-gray-800 text-lg leading-relaxed mb-6">
                    Our mission is to empower minority communities through comprehensive welfare programs that address their socio-economic challenges and promote their overall development.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-teal-800 mb-2">Socio-Economic Empowerment</h3>
                      <p className="text-gray-700 text-sm">
                        Implement targeted schemes to reduce economic disparities and promote self-reliance among minority communities.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-teal-800 mb-2">Educational Excellence</h3>
                      <p className="text-gray-700 text-sm">
                        Provide educational opportunities and concessions to ensure minority students achieve academic success.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-teal-800 mb-2">Gender Equality</h3>
                      <p className="text-gray-700 text-sm">
                        Focus on women and children welfare through specialized programs and support services.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-teal-800 mb-2">Cultural Preservation</h3>
                      <p className="text-gray-700 text-sm">
                        Support cultural and religious institutions while maintaining social harmony and integration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
}