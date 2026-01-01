"use client";

import { Check } from "lucide-react";

type Step = {
  id: number;
  title: string;
  shortTitle: string;
};

type StepIndicatorProps = {
  steps: Step[];
  currentStep: number;
};

const defaultSteps: Step[] = [
  { id: 1, title: "Select Category", shortTitle: "Category" },
  { id: 2, title: "Create Login", shortTitle: "Login" },
  { id: 3, title: "Basic Details", shortTitle: "Basic" },
  { id: 4, title: "Scheme Details", shortTitle: "Scheme" },
  { id: 5, title: "Describe Issue", shortTitle: "Issue" },
];

export default function StepIndicator({
  steps = defaultSteps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  currentStep > step.id
                    ? "bg-green-600 text-white"
                    : currentStep === step.id
                    ? "bg-green-600 text-white ring-4 ring-green-200"
                    : "bg-gray-200 text-gray-500"
                }`}
                aria-current={currentStep === step.id ? "step" : undefined}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              
              {/* Step Title */}
              <span
                className={`mt-2 text-xs font-medium hidden sm:block ${
                  currentStep >= step.id ? "text-green-700" : "text-gray-400"
                }`}
              >
                {step.shortTitle}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  currentStep > step.id ? "bg-green-600" : "bg-gray-200"
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}