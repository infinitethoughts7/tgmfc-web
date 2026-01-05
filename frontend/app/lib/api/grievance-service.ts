// ============================================
// GRIEVANCE API SERVICE LAYER
// ============================================
// This is the ABSTRACTION LAYER between UI and data.
// 
// Currently: Uses mock data from ./mock-data/
// Later: Just update these functions to call Wagtail API
// 
// UI components import from HERE, not directly from mock data.
// This makes migration to real API a ONE-FILE change!
// ============================================

import {
  Grievance,
  GrievanceStatus,
  GrievanceListFilters,
  PaginatedResponse,
  Officer,
  DashboardStats,
  TimelineEntry,
  GrievanceActionType,
} from "../../lib/types/grievance";

import { GRIEVANCES, getGrievanceById, getGrievanceByTrackingId, getGrievanceStats } from "../mock-data/grievances";
import { OFFICERS, validateOfficerLogin, getOfficerById, getNextLevelOfficer, getPreviousLevelOfficer } from "../mock-data/officers";
import { DISTRICTS, MANDALS, getDistrictById, getMandalById, getMandalsByDistrict } from "../mock-data/locations";
import { SCHEMES, getSchemeById, generateTrackingId, getFormTemplate } from "../mock-data/schemes";

// ------------------------------------
// CONFIGURATION
// ------------------------------------

const USE_MOCK_DATA = true; // Set to false when Wagtail API is ready
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Simulated network delay for realistic UX testing
const MOCK_DELAY = 500;

// Helper to simulate API delay
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

// ------------------------------------
// AUTHENTICATION APIs
// ------------------------------------

export type LoginResponse = {
  success: boolean;
  officer?: Officer;
  token?: string;
  error?: string;
};

/**
 * Officer Login
 * TODO: Replace with actual auth API
 */
