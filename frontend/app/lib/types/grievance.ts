// ============================================
// GRIEVANCE MANAGEMENT SYSTEM - TYPE DEFINITIONS
// ============================================
// These types are designed to be API-ready.
// When integrating with Wagtail, just update the API layer.
// ============================================

// ------------------------------------
// LOCATION TYPES
// ------------------------------------

export type District = {
  id: string;
  name: string;
  name_te: string; // Telugu name for multilingual
  code: string;    // District code (e.g., "HYD", "RNG")
};

export type Mandal = {
  id: string;
  name: string;
  name_te: string;
  code: string;
  district_id: string; // Foreign key to District
};

// ------------------------------------
// OFFICER & ROLE TYPES
// ------------------------------------

export type OfficerRole = "mandal_officer" | "district_officer" | "hod";

export type OfficerLevel = 1 | 2 | 3; // 1=Mandal, 2=District, 3=HOD

export type Officer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: OfficerRole;
  level: OfficerLevel;
  designation: string;      // e.g., "Mandal Welfare Officer"
  
  // Location assignment
  district_id: string;
  mandal_id?: string;       // Only for mandal officers
  
  // Scheme assignment (which schemes this officer handles)
  scheme_ids: string[];     // Array of scheme IDs they handle
  
  // For display
  profile_image?: string;
  is_active: boolean;
};

// For officer login
export type OfficerCredentials = {
  officer_id: string;
  username: string;
  password_hash: string; // In real app, never store plain passwords!
};

// ------------------------------------
// SCHEME TYPES
// ------------------------------------

export type Scheme = {
  id: string;
  name: string;
  name_te: string;
  code: string;           // e.g., "SM" for Shadi Mubarak
  department_id: string;
  description: string;
  is_active: boolean;
  
  // Form configuration
  form_template: string;  // Which form fields to show
  
  // For categorization
  category_id: string;
};

// ------------------------------------
// GRIEVANCE STATUS & FLOW TYPES
// ------------------------------------

export type GrievanceStatus = 
  | "submitted"           // Just submitted by citizen
  | "at_mandal"           // With Mandal Officer
  | "at_district"         // With District Officer
  | "at_hod"              // With HOD
  | "info_requested"      // Additional info needed from citizen
  | "field_visit"         // Field verification in progress
  | "resolved"            // Successfully resolved
  | "rejected";           // Rejected with reason

// What citizens see (friendly labels)
export const STATUS_LABELS: Record<GrievanceStatus, string> = {
  submitted: "Submitted - Under Review",
  at_mandal: "At Mandal Level",
  at_district: "At District Level",
  at_hod: "At HOD Level",
  info_requested: "Additional Information Required",
  field_visit: "Field Verification in Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

// Status colors for UI
export const STATUS_COLORS: Record<GrievanceStatus, { bg: string; text: string }> = {
  submitted: { bg: "bg-blue-100", text: "text-blue-800" },
  at_mandal: { bg: "bg-yellow-100", text: "text-yellow-800" },
  at_district: { bg: "bg-orange-100", text: "text-orange-800" },
  at_hod: { bg: "bg-purple-100", text: "text-purple-800" },
  info_requested: { bg: "bg-red-100", text: "text-red-800" },
  field_visit: { bg: "bg-indigo-100", text: "text-indigo-800" },
  resolved: { bg: "bg-green-100", text: "text-green-800" },
  rejected: { bg: "bg-gray-100", text: "text-gray-800" },
};

// ------------------------------------
// GRIEVANCE ACTION TYPES
// ------------------------------------

export type GrievanceActionType = 
  | "submit"              // Citizen submits
  | "forward"             // Forward to higher level
  | "send_back"           // Send back to lower level
  | "request_info"        // Request more info from citizen
  | "add_note"            // Add internal note
  | "schedule_visit"      // Schedule field visit
  | "resolve"             // Mark as resolved
  | "reject";             // Reject grievance

// Actions available at each level
export const LEVEL_ACTIONS: Record<OfficerLevel, GrievanceActionType[]> = {
  1: ["forward", "request_info", "add_note", "reject"],                    // Mandal
  2: ["forward", "send_back", "request_info", "add_note", "reject"],       // District
  3: ["send_back", "request_info", "add_note", "schedule_visit", "resolve", "reject"], // HOD
};

// ------------------------------------
// TIMELINE & HISTORY TYPES
// ------------------------------------

export type TimelineEntry = {
  id: string;
  grievance_id: string;
  timestamp: string;       // ISO date string
  action: GrievanceActionType;
  from_status: GrievanceStatus;
  to_status: GrievanceStatus;
  
  // Who performed the action
  performed_by: {
    type: "citizen" | "officer" | "system";
    id?: string;
    name: string;
  };
  
  // Action details
  note?: string;           // Reason/note for the action (REQUIRED for send_back)
  is_public: boolean;      // Whether citizen can see this entry
  
  // For send_back specifically
  send_back_reason?: string;
};

// ------------------------------------
// MAIN GRIEVANCE TYPE
// ------------------------------------

export type Grievance = {
  id: string;
  tracking_id: string;     // Public ID shown to citizen (e.g., "GRV-SM-2024-001")
  
  // Scheme & Category
  scheme_id: string;
  scheme_code: string;
  category_id: string;
  department_id: string;
  
  // Citizen Details
  citizen: {
    name: string;
    aadhaar_last_4: string;  // Only store last 4 for privacy
    phone: string;
    email?: string;
  };
  
  // Location
  district_id: string;
  mandal_id: string;
  address: string;
  
  // Application Details (from original scheme application)
  application_number?: string;  // Original ePASS/scheme application number
  scheme_details: Record<string, string>;  // Dynamic fields based on scheme
  
  // Grievance Content
  description: string;
  has_voice_recording: boolean;
  attachments: string[];    // File URLs
  
  // Current Status
  status: GrievanceStatus;
  current_level: OfficerLevel;
  current_officer_id?: string;  // Currently assigned officer
  
  // Timestamps
  submitted_at: string;
  updated_at: string;
  resolved_at?: string;
  
  // Resolution Details
  resolution?: {
    summary: string;
    resolved_by: string;
    resolution_type: "approved" | "rejected" | "referred";
  };
  
  // Timeline
  timeline: TimelineEntry[];
  
  // Priority (auto-calculated based on age)
  priority: "low" | "medium" | "high" | "urgent";
  
  // Internal flags
  is_escalated: boolean;
  escalation_reason?: string;
};

// ------------------------------------
// API RESPONSE TYPES
// ------------------------------------

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type GrievanceListFilters = {
  status?: GrievanceStatus;
  scheme_id?: string;
  district_id?: string;
  mandal_id?: string;
  priority?: Grievance["priority"];
  date_from?: string;
  date_to?: string;
  search?: string;  // Search by tracking_id or citizen name
};

// ------------------------------------
// DASHBOARD STATS TYPES
// ------------------------------------

export type DashboardStats = {
  total_grievances: number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
  
  // By priority
  by_priority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  
  // Resolution metrics
  avg_resolution_days: number;
  resolved_this_month: number;
  
  // Pending by level
  at_mandal: number;
  at_district: number;
  at_hod: number;
};
