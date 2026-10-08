import React from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { MessageSquare, ShoppingBag, X, Bell } from "lucide-react";

export const NotificationToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white rounded-2xl p-4 shadow-xl border border-slate-200/90 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 transition-all hover:shadow-2xl"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === "order"
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {toast.type === "order" ? (
              <ShoppingBag className="w-5 h-5" />
            ) : toast.type === "message" ? (
              <MessageSquare className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 text-sm">{toast.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{toast.message}</p>
            {toast.link && (
              <Link
                to={toast.link}
                onClick={() => dismissToast(toast.id)}
                className="inline-block mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                View Now →
              </Link>
            )}
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

