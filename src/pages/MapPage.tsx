import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  Phone,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  LocateFixed,
  ShoppingBag,
  List
} from "lucide-react";
import { medicines, Pharmacy } from "../data/mockData";
import { useApp } from "../context/AppContext";

export const MapPage: React.FC = () => {
  const { pharmacies, openReservationModal } = useApp();
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(pharmacies[0]);
  const [filterMode, setFilterMode] = useState<"all" | "open24" | "verified">("all");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const filteredPharmacies = pharmacies.filter((p) => {
    if (filterMode === "open24") return p.openStatus.includes("24");
    if (filterMode === "verified") return p.verified;
    return true;
  });

  const handleRecenter = () => {
    setSelectedPharmacy(pharmacies[0]);
    setZoomLevel(1);
  };

  const handleReserve = (pharmacy: Pharmacy) => {
    openReservationModal(medicines[0], pharmacy);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
            Location Services
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Interactive Pharmacy Map
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Indiranagar, Bengaluru · Showing {filteredPharmacies.length} nearby partner chemists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/search" className="btn-outline btn-sm">
            <List size={14} /> Switch to List View
          </Link>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterMode === "all"
                ? "bg-teal-600 text-white font-semibold"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            All Stores ({pharmacies.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterMode("open24")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
              filterMode === "open24"
                ? "bg-teal-600 text-white font-semibold"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Clock size={12} /> Open 24/7
          </button>

          <button
            type="button"
            onClick={() => setFilterMode("verified")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
              filterMode === "verified"
                ? "bg-teal-600 text-white font-semibold"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ShieldCheck size={12} /> Verified Stores
          </button>
        </div>

        <div className="text-xs text-gray-400">
          Radius: 3.0 km · Click on any pharmacy pin to view details
        </div>
      </div>

      {/* Map Display Card & Selected Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vector SVG Map Container */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative">
          <div
            className="w-full relative bg-slate-100 overflow-hidden"
            style={{ height: "450px" }}
          >
            {/* SVG Graphics Canvas */}
            <div
              className="w-full h-full transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "50% 50%" }}
            >
              <svg className="w-full h-full" viewBox="0 0 1000 700" preserveAspectRatio="none">
                <defs>
                  <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="1000" height="700" fill="#f8fafc" />
                <rect width="1000" height="700" fill="url(#mapGrid)" />

                {/* Parks */}
                <path d="M 60,60 Q 180,40 220,150 T 100,280 Z" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
                <text x="100" y="150" fill="#047857" fontSize="12" fontWeight="600">Defense Colony Park</text>

                <path d="M 680,180 Q 860,140 900,320 T 720,440 Z" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
                <text x="740" y="270" fill="#047857" fontSize="12" fontWeight="600">HAL Heritage Enclave</text>

                {/* Main CMH Road */}
                <path d="M 0,350 L 1000,350" stroke="#ffffff" strokeWidth="24" />
                <path d="M 0,350 L 1000,350" stroke="#cbd5e1" strokeWidth="20" />
                <path d="M 0,350 L 1000,350" stroke="#ffffff" strokeWidth="2" strokeDasharray="14 10" />
                <text x="50" y="342" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1">
                  CMH ROAD
                </text>

                {/* 100 Feet Road */}
                <path d="M 460,0 L 460,700" stroke="#ffffff" strokeWidth="28" />
                <path d="M 460,0 L 460,700" stroke="#cbd5e1" strokeWidth="24" />
                <path d="M 460,0 L 460,700" stroke="#ffffff" strokeWidth="2" strokeDasharray="16 12" />
                <text x="475" y="60" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="1">
                  100 FEET ROAD (HAL 2ND STAGE)
                </text>

                {/* 12th Main Road */}
                <path d="M 120,680 L 920,40" stroke="#ffffff" strokeWidth="16" />
                <path d="M 120,680 L 920,40" stroke="#e2e8f0" strokeWidth="12" />
                <text x="260" y="550" fill="#64748b" fontSize="11" fontWeight="600">12th Main Road</text>

                {/* Metro Line */}
                <path d="M 0,325 L 1000,325" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="8 6" opacity="0.6" />
                <circle cx="460" cy="325" r="6" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                <text x="475" y="322" fill="#7c3aed" fontSize="10" fontWeight="700">Indiranagar Metro</text>
              </svg>

              {/* User GPS Pin */}
              <div
                className="absolute z-20 flex flex-col items-center pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: "46%", top: "48%" }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-200"></div>
                <span className="text-[10px] font-bold text-blue-800 bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1 border border-blue-200">
                  You are here
                </span>
              </div>

              {/* Interactive Pharmacy Pins */}
              {filteredPharmacies.map((pharmacy) => {
                const isSelected = selectedPharmacy?.id === pharmacy.id;
                const price = Object.values(pharmacy.inventory)[0]?.price || 35;

                return (
                  <button
                    key={pharmacy.id}
                    type="button"
                    onClick={() => setSelectedPharmacy(pharmacy)}
                    className={`absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 flex flex-col items-center ${
                      isSelected ? "scale-110 z-40" : ""
                    }`}
                    style={{
                      left: `${pharmacy.coordinates.x}%`,
                      top: `${pharmacy.coordinates.y}%`
                    }}
                  >
                    <div
                      className={`px-2 py-1 rounded-md text-xs font-bold shadow-md border flex items-center gap-1 ${
                        isSelected
                          ? "bg-teal-600 text-white border-teal-700 ring-2 ring-teal-300"
                          : "bg-white text-gray-800 border-gray-300 hover:border-teal-500"
                      }`}
                    >
                      <MapPin size={11} className={isSelected ? "text-white" : "text-teal-600"} />
                      <span>₹{price}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700 bg-white/90 px-1.5 rounded shadow-2xs mt-0.5 max-w-[120px] truncate border border-gray-200">
                      {pharmacy.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Map Controls */}
            <div className="absolute top-3 right-3 z-30 flex flex-col gap-1 bg-white border border-gray-200 rounded-lg shadow-sm p-1">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                onClick={handleRecenter}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded border-t border-gray-100"
                title="Re-center"
              >
                <LocateFixed size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Pharmacy Detail Panel */}
        <div className="lg:col-span-4">
          {selectedPharmacy ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-gray-900">
                      {selectedPharmacy.name}
                    </h3>
                  </div>
                  {selectedPharmacy.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 mt-1">
                      <ShieldCheck size={12} /> Verified Chemist
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 font-bold flex items-center justify-center shrink-0">
                  {selectedPharmacy.name[0]}
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <p className="flex items-start gap-1.5">
                  <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <span>{selectedPharmacy.address}</span>
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {selectedPharmacy.distanceText}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={13} className="text-amber-500 fill-amber-500" />
                    <strong>{selectedPharmacy.rating}</strong> ({selectedPharmacy.reviewsCount})
                  </span>
                  <span className="text-gray-500">
                    <Clock size={12} className="inline mr-1" />
                    {selectedPharmacy.openStatus}
                  </span>
                </div>
              </div>

              {/* Sample Prices */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs">
                <span className="text-gray-500 font-semibold block text-[11px] uppercase">
                  Sample Stock & Prices:
                </span>
                <div className="space-y-1">
                  {Object.entries(selectedPharmacy.inventory).slice(0, 3).map(([medId, stock]) => {
                    const med = medicines.find((m) => m.id === medId);
                    return (
                      <div key={medId} className="flex justify-between items-center py-1 border-b border-gray-50">
                        <span className="text-gray-800 font-medium">{med?.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">₹{stock.price}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 rounded">
                            {stock.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <button
                  type="button"
                  onClick={() => handleReserve(selectedPharmacy)}
                  className="btn-primary w-full text-xs py-2"
                >
                  <ShoppingBag size={14} /> Reserve at this Store
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${selectedPharmacy.phone.replace(/[^0-9+]/g, "")}`}
                    className="btn-outline text-xs py-1.5 justify-center"
                  >
                    <Phone size={13} /> Call Chemist
                  </a>
                  <Link
                    to={`/search?q=${encodeURIComponent(selectedPharmacy.name)}`}
                    className="btn-secondary text-xs py-1.5 justify-center"
                  >
                    View Catalog <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-xs text-gray-500">
              Select a pharmacy pin on the map to see details and reserve medicines.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
