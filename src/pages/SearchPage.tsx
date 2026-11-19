import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  RotateCcw,
  SlidersHorizontal,
  Pill,
  Heart,
  ArrowRight,
  AlertCircle,
  MapPin,
  LocateFixed
} from "lucide-react";
import { SearchBox } from "../components/SearchBox";
import { PharmacyCard } from "../components/PharmacyCard";
import { Medicine, Pharmacy } from "../data/mockData";
import { useApp } from "../context/AppContext";

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    medicines,
    pharmacies,
    isMedicineSaved,
    toggleSaveMedicine,
    addToast,
    userLocation,
    locationName,
    isLocating,
    detectLiveLocation
  } = useApp();

  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "All";

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [maxDistance, setMaxDistance] = useState<number>(15.0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [prescriptionType, setPrescriptionType] = useState<"all" | "otc" | "rx">("all");
  const [sortBy, setSortBy] = useState<"best" | "price" | "distance" | "rating">("best");

  // Keep state synced with URL changes
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  const categories = [
    "All",
    "Rare & Orphan",
    "Pain relief",
    "Antibiotic",
    "Allergy",
    "Cardiac",
    "Diabetes",
    "Oncology",
    "Immunology",
    "Neurology",
    "Respiratory",
    "Digestive"
  ];

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    setSearchParams(newParams);
  };

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    const q = urlQuery.trim().toLowerCase();
    return medicines.filter((m) => {
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.generic.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.uses.some((u) => u.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === "All" || m.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesRx =
        prescriptionType === "all" ||
        (prescriptionType === "otc" && !m.prescriptionRequired) ||
        (prescriptionType === "rx" && m.prescriptionRequired);

      return matchesQuery && matchesCat && matchesRx;
    });
  }, [urlQuery, selectedCategory, prescriptionType]);

  // Focused medicine
  const [focusedMedicineId, setFocusedMedicineId] = useState<string | null>(null);

  useEffect(() => {
    if (filteredMedicines.length > 0) {
      if (!focusedMedicineId || !filteredMedicines.some((m) => m.id === focusedMedicineId)) {
        setFocusedMedicineId(filteredMedicines[0].id);
      }
    } else {
      setFocusedMedicineId(null);
    }
  }, [filteredMedicines, focusedMedicineId]);

  const currentMedicine = medicines.find((m) => m.id === focusedMedicineId) || filteredMedicines[0] || medicines[0];

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Matching pharmacies offering this medicine
  const matchingPharmacies = useMemo(() => {
    if (!currentMedicine) return [];
    return pharmacies
      .map((p) => {
        const computedDist =
          p.lat && p.lng && userLocation
            ? calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng)
            : p.distance;
        return {
          ...p,
          distance: computedDist,
          distanceText: `${computedDist} km away`
        };
      })
      .filter((p) => {
        if (p.distance > maxDistance) return false;
        if (inStockOnly) {
          const stock = p.inventory[currentMedicine.id];
          if (!stock || stock.status !== "Available") return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.inventory[currentMedicine.id]?.price || 999;
        const priceB = b.inventory[currentMedicine.id]?.price || 999;
        if (sortBy === "price") return priceA - priceB;
        if (sortBy === "distance") return a.distance - b.distance;
        if (sortBy === "rating") return b.rating - a.rating;
        return a.distance - b.distance;
      });
  }, [maxDistance, inStockOnly, sortBy, currentMedicine, pharmacies, userLocation]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setMaxDistance(15.0);
    setInStockOnly(false);
    setPrescriptionType("all");
    setSortBy("best");
    setSearchParams(new URLSearchParams());
    if (filteredMedicines.length > 0) {
      setFocusedMedicineId(filteredMedicines[0].id);
    }
    addToast("Filters Reset", "Search distance set to 15 km, showing all available medicines.", "info");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
            Medicine Search
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Find & Compare Medicine Stocks
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Check local pharmacy availability, retail prices, and reserve online.
          </p>
        </div>

        <div className="max-w-3xl">
          <SearchBox
            defaultValue={urlQuery}
            placeholder="Search medicine (e.g. Paracetamol), generic molecule, or symptom..."
            onSearchSubmit={(q) => {
              const newParams = new URLSearchParams(searchParams);
              if (q) newParams.set("q", q);
              else newParams.delete("q");
              setSearchParams(newParams);
            }}
          />
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white font-semibold"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900">
              <SlidersHorizontal size={16} className="text-teal-600" />
              <span>Filter Results</span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-teal-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>

          {/* Maximum Distance */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
              <span>Max Distance</span>
              <span className="text-teal-700 font-bold">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25.0"
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>0.5 km</span>
              <span>10 km</span>
              <span>25 km</span>
            </div>
          </div>

          {/* Stock Filter Checkbox */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-gray-700 block">Availability</span>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 accent-teal-600"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Prescription Type */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-gray-700 block">Prescription Required</span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg text-center font-medium">
              {(["all", "otc", "rx"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPrescriptionType(t)}
                  className={`py-1 rounded text-xs transition-colors ${
                    prescriptionType === t
                      ? "bg-white text-gray-900 font-bold shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Results Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm text-xs">
            <div className="text-gray-600">
              Showing <strong className="text-gray-900">{filteredMedicines.length}</strong> matching medicines
              {urlQuery && <span> for "<strong>{urlQuery}</strong>"</span>}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-gray-500 shrink-0">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="best">Best Match</option>
                <option value="price">Lowest Price</option>
                <option value="distance">Nearest Distance</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {filteredMedicines.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Pill size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">No Medicines Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No medications matched your search keywords or filter criteria. Try resetting your filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-primary btn-sm mx-auto"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Medicine Selector Pills */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-700 block">
                  Select a medicine to view local pharmacy stock:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {filteredMedicines.map((med) => {
                    const isSelected = med.id === currentMedicine?.id;
                    return (
                      <button
                        key={med.id}
                        type="button"
                        onClick={() => setFocusedMedicineId(med.id)}
                        className={`px-3.5 py-2 rounded-xl text-left border transition-all shrink-0 text-xs ${
                          isSelected
                            ? "border-teal-600 bg-teal-50/70 text-teal-900 font-semibold ring-1 ring-teal-500"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{med.name}</span>
                          <span className={`text-[10px] px-1 py-0.2 rounded font-normal ${med.prescriptionRequired ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
                            {med.prescriptionRequired ? "Rx" : "OTC"}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {med.generic} · from ₹{med.basePrice}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Medicine Highlight Card */}
              {currentMedicine && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {currentMedicine.category}
                        </span>
                        {currentMedicine.prescriptionRequired ? (
                          <span className="badge-rx">Rx Required</span>
                        ) : (
                          <span className="badge-otc">Over-the-Counter</span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {currentMedicine.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        Active Ingredient: <strong>{currentMedicine.generic}</strong> ({currentMedicine.strength}) · Form: {currentMedicine.form}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/medicine/${currentMedicine.id}`}
                        className="btn-secondary btn-sm"
                      >
                        Clinical Details <ArrowRight size={12} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleSaveMedicine(currentMedicine.id)}
                        className="btn-outline btn-sm"
                      >
                        <Heart
                          size={14}
                          className={isMedicineSaved(currentMedicine.id) ? "text-rose-500 fill-rose-500" : ""}
                        />
                        {isMedicineSaved(currentMedicine.id) ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {currentMedicine.description}
                  </p>
                </div>
              )}

              {/* Pharmacies Carrying This Medicine */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">
                    Pharmacies Carrying {currentMedicine?.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {matchingPharmacies.length} {matchingPharmacies.length === 1 ? "store" : "stores"} within {maxDistance} km
                  </span>
                </div>

                {matchingPharmacies.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center space-y-3 text-xs">
                    <AlertCircle size={26} className="text-amber-500 mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">No Stores Found Within {maxDistance} km</h4>
                      <p className="text-gray-500 mt-1 max-w-md mx-auto">
                        No pharmacies around <strong>{locationName}</strong> currently match these filters.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="btn-primary btn-sm inline-flex items-center gap-1.5"
                      >
                        <RotateCcw size={13} /> Reset Filters & Expand to 15 km
                      </button>
                      <button
                        type="button"
                        onClick={() => detectLiveLocation(true)}
                        disabled={isLocating}
                        className="btn-secondary btn-sm inline-flex items-center gap-1.5"
                      >
                        <LocateFixed size={13} className={isLocating ? "animate-spin" : ""} />
                        {isLocating ? "Locating..." : "Detect Live GPS"}
                      </button>
                      <Link to="/map" className="btn-outline btn-sm inline-flex items-center gap-1.5">
                        <MapPin size={13} /> View on Map
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matchingPharmacies.map((pharmacy, index) => (
                      <PharmacyCard
                        key={pharmacy.id}
                        pharmacy={pharmacy}
                        medicine={currentMedicine}
                        bestMatch={index === 0 && sortBy === "best"}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};
