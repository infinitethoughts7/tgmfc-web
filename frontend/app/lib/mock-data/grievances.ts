// ============================================
// SAMPLE GRIEVANCES MOCK DATA
// ============================================
// These show complete grievance journeys including:
// - Forward flow (Mandal → District → HOD)
// - Send back flow (HOD → District → Mandal)
// - Various status states
// ============================================

import { Grievance, TimelineEntry, GrievanceStatus } from "../types/grievance";

// ------------------------------------
// SAMPLE GRIEVANCES
// ------------------------------------

export const GRIEVANCES: Grievance[] = [
  // ========================================
  // GRIEVANCE 1: Complete journey - RESOLVED
  // Shows full forward and send-back flow
  // ========================================
  {
    id: "grv_001",
    tracking_id: "GRV-SM-2024-ABC123",
    
    scheme_id: "scheme_shadi_mubarak",
    scheme_code: "SM",
    category_id: "cat_financial_assistance",
    department_id: "dept_minority_welfare",
    
    citizen: {
      name: "Fatima Begum",
      aadhaar_last_4: "4523",
      phone: "9123456789",
      email: "fatima.begum@email.com",
    },
    
    district_id: "dist_hyd",
    mandal_id: "mndl_charminar",
    address: "H.No. 12-3-456, Charminar, Hyderabad - 500002",
    
    application_number: "TSSMBC202400012345",
    scheme_details: {
      bride_name: "Fatima Begum",
      groom_name: "Mohammad Irfan",
      marriage_date: "2024-10-15",
      application_number: "TSSMBC202400012345",
      sanctioned_amount: "100116",
      amount_received: "0",
      bank_account: "1234567890123",
      issue_type: "payment_delayed",
    },
    
    description: "My marriage was on 15th October 2024. Application was approved but payment has not been received even after 2 months. Application status shows 'Payment Processing' since November. Please help.",
    has_voice_recording: false,
    attachments: ["marriage_certificate.pdf", "bank_statement.pdf"],
    
    status: "resolved",
    current_level: 3,
    current_officer_id: "off_hod_sm",
    
    submitted_at: "2024-12-15T10:30:00.000Z",
    updated_at: "2024-12-28T16:45:00.000Z",
    resolved_at: "2024-12-28T16:45:00.000Z",
    
    resolution: {
      summary: "Payment released. Transaction ID: NEFT202412280012. Amount ₹1,00,116 credited to account ending 0123.",
      resolved_by: "off_hod_sm",
      resolution_type: "approved",
    },
    
    timeline: [
      {
        id: "tl_001_1",
        grievance_id: "grv_001",
        timestamp: "2024-12-15T10:30:00.000Z",
        action: "submit",
        from_status: "submitted",
        to_status: "at_mandal",
        performed_by: { type: "citizen", name: "Fatima Begum" },
        note: "Grievance submitted successfully",
        is_public: true,
      },
      {
        id: "tl_001_2",
        grievance_id: "grv_001",
        timestamp: "2024-12-16T09:15:00.000Z",
        action: "forward",
        from_status: "at_mandal",
        to_status: "at_district",
        performed_by: { type: "officer", id: "off_mndl_charminar", name: "Sri. Syed Hussain" },
        note: "Documents verified. Forwarding to District for payment approval.",
        is_public: true,
      },
      {
        id: "tl_001_3",
        grievance_id: "grv_001",
        timestamp: "2024-12-18T14:30:00.000Z",
        action: "forward",
        from_status: "at_district",
        to_status: "at_hod",
        performed_by: { type: "officer", id: "off_dist_hyd", name: "Smt. Fatima Begum" },
        note: "Verified. Payment stuck at treasury level. Escalating to HOD for treasury coordination.",
        is_public: true,
      },
      {
        id: "tl_001_4",
        grievance_id: "grv_001",
        timestamp: "2024-12-28T16:45:00.000Z",
        action: "resolve",
        from_status: "at_hod",
        to_status: "resolved",
        performed_by: { type: "officer", id: "off_hod_sm", name: "Dr. Ahmed Khan" },
        note: "Coordinated with Treasury. Payment released successfully. Transaction ID: NEFT202412280012.",
        is_public: true,
      },
    ],
    
    priority: "medium",
    is_escalated: false,
  },

  // ========================================
  // GRIEVANCE 2: Send-back flow example
  // Shows HOD → District → Mandal send-back
  // ========================================
  {
    id: "grv_002",
    tracking_id: "GRV-SM-2024-DEF456",
    
    scheme_id: "scheme_shadi_mubarak",
    scheme_code: "SM",
    category_id: "cat_financial_assistance",
    department_id: "dept_minority_welfare",
    
    citizen: {
      name: "Ayesha Khatoon",
      aadhaar_last_4: "7891",
      phone: "9234567890",
    },
    
    district_id: "dist_rng",
    mandal_id: "mndl_rajendranagar",
    address: "H.No. 5-6-789, Rajendranagar, Rangareddy - 500030",
    
    application_number: "TSSMBC202400054321",
    scheme_details: {
      bride_name: "Ayesha Khatoon",
      groom_name: "Syed Imran",
      marriage_date: "2024-11-20",
      application_number: "TSSMBC202400054321",
      sanctioned_amount: "100116",
      amount_received: "50000",
      bank_account: "9876543210987",
      issue_type: "partial_payment",
    },
    
    description: "I received only ₹50,000 instead of full ₹1,00,116. Marriage was conducted on 20th November. Please release remaining amount.",
    has_voice_recording: true,
    attachments: ["marriage_photo.jpg", "bank_passbook.pdf"],
    
    status: "at_mandal",
    current_level: 1,
    current_officer_id: "off_mndl_rajendranagar",
    
    submitted_at: "2024-12-20T11:00:00.000Z",
    updated_at: "2024-12-27T10:30:00.000Z",
    
    timeline: [
      {
        id: "tl_002_1",
        grievance_id: "grv_002",
        timestamp: "2024-12-20T11:00:00.000Z",
        action: "submit",
        from_status: "submitted",
        to_status: "at_mandal",
        performed_by: { type: "citizen", name: "Ayesha Khatoon" },
        note: "Grievance submitted successfully",
        is_public: true,
      },
      {
        id: "tl_002_2",
        grievance_id: "grv_002",
        timestamp: "2024-12-21T10:00:00.000Z",
        action: "forward",
        from_status: "at_mandal",
        to_status: "at_district",
        performed_by: { type: "officer", id: "off_mndl_rajendranagar", name: "Smt. Nazia Parveen" },
        note: "Partial payment case. Forwarding for district review.",
        is_public: true,
      },
      {
        id: "tl_002_3",
        grievance_id: "grv_002",
        timestamp: "2024-12-23T15:20:00.000Z",
        action: "forward",
        from_status: "at_district",
        to_status: "at_hod",
        performed_by: { type: "officer", id: "off_dist_rng", name: "Sri. Mohammad Rafi" },
        note: "Confirmed partial payment. Need HOD approval for balance release.",
        is_public: true,
      },
      {
        id: "tl_002_4",
        grievance_id: "grv_002",
        timestamp: "2024-12-25T11:45:00.000Z",
        action: "send_back",
        from_status: "at_hod",
        to_status: "at_district",
        performed_by: { type: "officer", id: "off_hod_sm", name: "Dr. Ahmed Khan" },
        note: "Marriage certificate shows different date than application. Please verify actual marriage date at field level.",
        send_back_reason: "Date discrepancy - field verification required",
        is_public: true,
      },
      {
        id: "tl_002_5",
        grievance_id: "grv_002",
        timestamp: "2024-12-26T09:30:00.000Z",
        action: "send_back",
        from_status: "at_district",
        to_status: "at_mandal",
        performed_by: { type: "officer", id: "off_dist_rng", name: "Sri. Mohammad Rafi" },
        note: "Please conduct field visit to verify marriage date and submit report with photos.",
        send_back_reason: "Field verification required",
        is_public: true,
      },
      {
        id: "tl_002_6",
        grievance_id: "grv_002",
        timestamp: "2024-12-27T10:30:00.000Z",
        action: "add_note",
        from_status: "at_mandal",
        to_status: "at_mandal",
        performed_by: { type: "officer", id: "off_mndl_rajendranagar", name: "Smt. Nazia Parveen" },
        note: "Field visit scheduled for 28th December. Will verify marriage date with local witnesses.",
        is_public: false, // Internal note
      },
    ],
    
    priority: "medium",
    is_escalated: false,
  },

  // ========================================
  // GRIEVANCE 3: Currently at District level
  // ========================================
  {
    id: "grv_003",
    tracking_id: "GRV-SM-2024-GHI789",
    
    scheme_id: "scheme_shadi_mubarak",
    scheme_code: "SM",
    category_id: "cat_financial_assistance",
    department_id: "dept_minority_welfare",
    
    citizen: {
      name: "Nazia Sultana",
      aadhaar_last_4: "3456",
      phone: "9345678901",
    },
    
    district_id: "dist_hyd",
    mandal_id: "mndl_golconda",
    address: "H.No. 8-9-123, Golconda, Hyderabad - 500008",
    
    application_number: "TSSMBC202400098765",
    scheme_details: {
      bride_name: "Nazia Sultana",
      groom_name: "Abdul Rashid",
      marriage_date: "2024-09-05",
      application_number: "TSSMBC202400098765",
      sanctioned_amount: "100116",
      amount_received: "0",
      bank_account: "5678901234567",
      issue_type: "payment_rejected",
    },
    
    description: "Application was approved in September but payment was rejected by bank due to account name mismatch. I have submitted corrected bank details but status is not updating.",
    has_voice_recording: false,
    attachments: ["rejection_letter.pdf", "new_passbook.pdf"],
    
    status: "at_district",
    current_level: 2,
    current_officer_id: "off_dist_hyd",
    
    submitted_at: "2024-12-22T14:00:00.000Z",
    updated_at: "2024-12-24T16:30:00.000Z",
    
    timeline: [
      {
        id: "tl_003_1",
        grievance_id: "grv_003",
        timestamp: "2024-12-22T14:00:00.000Z",
        action: "submit",
        from_status: "submitted",
        to_status: "at_mandal",
        performed_by: { type: "citizen", name: "Nazia Sultana" },
        note: "Grievance submitted successfully",
        is_public: true,
      },
      {
        id: "tl_003_2",
        grievance_id: "grv_003",
        timestamp: "2024-12-23T11:15:00.000Z",
        action: "forward",
        from_status: "at_mandal",
        to_status: "at_district",
        performed_by: { type: "officer", id: "off_mndl_golconda", name: "Smt. Ayesha Sultana" },
        note: "Bank account mismatch issue. New account details verified. Forwarding for bank detail update in system.",
        is_public: true,
      },
      {
        id: "tl_003_3",
        grievance_id: "grv_003",
        timestamp: "2024-12-24T16:30:00.000Z",
        action: "add_note",
        from_status: "at_district",
        to_status: "at_district",
        performed_by: { type: "officer", id: "off_dist_hyd", name: "Smt. Fatima Begum" },
        note: "Requested ePASS team to update bank details. Awaiting confirmation.",
        is_public: true,
      },
    ],
    
    priority: "high",
    is_escalated: false,
  },

  // ========================================
  // GRIEVANCE 4: Newly submitted - at Mandal
  // ========================================
  {
    id: "grv_004",
    tracking_id: "GRV-SM-2024-JKL012",
    
    scheme_id: "scheme_shadi_mubarak",
    scheme_code: "SM",
    category_id: "cat_financial_assistance",
    department_id: "dept_minority_welfare",
    
    citizen: {
      name: "Rehana Begum",
      aadhaar_last_4: "6789",
      phone: "9456789012",
    },
    
    district_id: "dist_hyd",
    mandal_id: "mndl_secunderabad",
    address: "H.No. 3-4-567, Secunderabad - 500003",
    
    application_number: "TSSMBC202400111222",
    scheme_details: {
      bride_name: "Rehana Begum",
      groom_name: "Syed Majid",
      marriage_date: "2024-12-01",
      application_number: "TSSMBC202400111222",
      sanctioned_amount: "100116",
      amount_received: "0",
      bank_account: "1122334455667",
      issue_type: "status_stuck",
    },
    
    description: "Application submitted in October. Status shows 'Document Verification' since 2 months. No update or communication received.",
    has_voice_recording: false,
    attachments: [],
    
    status: "at_mandal",
    current_level: 1,
    current_officer_id: "off_mndl_secunderabad",
    
    submitted_at: "2024-12-28T09:00:00.000Z",
    updated_at: "2024-12-28T09:00:00.000Z",
    
    timeline: [
      {
        id: "tl_004_1",
        grievance_id: "grv_004",
        timestamp: "2024-12-28T09:00:00.000Z",
        action: "submit",
        from_status: "submitted",
        to_status: "at_mandal",
        performed_by: { type: "citizen", name: "Rehana Begum" },
        note: "Grievance submitted successfully",
        is_public: true,
      },
    ],
    
    priority: "low",
    is_escalated: false,
  },

  // ========================================
  // GRIEVANCE 5: Info Requested from Citizen
  // ========================================
  {
    id: "grv_005",
    tracking_id: "GRV-SM-2024-MNO345",
    
    scheme_id: "scheme_shadi_mubarak",
    scheme_code: "SM",
    category_id: "cat_financial_assistance",
    department_id: "dept_minority_welfare",
    
    citizen: {
      name: "Shabana Parveen",
      aadhaar_last_4: "2345",
      phone: "9567890123",
    },
    
    district_id: "dist_rng",
    mandal_id: "mndl_shamshabad",
    address: "H.No. 7-8-901, Shamshabad, Rangareddy - 501218",
    
    application_number: "TSSMBC202400333444",
    scheme_details: {
      bride_name: "Shabana Parveen",
      groom_name: "Mohammad Saleem",
      marriage_date: "2024-08-15",
      application_number: "TSSMBC202400333444",
      sanctioned_amount: "100116",
      amount_received: "0",
      bank_account: "9988776655443",
      issue_type: "document_issue",
    },
    
    description: "My application shows 'Documents Pending'. But I have submitted all documents. Please check and process.",
    has_voice_recording: true,
    attachments: ["all_documents.pdf"],
    
    status: "info_requested",
    current_level: 1,
    current_officer_id: "off_mndl_shamshabad",
    
    submitted_at: "2024-12-18T16:00:00.000Z",
    updated_at: "2024-12-20T14:00:00.000Z",
    
    timeline: [
      {
        id: "tl_005_1",
        grievance_id: "grv_005",
        timestamp: "2024-12-18T16:00:00.000Z",
        action: "submit",
        from_status: "submitted",
        to_status: "at_mandal",
        performed_by: { type: "citizen", name: "Shabana Parveen" },
        note: "Grievance submitted successfully",
        is_public: true,
      },
      {
        id: "tl_005_2",
        grievance_id: "grv_005",
        timestamp: "2024-12-20T14:00:00.000Z",
        action: "request_info",
        from_status: "at_mandal",
        to_status: "info_requested",
        performed_by: { type: "officer", id: "off_mndl_shamshabad", name: "Sri. Imran Ali" },
        note: "Marriage certificate uploaded is not clear. Please upload a clearer scanned copy of the marriage certificate.",
        is_public: true,
      },
    ],
    
    priority: "medium",
    is_escalated: false,
  },

  // ========================================
  // GRIEVANCE 6: REJECTED
  // ========================================
  {
    id: "grv_006",
    tracking_id: "GRV-SM-2024-PQR678",
    
    scheme_id: "scheme_shadi_mubarak",
    scheme_code: "SM",
    category_id: "cat_financial_assistance",
    department_id: "dept_minority_welfare",
    
    citizen: {
      name: "Zarina Khatoon",
      aadhaar_last_4: "8901",
      phone: "9678901234",
    },
    
    district_id: "dist_hyd",
    mandal_id: "mndl_charminar",
    address: "H.No. 1-2-345, Charminar, Hyderabad - 500002",
    
    application_number: "TSSMBC202400555666",
    scheme_details: {
      bride_name: "Zarina Khatoon",
      groom_name: "Syed Farhan",
      marriage_date: "2023-06-20",
      application_number: "TSSMBC202400555666",
      sanctioned_amount: "100116",
      amount_received: "100116",
      bank_account: "5544332211009",
      issue_type: "other",
    },
    
    description: "I want additional payment as marriage expenses were high.",
    has_voice_recording: false,
    attachments: [],
    
    status: "rejected",
    current_level: 1,
    current_officer_id: "off_mndl_charminar",
    
    submitted_at: "2024-12-10T12:00:00.000Z",
    updated_at: "2024-12-12T10:30:00.000Z",
    
    resolution: {
      summary: "Grievance rejected. Full sanctioned amount of ₹1,00,116 has already been credited. No provision for additional payment under scheme guidelines.",
      resolved_by: "off_mndl_charminar",
      resolution_type: "rejected",
    },
    
    timeline: [
      {
        id: "tl_006_1",
        grievance_id: "grv_006",
        timestamp: "2024-12-10T12:00:00.000Z",
        action: "submit",
        from_status: "submitted",
        to_status: "at_mandal",
        performed_by: { type: "citizen", name: "Zarina Khatoon" },
        note: "Grievance submitted successfully",
        is_public: true,
      },
      {
        id: "tl_006_2",
        grievance_id: "grv_006",
        timestamp: "2024-12-12T10:30:00.000Z",
        action: "reject",
        from_status: "at_mandal",
        to_status: "rejected",
        performed_by: { type: "officer", id: "off_mndl_charminar", name: "Sri. Syed Hussain" },
        note: "Verified: Full amount of ₹1,00,116 already credited to account on 15-Jul-2023. Request for additional payment is not covered under scheme guidelines.",
        is_public: true,
      },
    ],
    
    priority: "low",
    is_escalated: false,
  },
];

