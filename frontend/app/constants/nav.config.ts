// app/constants/nav.config.ts

type NavChild = {
  label: string;
  href: string;
  externalLink?: string;
};

type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },

  {
    label: "About Us",
    children: [
      { label: "About Ministry", href: "/about/ministry" },
      { label: "List of Chairpersons", href: "/about/chairpersons" },
      { label: "Organogram", href: "/about/organogram" },
    ],
  },

  {
    label: "Departments",
    children: [
      {
        label: "TGMREIS",
        href: "/departments/tgmreis",
        externalLink: "https://tgmreistelangana.cgg.gov.in",
      },
      {
        label: "Telangana Minority Finance Corporation",
        href: "/departments/minority-finance-corporation",
        externalLink: "https://tgmfc.com/",
      },
      {
        label: "Telangana Christian Minority Finance Corporation",
        href: "/departments/christian-minority-finance-corporation",
        externalLink: "https://tgcmfc.in/",
      },
      {
        label: "Telangana State Waqf Board",
        href: "/departments/waqf-board",
        externalLink: "https://waqf.telangana.gov.in/",
      },
      {
        label: "Survey Commissioner of Waqf",
        href: "/departments/survey-commissioner-waqf",
      },
      {
        label: "Waqf Tribunal",
        href: "/departments/waqf-tribunal",
        externalLink: "https://waqf.telangana.gov.in/",
      },
      {
        label: "Telangana Haj Committee",
        href: "/departments/haj-committee",
        externalLink: "https://telanganastatehajcommittee.com/",
      },
      {
        label: "Telangana Urdu Academy",
        href: "/departments/urdu-academy",
        externalLink: "https://www.urduacademyts.com/",
      },
      {
        label: "Minorities Study Circle",
        href: "/departments/minorities-study-circle",
        externalLink: "https://tsstudycircle.co.in/",
      },
      {
        label: "Centre for Education Development of Minorities",
        href: "/departments/cedm",
        externalLink: "https://tscedm.com/",
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
  // { label: "File & Manage Grievance", href: "/grievance" },
  { label: "News & Press", href: "/news-and-press" },
  { label: "Schemes", href: "/schemes" },
  { label: "Photo Gallery", href: "/photo-gallery" },
  { label: "Achievements", href: "/achievements" },
  { label: "Budget", href: "/budget" },
];