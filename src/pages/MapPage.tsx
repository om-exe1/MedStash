import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  Phone,
  ArrowRight,
  LocateFixed,
  Navigation,
  Search,
  List,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import { Pharmacy, Medicine } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";

export const MapPage: React.FC = () => {
  const {
    medicines,
    pharmacies: defaultPharmacies,
    openReservationModal,
    addToast,
    userLocation,
    locationName,
    isLocating,
    detectLiveLocation,
    setUserCustomLocation
  } = useApp();

  // Map state
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  const [isLoadingStores, setIsLoadingStores] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchRadius, setSearchRadius] = useState<number>(5.0);

  // Stores & Selection
  const [nearbyPharmacies, setNearbyPharmacies] = useState<Pharmacy[]>(defaultPharmacies);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(defaultPharmacies[0] || null);
  const [filterMode, setFilterMode] = useState<"all" | "open24" | "verified">("all");

  // Keep stores in sync with AppContext nearby pharmacies
  useEffect(() => {
    if (defaultPharmacies && defaultPharmacies.length > 0) {
      setNearbyPharmacies(defaultPharmacies);
      if (!selectedPharmacy || !defaultPharmacies.some(p => p.id === selectedPharmacy.id)) {
        setSelectedPharmacy(defaultPharmacies[0]);
      }
    }
  }, [defaultPharmacies]);

  // Selected medicine for price comparison on map markers
  const [activeMedicineId, setActiveMedicineId] = useState<string>(medicines[0]?.id || "dolo-650");
  const activeMedicine = medicines.find((m) => m.id === activeMedicineId) || medicines[0];

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 14,
      zoomControl: false,
    });

    // High quality OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Fix map sizing after render
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Fetch nearby pharmacies when location or radius changes
  const fetchPharmaciesAtLocation = async (lat: number, lng: number, radius: number = searchRadius) => {
    setIsLoadingStores(true);
    try {
      const data = await api.getNearbyPharmacies(lat, lng, radius);
      if (data && data.length > 0) {
        setNearbyPharmacies(data);
        setSelectedPharmacy(data[0]);
      } else {
        // Fallback to default pharmacies with recalculated distances
        setNearbyPharmacies(defaultPharmacies);
        if (defaultPharmacies.length > 0) setSelectedPharmacy(defaultPharmacies[0]);
      }
    } catch (err) {
      console.warn("Could not fetch Overpass pharmacies, using active catalog", err);
      setNearbyPharmacies(defaultPharmacies);
      if (defaultPharmacies.length > 0) setSelectedPharmacy(defaultPharmacies[0]);
    } finally {
      setIsLoadingStores(false);
    }
  };

  // 3. User GPS Geolocation handler - triggers global live location tracking
  const handleLocateMe = async () => {
    await detectLiveLocation(true);
  };

  // Smoothly pan map when userLocation updates
  useEffect(() => {
    if (mapInstanceRef.current && userLocation.lat && userLocation.lng) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.2 });
    }
  }, [userLocation.lat, userLocation.lng]);

  // 4. Search area by text (using OpenStreetMap Nominatim Geocoder)
  const handleSearchAreaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsLoadingStores(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&limit=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const targetLat = parseFloat(data[0].lat);
          const targetLng = parseFloat(data[0].lon);
          const friendlyName = data[0].display_name.split(",").slice(0, 2).join(",");
          setUserCustomLocation({ lat: targetLat, lng: targetLng }, friendlyName);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([targetLat, targetLng], 14, { duration: 1.2 });
          }

          addToast("Area Located", `Showing pharmacies around ${data[0].display_name.split(",")[0]}.`, "success");
        } else {
          addToast("Area Not Found", "Could not locate that neighborhood. Try another city or locality.", "error");
        }
      }
    } catch {
      addToast("Search Error", "Could not connect to geocoding service.", "error");
    } finally {
      setIsLoadingStores(false);
    }
  };

  // 5. Update Map Markers and User Location Pin
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // User location pulsing marker
    const userPulseIcon = L.divIcon({
      className: "custom-user-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-6 h-6 rounded-full bg-teal-500/30 animate-ping absolute"></div>
          <div class="w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-lg relative z-10"></div>
          <span class="absolute top-5 bg-teal-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">You are here</span>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userPulseIcon,
        zIndexOffset: 1000,
      }).addTo(markersLayer);
    }

    // Radius circle overlay
    if (radiusCircleRef.current) {
      radiusCircleRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      radiusCircleRef.current.setRadius(searchRadius * 1000);
    } else {
      radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
        radius: searchRadius * 1000,
        color: "#0d9488",
        fillColor: "#0d9488",
        fillOpacity: 0.05,
        weight: 1.5,
        dashArray: "4, 6",
      }).addTo(markersLayer);
    }

    // Filter pharmacies
    const displayedPharmacies = nearbyPharmacies.filter((p) => {
      if (filterMode === "open24") return p.openStatus.includes("24");
      if (filterMode === "verified") return p.verified;
      return true;
    });

    // Pharmacy markers
    displayedPharmacies.forEach((pharmacy) => {
      const pLat = pharmacy.lat || userLocation.lat + 0.005;
      const pLng = pharmacy.lng || userLocation.lng + 0.005;
      const isSelected = selectedPharmacy?.id === pharmacy.id;

      // Price for active medicine
      const price = pharmacy.inventory[activeMedicineId]?.price ?? activeMedicine?.basePrice ?? 35;
      const stock = pharmacy.inventory[activeMedicineId]?.status || "Available";
      const isOutOfStock = stock === "Out of stock";

      const markerHtml = `
        <div class="cursor-pointer transition-transform duration-200 transform hover:scale-110 flex flex-col items-center">
          <div class="px-2 py-1 rounded-md text-xs font-bold shadow-lg border flex items-center gap-1 ${
            isSelected
              ? "bg-teal-600 text-white border-teal-700 ring-4 ring-teal-200"
              : isOutOfStock
              ? "bg-gray-100 text-gray-500 border-gray-300"
              : "bg-white text-gray-900 border-teal-400 hover:bg-teal-50"
          }">
            <span>${isOutOfStock ? "Sold Out" : `₹${price}`}</span>
          </div>
          <span class="text-[10px] font-semibold text-gray-800 bg-white/95 px-1.5 py-0.5 rounded shadow-xs mt-0.5 max-w-[120px] truncate border border-gray-200">
            ${pharmacy.name}
          </span>
        </div>
      `;

      const storeIcon = L.divIcon({
        className: "custom-store-marker",
        html: markerHtml,
        iconSize: [80, 40],
        iconAnchor: [40, 20],
      });

      const marker = L.marker([pLat, pLng], { icon: storeIcon, zIndexOffset: isSelected ? 500 : 100 })
        .addTo(markersLayer)
        .on("click", () => {
          setSelectedPharmacy(pharmacy);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo([pLat, pLng]);
          }
        });
    });
  }, [userLocation, nearbyPharmacies, selectedPharmacy, filterMode, activeMedicineId, searchRadius]);

  const handleReserve = (pharmacy: Pharmacy) => {
    openReservationModal(activeMedicine, pharmacy);
  };

  const filteredPharmacies = nearbyPharmacies.filter((p) => {
    if (filterMode === "open24") return p.openStatus.includes("24");
    if (filterMode === "verified") return p.verified;
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Location Controls */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              Live Location Services
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Real-Time Stock Radar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Neighborhood Pharmacy Map
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5">
            <MapPin size={14} className="text-teal-600 shrink-0" />
            <span>Currently focused on: <strong>{locationName}</strong></span>
            {isLoadingStores && <RefreshCw size={13} className="animate-spin text-teal-600 ml-1" />}
          </p>
        </div>

        {/* GPS Locate Button & Search Form */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <form onSubmit={handleSearchAreaSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search area (e.g. Indiranagar, Mumbai)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-16 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-teal-500 w-full sm:w-64"
            />
            <Search size={14} className="absolute left-2.5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-1 px-2 py-1 text-[11px] font-semibold bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Search
            </button>
          </form>

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="btn-primary text-xs py-2 px-3 inline-flex items-center justify-center gap-1.5 font-semibold"
            title="Detect GPS coordinates and search nearby stores"
          >
            <LocateFixed size={14} className={isLocating ? "animate-spin" : ""} />
            {isLocating ? "Detecting GPS..." : "Locate My Position"}
          </button>
        </div>
      </div>

      {/* Control Bar: Filters & Medicine Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
        {/* Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterMode === "all"
                ? "bg-teal-600 text-white font-semibold shadow-xs"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Stores ({nearbyPharmacies.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterMode("open24")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1 ${
              filterMode === "open24"
                ? "bg-teal-600 text-white font-semibold shadow-xs"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Clock size={12} /> Open 24/7
          </button>

          <button
            type="button"
            onClick={() => setFilterMode("verified")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1 ${
              filterMode === "verified"
                ? "bg-teal-600 text-white font-semibold shadow-xs"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ShieldCheck size={12} /> Verified Stores
          </button>
        </div>

        {/* Medicine Price Tracker & Radius Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>Tracking Pin Price:</span>
            <select
              value={activeMedicineId}
              onChange={(e) => setActiveMedicineId(e.target.value)}
              className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-semibold text-gray-900"
            >
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.strength})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>Radius:</span>
            <select
              value={searchRadius}
              onChange={(e) => {
                const r = parseFloat(e.target.value);
                setSearchRadius(r);
                fetchPharmaciesAtLocation(userLocation.lat, userLocation.lng, r);
              }}
              className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-semibold text-gray-900"
            >
              <option value="2.0">2 km</option>
              <option value="5.0">5 km</option>
              <option value="10.0">10 km</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map + Store Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leaflet Real Interactive Map */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative">
          <div
            ref={mapContainerRef}
            className="w-full relative z-10"
            style={{ height: "540px" }}
          />

          {/* Map Overlay Indicator */}
          <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-xs border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
            <span className="font-semibold text-gray-800">
              {filteredPharmacies.length} Stores Found in {searchRadius} km
            </span>
          </div>
        </div>

        {/* Selected Pharmacy Detail Panel */}
        <div className="lg:col-span-4 space-y-4">
          {selectedPharmacy ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              {/* Header Details */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-base font-bold text-gray-900 leading-tight">
                      {selectedPharmacy.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {selectedPharmacy.address}
                  </p>
                </div>
                {selectedPharmacy.verified && (
                  <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1 shrink-0">
                    <ShieldCheck size={11} className="text-teal-600" /> Verified
                  </span>
                )}
              </div>

              {/* Status and Rating Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                  <Clock size={16} className="text-teal-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Timings</span>
                    <span className="font-semibold text-gray-800 text-xs">
                      {selectedPharmacy.openStatus}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Rating</span>
                    <span className="font-semibold text-gray-800 text-xs">
                      {selectedPharmacy.rating} ★ ({selectedPharmacy.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Distance from User GPS */}
              <div className="flex items-center justify-between text-xs px-3 py-2 bg-teal-50/60 rounded-xl border border-teal-100">
                <span className="text-teal-800 font-medium flex items-center gap-1">
                  <Navigation size={13} className="text-teal-600" /> Real-time Proximity
                </span>
                <span className="font-bold text-teal-900">
                  {selectedPharmacy.distanceText || `${selectedPharmacy.distance} km away`}
                </span>
              </div>

              {/* Live Medicine Stock at this Pharmacy */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  Live Counter Inventory
                </h4>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {medicines.slice(0, 5).map((med) => {
                    const stock = selectedPharmacy.inventory[med.id] || {
                      status: "Available",
                      price: med.basePrice,
                      quantity: 15,
                    };
                    const isAvailable = stock.status !== "Out of stock";

                    return (
                      <div
                        key={med.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-gray-900 block truncate">
                            {med.name}
                          </span>
                          <span className="text-[10px] text-gray-500 block truncate">
                            {med.strength} · {med.generic}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-gray-900 block text-xs">
                            ₹{stock.price}
                          </span>
                          <span
                            className={`text-[10px] font-semibold ${
                              isAvailable ? "text-emerald-600" : "text-rose-500"
                            }`}
                          >
                            {stock.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleReserve(selectedPharmacy)}
                  className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag size={14} /> Reserve Medicine for Counter Pickup
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPharmacy.lat || userLocation.lat},${selectedPharmacy.lng || userLocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-xs py-2 flex items-center justify-center gap-1 text-center"
                  >
                    <ExternalLink size={12} /> Directions
                  </a>

                  <a
                    href={`tel:${selectedPharmacy.phone}`}
                    className="btn-outline text-xs py-2 flex items-center justify-center gap-1 text-center"
                  >
                    <Phone size={12} /> Call Store
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 space-y-2">
              <MapPin size={32} className="mx-auto text-gray-300" />
              <p className="text-xs">Click on any pharmacy marker on the map to see its live stock and reserve.</p>
            </div>
          )}

          {/* Quick List of all nearby stores */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Nearby Stores Directory ({filteredPharmacies.length})
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredPharmacies.map((p) => {
                const isSelected = selectedPharmacy?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPharmacy(p);
                      if (mapInstanceRef.current && p.lat && p.lng) {
                        mapInstanceRef.current.panTo([p.lat, p.lng]);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 truncate">{p.name}</span>
                      <span className="text-teal-700 font-semibold text-[11px] shrink-0">
                        {p.distanceText || `${p.distance} km`}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{p.address}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
