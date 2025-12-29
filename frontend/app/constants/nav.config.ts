// nav.config.ts
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    children: [
      { label: "Ministry Overview", href: "/about/overview" },
      { label: "Vision & Mission", href: "/about/vision" },
      { label: "Leadership", href: "/about/leadership" },
    ],
  },
  {
    label: "Departments",
    children: [
      { label: "Minority Finance Corporation", href: "/departments/mfc" },
      { label: "Wakf Board", href: "/departments/wakf" },
    ],
  },
  { label: "Achievements", href: "/achievements" },
  { label: "File & Manage Grievance", href: "/grievance" },
  {
    label: "Reports",
    children: [
      { label: "Annual Reports", href: "/reports/annual" },
      { label: "Audit Reports", href: "/reports/audit" },
    ],
  },
  { label: "Budget", href: "/budget" },
];
