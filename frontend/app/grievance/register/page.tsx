"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "../components/StepIndicator";
import LoginForm from "../components/LoginForm";
import BasicDetailsForm from "../components/BasicDetailsForm";
import SchemeDetailsForm from "../components/SchemeDetailsForm";
import IssueForm from "../components/IssueForm";

type Subcategory = {
  id: string;
  title: string;
  scheme_code: string;
  form_template: string;
};

type Category = {
  id: string;
  title: string;
  department_id: string;
  icon: string;
  subcategories: Subcategory[];
};

type GrievanceSelection = {
  category: Category;
  subcategory: Subcategory;
};

type LoginData = {
  emailOrPhone: string;
  name: string;
};

type BasicDetails = {
  nameAsPerAadhaar: string;
  dob: string;
  fatherName: string;
  district: string;
  mandal: string;
  completeAddress: string;
};

type IssueData = {
  description: string;
  voiceRecording: Blob | null;
  attachments: File[];
};

const steps = [
  { id: 1, title: "Select Category", shortTitle: "Category" },
  { id: 2, title: "Create Login", shortTitle: "Login" },
  { id: 3, title: "Basic Details", shortTitle: "Basic" },
  { id: 4, title: "Scheme Details", shortTitle: "Scheme" },
  { id: 5, title: "Describe Issue", shortTitle: "Issue" },
];

export default function GrievanceRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);
  const [selection, setSelection] = useState<GrievanceSelection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data for each step
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [basicDetails, setBasicDetails] = useState<BasicDetails | null>(null);
  const [schemeDetails, setSchemeDetails] = useState<Record<string, string> | null>(null);
  const [issueData, setIssueData] = useState<IssueData | null>(null);

  // Load selection from sessionStorage
  useEffect(() => {
    const storedSelection = sessionStorage.getItem("grievance_selection");
    if (storedSelection) {
      setSelection(JSON.parse(storedSelection));
    } else {
      router.push("/grievance");
    }
  }, [router]);

  const handleLoginNext = (data: LoginData) => {
    setLoginData(data);
    setCurrentStep(3);
  };

  const handleBasicDetailsNext = (data: BasicDetails) => {
    setBasicDetails(data);
    setCurrentStep(4);
  };

  const handleSchemeDetailsNext = (data: Record<string, string>) => {
    setSchemeDetails(data);
    setCurrentStep(5);
  };

  const handleIssueSubmit = async (data: IssueData) => {
    setIssueData(data);
    setIsSubmitting(true);

    try {
      // Prepare the complete grievance data
      const grievanceData = {
        category_id: selection?.category.id,
        subcategory_id: selection?.subcategory.id,
        scheme_code: selection?.subcategory.scheme_code,
        department_id: selection?.category.department_id,
        form_template: selection?.subcategory.form_template,
        contact: loginData?.emailOrPhone,
        applicant_name: loginData?.name,
        aadhaar_name: basicDetails?.nameAsPerAadhaar,
        dob: basicDetails?.dob,
        father_name: basicDetails?.fatherName,
        district: basicDetails?.district,
        mandal: basicDetails?.mandal,
        address: basicDetails?.completeAddress,
        scheme_details: schemeDetails,
        description: data.description,
        has_voice_recording: !!data.voiceRecording,
        attachment_count: data.attachments.length,
        submitted_at: new Date().toISOString(),
      };

      // TODO: Replace with actual API call to Wagtail CMS
      console.log("Grievance Data:", grievanceData);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate tracking ID
      const trackingId = `GRV-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      sessionStorage.setItem(
        "grievance_submitted",
        JSON.stringify({
          trackingId,
          schemeName: selection?.subcategory.title,
          submittedAt: new Date().toISOString(),
        })
      );

      sessionStorage.removeItem("grievance_selection");
      router.push("/grievance/success");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit grievance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      router.push("/grievance");
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!selection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-teal-800 mb-1">
            Register Grievance
          </h1>
          <p className="text-gray-600 text-sm">
            {selection.category.title} → {selection.subcategory.title}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Form Steps */}
        <div className="max-w-lg mx-auto">
          {currentStep === 2 && (
            <LoginForm
              initialData={loginData || undefined}
              onNext={handleLoginNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <BasicDetailsForm
              initialData={basicDetails || undefined}
              onNext={handleBasicDetailsNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <SchemeDetailsForm
              formTemplate={selection.subcategory.form_template}
              schemeTitle={selection.subcategory.title}
              initialData={schemeDetails || undefined}
              onNext={handleSchemeDetailsNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <IssueForm
              schemeTitle={selection.subcategory.title}
              initialData={issueData || undefined}
              onSubmit={handleIssueSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}