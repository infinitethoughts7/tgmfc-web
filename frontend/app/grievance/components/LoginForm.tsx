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
  const [errors, setErrors] = useState<Partial<LoginData & { otp: string }>>({});
  
  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or Phone number is required";
    } else {
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

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setIsSendingOtp(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP sent to:", formData.emailOrPhone);
      setOtpSent(true);
      startResendTimer();
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setErrors({ emailOrPhone: "Failed to send OTP. Please try again." });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setIsSendingOtp(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP resent to:", formData.emailOrPhone);
      startResendTimer();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setErrors({ otp: "Please enter 6-digit OTP" });
      return;
    }

    setIsVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP verified successfully");
      onNext(formData);
    } catch (error) {
      console.error("OTP verification failed:", error);
      setErrors({ otp: "Invalid OTP. Please try again." });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEditContact = () => {
    setOtpSent(false);
    setOtp("");
    setErrors({});
  };

  return (
    <div className="bg-green-100 rounded-xl px-10 py-6 w-full max-w-xl mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Create Login</h2>

      {!otpSent ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-4">
          {/* Email/Phone Field */}
          <div>
            <label
              htmlFor="emailOrPhone"
              className="block text-sm font-semibold text-gray-800 mb-1"
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
              className={`w-full px-4 py-3 rounded-lg bg-white text-gray-900 border ${
                errors.emailOrPhone ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Enter email or phone number"
            />
            {errors.emailOrPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.emailOrPhone}</p>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-white text-gray-900 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-400 text-gray-700 font-semibold hover:bg-white transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSendingOtp}
              className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {/* Show where OTP was sent */}
          <div className="bg-white rounded-lg p-3 border border-gray-300">
            <p className="text-sm text-gray-600">OTP sent to:</p>
            <div className="flex items-center justify-between mt-1">
              <p className="font-semibold text-gray-900">{formData.emailOrPhone}</p>
              <button
                type="button"
                onClick={handleEditContact}
                className="text-sm text-green-600 hover:underline"
              >
                Edit
              </button>
            </div>
          </div>

          {/* OTP Input */}
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(val);
                if (errors.otp) setErrors({});
              }}
              className={`w-full px-4 py-3 rounded-lg bg-white text-gray-900 text-center text-2xl font-mono tracking-widest border ${
                errors.otp ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="● ● ● ● ● ●"
              maxLength={6}
              autoFocus
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
            )}
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-600">
                Resend OTP in <span className="font-semibold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isSendingOtp}
                className="text-sm text-green-600 font-semibold hover:underline disabled:opacity-50"
              >
                {isSendingOtp ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={handleEditContact}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-400 text-gray-700 font-semibold hover:bg-white transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify & Next"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}