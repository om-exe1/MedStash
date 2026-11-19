import { Medicine, Pharmacy, PharmacyStock } from "../data/mockData";
import { Reservation, UserProfile, NotificationItem } from "../context/AppContext";

const API_BASE = "/api";

export const api = {
  // Medicines
  async getMedicines(params?: { q?: string; category?: string; popular?: boolean }): Promise<Medicine[]> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set("q", params.q);
    if (params?.category && params.category !== "All") searchParams.set("category", params.category);
    if (params?.popular !== undefined) searchParams.set("popular", String(params.popular));

    const res = await fetch(`${API_BASE}/medicines?${searchParams.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch medicines");
    return res.json();
  },

  async getMedicineById(id: string): Promise<Medicine> {
    const res = await fetch(`${API_BASE}/medicines/${id}`);
    if (!res.ok) throw new Error("Failed to fetch medicine");
    return res.json();
  },

  async createMedicine(data: Partial<Medicine>): Promise<Medicine> {
    const res = await fetch(`${API_BASE}/medicines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create medicine");
    return res.json();
  },

  // Pharmacies
  async getPharmacies(coords?: { lat: number; lng: number }): Promise<Pharmacy[]> {
    const url = coords ? `${API_BASE}/pharmacies?lat=${coords.lat}&lng=${coords.lng}` : `${API_BASE}/pharmacies`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch pharmacies");
    return res.json();
  },

  async getNearbyPharmacies(lat: number, lng: number, radius: number = 5.0): Promise<Pharmacy[]> {
    const res = await fetch(`${API_BASE}/pharmacies/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    if (!res.ok) throw new Error("Failed to fetch nearby pharmacies");
    return res.json();
  },

  async updateStock(
    pharmacyId: string,
    medicineId: string,
    data: { status?: string; quantity?: number; price?: number; lastUpdated?: string }
  ): Promise<PharmacyStock> {
    const res = await fetch(`${API_BASE}/pharmacies/${pharmacyId}/inventory/${medicineId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update stock");
    return res.json();
  },

  // Reservations
  async getReservations(pharmacyId?: string): Promise<Reservation[]> {
    const url = pharmacyId ? `${API_BASE}/reservations?pharmacyId=${pharmacyId}` : `${API_BASE}/reservations`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch reservations");
    return res.json();
  },

  async createReservation(data: {
    medicineId: string;
    medicineName: string;
    medicineStrength?: string;
    pharmacyId: string;
    pharmacyName: string;
    pharmacyAddress?: string;
    pharmacyPhone?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    patientName: string;
    patientPhone?: string;
    timeSlot?: string;
  }): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create reservation");
    return res.json();
  },

  async updateReservationStatus(id: string, status: string): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update reservation status");
    return res.json();
  },

  async verifyReservationCode(code: string): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations/verify/${encodeURIComponent(code)}`);
    if (!res.ok) throw new Error("Reservation code not found");
    return res.json();
  },

  // Analytics
  async getAnalyticsSummary(): Promise<{
    totalMedicines: number;
    totalPharmacies: number;
    activeReservations: number;
    completedReservations: number;
    lowStockCount: number;
    outOfStockCount: number;
  }> {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  },

  // Health
  async checkHealth(): Promise<{ status: string; service: string; version: string }> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Backend offline");
    return res.json();
  },

  // Auth
  async login(role: "patient" | "pharmacy_owner", email?: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, email }),
    });
    if (!res.ok) throw new Error("Failed to login");
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  },

  async markNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/mark-read`, { method: "PATCH" });
  },
};
