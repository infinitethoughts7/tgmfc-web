// ============================================
// OFFICERS MOCK DATA
// ============================================
// Hierarchy: Mandal (Level 1) → District (Level 2) → HOD (Level 3)
// 
// Structure for Shadi Mubarak pilot:
// - 5 Mandal Officers (one per mandal)
// - 2 District Officers (one per district)
// - 1 HOD (for entire Shadi Mubarak scheme)
// ============================================

import { Officer, OfficerCredentials, OfficerRole, OfficerLevel } from "../types/grievance";

// ------------------------------------
// OFFICERS DATA
// ------------------------------------

export const OFFICERS: Officer[] = [
  // ========================================
  // HOD LEVEL (Level 3) - 1 Officer
  // ========================================
  {
    id: "off_hod_sm",
    name: "Dr. Ahmed Khan",
    email: "hod.shadimubarak@telangana.gov.in",
    phone: "9876543210",
    role: "hod",
    level: 3,
    designation: "Director, Shadi Mubarak Scheme",
    district_id: "dist_hyd", // Headquartered in Hyderabad
    scheme_ids: ["scheme_shadi_mubarak"],
    is_active: true,
  },

  // ========================================
  // DISTRICT LEVEL (Level 2) - 2 Officers
  // ========================================
  {
    id: "off_dist_hyd",
    name: "Smt. Fatima Begum",
    email: "do.hyd.minorities@telangana.gov.in",
    phone: "9876543211",
    role: "district_officer",
    level: 2,
    designation: "District Minorities Welfare Officer",
    district_id: "dist_hyd",
    scheme_ids: ["scheme_shadi_mubarak", "scheme_scholarship"],
    is_active: true,
  },
  {
    id: "off_dist_rng",
    name: "Sri. Mohammad Rafi",
    email: "do.rng.minorities@telangana.gov.in",
    phone: "9876543212",
    role: "district_officer",
    level: 2,
    designation: "District Minorities Welfare Officer",
    district_id: "dist_rng",
    scheme_ids: ["scheme_shadi_mubarak", "scheme_scholarship"],
    is_active: true,
  },

  // ========================================
  // MANDAL LEVEL (Level 1) - 5 Officers
  // ========================================
  
  // Hyderabad District Mandals (3)
  {
    id: "off_mndl_charminar",
    name: "Sri. Syed Hussain",
    email: "mo.charminar@telangana.gov.in",
    phone: "9876543213",
    role: "mandal_officer",
    level: 1,
    designation: "Mandal Welfare Officer",
    district_id: "dist_hyd",
    mandal_id: "mndl_charminar",
    scheme_ids: ["scheme_shadi_mubarak", "scheme_scholarship"],
    is_active: true,
  },
  {
    id: "off_mndl_golconda",
    name: "Smt. Ayesha Sultana",
    email: "mo.golconda@telangana.gov.in",
    phone: "9876543214",
    role: "mandal_officer",
    level: 1,
    designation: "Mandal Welfare Officer",
    district_id: "dist_hyd",
    mandal_id: "mndl_golconda",
    scheme_ids: ["scheme_shadi_mubarak", "scheme_scholarship"],
    is_active: true,
  },
  {
    id: "off_mndl_secunderabad",
    name: "Sri. Abdul Kareem",
    email: "mo.secunderabad@telangana.gov.in",
    phone: "9876543215",
    role: "mandal_officer",
    level: 1,
    designation: "Mandal Welfare Officer",
    district_id: "dist_hyd",
    mandal_id: "mndl_secunderabad",
    scheme_ids: ["scheme_shadi_mubarak", "scheme_scholarship"],
    is_active: true,
  },
  
  // Rangareddy District Mandals (2)
  {
    id: "off_mndl_rajendranagar",
    name: "Smt. Nazia Parveen",
    email: "mo.rajendranagar@telangana.gov.in",
    phone: "9876543216",
    role: "mandal_officer",
    level: 1,
    designation: "Mandal Welfare Officer",
    district_id: "dist_rng",
    mandal_id: "mndl_rajendranagar",
    scheme_ids: ["scheme_shadi_mubarak", "scheme_scholarship"],
    is_active: true,
  },
  {
    id: "off_mndl_shamshabad",
    name: "Sri. Imran Ali",
    email: "mo.shamshabad@telangana.gov.in",
    phone: "9876543217",
    role: "mandal_officer",
    level: 1,
    designation: "Mandal Welfare Officer",
    district_id: "dist_rng",
    mandal_id: "mndl_shamshabad",
    scheme_ids: ["scheme_shadi_mubarak", "scheme_scholarship"],
    is_active: true,
  },
];

// ------------------------------------
// MOCK CREDENTIALS (for demo only!)
// In real app, use proper auth system
// ------------------------------------

