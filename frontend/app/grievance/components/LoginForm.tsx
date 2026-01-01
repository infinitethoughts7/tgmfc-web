"use client";

import { useState } from "react";

type LoginData = {
  emailOrPhone: string;
  name: string;
};

type LoginFormProps = {
  initialData?: LoginData;
  onNext: (data: LoginData) => void;
  onBack: () => void;
};

export default function LoginForm({ initialData, onNext, onBack }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginData>(
    initialData || { emailOrPhone: "", name: "" }
  );
  const [errors, setErrors] = useState<Partial<LoginData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or Phone number is required";
    } else {
      // Check if it's a valid email or phone
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrPhone);
      const isPhone = /^[6-9]\d{9}$/.test(formData.emailOrPhone);
      if (!isEmail && !isPhone) {
        newErrors.emailOrPhone = "Enter a valid email or 10-digit phone number";
      }
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
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
    <div className="bg-green-100 rounded-xl p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Create Login</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email/Phone Field */}
        <div>
          <label
            htmlFor="emailOrPhone"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Email / Phone Number
          </label>
          <input
            type="text"
            id="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={(e) =>
              setFormData({ ...formData, emailOrPhone: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.emailOrPhone ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="Enter email or phone number"
            aria-describedby={errors.emailOrPhone ? "emailOrPhone-error" : undefined}
          />
          {errors.emailOrPhone && (
            <p id="emailOrPhone-error" className="mt-1 text-sm text-red-600">
              {errors.emailOrPhone}
            </p>
          )}
        </div>

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="Enter your name"
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

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