export async function loginOfficer(username: string, password: string): Promise<LoginResponse> {
  await simulateDelay();

  if (USE_MOCK_DATA) {
    const officer = validateOfficerLogin(username, password);
    if (officer) {
      return {
        success: true,
        officer,
        token: `mock-token-${officer.id}-${Date.now()}`,
      };
    }
    return {
      success: false,
      error: "Invalid username or password",
    };
  }

  // Real API call
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

/**
 * Get current officer profile
 */
export async function getCurrentOfficer(token: string): Promise<Officer | null> {
  await simulateDelay();

  if (USE_MOCK_DATA) {
    // Extract officer ID from mock token
    const match = token.match(/mock-token-(.+?)-/);
    if (match) {
      return getOfficerById(match[1]) || null;
    }
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

// ------------------------------------
// GRIEVANCE CITIZEN APIs
// ------------------------------------

export type SubmitGrievanceData = {
  scheme_id: string;
  citizen: {
    name: string;
    phone: string;
    aadhaar_last_4: string;
    email?: string;
  };
  district_id: string;
  mandal_id: string;
  address: string;
  application_number?: string;
  scheme_details: Record<string, string>;
  description: string;
  has_voice_recording: boolean;
  attachments: string[];
};

/**
 * Submit new grievance (Citizen)
 */
export async function submitGrievance(data: SubmitGrievanceData): Promise<{ tracking_id: string; grievance_id: string }> {
  await simulateDelay();

  if (USE_MOCK_DATA) {
    const scheme = getSchemeById(data.scheme_id);
    const tracking_id = generateTrackingId(scheme?.code || "GRV");
    const grievance_id = `grv_${Date.now()}`;

    // In real app, this would create a new grievance in database
    console.log("New grievance submitted:", { ...data, tracking_id, grievance_id });

    return { tracking_id, grievance_id };
  }

  const response = await fetch(`${API_BASE_URL}/grievances`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Track grievance by tracking ID (Citizen)
 */
export async function trackGrievance(trackingId: string): Promise<Grievance | null> {
  await simulateDelay();

  if (USE_MOCK_DATA) {
    return getGrievanceByTrackingId(trackingId) || null;
  }

  const response = await fetch(`${API_BASE_URL}/grievances/track/${trackingId}`);
  if (!response.ok) return null;
  return response.json();
}

/**
 * Track grievances by Aadhaar + Phone (Citizen)
 */
export async function trackGrievancesByContact(phone: string, aadhaarLast4: string): Promise<Grievance[]> {
  await simulateDelay();

  if (USE_MOCK_DATA) {
    return GRIEVANCES.filter(
      (g) => g.citizen.phone === phone && g.citizen.aadhaar_last_4 === aadhaarLast4
    );
  }

  const response = await fetch(`${API_BASE_URL}/grievances/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, aadhaar_last_4: aadhaarLast4 }),
  });
  return response.json();
}

// ------------------------------------
// GRIEVANCE OFFICER APIs
// ------------------------------------

/**
 * Get grievances for officer dashboard
 */
export async function getOfficerGrievances(
  officerId: string,
  filters?: GrievanceListFilters,
  page = 1,
  perPage = 10
): Promise<PaginatedResponse<Grievance>> {
  await simulateDelay();

  if (USE_MOCK_DATA) {
    let filtered = GRIEVANCES.filter((g) => g.current_officer_id === officerId);

    // Apply filters
    if (filters?.status) {
      filtered = filtered.filter((g) => g.status === filters.status);
    }
    if (filters?.priority) {
      filtered = filtered.filter((g) => g.priority === filters.priority);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.tracking_id.toLowerCase().includes(search) ||
          g.citizen.name.toLowerCase().includes(search)
      );
    }

    // Paginate
    const total = filtered.length;
    const startIndex = (page - 1) * perPage;
    const data = filtered.slice(startIndex, startIndex + perPage);

    return {
      data,
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    };
  }

  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    ...filters,
  });
  const response = await fetch(`${API_BASE_URL}/officers/${officerId}/grievances?${params}`);
  return response.json();
}

/**
 * Get single grievance details (Officer)
 */
export async function getGrievanceDetails(grievanceId: string): Promise<Grievance | null> {
  await simulateDelay();

  if (USE_MOCK_DATA) {
    return getGrievanceById(grievanceId) || null;
  }

  const response = await fetch(`${API_BASE_URL}/grievances/${grievanceId}`);
  if (!response.ok) return null;
  return response.json();
}

/**
 * Perform action on grievance (Officer)
 */
export type GrievanceActionData = {
  action: GrievanceActionType;
  note: string;
  send_back_reason?: string;
};

export async function performGrievanceAction(
  grievanceId: string,
  officerId: string,
  actionData: GrievanceActionData
): Promise<{ success: boolean; new_status?: GrievanceStatus; error?: string }> {
  await simulateDelay();

  if (USE_MOCK_DATA) {
    const grievance = getGrievanceById(grievanceId);
    const officer = getOfficerById(officerId);

    if (!grievance || !officer) {
      return { success: false, error: "Grievance or officer not found" };
    }

    // Determine new status based on action
    let new_status: GrievanceStatus = grievance.status;

    switch (actionData.action) {
      case "forward":
        const nextOfficer = getNextLevelOfficer(officerId, grievance.scheme_id);
        if (!nextOfficer) {
          return { success: false, error: "No higher level officer found" };
        }
        new_status = nextOfficer.level === 2 ? "at_district" : "at_hod";
        break;

      case "send_back":
        const prevOfficer = getPreviousLevelOfficer(officerId, grievance.mandal_id, grievance.scheme_id);
        if (!prevOfficer) {
          return { success: false, error: "No lower level officer found" };
        }
        new_status = prevOfficer.level === 1 ? "at_mandal" : "at_district";
        break;

      case "request_info":
        new_status = "info_requested";
        break;

      case "resolve":
        new_status = "resolved";
        break;

      case "reject":
        new_status = "rejected";
        break;

      case "add_note":
        // Status doesn't change
        break;
    }

    console.log(`Action performed on ${grievanceId}:`, {
      action: actionData.action,
      by: officer.name,
      new_status,
      note: actionData.note,
    });

    return { success: true, new_status };
  }

  const response = await fetch(`${API_BASE_URL}/grievances/${grievanceId}/actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ officer_id: officerId, ...actionData }),
  });
  return response.json();
}

// ------------------------------------
// DASHBOARD & STATS APIs
// ------------------------------------

/**
 * Get dashboard statistics for officer
 */
export async function getOfficerDashboardStats(officerId: string): Promise<DashboardStats> {
  await simulateDelay();

  if (USE_MOCK_DATA) {
    const officer = getOfficerById(officerId);
    if (!officer) {
      return {
        total_grievances: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
        rejected: 0,
        by_priority: { low: 0, medium: 0, high: 0, urgent: 0 },
        avg_resolution_days: 0,
        resolved_this_month: 0,
        at_mandal: 0,
        at_district: 0,
        at_hod: 0,
      };
    }

    // Get grievances relevant to this officer based on their level
    let relevantGrievances: Grievance[];

    if (officer.level === 3) {
      // HOD sees all grievances for their schemes
      relevantGrievances = GRIEVANCES.filter((g) => officer.scheme_ids.includes(g.scheme_id));
    } else if (officer.level === 2) {
      // District officer sees grievances in their district
      relevantGrievances = GRIEVANCES.filter((g) => g.district_id === officer.district_id);
    } else {
      // Mandal officer sees grievances in their mandal
      relevantGrievances = GRIEVANCES.filter((g) => g.mandal_id === officer.mandal_id);
    }

    const myGrievances = relevantGrievances.filter((g) => g.current_officer_id === officerId);

    return {
      total_grievances: relevantGrievances.length,
      pending: myGrievances.length,
      in_progress: relevantGrievances.filter((g) => !["resolved", "rejected"].includes(g.status)).length,
      resolved: relevantGrievances.filter((g) => g.status === "resolved").length,
      rejected: relevantGrievances.filter((g) => g.status === "rejected").length,
      by_priority: {
        low: myGrievances.filter((g) => g.priority === "low").length,
        medium: myGrievances.filter((g) => g.priority === "medium").length,
        high: myGrievances.filter((g) => g.priority === "high").length,
        urgent: myGrievances.filter((g) => g.priority === "urgent").length,
      },
      avg_resolution_days: 5.2, // Mock value
      resolved_this_month: relevantGrievances.filter((g) => g.status === "resolved").length,
      at_mandal: relevantGrievances.filter((g) => g.status === "at_mandal").length,
      at_district: relevantGrievances.filter((g) => g.status === "at_district").length,
      at_hod: relevantGrievances.filter((g) => g.status === "at_hod").length,
    };
  }

  const response = await fetch(`${API_BASE_URL}/officers/${officerId}/stats`);
  return response.json();
}

// ------------------------------------
// LOCATION APIs
// ------------------------------------

/**
 * Get all districts
 */
export async function getDistricts() {
  if (USE_MOCK_DATA) {
    return DISTRICTS;
  }

  const response = await fetch(`${API_BASE_URL}/locations/districts`);
  return response.json();
}

/**
 * Get mandals by district
 */
export async function getMandals(districtId?: string) {
  if (USE_MOCK_DATA) {
    return districtId ? getMandalsByDistrict(districtId) : MANDALS;
  }

  const url = districtId
    ? `${API_BASE_URL}/locations/mandals?district_id=${districtId}`
    : `${API_BASE_URL}/locations/mandals`;
  const response = await fetch(url);
  return response.json();
}

// ------------------------------------
// SCHEME APIs
// ------------------------------------

/**
 * Get all active schemes
 */
export async function getSchemes() {
  if (USE_MOCK_DATA) {
    return SCHEMES.filter((s) => s.is_active);
  }

  const response = await fetch(`${API_BASE_URL}/schemes`);
  return response.json();
}

/**
 * Get form template for a scheme
 */
export async function getSchemeFormTemplate(templateName: string) {
  if (USE_MOCK_DATA) {
    return getFormTemplate(templateName);
  }

  const response = await fetch(`${API_BASE_URL}/schemes/templates/${templateName}`);
  return response.json();
}

// ------------------------------------
// EXPORT ALL for convenience
// ------------------------------------

export const GrievanceAPI = {
  // Auth
  loginOfficer,
  getCurrentOfficer,

  // Citizen APIs
  submitGrievance,
  trackGrievance,
  trackGrievancesByContact,

  // Officer APIs
  getOfficerGrievances,
  getGrievanceDetails,
  performGrievanceAction,
  getOfficerDashboardStats,

  // Location APIs
  getDistricts,
  getMandals,

  // Scheme APIs
  getSchemes,
  getSchemeFormTemplate,
};

export default GrievanceAPI;
