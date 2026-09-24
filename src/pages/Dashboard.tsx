import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Trash2,
  ArrowRight,
  ShieldCheck,
  XCircle,
  Copy,
  CheckCheck,
  Pill,
  X
} from "lucide-react";
import { useApp, Reservation } from "../context/AppContext";
import { medicines } from "../data/mockData";

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    pharmacies,
    reservations,
    cancelReservation,
    savedMedicineIds,
    toggleSaveMedicine,
    openReservationModal,
    addToast
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"reservations" | "saved">("reservations");
  const [selectedPass, setSelectedPass] = useState<Reservation | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Close pass on Escape
  React.useEffect(() => {
    if (!selectedPass) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPass(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedPass]);

  // Filter reservations
  const activeReservations = reservations.filter((r) => r.status !== "Cancelled");
  const pastReservations = reservations.filter((r) => r.status === "Cancelled");

  // Get saved medicines objects
  const savedMedicines = medicines.filter((m) => savedMedicineIds.includes(m.id));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
            Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your active medicine pickup holds, saved prescriptions, and counter passes.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs">
          <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <strong className="block text-gray-900">{currentUser.name}</strong>
            <span className="text-gray-500">{currentUser.email}</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <ShoppingBag size={24} />
          </div>
          <div>
            <span className="text-2xl font-bold text-gray-900 block">{activeReservations.length}</span>
            <span className="text-xs text-gray-500 font-medium">Active Pickup Holds</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Heart size={24} />
          </div>
          <div>
            <span className="text-2xl font-bold text-gray-900 block">{savedMedicines.length}</span>
            <span className="text-xs text-gray-500 font-medium">Saved Medicines</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="text-2xl font-bold text-gray-900 block">{pharmacies.length}</span>
            <span className="text-xs text-gray-500 font-medium">Local Partner Chemists</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-4 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("reservations")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "reservations"
              ? "border-teal-600 text-teal-700 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <ShoppingBag size={16} /> My Reservations ({activeReservations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("saved")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "saved"
              ? "border-teal-600 text-teal-700 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Heart size={16} /> Saved Medicines ({savedMedicines.length})
        </button>
      </div>

      {/* TAB 1: Reservations */}
      {activeTab === "reservations" && (
        <div className="space-y-4">
          {activeReservations.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-3">
              <ShoppingBag size={32} className="text-gray-400 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Active Reservations</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                You do not have any medicines reserved at local pharmacies right now.
              </p>
              <Link to="/search" className="btn-primary btn-sm inline-flex">
                Find & Reserve Medicine <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeReservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3 hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 uppercase font-semibold">Pass Code:</span>
                      <strong className="font-mono text-base font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                        {res.code}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="badge-available">
                        <CheckCircle2 size={12} /> {res.status}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {res.pickupDeadline}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {/* Item */}
                    <div>
                      <span className="text-gray-400 uppercase font-medium text-[10px] block">Reserved Item</span>
                      <strong className="text-sm text-gray-900 block font-semibold">{res.medicineName}</strong>
                      <span className="text-gray-500">
                        {res.medicineStrength} · Quantity: <strong>{res.quantity}</strong>
                      </span>
                    </div>

                    {/* Pharmacy */}
                    <div>
                      <span className="text-gray-400 uppercase font-medium text-[10px] block">Pickup Chemist</span>
                      <strong className="text-sm text-gray-900 block font-semibold">{res.pharmacyName}</strong>
                      <span className="text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-gray-400 shrink-0" />
                        {res.pharmacyAddress}
                      </span>
                    </div>

                    {/* Counter Payment */}
                    <div className="sm:text-right">
                      <span className="text-gray-400 uppercase font-medium text-[10px] block">To Pay at Counter</span>
                      <strong className="text-lg font-bold text-gray-900 block">₹{res.totalPrice}</strong>
                      <span className="text-gray-400 text-[11px]">(₹{res.unitPrice} each)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={`tel:${res.pharmacyPhone.replace(/[^0-9+]/g, "")}`}
                      className="btn-outline btn-sm text-xs"
                    >
                      <Phone size={12} /> Call Store
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPass(res)}
                        className="btn-secondary btn-sm text-xs font-semibold"
                      >
                        Show Pickup Pass
                      </button>

                      <button
                        type="button"
                        onClick={() => cancelReservation(res.id)}
                        className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors font-medium"
                      >
                        Cancel Hold
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past / Cancelled Holds */}
          {pastReservations.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-xs">
              <span className="font-semibold text-gray-700 block">
                Past or Cancelled Holds ({pastReservations.length})
              </span>
              <div className="divide-y divide-gray-200">
                {pastReservations.map((p) => (
                  <div key={p.id} className="py-1.5 flex justify-between items-center text-gray-500">
                    <span>
                      {p.medicineName} ({p.medicineStrength}) at {p.pharmacyName}
                    </span>
                    <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                      Cancelled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Saved Medicines */}
      {activeTab === "saved" && (
        <div>
          {savedMedicines.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-3">
              <Heart size={32} className="text-gray-400 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Saved Medicines</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Save your regular medications to check stock and prices in 1 click.
              </p>
              <Link to="/search" className="btn-primary btn-sm inline-flex">
                Browse Medicines <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedMedicines.map((med) => {
                const lowest = Math.min(
                  ...pharmacies.map((p) => p.inventory[med.id]?.price ?? med.basePrice)
                );
                return (
                  <div key={med.id} className="med-card flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {med.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSaveMedicine(med.id)}
                          className="text-gray-400 hover:text-rose-500 p-1"
                          title="Remove from saved"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div onClick={() => navigate(`/medicine/${med.id}`)} className="cursor-pointer space-y-1">
                        <h3 className="text-sm font-bold text-gray-900 hover:text-teal-700">
                          {med.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {med.generic} · {med.strength}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 pt-1">
                          {med.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Price from</span>
                        <span className="text-base font-bold text-gray-900">₹{lowest}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link to={`/medicine/${med.id}`} className="btn-outline btn-sm text-xs">
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => openReservationModal(med, pharmacies[0])}
                          className="btn-primary btn-sm text-xs"
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Pickup Pass Modal Dialog */}
      {selectedPass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedPass(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative border border-gray-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1">
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
                Digital Pickup Pass
              </span>
              <h3 className="text-lg font-bold text-gray-900">Show at Chemist Counter</h3>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center space-y-2">
              <span className="text-xs text-teal-800 font-medium block">Reservation Code</span>
              <div className="text-3xl font-mono font-bold text-teal-900 tracking-wider">
                {selectedPass.code}
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedPass.code);
                  setCopiedCode(true);
                  addToast("Pass Code Copied", `${selectedPass.code} copied to clipboard`, "info");
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="btn-outline btn-sm mx-auto text-xs"
              >
                {copiedCode ? <CheckCheck size={13} className="text-emerald-600" /> : <Copy size={13} />}
                {copiedCode ? "Copied!" : "Copy Code"}
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Medicine:</span>
                <span className="font-semibold text-gray-800">
                  {selectedPass.quantity}x {selectedPass.medicineName} ({selectedPass.medicineStrength})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chemist:</span>
                <span className="font-semibold text-gray-800">{selectedPass.pharmacyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Store Address:</span>
                <span className="text-gray-600 text-right max-w-[180px] truncate">{selectedPass.pharmacyAddress}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-200">
                <span className="text-gray-500 font-semibold">Total to Pay:</span>
                <span className="font-bold text-teal-700 text-sm">₹{selectedPass.totalPrice}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPass(null)}
              className="btn-primary w-full text-xs py-2"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
