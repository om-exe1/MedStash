import React, { createContext, useContext, useState, useEffect } from "react";
import { Medicine, Pharmacy, PharmacyStock, medicines, pharmacies as initialPharmacies, mockNotifications } from "../data/mockData";
import { api } from "../services/api";

export interface Reservation {
  id: string;
  code: string;
  medicineId: string;
  medicineName: string;
  medicineStrength: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyPhone: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  pickupDeadline: string;
  patientName: string;
  patientPhone?: string;
  timeSlot: string;
  status: "Confirmed" | "Ready for pickup" | "Picked Up" | "Cancelled";
}

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "error";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  role: "patient" | "pharmacy_owner";
  name: string;
  email: string;
  pharmacyId?: string;
  pharmacyName?: string;
}

interface AppContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  currentUser: UserProfile;
  userLocation: { lat: number; lng: number };
  locationName: string;
  isLocating: boolean;
  detectLiveLocation: (showToast?: boolean) => Promise<boolean>;
  setUserCustomLocation: (coords: { lat: number; lng: number }, name: string) => void;
  medicines: Medicine[];
  loadingMedicines: boolean;
  backendConnected: boolean;
  refreshData: () => Promise<void>;
  addMedicine: (data: Partial<Medicine>) => Promise<Medicine>;
  verifyCode: (code: string) => Promise<Reservation | null>;
  pharmacies: Pharmacy[];
  reservations: Reservation[];
  savedMedicineIds: string[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  toasts: ToastItem[];
  reservationModalTarget: { medicine: Medicine; pharmacy: Pharmacy } | null;
  login: (role: "patient" | "pharmacy_owner", overrides?: Partial<UserProfile>) => void;
  logout: () => void;
  openReservationModal: (medicine: Medicine, pharmacy: Pharmacy) => void;
  closeReservationModal: () => void;
  createReservation: (data: {
    medicine: Medicine;
    pharmacy: Pharmacy;
    quantity: number;
    patientName: string;
    patientPhone?: string;
    timeSlot: string;
  }) => Reservation;
  cancelReservation: (id: string) => void;
  completeReservation: (id: string) => void;
  updatePharmacyStock: (pharmacyId: string, medicineId: string, updates: Partial<PharmacyStock>) => void;
  addMedicineToPharmacy: (pharmacyId: string, medicineId: string, stock: PharmacyStock) => void;
  toggleSaveMedicine: (medicineId: string) => boolean;
  isMedicineSaved: (medicineId: string) => boolean;
  markNotificationsAsRead: () => void;
  addToast: (title: string, message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state with anti-flicker sync
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem("medstash_theme");
      if (stored === "dark" || stored === "light") return stored;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch {}
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("medstash_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Keyboard shortcut: Pressing '/' focuses search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes((document.activeElement?.tagName || ""))
      ) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("medstash-focus-search"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Current user (defaults to patient Om, but can be switched to pharmacy owner)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem("medstash_current_user") || localStorage.getItem("medfinder_current_user");
      if (stored) return JSON.parse(stored);
      return {
        id: "usr-om",
        role: "patient",
        name: "Om",
        email: "om@example.com"
      };
    } catch {
      return {
        id: "usr-om",
        role: "patient",
        name: "Om",
        email: "om@example.com"
      };
    }
  });

  // Stateful pharmacies list for stock updates
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(() => {
    try {
      const stored = localStorage.getItem("medstash_pharmacies_v2") || localStorage.getItem("medfinder_pharmacies_v2");
      if (stored) return JSON.parse(stored);
      return initialPharmacies;
    } catch {
      return initialPharmacies;
    }
  });

  // Load initial reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const stored = localStorage.getItem("medstash_reservations_v2") || localStorage.getItem("medfinder_reservations_v2");
      if (stored) return JSON.parse(stored);
      return [
        {
          id: "res-seed-1",
          code: "RX-19782",
          medicineId: "azithral-500",
          medicineName: "Azithral 500",
          medicineStrength: "500 mg",
          pharmacyId: "xyz-pharmacy",
          pharmacyName: "XYZ Neighborhood Pharmacy",
          pharmacyAddress: "Shop 4, Sunrise Heights, 12th Main, Indiranagar",
          pharmacyPhone: "+91 98450 12384",
          unitPrice: 115,
          quantity: 2,
          totalPrice: 230,
          createdAt: "Today at 10:15 AM",
          pickupDeadline: "Held for 24 hours (Today before 8:00 PM)",
          patientName: "Om",
          patientPhone: "+91 98765 43210",
          timeSlot: "Today before 8:00 PM",
          status: "Ready for pickup"
        },
        {
          id: "res-seed-2",
          code: "RX-84920",
          medicineId: "dolo-650",
          medicineName: "Dolo 650",
          medicineStrength: "650 mg",
          pharmacyId: "xyz-pharmacy",
          pharmacyName: "XYZ Neighborhood Pharmacy",
          pharmacyAddress: "Shop 4, Sunrise Heights, 12th Main, Indiranagar",
          pharmacyPhone: "+91 98450 12384",
          unitPrice: 34,
          quantity: 1,
          totalPrice: 34,
          createdAt: "Yesterday at 6:40 PM",
          pickupDeadline: "Held for 24 hours",
          patientName: "Pooja Sharma",
          patientPhone: "+91 98234 56789",
          timeSlot: "Today morning",
          status: "Ready for pickup"
        }
      ];
    } catch {
      return [];
    }
  });

  // Load saved medicines
  const [savedMedicineIds, setSavedMedicineIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("medstash_saved_medicines") || localStorage.getItem("medfinder_saved_medicines");
      return stored ? JSON.parse(stored) : ["dolo-650", "cetirizine-10"];
    } catch {
      return ["dolo-650", "cetirizine-10"];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [reservationModalTarget, setReservationModalTarget] = useState<{ medicine: Medicine; pharmacy: Pharmacy } | null>(null);

  // User Live Location & Geocoding State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(() => {
    try {
      const stored = localStorage.getItem("medstash_user_coords");
      if (stored) return JSON.parse(stored);
    } catch {}
    return { lat: 12.9716, lng: 77.5946 }; // Default fallback
  });

  const [locationName, setLocationName] = useState<string>(() => {
    try {
      const stored = localStorage.getItem("medstash_location_name");
      if (stored) return stored;
    } catch {}
    return "Detecting live location...";
  });

  const [isLocating, setIsLocating] = useState<boolean>(false);

  const [medicinesList, setMedicinesList] = useState<Medicine[]>(() => {
    try {
      const stored = localStorage.getItem("medstash_medicines_v2");
      return stored ? JSON.parse(stored) : medicines;
    } catch {
      return medicines;
    }
  });
  const [loadingMedicines, setLoadingMedicines] = useState<boolean>(false);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("medstash_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("medstash_pharmacies_v2", JSON.stringify(pharmacies));
  }, [pharmacies]);

  useEffect(() => {
    localStorage.setItem("medstash_reservations_v2", JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem("medstash_saved_medicines", JSON.stringify(savedMedicineIds));
  }, [savedMedicineIds]);

  const refreshData = async () => {
    try {
      const health = await api.checkHealth();
      if (health.status === "online") {
        setBackendConnected(true);
      }
    } catch {
      setBackendConnected(false);
    }

    try {
      setLoadingMedicines(true);
      const meds = await api.getMedicines();
      if (meds && meds.length > 0) {
        setMedicinesList(meds);
        localStorage.setItem("medstash_medicines_v2", JSON.stringify(meds));
      }
    } catch (e) {
      console.warn("Could not load medicines from backend, using cached/mock", e);
    } finally {
      setLoadingMedicines(false);
    }

    try {
      const pharms = await api.getPharmacies();
      if (pharms && pharms.length > 0) {
        setPharmacies(pharms);
      }
    } catch {}

    try {
      const res = await api.getReservations();
      if (res && res.length > 0) {
        setReservations(res);
      }
    } catch {}

    try {
      const notifs = await api.getNotifications();
      if (notifs && notifs.length > 0) {
        setNotifications(notifs);
      }
    } catch {}
  };

  // Initial sync with backend API and auto-detect location
  useEffect(() => {
    refreshData();
    detectLiveLocation(false);
  }, []);

  const detectLiveLocation = async (showToast = true): Promise<boolean> => {
    setIsLocating(true);

    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`
        );
        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};
          const suburb = addr.suburb || addr.neighbourhood || addr.subdivision || addr.residential || addr.quarter || "";
          const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || "";
          if (suburb && city) return `${suburb}, ${city}`;
          if (city) return `${city}, ${addr.state || ""}`.replace(/,\s*$/, "");
          if (data.display_name) return data.display_name.split(",").slice(0, 2).join(",");
        }
      } catch {}
      return `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    };

    const applyLocation = async (lat: number, lng: number, name: string) => {
      setUserLocation({ lat, lng });
      setLocationName(name);
      try {
        localStorage.setItem("medstash_user_coords", JSON.stringify({ lat, lng }));
        localStorage.setItem("medstash_location_name", name);
      } catch {}

      // Fetch live nearby pharmacies around this user's real coordinate
      try {
        const pharms = await api.getNearbyPharmacies(lat, lng, 5.0);
        if (pharms && pharms.length > 0) {
          setPharmacies(pharms);
        }
      } catch (err) {
        console.warn("Could not load pharmacies at detected location", err);
      }
    };

    // 1. Try Browser GPS first
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 9000,
            maximumAge: 60000,
          });
        });

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const name = await reverseGeocode(lat, lng);
        await applyLocation(lat, lng, name);
        setIsLocating(false);
        if (showToast) {
          addToast("Live Location Found", `Detected: ${name}. Updated nearby pharmacy stores!`, "success");
        }
        return true;
      } catch (gpsError) {
        console.info("GPS prompt dismissed/timed out, attempting IP location fallback...", gpsError);
      }
    }

    // 2. IP-based location fallback if GPS is blocked or timed out
    try {
      const ipRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        const lat = parseFloat(ipData.latitude);
        const lng = parseFloat(ipData.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          const parts = [ipData.city, ipData.region, ipData.country].filter(Boolean);
          const name = parts.slice(0, 2).join(", ") || "Detected Region";
          await applyLocation(lat, lng, name);
          setIsLocating(false);
          if (showToast) {
            addToast("Location Detected", `Set to ${name} via network.`, "info");
          }
          return true;
        }
      }
    } catch (ipError) {
      console.warn("IP geolocation fallback also failed", ipError);
    }

    setIsLocating(false);
    if (showToast) {
      addToast("Location Not Available", "Could not detect GPS. You can choose your area on the Pharmacy Map.", "info");
    }
    return false;
  };

  const setUserCustomLocation = async (coords: { lat: number; lng: number }, name: string) => {
    setUserLocation(coords);
    setLocationName(name);
    try {
      localStorage.setItem("medstash_user_coords", JSON.stringify(coords));
      localStorage.setItem("medstash_location_name", name);
    } catch {}
    try {
      const pharms = await api.getNearbyPharmacies(coords.lat, coords.lng, 5.0);
      if (pharms && pharms.length > 0) {
        setPharmacies(pharms);
      }
    } catch {}
  };

  const addToast = (title: string, message: string, type: "success" | "info" | "error" = "success") => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (role: "patient" | "pharmacy_owner", overrides?: Partial<UserProfile>) => {
    if (role === "pharmacy_owner") {
      const ownerUser: UserProfile = {
        id: "owner-xyz",
        role: "pharmacy_owner",
        name: overrides?.name || "Rajesh Gupta",
        email: overrides?.email || "rajesh@xyzpharmacy.com",
        pharmacyId: overrides?.pharmacyId || "xyz-pharmacy",
        pharmacyName: overrides?.pharmacyName || "XYZ Neighborhood Pharmacy"
      };
      setCurrentUser(ownerUser);
      addToast("Chemist Portal Active", `Logged in as ${ownerUser.name} (${ownerUser.pharmacyName})`, "success");
    } else {
      const patientUser: UserProfile = {
        id: "usr-om",
        role: "patient",
        name: overrides?.name || "Om",
        email: overrides?.email || "om@example.com"
      };
      setCurrentUser(patientUser);
      addToast("Patient Profile Active", `Logged in as ${patientUser.name}`, "success");
    }
  };

  const logout = () => {
    const defaultPatient: UserProfile = {
      id: "usr-om",
      role: "patient",
      name: "Om",
      email: "om@example.com"
    };
    setCurrentUser(defaultPatient);
    addToast("Logged Out", "Switched to standard patient session.", "info");
  };

  const openReservationModal = (medicine: Medicine, pharmacy: Pharmacy) => {
    setReservationModalTarget({ medicine, pharmacy });
  };

  const closeReservationModal = () => {
    setReservationModalTarget(null);
  };

  const createReservation = ({
    medicine,
    pharmacy,
    quantity,
    patientName,
    patientPhone,
    timeSlot
  }: {
    medicine: Medicine;
    pharmacy: Pharmacy;
    quantity: number;
    patientName: string;
    patientPhone?: string;
    timeSlot: string;
  }): Reservation => {
    const unitPrice = pharmacy.inventory[medicine.id]?.price ?? medicine.basePrice;
    const code = "RX-" + Math.floor(10000 + Math.random() * 90000);
    const newReservation: Reservation = {
      id: "res-" + Date.now(),
      code,
      medicineId: medicine.id,
      medicineName: medicine.name,
      medicineStrength: medicine.strength,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      pharmacyAddress: pharmacy.address,
      pharmacyPhone: pharmacy.phone,
      unitPrice,
      quantity,
      totalPrice: unitPrice * quantity,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      pickupDeadline: "Held for 24 hours (" + timeSlot + ")",
      patientName: patientName || currentUser.name || "Om",
      patientPhone: patientPhone || "+91 98765 43210",
      timeSlot,
      status: "Confirmed"
    };

    setReservations((prev) => [newReservation, ...prev]);
    addToast(
      "Medicine Reserved! " + code,
      `${quantity}x ${medicine.name} held at ${pharmacy.name}. Pick up today!`,
      "success"
    );
    closeReservationModal();

    // Async sync with backend
    api.createReservation({
      medicineId: medicine.id,
      medicineName: medicine.name,
      medicineStrength: medicine.strength,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      pharmacyAddress: pharmacy.address,
      pharmacyPhone: pharmacy.phone,
      unitPrice,
      quantity,
      totalPrice: unitPrice * quantity,
      patientName: patientName || currentUser.name || "Om",
      patientPhone: patientPhone || "+91 98765 43210",
      timeSlot,
    }).catch(() => {});

    return newReservation;
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Cancelled" as const } : r))
    );
    api.updateReservationStatus(id, "Cancelled").catch(() => {});
    addToast("Reservation Cancelled", "The reservation hold has been released.", "info");
  };

  const completeReservation = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (!res) return;

    // Update reservation status to Picked Up
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Picked Up" as const } : r))
    );
    api.updateReservationStatus(id, "Picked Up").catch(() => {});

    // Decrement pharmacy inventory stock
    setPharmacies((prev) =>
      prev.map((p) => {
        if (p.id !== res.pharmacyId) return p;
        const currentStock = p.inventory[res.medicineId];
        if (!currentStock) return p;

        const newQty = Math.max(0, currentStock.quantity - res.quantity);
        const newStatus: "Available" | "Low stock" | "Out of stock" =
          newQty === 0 ? "Out of stock" : newQty < 5 ? "Low stock" : "Available";

        return {
          ...p,
          inventory: {
            ...p.inventory,
            [res.medicineId]: {
              ...currentStock,
              quantity: newQty,
              status: newStatus,
              lastUpdated: "Just now"
            }
          }
        };
      })
    );

    addToast(
      "Medication Dispensed!",
      `Pass ${res.code} verified. ${res.quantity}x ${res.medicineName} handed over to ${res.patientName}.`,
      "success"
    );
  };

  // Pharmacy stock update (for owner dashboard)
  const updatePharmacyStock = (
    pharmacyId: string,
    medicineId: string,
    updates: Partial<PharmacyStock>
  ) => {
    setPharmacies((prev) =>
      prev.map((p) => {
        if (p.id !== pharmacyId) return p;
        const existing = p.inventory[medicineId] || {
          price: 35,
          quantity: 10,
          status: "Available",
          lastUpdated: "Just now"
        };
        const updatedStock: PharmacyStock = {
          ...existing,
          ...updates,
          lastUpdated: "Just now"
        };
        return {
          ...p,
          inventory: {
            ...p.inventory,
            [medicineId]: updatedStock
          }
        };
      })
    );

    const med = medicines.find((m) => m.id === medicineId);
    api.updateStock(pharmacyId, medicineId, updates).catch(() => {});
    addToast(
      "Stock Updated",
      `${med?.name || "Medicine"} updated to ${updates.status || "new quantity/price"}.`,
      "success"
    );
  };

  const addMedicineToPharmacy = (
    pharmacyId: string,
    medicineId: string,
    stock: PharmacyStock
  ) => {
    setPharmacies((prev) =>
      prev.map((p) => {
        if (p.id !== pharmacyId) return p;
        return {
          ...p,
          inventory: {
            ...p.inventory,
            [medicineId]: {
              ...stock,
              lastUpdated: "Just now"
            }
          }
        };
      })
    );

    const med = medicines.find((m) => m.id === medicineId);
    api.updateStock(pharmacyId, medicineId, {
      status: stock.status,
      quantity: stock.quantity,
      price: stock.price,
      lastUpdated: "Just now"
    }).catch(() => {});
    addToast(
      "Medicine Added to Store",
      `${med?.name || "Medicine"} added to your pharmacy stock catalog.`,
      "success"
    );
  };

  const toggleSaveMedicine = (medicineId: string): boolean => {
    const exists = savedMedicineIds.includes(medicineId);
    if (exists) {
      setSavedMedicineIds((prev) => prev.filter((id) => id !== medicineId));
      addToast("Removed from Saved", "Medicine removed from your saved list.", "info");
      return false;
    } else {
      setSavedMedicineIds((prev) => [...prev, medicineId]);
      addToast("Saved to Favorites", "You can quickly track and reserve this from your dashboard.", "success");
      return true;
    }
  };

  const isMedicineSaved = (medicineId: string) => savedMedicineIds.includes(medicineId);

  const addMedicine = async (data: Partial<Medicine>): Promise<Medicine> => {
    try {
      const created = await api.createMedicine(data);
      setMedicinesList((prev) => [created, ...prev]);
      addToast("Medicine Added", `${created.name} was added to the live catalog.`, "success");
      return created;
    } catch {
      const fallback: Medicine = {
        id: (data.name || "new-med").toLowerCase().replace(/\s+/g, "-"),
        name: data.name || "Unknown Medicine",
        generic: data.generic || "Generic Name",
        form: data.form || "Tablet",
        strength: data.strength || "500 mg",
        category: (data.category as any) || "Pain relief",
        prescriptionRequired: !!data.prescriptionRequired,
        basePrice: data.basePrice || 30,
        description: data.description || "Medication details",
        uses: data.uses || ["General therapeutic use"],
        dosage: data.dosage || "As prescribed",
        sideEffects: data.sideEffects || [],
        storage: data.storage || "Store below 25°C",
        popular: false
      };
      setMedicinesList((prev) => [fallback, ...prev]);
      addToast("Medicine Added", `${fallback.name} added to catalog.`, "info");
      return fallback;
    }
  };

  const verifyCode = async (code: string): Promise<Reservation | null> => {
    try {
      const result = await api.verifyReservationCode(code);
      return result;
    } catch {
      const clean = code.trim().toLowerCase();
      const local = reservations.find((r) => r.code.toLowerCase().includes(clean) || r.id.toLowerCase().includes(clean));
      return local || null;
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        userLocation,
        locationName,
        isLocating,
        detectLiveLocation,
        setUserCustomLocation,
        medicines: medicinesList,
        loadingMedicines,
        backendConnected,
        refreshData,
        addMedicine,
        verifyCode,
        pharmacies,
        reservations,
        savedMedicineIds,
        notifications,
        unreadNotifsCount,
        toasts,
        reservationModalTarget,
        login,
        logout,
        openReservationModal,
        closeReservationModal,
        createReservation,
        cancelReservation,
        completeReservation,
        updatePharmacyStock,
        addMedicineToPharmacy,
        toggleSaveMedicine,
        isMedicineSaved,
        markNotificationsAsRead,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