// ------------------------------------
// HELPER FUNCTIONS
// ------------------------------------

/**
 * Get grievance by ID
 */
export function getGrievanceById(id: string): Grievance | undefined {
  return GRIEVANCES.find((g) => g.id === id);
}

/**
 * Get grievance by tracking ID
 */
export function getGrievanceByTrackingId(trackingId: string): Grievance | undefined {
  return GRIEVANCES.find((g) => g.tracking_id.toLowerCase() === trackingId.toLowerCase());
}

/**
 * Get grievances for a specific officer
 */
export function getGrievancesForOfficer(officerId: string): Grievance[] {
  return GRIEVANCES.filter((g) => g.current_officer_id === officerId);
}

/**
 * Get grievances by status
 */
export function getGrievancesByStatus(status: GrievanceStatus): Grievance[] {
  return GRIEVANCES.filter((g) => g.status === status);
}

/**
 * Get grievances by mandal
 */
export function getGrievancesByMandal(mandalId: string): Grievance[] {
  return GRIEVANCES.filter((g) => g.mandal_id === mandalId);
}

/**
 * Get grievances by district
 */
export function getGrievancesByDistrict(districtId: string): Grievance[] {
  return GRIEVANCES.filter((g) => g.district_id === districtId);
}

/**
 * Get grievances by scheme
 */
