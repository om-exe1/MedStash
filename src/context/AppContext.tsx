import React, { createContext, useContext, useState, useEffect } from "react";
import { Medicine, Pharmacy, PharmacyStock, medicines, pharmacies as initialPharmacies, mockNotifications } from "../data/mockData";

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
    return newReservation;
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Cancelled" as const } : r))
    );
    addToast("Reservation Cancelled", "The reservation hold has been released.", "info");
  };

  const completeReservation = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (!res) return;

    // Update reservation status to Picked Up
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Picked Up" as const } : r))
    );

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
