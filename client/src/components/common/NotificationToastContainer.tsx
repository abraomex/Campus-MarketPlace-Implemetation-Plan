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
          className="pointer-events-auto bg-[#111726]/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-black/80 border border-white/10 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 transition-all hover:border-emerald-500/40"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              toast.type === "order"
                ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
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
            <h4 className="font-bold text-white text-sm">{toast.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{toast.message}</p>
            {toast.link && (
              <Link
                to={toast.link}
                onClick={() => dismissToast(toast.id)}
                className="inline-block mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"
              >
                View Now →
              </Link>
            )}
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 text-slate-500 hover:text-white rounded-lg shrink-0 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
