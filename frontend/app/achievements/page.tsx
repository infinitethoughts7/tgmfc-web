"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  GraduationCap,
  Building2,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Briefcase,
  HeartHandshake,
} from "lucide-react";

// --- DATA EXTRACTION FROM SOURCE ---

// Source: Page 7 
const budgetData = [
  { year: "2014-15", allocated: 1030, released: 461 },
  { year: "2016-17", allocated: 1200, released: 1100 },
  { year: "2018-19", allocated: 1973, released: 1416 },
  { year: "2020-21", allocated: 1513, released: 1522 },
  { year: "2022-23", allocated: 1724, released: 2319 },
  { year: "2024-25", allocated: 2997, released: 2750 },
  { year: "2025-26", allocated: 3590, released: 2666 },
];

// Source: Page 4 
const demographicData = [
  { name: "Muslims", value: 89.17, color: "#0ea5e9" }, // Sky 500
  { name: "Christians", value: 8.93, color: "#22c55e" }, // Green 500
  { name: "Sikhs", value: 0.65, color: "#eab308" }, // Yellow 500
  { name: "Jains", value: 0.61, color: "#f97316" }, // Orange 500
  { name: "Others", value: 0.64, color: "#64748b" }, // Slate 500
];

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Milestones & Achievements
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Highlighting the Government of Telangana&apos;s commitment to Minority Welfare through
            record-breaking budget allocations, educational excellence, and infrastructure development.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: Key Metrics (Bento Grid) */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Impact at a Glance (2025-26)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<TrendingUp />}
              label="Total Budget Allocation"
              value="₹3,590.77 Cr"
              subtext="Highest ever allocation "
              color="blue"
            />
            <StatCard
              icon={<Users />}
              label="Student Enrollment"
              value="85,341"
              subtext="Across 205 Institutions "
              color="green"
            />
            <StatCard
              icon={<Award />}
              label="Exam Qualifiers"
              value="5,099"
              subtext="IIT, NEET, EAMCET, etc. "
              color="purple"
            />
            <StatCard
              icon={<HeartHandshake />}
              label="Shaadi Mubarak"
              value="11,439"
              subtext="Beneficiaries this year "
              color="pink"
            />
          </div>
        </section>

        {/* Section 2: Budget Growth Chart */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Budgetary Growth</h2>
              <p className="text-gray-500 mt-1">
                Consistent increase in allocation and release of funds (in Crores).
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-400">Source: Dept Budget Overview </p>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={budgetData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
                  cursor={{ fill: "transparent" }}
                />
                <Legend />
                <Bar name="Budget Allocated" dataKey="allocated" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar name="Budget Released" dataKey="released" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Section 3: Educational Excellence */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
              Educational Development (TGMREIS)
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Infrastructure & Reach</h3>
              <ul className="space-y-3">
                <ListItem text="205 Residential Institutions operational (98 Girls | 107 Boys) " />
                <ListItem text="54 'Young India' complexes sanctioned @ ₹200 Cr each " />
                <ListItem text="1,372 teaching posts filled in Residential Schools " />
                <ListItem text="Common Diet Menu implemented across all schools " />
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Overseas Scholarship Scheme</h3>
              <div className="flex items-center justify-between mb-4">
                 <div>
                    <p className="text-3xl font-bold text-indigo-600">250</p>
                    <p className="text-sm text-gray-500">Students Selected (Fall 2024)</p>
                 </div>
                 <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-600">₹20 Lakhs</p>
                    <p className="text-sm text-gray-500">Grant per Student</p>
                 </div>
              </div>
              <p className="text-sm text-gray-600">
                 Scholarships provided for PG & Doctoral courses in USA, UK, Australia, etc. 
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6 text-orange-600" />
              Infrastructure (PMJVK)
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
               <h3 className="font-semibold text-lg mb-6">Project Completion Status</h3>
               {/* Custom Progress Bar for PMJVK */}
               <div className="mb-8">
                  <div className="flex justify-between mb-2">
                     <span className="font-medium text-gray-700">Residential Schools</span>
                     <span className="text-sm text-gray-500">19/54 Completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                     <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                  </div>
               </div>
               <div className="mb-8">
                  <div className="flex justify-between mb-2">
                     <span className="font-medium text-gray-700">Health Centers</span>
                     <span className="text-sm text-gray-500">8/9 Completed (Nearly 90%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                     <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '89%' }}></div>
                  </div>
               </div>
               <div className="mb-4">
                  <div className="flex justify-between mb-2">
                     <span className="font-medium text-gray-700">Anganwadi Buildings</span>
                     <span className="text-sm text-gray-500">16 Completed / 31 In Progress</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                     <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '32%' }}></div>
                  </div>
               </div>
               <p className="text-xs text-gray-400 mt-6">
                  Data Source: PMJVK Project Status Report 
               </p>
            </div>
          </div>
        </section>

        {/* Section 4: Welfare & Economic Support */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-teal-600" />
            Welfare & Economic Empowerment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <InfoCard 
                title="Shaadi Mubarak" 
                value="₹324.96 Cr" 
                desc="Released for 11,439 beneficiaries in FY 2025-26 " 
             />
             <InfoCard 
                title="Sewing Machines" 
                value="13,538+" 
                desc="Distributed to empower women (12,940 General + 598 Christian Minorities) " 
             />
             <InfoCard 
                title="Fee Reimbursement (RTF)" 
                value="20,183" 
                desc="Students benefited from Tuition Fee Reimbursement this year " 
             />
          </div>
        </section>

        {/* Section 5: Demographics (Pie Chart) */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                 <h2 className="text-2xl font-bold mb-4">Demographic Focus</h2>
                 <p className="text-gray-600 mb-6">
                    Our welfare programs are designed to serve the diverse minority population of Telangana, which constitutes 14.24% of the total state population (50.07 Lakhs).
                 </p>
                 <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#0ea5e9]"></span> Muslims: 89.17%</li>
                    <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22c55e]"></span> Christians: 8.93%</li>
                    <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#eab308]"></span> Sikhs & Others: ~1.9%</li>
                 </ul>
                 <p className="text-xs text-gray-400 mt-4"></p>
              </div>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={demographicData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                       >
                          {demographicData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ icon, label, value, subtext, color }: any) {
  const colorClasses: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    pink: "bg-pink-50 text-pink-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-2">{subtext}</p>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1.5 min-w-[6px] h-1.5 rounded-full bg-indigo-500" />
      <span className="text-gray-600 text-sm leading-relaxed">{text}</span>
    </li>
  );
}

function InfoCard({ title, value, desc }: any) {
   return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
         <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">{title}</h3>
         <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
         </div>
         <p className="mt-2 text-sm text-gray-600">{desc}</p>
      </div>
   )
}