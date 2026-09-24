import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Pill,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Search,
  Plus,
  Phone,
  QrCode,
  ShieldCheck,
  TrendingUp,
  User,
  PackageCheck,
  BadgeAlert,
  X,
  ExternalLink
} from "lucide-react";
import { useApp, Reservation } from "../context/AppContext";
import { medicines, Medicine, PharmacyStock, Pharmacy } from "../data/mockData";

export const PharmacyOwnerDashboard: React.FC = () => {
  const {
    currentUser,
    pharmacies,
    reservations,
    updatePharmacyStock,
    addMedicineToPharmacy,
    completeReservation,
    cancelReservation,
    createReservation,
    addToast
  } = useApp();

  const currentPharmacyId = currentUser.pharmacyId || "xyz-pharmacy";
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>(currentPharmacyId);

  const pharmacy = pharmacies.find((p) => p.id === selectedPharmacyId) || pharmacies[0];

  const [activeTab, setActiveTab] = useState<"inventory" | "patients" | "walkin">("inventory");

  // Inventory search & filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Available" | "Low stock" | "Out of stock">("all");

  // Pass code verification
  const [verifyCodeInput, setVerifyCodeInput] = useState<string>("");
  const [verifiedReservation, setVerifiedReservation] = useState<Reservation | null>(null);

  // Add Medicine Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedMedToAdd, setSelectedMedToAdd] = useState<string>("");
  const [addQuantity, setAddQuantity] = useState<number>(25);
  const [addPrice, setAddPrice] = useState<number>(40);
  const [addStatus, setAddStatus] = useState<"Available" | "Low stock">("Available");

  // Walk-in Form
  const [walkinName, setWalkinName] = useState<string>("");
  const [walkinPhone, setWalkinPhone] = useState<string>("");
  const [walkinMedId, setWalkinMedId] = useState<string>(medicines[0]?.id || "dolo-650");
  const [walkinQty, setWalkinQty] = useState<number>(1);

  // Filtered inventory list
  const storeInventoryList = useMemo(() => {
    return Object.entries(pharmacy.inventory)
      .map(([medId, stock]) => {
        const med = medicines.find((m) => m.id === medId);
        return {
          medicineId: medId,
          medicine: med,
          stock
        };
      })
      .filter((item) => {
        if (!item.medicine) return false;
        const matchesQuery =
          !searchQuery ||
          item.medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.medicine.generic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.medicine.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || item.stock.status === statusFilter;
        return matchesQuery && matchesStatus;
      });
  }, [pharmacy.inventory, searchQuery, statusFilter]);

  // Reservations targeting this specific pharmacy
  const storeReservations = reservations.filter((r) => r.pharmacyId === pharmacy.id);
  const pendingReservations = storeReservations.filter((r) => r.status === "Confirmed" || r.status === "Ready for pickup");
  const completedReservations = storeReservations.filter((r) => r.status === "Picked Up");

  const totalItemsCount = Object.keys(pharmacy.inventory).length;
  const lowStockCount = Object.values(pharmacy.inventory).filter(
    (s) => s.status === "Low stock" || s.quantity <= 5
  ).length;
  const pendingValue = pendingReservations.reduce((sum, r) => sum + r.totalPrice, 0);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = verifyCodeInput.trim().toUpperCase();
    const found = reservations.find((r) => r.code.toUpperCase() === clean);
    if (found) {
      setVerifiedReservation(found);
      addToast("Pass Verified", `Matched patient: ${found.patientName} (${found.medicineName})`, "success");
    } else {
      setVerifiedReservation(null);
      addToast("Not Found", `No active reservation found for code "${verifyCodeInput}"`, "error");
    }
  };

  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedToAdd) return;
    addMedicineToPharmacy(pharmacy.id, selectedMedToAdd, {
      price: addPrice,
      quantity: addQuantity,
      status: addStatus,
      lastUpdated: "Just now"
    });
    setIsAddModalOpen(false);
    setSelectedMedToAdd("");
    addToast("Medicine Added", "Added item to store catalog", "success");
  };

  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMed = medicines.find((m) => m.id === walkinMedId);
    if (!targetMed) return;

    createReservation({
      medicine: targetMed,
      pharmacy,
      quantity: walkinQty,
      patientName: walkinName || "Walk-in Patient",
      patientPhone: walkinPhone || "+91 99999 00000",
      timeSlot: "Counter walk-in"
    });

    setTimeout(() => {
      const latest = reservations[0];
      if (latest) completeReservation(latest.id);
    }, 100);

    setWalkinName("");
    setWalkinPhone("");
    addToast("Recorded & Dispensed", `${walkinQty}x ${targetMed.name} recorded. Stock updated.`, "success");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Store Identity Banner */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
            <Store size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                Chemist Portal
              </span>
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <ShieldCheck size={12} className="text-teal-600" /> Verified Partner
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{pharmacy.name}</h1>
            <p className="text-xs text-gray-500">
              {pharmacy.address} · Phone: <strong>{pharmacy.phone}</strong>
            </p>
          </div>
        </div>

        {/* Branch Switcher & Public View */}
        <div className="flex items-center gap-3">
          <div className="text-xs">
            <label className="text-gray-400 block mb-0.5 font-medium">Switch Branch:</label>
            <select
              value={selectedPharmacyId}
              onChange={(e) => setSelectedPharmacyId(e.target.value)}
              className="med-select py-1.5 px-2.5 text-xs"
            >
              {pharmacies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.area})
                </option>
              ))}
            </select>
          </div>

          <Link
            to={`/search?q=${encodeURIComponent(pharmacy.name)}`}
            className="btn-outline btn-sm text-xs mt-3.5"
          >
            <ExternalLink size={12} /> Public Storefront
          </Link>
        </div>
      </section>

      {/* KPI Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-teal-600 mb-2">
            <Pill size={20} />
            <span className="text-xs font-semibold text-gray-400">Inventory</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 block">{totalItemsCount}</span>
          <span className="text-xs text-gray-500">Catalog Medicines</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <ShoppingBag size={20} />
            <span className="text-xs font-semibold text-gray-400">Pending</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 block">{pendingReservations.length}</span>
          <span className="text-xs text-gray-500">Pickup Holds</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <TrendingUp size={20} />
            <span className="text-xs font-semibold text-gray-400">Receivable</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 block">₹{pendingValue}</span>
          <span className="text-xs text-gray-500">Counter Collection</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <BadgeAlert size={20} />
            <span className="text-xs font-semibold text-gray-400">Restock</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 block">{lowStockCount}</span>
          <span className="text-xs text-gray-500">Low Stock Alerts (&le;5)</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 gap-4 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("inventory")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "inventory"
              ? "border-teal-600 text-teal-700 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Pill size={16} /> Stock Management ({totalItemsCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("patients")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "patients"
              ? "border-teal-600 text-teal-700 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <ShoppingBag size={16} /> Patient Pickups ({pendingReservations.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("walkin")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "walkin"
              ? "border-teal-600 text-teal-700 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Plus size={16} /> Record Walk-in Sale
        </button>
      </div>

      {/* TAB 1: Inventory & Stock Management */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter stock by name, generic, or category..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {(["all", "Available", "Low stock", "Out of stock"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? "bg-teal-600 text-white font-semibold"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === "all" ? "All Status" : s}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary btn-sm ml-auto sm:ml-2 text-xs"
              >
                <Plus size={14} /> Add Medicine
              </button>
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Medicine & Salt</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Stock Status</th>
                  <th className="py-3 px-3">Units in Stock</th>
                  <th className="py-3 px-3">Counter Price (₹)</th>
                  <th className="py-3 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {storeInventoryList.map(({ medicineId, medicine, stock }) => {
                  if (!medicine) return null;
                  return (
                    <tr key={medicineId} className="hover:bg-gray-50/70 transition-colors">
                      {/* Name */}
                      <td className="py-3 px-4">
                        <strong className="text-gray-900 font-semibold block text-sm">
                          {medicine.name}
                        </strong>
                        <span className="text-gray-500 text-[11px]">
                          {medicine.generic} · {medicine.strength}
                        </span>
                      </td>

                      {/* Classification */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[11px] font-medium">
                            {medicine.category}
                          </span>
                          {medicine.prescriptionRequired && (
                            <span className="badge-rx">Rx</span>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-3">
                        <select
                          value={stock.status}
                          onChange={(e) =>
                            updatePharmacyStock(pharmacy.id, medicineId, {
                              status: e.target.value as any
                            })
                          }
                          className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-800 font-medium"
                        >
                          <option value="Available">Available</option>
                          <option value="Low stock">Low stock (&lt;5)</option>
                          <option value="Out of stock">Out of stock</option>
                        </select>
                      </td>

                      {/* Quantity Stepper */}
                      <td className="py-3 px-3">
                        <div className="flex items-center border border-gray-300 rounded max-w-[100px] overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => {
                              const newQty = Math.max(0, stock.quantity - 1);
                              updatePharmacyStock(pharmacy.id, medicineId, {
                                quantity: newQty,
                                status: newQty === 0 ? "Out of stock" : newQty < 5 ? "Low stock" : "Available"
                              });
                            }}
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-gray-800 text-xs">
                            {stock.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newQty = stock.quantity + 1;
                              updatePharmacyStock(pharmacy.id, medicineId, {
                                quantity: newQty,
                                status: newQty >= 5 ? "Available" : "Low stock"
                              });
                            }}
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Price Input */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400 font-bold">₹</span>
                          <input
                            type="number"
                            min="1"
                            value={stock.price}
                            onChange={(e) => {
                              const newPrice = Math.max(1, parseInt(e.target.value) || 1);
                              updatePharmacyStock(pharmacy.id, medicineId, { price: newPrice });
                            }}
                            className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-900"
                          />
                        </div>
                      </td>

                      {/* Toggle Out of stock / Restock */}
                      <td className="py-3 px-3 text-right">
                        {stock.status === "Available" ? (
                          <button
                            type="button"
                            onClick={() =>
                              updatePharmacyStock(pharmacy.id, medicineId, {
                                status: "Out of stock",
                                quantity: 0
                              })
                            }
                            className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded font-medium text-xs transition-colors"
                          >
                            Mark Out
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              updatePharmacyStock(pharmacy.id, medicineId, {
                                status: "Available",
                                quantity: 20
                              })
                            }
                            className="px-2.5 py-1 text-emerald-600 hover:bg-emerald-50 border border-emerald-200 rounded font-medium text-xs transition-colors"
                          >
                            Restock (20)
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Patient Pickups */}
      {activeTab === "patients" && (
        <div className="space-y-6">
          {/* Quick Code Scanner / Input */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <QrCode size={20} className="text-teal-600" />
              <div>
                <h3 className="text-sm font-bold text-gray-900">Verify Patient Pickup Pass</h3>
                <p className="text-xs text-gray-500">
                  Enter pass code (e.g. RX-19782 or RX-84920) to dispense held medicine.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyCode} className="flex gap-2 max-w-md">
              <input
                type="text"
                required
                placeholder="Enter Pass Code (e.g. RX-19782)"
                value={verifyCodeInput}
                onChange={(e) => setVerifyCodeInput(e.target.value)}
                className="med-input py-2 text-xs font-mono uppercase"
              />
              <button type="submit" className="btn-primary text-xs shrink-0">
                Verify Pass
              </button>
            </form>

            {verifiedReservation && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="badge-available">
                    <CheckCircle2 size={12} /> Valid Pass Match
                  </span>
                  <div className="text-sm font-bold text-gray-900">
                    Patient: {verifiedReservation.patientName}
                  </div>
                  <div className="text-gray-600">
                    Item: <strong>{verifiedReservation.quantity}x {verifiedReservation.medicineName}</strong>
                  </div>
                  <div className="text-emerald-800 font-bold">
                    Amount to Collect: ₹{verifiedReservation.totalPrice}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    completeReservation(verifiedReservation.id);
                    setVerifiedReservation(null);
                    setVerifyCodeInput("");
                  }}
                  className="btn-primary text-xs"
                >
                  <PackageCheck size={14} /> Dispense & Complete
                </button>
              </div>
            )}
          </div>

          {/* Active Holds List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                Active Holds at {pharmacy.name} ({pendingReservations.length})
              </h3>
            </div>

            {pendingReservations.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-xs text-gray-500">
                No pending customer holds for this store.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {res.code}
                        </span>
                        <span className="font-bold text-gray-900 text-sm">
                          {res.patientName}
                        </span>
                        {res.patientPhone && (
                          <a href={`tel:${res.patientPhone}`} className="text-gray-500 hover:text-teal-600 flex items-center gap-1">
                            <Phone size={11} /> {res.patientPhone}
                          </a>
                        )}
                      </div>

                      <div className="text-gray-600">
                        Reserved: <strong>{res.quantity}x {res.medicineName}</strong> ({res.medicineStrength})
                      </div>
                      <div className="text-gray-400 text-[11px] flex items-center gap-1">
                        <Clock size={11} /> Deadline: {res.pickupDeadline}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-gray-400 block uppercase">To Collect</span>
                        <span className="text-base font-bold text-gray-900">₹{res.totalPrice}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => completeReservation(res.id)}
                          className="btn-primary text-xs py-1.5"
                        >
                          <PackageCheck size={14} /> Dispense
                        </button>
                        <button
                          type="button"
                          onClick={() => cancelReservation(res.id)}
                          className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dispensed Pickups Log */}
          {completedReservations.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-xs">
              <span className="font-semibold text-gray-700 block">
                Recently Dispensed ({completedReservations.length})
              </span>
              <div className="divide-y divide-gray-200">
                {completedReservations.map((c) => (
                  <div key={c.id} className="py-1.5 flex justify-between items-center text-gray-600">
                    <span>
                      Pass <strong>{c.code}</strong> — {c.quantity}x {c.medicineName} handed to <strong>{c.patientName}</strong>
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium text-[11px]">
                      Dispensed (₹{c.totalPrice})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Walk-in Sale Form */}
      {activeTab === "walkin" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-xl mx-auto space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <User size={18} className="text-teal-600" />
            <div>
              <h3 className="font-bold text-base text-gray-900">Record Walk-in Patient Sale</h3>
              <p className="text-xs text-gray-500">
                Record counter sales to walk-in patients to keep store stock accurate.
              </p>
            </div>
          </div>

          <form onSubmit={handleWalkinSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Verma"
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                className="med-input py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Patient Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="+91 98XXX XXXXX"
                value={walkinPhone}
                onChange={(e) => setWalkinPhone(e.target.value)}
                className="med-input py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Medicine to Dispense
                </label>
                <select
                  value={walkinMedId}
                  onChange={(e) => setWalkinMedId(e.target.value)}
                  className="med-select py-2 text-xs"
                >
                  {medicines.map((m) => {
                    const price = pharmacy.inventory[m.id]?.price || m.basePrice;
                    const qty = pharmacy.inventory[m.id]?.quantity || 0;
                    return (
                      <option key={m.id} value={m.id}>
                        {m.name} — ₹{price} ({qty} in stock)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={walkinQty}
                  onChange={(e) => setWalkinQty(parseInt(e.target.value) || 1)}
                  className="med-input py-2 text-xs"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-2.5 text-xs font-semibold">
              <PackageCheck size={14} /> Record & Dispense Immediately
            </button>
          </form>
        </div>
      )}

      {/* Add Medicine to Store Catalog Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative border border-gray-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Add Medicine to Store</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Add an item to {pharmacy.name}'s active catalog.
              </p>
            </div>

            <form onSubmit={handleAddMedicineSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Select Medicine from Directory
                </label>
                <select
                  required
                  value={selectedMedToAdd}
                  onChange={(e) => {
                    setSelectedMedToAdd(e.target.value);
                    const found = medicines.find((m) => m.id === e.target.value);
                    if (found) setAddPrice(found.basePrice);
                  }}
                  className="med-select py-2 text-xs"
                >
                  <option value="">-- Choose a medicine --</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.generic}, {m.strength})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={addQuantity}
                    onChange={(e) => setAddQuantity(parseInt(e.target.value) || 1)}
                    className="med-input py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Counter Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={addPrice}
                    onChange={(e) => setAddPrice(parseInt(e.target.value) || 1)}
                    className="med-input py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Availability Status
                </label>
                <select
                  value={addStatus}
                  onChange={(e) => setAddStatus(e.target.value as any)}
                  className="med-select py-2 text-xs"
                >
                  <option value="Available">Available (In Stock)</option>
                  <option value="Low stock">Low stock (&lt;5 units)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!selectedMedToAdd}
                className="btn-primary w-full py-2.5 text-xs font-semibold"
              >
                Add to Store Inventory
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
