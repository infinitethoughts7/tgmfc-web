"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GrievanceAPI } from "@/app/lib/api/grievance-service";
import { Officer } from "@/app/lib/types/grievance";
import { DISTRICTS, MANDALS } from "@/app/lib/mock-data/locations";
import { SCHEMES } from "@/app/lib/mock-data/schemes";
import OfficerLayout from "../components/OfficerLayout";
import { Loader2, User, Mail, Phone, MapPin, Award, Shield } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("officer_token");
    if (!token) {
      router.push("/officer/login");
      return;
    }

    const loadData = async () => {
      const off = await GrievanceAPI.getCurrentOfficer(token);
      if (!off) {
        localStorage.removeItem("officer_token");
        router.push("/officer/login");
        return;
      }

      setOfficer(off);
      setLoading(false);
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!officer) return null;

  const district = DISTRICTS.find((d) => d.id === officer.district_id);
  const mandal = officer.mandal_id ? MANDALS.find((m) => m.id === officer.mandal_id) : null;
  const schemes = SCHEMES.filter((s) => officer.scheme_ids.includes(s.id));

  return (
    <OfficerLayout officer={officer}>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-600 mt-1">View and manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-teal-700 to-green-600 px-8 py-12">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl font-bold text-green-600">
                  {officer.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </span>
              </div>
              <div className="text-white">
                <h3 className="text-3xl font-bold">{officer.name}</h3>
                <p className="text-teal-100 mt-1 text-lg">{officer.designation}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Level {officer.level} Officer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 space-y-6">
            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{officer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{officer.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Assignment */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Location Assignment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">District</p>
                  <p className="text-sm font-medium text-gray-900">{district?.name}</p>
                </div>
                {mandal && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Mandal</p>
                    <p className="text-sm font-medium text-gray-900">{mandal.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Role Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Role & Responsibilities
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm font-medium text-gray-900">
                    {officer.role.replace(/_/g, " ").toUpperCase()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Officer Level</p>
                  <p className="text-sm font-medium text-gray-900">
                    Level {officer.level} - {officer.level === 1 ? "Mandal Officer" : officer.level === 2 ? "District Officer" : "Head of Department"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${officer.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {officer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Schemes */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Assigned Schemes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schemes.map((scheme) => (
                  <div key={scheme.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
                    <h5 className="font-medium text-gray-900">{scheme.name}</h5>
                    <p className="text-xs text-gray-500 mt-1">{scheme.code}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}
