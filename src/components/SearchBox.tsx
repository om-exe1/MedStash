import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, X, Pill } from "lucide-react";
import { useApp } from "../context/AppContext";

interface SearchBoxProps {
  large?: boolean;
  defaultValue?: string;
  placeholder?: string;
  onSearchSubmit?: (query: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  large = false,
  defaultValue = "",
  placeholder = "Search medicine (e.g. Dolo 650), salt, or symptom...",
  onSearchSubmit
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { medicines } = useApp();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return medicines
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.generic.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.uses.some((u) => u.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [query]);

  const executeSearch = (targetQuery?: string) => {
    const finalQuery = (targetQuery !== undefined ? targetQuery : query).trim();
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(finalQuery);
    } else {
      navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <div
        className={`flex items-center bg-white border border-gray-300 rounded-xl shadow-sm transition-all focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 ${
          large ? "p-1.5 sm:p-2" : "p-1"
        }`}
      >
        <SearchIcon
          className="text-gray-400 ml-3 shrink-0"
          size={large ? 20 : 18}
        />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm text-gray-900 bg-transparent placeholder-gray-400 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md mr-1"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={() => executeSearch()}
          className="btn-primary shrink-0 text-xs sm:text-sm px-4 py-2"
        >
          Search
        </button>
      </div>

      {/* Auto-suggest dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-gray-100">
          <div className="px-3.5 py-1.5 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Matching Medicines
          </div>
          {suggestions.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/medicine/${m.id}`);
              }}
              className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-teal-50/60 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Pill size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-teal-700">
                    {m.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {m.generic} · {m.strength}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-teal-700">
                  from ₹{m.basePrice}
                </span>
                <span className="block text-[10px] text-gray-400">
                  {m.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
