import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Store,
  User,
  LogOut,
  MapPin,
  Search,
  ShoppingBag
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const Navbar: React.FC = () => {
  const {
    currentUser,
    logout,
    reservations,
    backendConnected,
    locationName,
    isLocating,
    detectLiveLocation
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const activeReservationsCount = reservations.filter(
    (r) => r.status === "Confirmed" || r.status === "Ready for pickup"
  ).length;

  const isChemist = currentUser.role === "pharmacy_owner";

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-base shadow-sm group-hover:bg-teal-700 transition-colors">
            +
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-gray-900 tracking-tight leading-none">
              Med<span className="text-teal-600">Stash</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide">
              Pharmacy & Medicine Finder
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-700 font-semibold"
                  : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-700 font-semibold"
                  : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
              }`
            }
          >
            Find Medicine
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-700 font-semibold"
                  : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
              }`
            }
          >
            Pharmacy Map
          </NavLink>

          {isChemist ? (
            <NavLink
              to="/pharmacy-dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                  isActive
                    ? "bg-teal-50 text-teal-700 font-semibold"
                    : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                }`
              }
            >
              <Store size={15} /> Store Dashboard
              {activeReservationsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-teal-600 text-white text-[11px] font-bold rounded-full">
                  {activeReservationsCount}
                </span>
              )}
            </NavLink>
          ) : (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                  isActive
                    ? "bg-teal-50 text-teal-700 font-semibold"
                    : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                }`
              }
            >
              <ShoppingBag size={15} /> My Dashboard
              {activeReservationsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-teal-600 text-white text-[11px] font-bold rounded-full">
                  {activeReservationsCount}
                </span>
              )}
            </NavLink>
          )}
        </nav>

        {/* Right Action: User profile & Switch / Login button */}
        <div className="hidden md:flex items-center gap-3">
          {/* Live Location Pill */}
          <button
            type="button"
            onClick={() => detectLiveLocation(true)}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-700 hover:text-teal-700 bg-gray-50 hover:bg-teal-50 border border-gray-200 rounded-lg transition-colors"
            title="Your detected live location. Click to refresh via GPS."
          >
            <MapPin size={13} className={`text-teal-600 shrink-0 ${isLocating ? "animate-spin" : ""}`} />
            <span className="max-w-[130px] truncate font-medium">{isLocating ? "Locating..." : locationName}</span>
          </button>

          {/* User Role Tag */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs">
            {isChemist ? (
              <Store size={14} className="text-teal-600" />
            ) : (
              <User size={14} className="text-teal-600" />
            )}
            <span className="font-semibold text-gray-800">
              {currentUser.name}
            </span>
            <span className="text-gray-400 font-normal">
              ({isChemist ? "Chemist" : "Patient"})
            </span>
          </div>

          {/* Live Backend Connection Indicator */}
          {backendConnected ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" title="FastAPI backend connected (http://127.0.0.1:8000)">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              API Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200" title="Running in local fallback mode. Run start_backend.bat to activate FastAPI server">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Local Mode
            </span>
          )}

          <Link
            to="/login"
            className="btn-outline btn-sm"
            title="Switch between Patient and Chemist views"
          >
            Switch / Login
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
          >
            Home
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
          >
            Find Medicine
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
          >
            Pharmacy Map
          </Link>

          {isChemist ? (
            <Link
              to="/pharmacy-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
            >
              Store Dashboard ({activeReservationsCount} active)
            </Link>
          ) : (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
            >
              My Dashboard ({activeReservationsCount} holds)
            </Link>
          )}

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Logged in as: <strong>{currentUser.name}</strong> ({isChemist ? "Chemist" : "Patient"})
            </span>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-teal-600 hover:underline"
            >
              Switch Role
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
