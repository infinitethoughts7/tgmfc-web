// ============================================
// LOCATIONS MOCK DATA
// ============================================
// 2 Districts, 5 Mandals for Shadi Mubarak pilot
// Scalable: Just add more entries when expanding
// ============================================

import { District, Mandal } from "../../lib/types/grievance";

// ------------------------------------
// DISTRICTS (2 for pilot)
// ------------------------------------

export const DISTRICTS: District[] = [
  {
    id: "dist_hyd",
    name: "Hyderabad",
    name_te: "హైదరాబాద్",
    code: "HYD",
  },
  {
    id: "dist_rng",
    name: "Rangareddy",
    name_te: "రంగారెడ్డి",
    code: "RNG",
  },
];

// ------------------------------------
// MANDALS (5 for pilot - spread across 2 districts)
// ------------------------------------

export const MANDALS: Mandal[] = [
  // Hyderabad District - 3 Mandals
  {
    id: "mndl_charminar",
    name: "Charminar",
    name_te: "చార్మినార్",
    code: "CHR",
    district_id: "dist_hyd",
  },
  {
    id: "mndl_golconda",
    name: "Golconda",
    name_te: "గోల్కొండ",
    code: "GLC",
    district_id: "dist_hyd",
  },
  {
    id: "mndl_secunderabad",
    name: "Secunderabad",
    name_te: "సికింద్రాబాద్",
    code: "SEC",
    district_id: "dist_hyd",
  },
  
  // Rangareddy District - 2 Mandals
  {
    id: "mndl_rajendranagar",
    name: "Rajendranagar",
    name_te: "రాజేంద్రనగర్",
    code: "RJN",
    district_id: "dist_rng",
  },
  {
    id: "mndl_shamshabad",
    name: "Shamshabad",
    name_te: "షంషాబాద్",
    code: "SHM",
    district_id: "dist_rng",
  },
];

// ------------------------------------
// HELPER FUNCTIONS
// ------------------------------------

/**
 * Get district by ID
 */
export function getDistrictById(id: string): District | undefined {
  return DISTRICTS.find((d) => d.id === id);
}

/**
 * Get mandal by ID
 */
export function getMandalById(id: string): Mandal | undefined {
  return MANDALS.find((m) => m.id === id);
}

/**
 * Get all mandals in a district
 */
export function getMandalsByDistrict(districtId: string): Mandal[] {
  return MANDALS.filter((m) => m.district_id === districtId);
}

/**
 * Get district of a mandal
 */
export function getDistrictByMandal(mandalId: string): District | undefined {
  const mandal = getMandalById(mandalId);
  if (!mandal) return undefined;
  return getDistrictById(mandal.district_id);
}

/**
 * Get location display string
 * Example: "Charminar, Hyderabad"
 */
export function getLocationString(mandalId: string): string {
  const mandal = getMandalById(mandalId);
  if (!mandal) return "Unknown Location";
  
  const district = getDistrictById(mandal.district_id);
  return `${mandal.name}, ${district?.name || "Unknown"}`;
}

/**
 * Get location display string in Telugu
 */
export function getLocationStringTelugu(mandalId: string): string {
  const mandal = getMandalById(mandalId);
  if (!mandal) return "తెలియని ప్రదేశం";
  
  const district = getDistrictById(mandal.district_id);
  return `${mandal.name_te}, ${district?.name_te || ""}`;
}

// ------------------------------------
// FOR DROPDOWN SELECTS
// ------------------------------------

/**
 * Get districts for dropdown
 */
export function getDistrictOptions() {
  return DISTRICTS.map((d) => ({
    value: d.id,
    label: d.name,
    label_te: d.name_te,
  }));
}

/**
 * Get mandals for dropdown (filtered by district)
 */
export function getMandalOptions(districtId?: string) {
  const mandals = districtId 
    ? getMandalsByDistrict(districtId)
    : MANDALS;
    
  return mandals.map((m) => ({
    value: m.id,
    label: m.name,
    label_te: m.name_te,
    district_id: m.district_id,
  }));
}
