"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryAccordion from "./components/CategoryAccordion";
import StepIndicator from "./components/StepIndicator";
import categoriesData from "../mock/grievance-categories.json";

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

const steps = [
  { id: 1, title: "Select Category", shortTitle: "Category" },
  { id: 2, title: "Create Login", shortTitle: "Login" },
  { id: 3, title: "Basic Details", shortTitle: "Basic" },
  { id: 4, title: "Scheme Details", shortTitle: "Scheme" },
  { id: 5, title: "Describe Issue", shortTitle: "Issue" },
];

export default function GrievancePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

  const handleSelect = (category: Category, subcategory: Subcategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  };

  const handleProceed = () => {
    if (selectedCategory && selectedSubcategory) {
      // Store selection in sessionStorage for the registration flow
      sessionStorage.setItem(
        "grievance_selection",
        JSON.stringify({
          category: selectedCategory,
          subcategory: selectedSubcategory,
        })
      );
      router.push("/grievance/register");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">
            File & Manage Grievance
          </h1>
          <p className="text-gray-600">
            Register your grievance with the Minority Welfare Department
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={steps} currentStep={1} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Category Selection */}
          <div>
            <h2 className="text-green-700 font-semibold mb-4">
              Please Select your Grievance Category
            </h2>
            <CategoryAccordion
              categories={categoriesData.categories as Category[]}
              onSelect={handleSelect}
              selectedSubcategory={selectedSubcategory?.id || null}
            />
          </div>

          {/* Right: Selection Summary & Proceed */}
          <div>
            {selectedSubcategory ? (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Selected Grievance Type
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-sm text-gray-500">Category:</span>
                    <p className="font-medium text-gray-800">
                      {selectedCategory?.title}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Sub-category:</span>
                    <p className="font-medium text-green-700">
                      {selectedSubcategory.title}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Department:</span>
                    <p className="font-medium text-gray-800 capitalize">
                      {selectedCategory?.department_id.replace(/-/g, " ")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Proceed to Register →
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  How to File a Grievance
                </h3>
                <ol className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Select a category from the list</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Choose the specific sub-category for your issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Register with your phone/email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Fill your details and describe your issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      5
                    </span>
                    <span>Submit and receive a tracking number</span>
                  </li>
                </ol>

                {/* Track Existing Grievance Link */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Already filed a grievance?
                  </p>
                  <a
                    href="/grievance/track"
                    className="text-green-600 font-semibold hover:underline"
                  >
                    Track Your Grievance Status →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
