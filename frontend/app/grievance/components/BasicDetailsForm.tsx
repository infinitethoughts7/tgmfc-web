"use client";

import { useState } from "react";
import locationsData from "../../mock/telangana-locations.json";

type BasicDetails = {
  nameAsPerAadhaar: string;
  dob: string;
  fatherName: string;
  district: string;
  mandal: string;
  completeAddress: string;
};

type BasicDetailsFormProps = {
  initialData?: BasicDetails;
  onNext: (data: BasicDetails) => void;
  onBack: () => void;
};

export default function BasicDetailsForm({
  initialData,
  onNext,
  onBack,
}: BasicDetailsFormProps) {
  const [formData, setFormData] = useState<BasicDetails>(
    initialData || {
      nameAsPerAadhaar: "",
      dob: "",
      fatherName: "",
      district: "",
      mandal: "",
      completeAddress: "",
    }
  );
  const [errors, setErrors] = useState<Partial<BasicDetails>>({});

  // Derive mandals from selected district
  const mandals = formData.district
    ? locationsData.districts.find((d) => d.id === formData.district)?.mandals || []
    : [];

  const validateForm = (): boolean => {
    const newErrors: Partial<BasicDetails> = {};

    if (!formData.nameAsPerAadhaar.trim()) {
      newErrors.nameAsPerAadhaar = "Name as per Aadhaar is required";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    }

    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father's name is required";
    }

    if (!formData.district) {
      newErrors.district = "District is required";
    }

    if (!formData.mandal) {
      newErrors.mandal = "Mandal is required";
    }

    if (!formData.completeAddress.trim()) {
      newErrors.completeAddress = "Complete address is required";
    } else if (formData.completeAddress.trim().length < 20) {
      newErrors.completeAddress = "Please provide a complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="bg-green-100 rounded-xl p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Enter your Basic Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name as per Aadhaar */}
        <div>
          <label
            htmlFor="nameAsPerAadhaar"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Name as Per Aadhaar Card
          </label>
          <input
            type="text"
            id="nameAsPerAadhaar"
            value={formData.nameAsPerAadhaar}
            onChange={(e) =>
              setFormData({ ...formData, nameAsPerAadhaar: e.target.value })
            }
            className={`w-full px-4 py-2 rounded-lg border bg-white text-gray-900 ${
              errors.nameAsPerAadhaar ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="Enter name as per Aadhaar"
          />
          {errors.nameAsPerAadhaar && (
            <p className="mt-1 text-sm text-red-600">{errors.nameAsPerAadhaar}</p>
          )}
        </div>

        {/* DOB */}
        <div>
          <label
            htmlFor="dob"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            DOB
          </label>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border bg-white text-gray-900 ${
              errors.dob ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
          )}
        </div>

        {/* Father's Name */}
        <div>
          <label
            htmlFor="fatherName"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Father&apos;s Name
          </label>
          <input
            type="text"
            id="fatherName"
            value={formData.fatherName}
            onChange={(e) =>
              setFormData({ ...formData, fatherName: e.target.value })
            }
            className={`w-full px-4 py-2 rounded-lg border bg-white text-gray-900 ${
              errors.fatherName ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="Enter father's name"
          />
          {errors.fatherName && (
            <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label
            htmlFor="district"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            District
          </label>
          <select
            id="district"
            value={formData.district}
            onChange={(e) => {
              const newDistrict = e.target.value;
              setFormData({ ...formData, district: newDistrict, mandal: "" });
            }}
            className={`w-full px-4 py-2 rounded-lg border bg-white text-gray-900 ${
              errors.district ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            <option value="">Select District</option>
            {locationsData.districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="mt-1 text-sm text-red-600">{errors.district}</p>
          )}
        </div>

        {/* Mandal */}
        <div>
          <label
            htmlFor="mandal"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Mandal
          </label>
          <select
            id="mandal"
            value={formData.mandal}
            onChange={(e) =>
              setFormData({ ...formData, mandal: e.target.value })
            }
            disabled={!formData.district}
            className={`w-full px-4 py-2 rounded-lg border bg-white text-gray-900 ${
              errors.mandal ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
          >
            <option value="">
              {formData.district ? "Select Mandal" : "Select District first"}
            </option>
            {mandals.map((mandal) => (
              <option key={mandal.id} value={mandal.id}>
                {mandal.name}
              </option>
            ))}
          </select>
          {errors.mandal && (
            <p className="mt-1 text-sm text-red-600">{errors.mandal}</p>
          )}
        </div>

        {/* Complete Address */}
        <div>
          <label
            htmlFor="completeAddress"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Complete Address
          </label>
          <textarea
            id="completeAddress"
            value={formData.completeAddress}
            onChange={(e) =>
              setFormData({ ...formData, completeAddress: e.target.value })
            }
            rows={3}
            className={`w-full px-4 py-2 rounded-lg border bg-white text-gray-900 ${
              errors.completeAddress ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-green-500 resize-none`}
            placeholder="Enter complete address"
          />
          {errors.completeAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.completeAddress}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
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