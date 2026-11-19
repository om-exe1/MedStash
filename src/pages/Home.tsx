import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  ShieldCheck,
  Clock,
  ShoppingBag,
  ArrowRight,
  Pill,
  Heart,
  Search,
  Sparkles,
  CheckCircle2,
  LocateFixed
} from "lucide-react";
import { SearchBox } from "../components/SearchBox";
import { useApp } from "../context/AppContext";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    medicines,
    pharmacies,
    isMedicineSaved,
    toggleSaveMedicine,
    locationName,
    isLocating,
    detectLiveLocation
  } = useApp();

  const categories = [
    { name: "Rare & Orphan", count: 17, color: "bg-rose-50 text-rose-700 border-rose-200" },
    { name: "Pain relief", count: 18, color: "bg-amber-50 text-amber-700 border-amber-200" },
    { name: "Antibiotic", count: 14, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { name: "Allergy", count: 12, color: "bg-purple-50 text-purple-700 border-purple-200" },
    { name: "Cardiac", count: 16, color: "bg-red-50 text-red-700 border-red-200" },
    { name: "Diabetes", count: 10, color: "bg-teal-50 text-teal-700 border-teal-200" },
    { name: "Oncology", count: 8, color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
    { name: "Digestive", count: 16, color: "bg-blue-50 text-blue-700 border-blue-200" },
  ];

  const popularMedicines = medicines.slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              <Sparkles size={13} /> Student Project · Pharmacy Stock Discovery Prototype
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Find medicines in nearby stores.<br />
              <span className="text-teal-600">Reserve & pick up easily.</span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Compare demo stock availability and counter prices across local neighborhood pharmacies. Reserve your medicine online for instant counter pickup.
            </p>

            {/* Search Box */}
            <div className="pt-1">
              <SearchBox large placeholder="Search medicine (e.g. Paracetamol, Dolo), salt, or symptom..." />
            </div>

            {/* Location & Map shortcut */}
            <div className="flex items-center gap-3 text-xs text-gray-500 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => detectLiveLocation(true)}
                disabled={isLocating}
                className="flex items-center gap-1.5 font-medium text-gray-700 hover:text-teal-700 bg-gray-50 hover:bg-teal-50 px-2.5 py-1 rounded-md border border-gray-200 transition-colors shadow-2xs group"
                title="Click to re-detect your live location via GPS"
              >
                <LocateFixed size={14} className={`text-teal-600 shrink-0 ${isLocating ? "animate-spin text-teal-700" : "group-hover:scale-110 transition-transform"}`} />
                <span>{isLocating ? "Detecting location..." : locationName}</span>
                <span className="text-[10px] text-teal-700 bg-teal-100/80 px-1.5 py-0.5 rounded font-semibold ml-0.5">
                  {isLocating ? "Locating..." : "Live"}
                </span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => navigate("/map")}
                className="text-teal-700 font-semibold hover:underline inline-flex items-center gap-1"
              >
                Change on Pharmacy Map <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Hero Right Visual / Overview Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-teal-50 to-slate-50 border border-teal-100 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-teal-100/80">
                <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                  Live Stock Status Overview
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 size={12} /> Active Network
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                      Rx
                    </div>
                    <div>
                      <strong className="text-xs text-gray-900 block font-semibold">Dolo 650 (Paracetamol)</strong>
                      <span className="text-[11px] text-gray-500">Apollo Pharmacy · 350m</span>
                    </div>
                  </div>
                  <span className="badge-available">In Stock · ₹35</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                      Rx
                    </div>
                    <div>
                      <strong className="text-xs text-gray-900 block font-semibold">Azithral 500</strong>
                      <span className="text-[11px] text-gray-500">XYZ Pharmacy · 750m</span>
                    </div>
                  </div>
                  <span className="badge-available">In Stock · ₹118</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
                <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                  <span className="text-lg font-bold text-teal-700 block">{pharmacies.length}</span>
                  <span className="text-gray-500 text-[11px]">Partner Chemists</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                  <span className="text-lg font-bold text-teal-700 block">{medicines.length}+</span>
                  <span className="text-gray-500 text-[11px]">Catalog Medicines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
              Quick Filter
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Browse by Health Category
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
          >
            View all medicines <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/search?category=${encodeURIComponent(cat.name)}`}
              className={`p-4 rounded-xl border transition-all hover:shadow-sm flex flex-col justify-between ${cat.color}`}
            >
              <div>
                <strong className="text-sm font-bold block">{cat.name}</strong>
                <span className="text-xs opacity-75 mt-0.5 block">{cat.count} medicines listed</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                <span>Explore</span>
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular In-Demand Medicines */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
              Frequent Prescriptions
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Most Searched Medicines Nearby
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
          >
            See full catalogue <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularMedicines.map((med) => {
            const saved = isMedicineSaved(med.id);
            return (
              <div
                key={med.id}
                className="med-card flex flex-col justify-between hover:border-teal-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      {med.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSaveMedicine(med.id)}
                      className="p-1 text-gray-400 hover:text-rose-500 rounded transition-colors"
                      title={saved ? "Remove from saved" : "Save medicine"}
                    >
                      <Heart
                        size={16}
                        className={saved ? "text-rose-500 fill-rose-500" : ""}
                      />
                    </button>
                  </div>

                  <div
                    onClick={() => navigate(`/medicine/${med.id}`)}
                    className="cursor-pointer space-y-1"
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
                      <Pill size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 hover:text-teal-700">
                      {med.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {med.generic} · {med.strength}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 pt-1 leading-relaxed">
                      {med.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Counter from</span>
                    <span className="text-base font-bold text-gray-900">₹{med.basePrice}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/medicine/${med.id}`)}
                    className="btn-secondary btn-sm"
                  >
                    Check Stock <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
            Simple Workflow
          </span>
          <h2 className="text-2xl font-bold text-gray-900">
            How MedStash Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            A 3-step solution to eliminate the frustration of visiting multiple chemist shops when sick.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-gray-900">Search Any Medicine</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Type the brand name, active chemical molecule, or symptoms to search inventory across pharmacies in your area.
            </p>
          </div>

          <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-gray-900">Compare Prices & Distance</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              See verified store availability, travel distance, customer ratings, and current counter retail prices side by side.
            </p>
          </div>

          <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-gray-900">Free 24-Hour Counter Hold</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Lock your medicine with no prepayment required. Show your digital pickup pass code at the chemist counter and collect.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
          <ShieldCheck size={28} className="text-teal-600 shrink-0" />
          <div className="text-xs">
            <strong className="text-gray-900 font-semibold block">Store Verification</strong>
            <span className="text-gray-500">Simulated demonstration pharmacy profiles</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
          <Clock size={28} className="text-teal-600 shrink-0" />
          <div className="text-xs">
            <strong className="text-gray-900 font-semibold block">Dynamic Stock Checks</strong>
            <span className="text-gray-500">Live store stock and counter price updates</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
          <ShoppingBag size={28} className="text-teal-600 shrink-0" />
          <div className="text-xs">
            <strong className="text-gray-900 font-semibold block">Zero Reservation Fee</strong>
            <span className="text-gray-500">Pay directly at the chemist counter on pickup</span>
          </div>
        </div>
      </section>

      {/* Public Health Notice */}
      <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-start gap-3 text-xs text-gray-600">
        <ShieldCheck size={18} className="text-teal-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-gray-900">Project Disclaimer:</strong> MedStash is an academic software prototype developed for pharmacy stock discovery. It does not sell pharmaceuticals directly. Prescription medications (Rx) strictly require presenting a valid registered medical prescription at the pharmacy counter.
        </div>
      </div>
    </main>
  );
};
