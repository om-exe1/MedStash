import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Store,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get("role") as "patient" | "pharmacy_owner") || "patient";

  const { login, pharmacies } = useApp();

  const [role, setRole] = useState<"patient" | "pharmacy_owner">(initialRole);
  const [email, setEmail] = useState<string>(role === "patient" ? "om@example.com" : "rajesh@xyzpharmacy.com");
  const [password, setPassword] = useState<string>("password123");
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>("xyz-pharmacy");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRoleChange = (newRole: "patient" | "pharmacy_owner") => {
    setRole(newRole);
    if (newRole === "patient") {
      setEmail("om@example.com");
    } else {
      setEmail("rajesh@xyzpharmacy.com");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (role === "pharmacy_owner") {
        const store = pharmacies.find((p) => p.id === selectedPharmacyId) || pharmacies[0];
        login("pharmacy_owner", {
          name: "Rajesh Gupta",
          email,
          pharmacyId: store.id,
          pharmacyName: store.name
        });
        setLoading(false);
        navigate("/pharmacy-dashboard");
      } else {
        login("patient", {
          name: "Om",
          email
        });
        setLoading(false);
        navigate("/dashboard");
      }
    }, 300);
  };

  // Quick 1-Click Demo Logins for Viva presentation
  const handleQuickPatient = () => {
    login("patient", { name: "Om", email: "om@example.com" });
    navigate("/dashboard");
  };

  const handleQuickChemist = () => {
    const store = pharmacies.find((p) => p.id === "xyz-pharmacy") || pharmacies[0];
    login("pharmacy_owner", {
      name: "Rajesh Gupta",
      email: "rajesh@xyzpharmacy.com",
      pharmacyId: store.id,
      pharmacyName: store.name
    });
    navigate("/pharmacy-dashboard");
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-lg mx-auto shadow-xs">
            +
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sign In to MedStash
          </h1>
          <p className="text-xs text-gray-500">
            Choose your role to access the patient or chemist dashboard.
          </p>
        </div>

        {/* Quick Demo Access (Great for Viva) */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 space-y-2 text-xs">
          <span className="font-semibold text-teal-800 uppercase tracking-wider block text-[11px]">
            ⚡ Viva Demo 1-Click Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickPatient}
              className="p-2 bg-white border border-teal-200 hover:border-teal-400 rounded-lg text-left text-gray-800 transition-colors shadow-2xs"
            >
              <strong className="block font-semibold text-teal-900">Patient View</strong>
              <span className="text-[10px] text-gray-500">Om (Dashboard)</span>
            </button>
            <button
              type="button"
              onClick={handleQuickChemist}
              className="p-2 bg-white border border-teal-200 hover:border-teal-400 rounded-lg text-left text-gray-800 transition-colors shadow-2xs"
            >
              <strong className="block font-semibold text-teal-900">Chemist View</strong>
              <span className="text-[10px] text-gray-500">XYZ Pharmacy</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] text-gray-400 uppercase tracking-wider relative">
            or login with credentials
          </span>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRoleChange("patient")}
            className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              role === "patient"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <User size={14} /> Patient Account
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("pharmacy_owner")}
            className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              role === "pharmacy_owner"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Store size={14} /> Pharmacy Owner
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {role === "pharmacy_owner" && (
            <div>
              <label className="block font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Building2 size={13} className="text-teal-600" /> Assigned Chemist Store
              </label>
              <select
                value={selectedPharmacyId}
                onChange={(e) => setSelectedPharmacyId(e.target.value)}
                className="med-select py-2 text-xs"
              >
                {pharmacies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.area})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Mail size={13} className="text-teal-600" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="med-input py-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Lock size={13} className="text-teal-600" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="med-input py-2 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-xs font-semibold"
          >
            {loading ? "Signing in..." : role === "pharmacy_owner" ? "Access Chemist Dashboard" : "Access Patient Dashboard"}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 flex items-center justify-center gap-1 text-[11px] text-gray-400">
          <ShieldCheck size={13} />
          <span>Demo credentials auto-filled for college presentation.</span>
        </div>
      </div>
    </main>
  );
};
