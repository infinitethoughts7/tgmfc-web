"use client";

import { useState, useEffect } from "react";
import schemeFieldsData from "../../mock/scheme-form-fields.json";
import locationsData from "../../mock/telangana-locations.json";

type FormField = {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  options_source?: string;
  depends_on?: string;
};

type SchemeDetailsFormProps = {
  formTemplate: string;
  schemeTitle: string;
  initialData?: Record<string, string>;
  onNext: (data: Record<string, string>) => void;
  onBack: () => void;
};

export default function SchemeDetailsForm({
  formTemplate,
  schemeTitle,
  initialData,
  onNext,
  onBack,
}: SchemeDetailsFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    initialData || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get form template from JSON
  const template =
    schemeFieldsData.form_templates[
      formTemplate as keyof typeof schemeFieldsData.form_templates
    ];

  const fields: FormField[] = template?.fields || [];

  // Get options for select fields
  const getOptions = (field: FormField): { id: string; name: string }[] => {
    if (field.options) {
      return field.options.map((opt) => ({ id: opt, name: opt }));
    }

    if (field.options_source === "districts") {
      return locationsData.districts.map((d) => ({ id: d.id, name: d.name }));
    }

    if (field.options_source === "mandals" && field.depends_on) {
      const districtId = formData[field.depends_on];
      if (districtId) {
        const district = locationsData.districts.find(
          (d) => d.id === districtId
        );
        return district?.mandals || [];
      }
      return [];
    }

    return [];
  };

  // Reset dependent fields when parent changes
  useEffect(() => {
    fields.forEach((field) => {
      if (field.depends_on && formData[field.depends_on] !== initialData?.[field.depends_on]) {
        setFormData((prev) => ({ ...prev, [field.id]: "" }));
      }
    });
  }, [formData.district]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleChange = (fieldId: string, value: string) => {
    setFormData({ ...formData, [fieldId]: value });
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: "" });
    }
  };

  const renderField = (field: FormField) => {
    const commonClasses = `w-full px-4 py-3 rounded-lg border ${
      errors[field.id] ? "border-red-500" : "border-gray-200"
    } focus:outline-none focus:ring-2 focus:ring-green-500`;

    switch (field.type) {
      case "select":
        const options = getOptions(field);
        const isDisabled =
          field.depends_on && !formData[field.depends_on];

        return (
          <select
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            disabled={isDisabled}
            className={`${commonClasses} bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}
          >
            <option value="">
              {isDisabled
                ? `Select ${field.depends_on} first`
                : `Select ${field.label}`}
            </option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <input
            type="date"
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={commonClasses}
          />
        );

      case "number":
        return (
          <input
            type="number"
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={commonClasses}
            placeholder={field.placeholder}
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            rows={3}
            className={`${commonClasses} resize-none`}
            placeholder={field.placeholder}
          />
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={commonClasses}
            placeholder={field.placeholder}
          />
        );
    }
  };

  if (!template) {
    return (
      <div className="bg-red-100 rounded-xl p-8 max-w-lg mx-auto">
        <p className="text-red-600">Form template not found: {formTemplate}</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-green-100 rounded-xl p-8 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        You are Registering Grievance regarding {schemeTitle}
      </h2>
      <p className="text-gray-600 mb-6 text-sm">{template.description}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {errors[field.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}