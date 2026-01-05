// ============================================
// SCHEMES MOCK DATA
// ============================================
// Currently: Shadi Mubarak & Scholarship
// Easily extendable: Just add more scheme objects
// ============================================

import { Scheme } from "../types/grievance";

// ------------------------------------
// SCHEMES DATA
// ------------------------------------

export const SCHEMES: Scheme[] = [
  {
    id: "scheme_shadi_mubarak",
    name: "Shadi Mubarak",
    name_te: "షాదీ ముబారక్",
    code: "SM",
    department_id: "dept_minority_welfare",
    description: "Marriage assistance scheme for minority community girls. Provides financial assistance of ₹1,00,116 for marriage expenses.",
    is_active: true,
    form_template: "shadi_mubarak",
    category_id: "cat_financial_assistance",
  },
  {
    id: "scheme_scholarship",
    name: "Post Matric Scholarship",
    name_te: "పోస్ట్ మెట్రిక్ స్కాలర్‌షిప్",
    code: "PMS",
    department_id: "dept_minority_welfare",
    description: "Scholarship for minority students pursuing post-matric education (Class 11 onwards to PhD).",
    is_active: true,
    form_template: "scholarship",
    category_id: "cat_education",
  },
];

// ------------------------------------
// FORM TEMPLATES
// ------------------------------------
// These define what fields appear in the scheme-specific form

export type FormField = {
  id: string;
  label: string;
  label_te: string;
  type: "text" | "date" | "select" | "number" | "file";
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select type
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
};

export const FORM_TEMPLATES: Record<string, FormField[]> = {
  // Shadi Mubarak Form Fields
  shadi_mubarak: [
    {
      id: "bride_name",
      label: "Bride's Name",
      label_te: "వధువు పేరు",
      type: "text",
      required: true,
      placeholder: "Enter bride's full name",
    },
    {
      id: "groom_name",
      label: "Groom's Name",
      label_te: "వరుడి పేరు",
      type: "text",
      required: true,
      placeholder: "Enter groom's full name",
    },
    {
      id: "marriage_date",
      label: "Date of Marriage",
      label_te: "వివాహ తేదీ",
      type: "date",
      required: true,
    },
    {
      id: "application_number",
      label: "ePASS Application Number",
      label_te: "ePASS దరఖాస్తు నంబర్",
      type: "text",
      required: true,
      placeholder: "e.g., TSSMBC123456789",
      validation: {
        pattern: "^[A-Z0-9]+$",
        message: "Application number should contain only uppercase letters and numbers",
      },
    },
    {
      id: "sanctioned_amount",
      label: "Sanctioned Amount (₹)",
      label_te: "మంజూరు మొత్తం (₹)",
      type: "number",
      required: true,
      placeholder: "e.g., 100116",
    },
    {
      id: "amount_received",
      label: "Amount Received So Far (₹)",
      label_te: "ఇప్పటివరకు అందిన మొత్తం (₹)",
      type: "number",
      required: true,
      placeholder: "e.g., 0",
    },
    {
      id: "bank_account",
      label: "Bank Account Number",
      label_te: "బ్యాంక్ ఖాతా నంబర్",
      type: "text",
      required: true,
      placeholder: "Enter account number linked to application",
    },
    {
      id: "issue_type",
      label: "Type of Issue",
      label_te: "సమస్య రకం",
      type: "select",
      required: true,
      options: [
        { value: "payment_delayed", label: "Payment Delayed" },
        { value: "payment_rejected", label: "Payment Rejected" },
        { value: "partial_payment", label: "Partial Payment Received" },
        { value: "wrong_account", label: "Wrong Account Credited" },
        { value: "document_issue", label: "Document Verification Issue" },
        { value: "status_stuck", label: "Application Status Stuck" },
        { value: "other", label: "Other" },
      ],
    },
  ],

  // Scholarship Form Fields
  scholarship: [
    {
      id: "student_name",
      label: "Student Name",
      label_te: "విద్యార్థి పేరు",
      type: "text",
      required: true,
      placeholder: "Enter student's full name",
    },
    {
      id: "institution_name",
      label: "Institution Name",
      label_te: "సంస్థ పేరు",
      type: "text",
      required: true,
      placeholder: "Enter college/university name",
    },
    {
      id: "course_name",
      label: "Course Name",
      label_te: "కోర్సు పేరు",
      type: "text",
      required: true,
      placeholder: "e.g., B.Tech, MBA, MBBS",
    },
    {
      id: "academic_year",
      label: "Academic Year",
      label_te: "విద్యా సంవత్సరం",
      type: "select",
      required: true,
      options: [
        { value: "2024-25", label: "2024-25" },
        { value: "2023-24", label: "2023-24" },
        { value: "2022-23", label: "2022-23" },
      ],
    },
    {
      id: "application_number",
      label: "ePASS Application Number",
      label_te: "ePASS దరఖాస్తు నంబర్",
      type: "text",
      required: true,
      placeholder: "e.g., TSPMS123456789",
    },
    {
      id: "scholarship_type",
      label: "Scholarship Type",
      label_te: "స్కాలర్‌షిప్ రకం",
      type: "select",
      required: true,
      options: [
        { value: "maintenance", label: "Maintenance Allowance" },
        { value: "tuition", label: "Tuition Fee" },
        { value: "both", label: "Both" },
      ],
    },
    {
      id: "sanctioned_amount",
      label: "Sanctioned Amount (₹)",
      label_te: "మంజూరు మొత్తం (₹)",
      type: "number",
      required: true,
      placeholder: "e.g., 50000",
    },
    {
      id: "issue_type",
      label: "Type of Issue",
      label_te: "సమస్య రకం",
      type: "select",
      required: true,
      options: [
        { value: "payment_delayed", label: "Payment Delayed" },
        { value: "application_rejected", label: "Application Rejected" },
        { value: "renewal_issue", label: "Renewal Issue" },
        { value: "institution_verification", label: "Institution Verification Pending" },
        { value: "document_issue", label: "Document Issue" },
        { value: "wrong_amount", label: "Wrong Amount Sanctioned" },
        { value: "other", label: "Other" },
      ],
    },
  ],
};

// ------------------------------------
// HELPER FUNCTIONS
// ------------------------------------

/**
 * Get scheme by ID
 */
export function getSchemeById(id: string): Scheme | undefined {
  return SCHEMES.find((s) => s.id === id);
}

/**
 * Get scheme by code
 */
export function getSchemeByCode(code: string): Scheme | undefined {
  return SCHEMES.find((s) => s.code === code);
}

/**
 * Get form template fields for a scheme
 */
export function getFormTemplate(templateName: string): FormField[] {
  return FORM_TEMPLATES[templateName] || [];
}

/**
 * Get all active schemes
 */
export function getActiveSchemes(): Scheme[] {
  return SCHEMES.filter((s) => s.is_active);
}

/**
 * Get schemes for dropdown
 */
export function getSchemeOptions() {
  return SCHEMES.filter((s) => s.is_active).map((s) => ({
    value: s.id,
    label: s.name,
    label_te: s.name_te,
    code: s.code,
  }));
}

/**
 * Generate tracking ID for a grievance
 */
export function generateTrackingId(schemeCode: string): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GRV-${schemeCode}-${year}-${random}`;
}
