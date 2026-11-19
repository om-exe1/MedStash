import React from "react";
import { ShieldCheck, MapPin, Star, Clock, Phone } from "lucide-react";
import { Pharmacy, Medicine, medicines } from "../data/mockData";
import { useApp } from "../context/AppContext";

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  medicine?: Medicine;
  bestMatch?: boolean;
  onSelect?: (pharmacy: Pharmacy) => void;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  medicine,
  bestMatch = false,
  onSelect
}) => {
  const { openReservationModal } = useApp();

  const stock = medicine ? pharmacy.inventory[medicine.id] : null;
  const price = stock ? stock.price : Object.values(pharmacy.inventory)[0]?.price || 35;
  const status = stock ? stock.status : "Available";
  const updated = stock ? stock.lastUpdated : "Recently updated";

  const handleReserve = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (medicine) {
      openReservationModal(medicine, pharmacy);
    } else {
      openReservationModal(medicines[0], pharmacy);
    }
  };

  const getStatusBadge = () => {
    if (status === "Available") {
      return (
        <span className="badge-available">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          In Stock
        </span>
      );
    }
    if (status === "Low stock") {
      return (
        <span className="badge-low">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Low Stock
        </span>
      );
    }
    return (
      <span className="badge-out">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        Out of Stock
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelect?.(pharmacy)}
      className={`med-card flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-shadow hover:shadow-md ${
        bestMatch ? "border-teal-300 ring-1 ring-teal-200" : ""
      }`}
    >
      {/* Pharmacy Details */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-bold text-gray-900">{pharmacy.name}</h3>
          {pharmacy.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              <ShieldCheck size={12} /> Verified
            </span>
          )}
          {bestMatch && (
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              ★ Best Match
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 flex items-center gap-1">
          <MapPin size={13} className="text-gray-400 shrink-0" />
          {pharmacy.address}
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
          <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
            {pharmacy.distanceText?.includes("away") ? pharmacy.distanceText : `${pharmacy.distanceText} away`}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <strong className="text-gray-700">{pharmacy.rating}</strong> ({pharmacy.reviewsCount})
          </span>
          <span className="inline-flex items-center gap-1 text-gray-400">
            <Clock size={12} /> {pharmacy.openStatus}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1 text-xs">
          {getStatusBadge()}
          <span className="text-gray-400 text-[11px]">Updated {updated}</span>
        </div>
      </div>

      {/* Pricing & Reserve Action */}
      <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 gap-3 shrink-0">
        <div className="text-left md:text-right">
          <span className="text-[11px] text-gray-400 block uppercase tracking-wider">
            Counter Price
          </span>
          <span className="text-xl font-bold text-gray-900">
            ₹{price}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${pharmacy.phone.replace(/[^0-9+]/g, "")}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 border border-gray-200 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            title={`Call ${pharmacy.name}`}
          >
            <Phone size={15} />
          </a>

          <button
            type="button"
            onClick={handleReserve}
            disabled={status === "Out of stock"}
            className="btn-primary text-xs px-3.5 py-2"
          >
            {status === "Out of stock" ? "Out of Stock" : "Reserve Hold"}
          </button>
        </div>
      </div>
    </div>
  );
};
