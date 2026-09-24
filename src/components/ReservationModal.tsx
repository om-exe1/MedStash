import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ShieldCheck, MapPin, Check, Copy, CheckCheck, ExternalLink, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ReservationModal: React.FC = () => {
  const { reservationModalTarget, closeReservationModal, createReservation, addToast } = useApp();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [patientName, setPatientName] = useState("Om");
  const [timeSlot, setTimeSlot] = useState("Today within 2 hours");
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [lastCode, setLastCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reservationModalTarget) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [reservationModalTarget]);

  if (!reservationModalTarget) return null;

  const { medicine, pharmacy } = reservationModalTarget;
  const stock = pharmacy.inventory[medicine.id];
  const unitPrice = stock?.price ?? medicine.basePrice;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createReservation({
      medicine,
      pharmacy,
      quantity,
      patientName: patientName.trim() || "Guest Patient",
      timeSlot
    });
    setLastCode(res.code);
    setStep("confirmed");
  };

  const handleClose = () => {
    setStep("form");
    setQuantity(1);
    setCopied(false);
    closeReservationModal();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lastCode);
    setCopied(true);
    addToast("Pass Code Copied", `Pickup pass ${lastCode} copied to clipboard`, "info");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {step === "form" ? (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 mb-2">
                <ShieldCheck size={14} /> Free 24-Hour Counter Hold (No Prepayment)
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Reserve {medicine.name}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Pay directly at the pharmacy counter upon physical collection.
              </p>
            </div>

            {/* Medicine and Pharmacy Summary Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block uppercase font-medium text-[10px]">Medicine</span>
                <strong className="text-gray-900 font-semibold text-sm">{medicine.name}</strong>
                <span className="text-gray-500 block">{medicine.generic} · {medicine.strength}</span>
              </div>
              <div className="border-l border-gray-200 pl-3">
                <span className="text-gray-400 block uppercase font-medium text-[10px]">Chemist Store</span>
                <strong className="text-gray-900 font-semibold text-sm">{pharmacy.name}</strong>
                <span className="text-gray-500 block truncate flex items-center gap-1">
                  <MapPin size={11} /> {pharmacy.area} ({pharmacy.distanceText})
                </span>
              </div>
            </div>

            {/* Form Fields: Quantity and Timeslot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Quantity ({medicine.form}s)
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-sm font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pickup Window
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="med-select py-2 text-xs"
                >
                  <option value="Today within 2 hours">Today within 2 hours</option>
                  <option value="Today before 8:00 PM">Today before 8:00 PM</option>
                  <option value="Tomorrow morning (9 AM - 12 PM)">Tomorrow morning</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Patient / Pickup Person Name
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter full name"
                className="med-input py-2 text-sm"
              />
            </div>

            {medicine.prescriptionRequired && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-800">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Prescription required:</strong> Please show your doctor's valid prescription at the counter when collecting this item.
                </span>
              </div>
            )}

            {/* Price Row & Submit Button */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <span className="text-[11px] text-gray-500 block">Total counter payment:</span>
                <span className="text-xl font-bold text-gray-900">₹{totalPrice}</span>
                <span className="text-[10px] text-gray-400 block">(₹{unitPrice} per unit)</span>
              </div>

              <button type="submit" className="btn-primary">
                Confirm Reservation <Check size={16} />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">Hold Confirmed!</h2>
              <p className="text-xs text-gray-500 mt-1">
                Your order is held at <strong>{pharmacy.name}</strong> for 24 hours.
              </p>
            </div>

            {/* Pass Code Card */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 max-w-sm mx-auto space-y-2">
              <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                Your Pickup Pass Code
              </span>
              <div className="text-2xl font-mono font-bold text-teal-900 tracking-wider">
                {lastCode}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="btn-outline btn-sm mx-auto text-xs"
              >
                {copied ? <CheckCheck size={13} className="text-emerald-600" /> : <Copy size={13} />}
                {copied ? "Copied to Clipboard!" : "Copy Code"}
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-gray-500">Item:</span>
                <span className="font-semibold text-gray-800">{quantity}x {medicine.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Store:</span>
                <span className="font-semibold text-gray-800">{pharmacy.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Due at Counter:</span>
                <span className="font-bold text-teal-700">₹{totalPrice}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={handleClose} className="btn-primary text-xs">
                Done & Continue
              </button>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  navigate("/dashboard");
                }}
                className="btn-outline text-xs"
              >
                View Dashboard <ExternalLink size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
