import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-md bg-white ${
              isSuccess
                ? "border-emerald-200 text-emerald-900"
                : isError
                ? "border-rose-200 text-rose-900"
                : "border-teal-200 text-teal-900"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 size={18} className="text-emerald-600" />}
              {isError && <AlertCircle size={18} className="text-rose-600" />}
              {!isSuccess && !isError && <Info size={18} className="text-teal-600" />}
            </div>

            <div className="flex-1 text-xs">
              <strong className="font-semibold block text-gray-900">
                {toast.title}
              </strong>
              <span className="text-gray-600 mt-0.5 block leading-relaxed">
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-1 shrink-0"
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