export function getGrievancesByScheme(schemeId: string): Grievance[] {
  return GRIEVANCES.filter((g) => g.scheme_id === schemeId);
}

/**
 * Search grievances by citizen phone (last 4 digits of Aadhaar + phone)
 */
export function searchGrievancesByCitizen(phone: string, aadhaarLast4: string): Grievance[] {
  return GRIEVANCES.filter(
    (g) => g.citizen.phone === phone && g.citizen.aadhaar_last_4 === aadhaarLast4
  );
}

/**
 * Calculate priority based on age
 */
export function calculatePriority(submittedAt: string): Grievance["priority"] {
  const daysSinceSubmission = Math.floor(
    (Date.now() - new Date(submittedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceSubmission > 30) return "urgent";
  if (daysSinceSubmission > 15) return "high";
  if (daysSinceSubmission > 7) return "medium";
  return "low";
}

/**
 * Get statistics for dashboard
 */
export function getGrievanceStats() {
  const total = GRIEVANCES.length;
  
  return {
    total,
    by_status: {
      submitted: GRIEVANCES.filter((g) => g.status === "submitted").length,
      at_mandal: GRIEVANCES.filter((g) => g.status === "at_mandal").length,
      at_district: GRIEVANCES.filter((g) => g.status === "at_district").length,
      at_hod: GRIEVANCES.filter((g) => g.status === "at_hod").length,
      info_requested: GRIEVANCES.filter((g) => g.status === "info_requested").length,
      resolved: GRIEVANCES.filter((g) => g.status === "resolved").length,
      rejected: GRIEVANCES.filter((g) => g.status === "rejected").length,
    },
    by_priority: {
      low: GRIEVANCES.filter((g) => g.priority === "low").length,
      medium: GRIEVANCES.filter((g) => g.priority === "medium").length,
      high: GRIEVANCES.filter((g) => g.priority === "high").length,
      urgent: GRIEVANCES.filter((g) => g.priority === "urgent").length,
    },
  };
}