export const OFFICER_CREDENTIALS: OfficerCredentials[] = [
  // HOD
  { officer_id: "off_hod_sm", username: "hod.sm", password_hash: "demo123" },
  
  // District Officers
  { officer_id: "off_dist_hyd", username: "do.hyd", password_hash: "demo123" },
  { officer_id: "off_dist_rng", username: "do.rng", password_hash: "demo123" },
  
  // Mandal Officers
  { officer_id: "off_mndl_charminar", username: "mo.charminar", password_hash: "demo123" },
  { officer_id: "off_mndl_golconda", username: "mo.golconda", password_hash: "demo123" },
  { officer_id: "off_mndl_secunderabad", username: "mo.secunderabad", password_hash: "demo123" },
  { officer_id: "off_mndl_rajendranagar", username: "mo.rajendranagar", password_hash: "demo123" },
  { officer_id: "off_mndl_shamshabad", username: "mo.shamshabad", password_hash: "demo123" },
];

// ------------------------------------
// HELPER FUNCTIONS
// ------------------------------------

/**
 * Get officer by ID
 */
export function getOfficerById(id: string): Officer | undefined {
  return OFFICERS.find((o) => o.id === id);
}

/**
 * Get officer by username (for login)
 */
export function getOfficerByUsername(username: string): Officer | undefined {
  const cred = OFFICER_CREDENTIALS.find((c) => c.username === username);
  if (!cred) return undefined;
  return getOfficerById(cred.officer_id);
}

/**
 * Validate officer login
 */
export function validateOfficerLogin(username: string, password: string): Officer | null {
  const cred = OFFICER_CREDENTIALS.find(
    (c) => c.username === username && c.password_hash === password
  );
  if (!cred) return null;
  return getOfficerById(cred.officer_id) || null;
}

/**
 * Get Mandal Officer for a specific mandal and scheme
 */
export function getMandalOfficer(mandalId: string, schemeId: string): Officer | undefined {
  return OFFICERS.find(
    (o) => 
      o.role === "mandal_officer" && 
      o.mandal_id === mandalId && 
      o.scheme_ids.includes(schemeId) &&
      o.is_active
  );
}

/**
 * Get District Officer for a specific district and scheme
 */
export function getDistrictOfficer(districtId: string, schemeId: string): Officer | undefined {
  return OFFICERS.find(
    (o) => 
      o.role === "district_officer" && 
      o.district_id === districtId && 
      o.scheme_ids.includes(schemeId) &&
      o.is_active
  );
}

/**
 * Get HOD for a specific scheme
 */
export function getHOD(schemeId: string): Officer | undefined {
  return OFFICERS.find(
    (o) => 
      o.role === "hod" && 
      o.scheme_ids.includes(schemeId) &&
      o.is_active
  );
}

/**
 * Get next level officer (for forwarding grievances)
 */
export function getNextLevelOfficer(
  currentOfficerId: string, 
  schemeId: string
): Officer | undefined {
  const currentOfficer = getOfficerById(currentOfficerId);
  if (!currentOfficer) return undefined;

  switch (currentOfficer.level) {
    case 1: // Mandal → District
      return getDistrictOfficer(currentOfficer.district_id, schemeId);
    case 2: // District → HOD
      return getHOD(schemeId);
    case 3: // HOD is top level
      return undefined;
    default:
      return undefined;
  }
}

/**
 * Get previous level officer (for send back)
 */
export function getPreviousLevelOfficer(
  currentOfficerId: string,
  mandalId: string,
  schemeId: string
): Officer | undefined {
  const currentOfficer = getOfficerById(currentOfficerId);
  if (!currentOfficer) return undefined;

  switch (currentOfficer.level) {
    case 3: // HOD → District
      // Find the district that the mandal belongs to
      const districtOfficer = getDistrictOfficerByMandal(mandalId, schemeId);
      return districtOfficer;
    case 2: // District → Mandal
      return getMandalOfficer(mandalId, schemeId);
    case 1: // Mandal is bottom level
      return undefined;
    default:
      return undefined;
  }
}

/**
 * Helper: Get district officer for a mandal
 */
function getDistrictOfficerByMandal(mandalId: string, schemeId: string): Officer | undefined {
  const mandalOfficer = getMandalOfficer(mandalId, schemeId);
  if (!mandalOfficer) return undefined;
  return getDistrictOfficer(mandalOfficer.district_id, schemeId);
}

/**
 * Get all officers at a specific level
 */
export function getOfficersByLevel(level: OfficerLevel): Officer[] {
  return OFFICERS.filter((o) => o.level === level && o.is_active);
}

/**
 * Get all officers for a scheme
 */
export function getOfficersByScheme(schemeId: string): Officer[] {
  return OFFICERS.filter((o) => o.scheme_ids.includes(schemeId) && o.is_active);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: OfficerRole): string {
  const names: Record<OfficerRole, string> = {
    mandal_officer: "Mandal Officer",
    district_officer: "District Officer",
    hod: "Head of Department",
  };
  return names[role];
}

/**
 * Get level display name
 */
export function getLevelDisplayName(level: OfficerLevel): string {
  const names: Record<OfficerLevel, string> = {
    1: "Mandal Level",
    2: "District Level",
    3: "HOD Level",
  };
  return names[level];
}
