import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Heart,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  Pill,
  Info
} from "lucide-react";
import { PharmacyCard } from "../components/PharmacyCard";
import { useApp } from "../context/AppContext";

export const MedicineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { medicines, pharmacies, isMedicineSaved, toggleSaveMedicine } = useApp();

  const [sortOption, setSortOption] = useState<"price" | "distance" | "rating">("price");

  const medicine = medicines.find((m) => m.id === id);

  if (!medicine) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">Medicine Not Found</h1>
        <p className="text-sm text-gray-500">
          We couldn't locate any record for the requested medication in our database.
        </p>
        <Link to="/search" className="btn-primary inline-flex">
          <ArrowLeft size={16} /> Return to Search
        </Link>
      </main>
    );
  }

  const saved = isMedicineSaved(medicine.id);

  // Pharmacies that carry this medicine sorted
  const sortedPharmacies = [...pharmacies].sort((a, b) => {
    const stockA = a.inventory[medicine.id]?.price || 999;
    const stockB = b.inventory[medicine.id]?.price || 999;
    if (sortOption === "price") return stockA - stockB;
    if (sortOption === "distance") return a.distance - b.distance;
    return b.rating - a.rating;
  });

  const lowestPrice = Math.min(
    ...pharmacies.map((p) => p.inventory[medicine.id]?.price ?? medicine.basePrice)
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/search" className="hover:text-teal-600 flex items-center gap-1 font-medium">
          <ArrowLeft size={13} /> Back to Search
        </Link>
        <span>/</span>
        <Link to={`/search?category=${encodeURIComponent(medicine.category)}`} className="hover:text-teal-600">
          {medicine.category}
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-800">{medicine.name}</span>
      </nav>

      {/* Main Medicine Header Card */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
              <Pill size={28} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded">
                  {medicine.category}
                </span>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  {medicine.form}
                </span>
                {medicine.prescriptionRequired ? (
                  <span className="badge-rx">
                    <FileText size={11} /> Doctor's Rx Required
                  </span>
                ) : (
                  <span className="badge-otc">
                    <CheckCircle2 size={11} /> Over-the-Counter
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {medicine.name}
              </h1>

              <p className="text-sm text-gray-600">
                Active Chemical Salt: <strong>{medicine.generic}</strong> · Strength: <strong>{medicine.strength}</strong>
              </p>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl pt-1">
                {medicine.description}
              </p>
            </div>
          </div>

          {/* Pricing & Quick Actions */}
          <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 gap-3 shrink-0">
            <div className="text-left md:text-right">
              <span className="text-xs text-gray-500 block">Counter Price From</span>
              <span className="text-2xl sm:text-3xl font-bold text-teal-700">₹{lowestPrice}</span>
              <span className="text-[11px] text-gray-400 block">across {pharmacies.length} nearby stores</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSaveMedicine(medicine.id)}
                className={`btn-outline btn-sm ${saved ? "text-rose-600 border-rose-200 bg-rose-50" : ""}`}
              >
                <Heart size={14} className={saved ? "text-rose-500 fill-rose-500" : ""} />
                {saved ? "Saved in Favorites" : "Save Medicine"}
              </button>

              <Link to="/map" className="btn-secondary btn-sm">
                <MapPin size={14} /> Map View
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Available Stores + Clinical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stores Carrying this Medicine */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Nearby Stores Carrying {medicine.name}
              </h2>
              <span className="text-xs text-gray-500">
                Compare local counter prices and reserve for 24 hours.
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <label className="text-gray-500">Sort:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700"
              >
                <option value="price">Lowest Price</option>
                <option value="distance">Nearest Distance</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {sortedPharmacies.map((pharmacy, i) => (
              <PharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
                medicine={medicine}
                bestMatch={i === 0 && sortOption === "price"}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Clinical Guide */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Info size={16} className="text-teal-600" />
              <h3 className="font-bold text-sm text-gray-900">Clinical Overview</h3>
            </div>

            {/* Primary Uses */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Primary Uses</h4>
              <ul className="space-y-1.5 text-gray-600">
                {medicine.uses.map((use, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-teal-600 mt-0.5 shrink-0" />
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dosage */}
            <div className="space-y-1 pt-2 border-t border-gray-100">
              <h4 className="font-semibold text-gray-800">Dosage Guidance</h4>
              <p className="text-gray-600 leading-relaxed">{medicine.dosage}</p>
            </div>

            {/* Side Effects */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <h4 className="font-semibold text-gray-800">Common Side Effects</h4>
              <div className="flex flex-wrap gap-1">
                {medicine.sideEffects.map((effect, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[11px]"
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="space-y-1 pt-2 border-t border-gray-100">
              <h4 className="font-semibold text-gray-800">Storage Information</h4>
              <p className="text-gray-600 leading-relaxed">{medicine.storage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3 text-xs text-gray-500">
        <ShieldCheck size={18} className="text-teal-600 shrink-0 mt-0.5" />
        <span>
          <strong>Clinical Reference Notice:</strong> This clinical guidance is provided for educational demonstration purposes only and does not replace certified professional medical consultation. Always consult a licensed doctor or pharmacist before starting or stopping any medication.
        </span>
      </div>
    </main>
  );
};
