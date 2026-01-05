"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { Officer } from "@/app/lib/types/grievance";
import { Camera } from "lucide-react";
import Image from "next/image";

type OfficerLayoutProps = {
  children: ReactNode;
  officer: Officer;
};

export default function OfficerLayout({ children, officer }: OfficerLayoutProps) {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("officer_token");
    router.push("/");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePhoto(result);
        localStorage.setItem(`officer_photo_${officer.id}`, result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load saved photo on mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem(`officer_photo_${officer.id}`);
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, [officer.id]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {officer.name}
              </h1>
              <p className="text-sm text-gray-600">
                {officer.designation} | Level {officer.level}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{officer.role.replace(/_/g, " ").toUpperCase()}</p>
                <p className="text-xs text-gray-500">{officer.email}</p>
              </div>

              {/* Profile Photo with Upload */}
              <div className="relative group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center cursor-pointer relative overflow-hidden border-2 border-white shadow-md hover:shadow-lg transition-all"
                >
                  {profilePhoto ? (
                    <Image
                      src={profilePhoto}
                      alt={officer.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {officer.name.split(" ")[0][0].toUpperCase()}
                    </span>
                  )}

                  {/* Camera overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
