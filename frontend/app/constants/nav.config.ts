// app/constants/nav.config.ts

export const NAV_ITEMS = [
  { label: "Home", href: "/" },

  {
    label: "About Us",
    children: [
      { label: "Overview", href: "/about/overview" },
      { label: "Vision & Mission", href: "/about/vision" },
    ],
  },

  {
    label: "Departments",
    children: [
      {
        label: "TGMREIS",
        href: "/departments/tgmreis",
      },
      {
        label: "Telangana Minority Finance Corporation",
        href: "/departments/minority-finance-corporation",
      },
      {
        label: "Telangana Christian Minority Finance Corporation",
        href: "/departments/christian-minority-finance-corporation",
      },
      {
        label: "Telangana State Waqf Board",
        href: "/departments/waqf-board",
      },
      {
        label: "Survey Commissioner of Waqf",
        href: "/departments/survey-commissioner-waqf",
      },
      {
        label: "Waqf Tribunal",
        href: "/departments/waqf-tribunal",
      },
      {
        label: "Telangana Haj Committee",
        href: "/departments/haj-committee",
      },
      {
        label: "Telangana Urdu Academy",
        href: "/departments/urdu-academy",
      },
      {
        label: "Minorities Study Circle",
        href: "/departments/minorities-study-circle",
      },
      {
        label: "Centre for Education Development of Minorities",
        href: "/departments/cedm",
      },
      {
        label: "Dairatul-Maarif-il-Osmania",
        href: "/departments/dairatul-maarif",
      },
      {
        label: "Telangana Minorities Commission",
        href: "/departments/minorities-commission",
      },
    ],
  },
  {label:'Photo gallery', href: '/photo-gallery'},
  { label: "File & Manage Grievance", href: "/grievance" },
  { label: "Achievements", href: "/achievements" },
  { label: "Reports", href: "/reports" },
  { label: "Budget", href: "/budget" },
];
