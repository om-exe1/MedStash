import React, { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { ReservationModal } from "./components/ReservationModal";
import { ToastContainer } from "./components/ToastContainer";
import { Home } from "./pages/Home";
import { SearchPage } from "./pages/SearchPage";
import { MedicineDetails } from "./pages/MedicineDetails";
import { MapPage } from "./pages/MapPage";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/LoginPage";
import { PharmacyOwnerDashboard } from "./pages/PharmacyOwnerDashboard";
import { ShieldCheck } from "lucide-react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                +
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">
                Med<span className="text-teal-600">Stack</span>
              </span>
            </div>
            <p className="text-gray-500 max-w-sm text-xs sm:text-sm leading-relaxed">
              A student React project helping users discover nearby pharmacy stock availability, compare retail counter prices, and reserve medicines without waiting.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
              <ShieldCheck size={14} /> Academic Prototype Demonstration
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-teal-600 transition-colors">Find Medicine</Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-600 hover:text-teal-600 transition-colors">Pharmacy Map</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-teal-600 transition-colors">Patient Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Chemist & Account Portal */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Chemist Portal</h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/pharmacy-dashboard" className="text-gray-600 hover:text-teal-600 transition-colors">Store Dashboard</Link>
              </li>
              <li>
                <Link to="/login?role=pharmacy_owner" className="text-gray-600 hover:text-teal-600 transition-colors">Chemist Login</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-teal-600 transition-colors">Switch User / Demo</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <span>&copy; {new Date().getFullYear()} MedStack. Developed for College Viva & Project Presentation.</span>
          <span>Built with React, TypeScript & Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800">
        <ScrollToTop />
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/medicine/:id" element={<MedicineDetails />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pharmacy-dashboard" element={<PharmacyOwnerDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
        <ReservationModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
