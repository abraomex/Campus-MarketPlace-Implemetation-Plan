import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { ShoppingBag, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data.data;
      login(token, user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white/[0.04] backdrop-blur-sm p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center text-black shadow-md shadow-emerald-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to manage your campus listings & contact student sellers
          </p>
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2.5 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Student Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.08] focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.08] focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In to Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Accounts Pill Bar */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
            Quick Fill Demo Accounts (PW: password123)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin("alex@university.edu")}
              className="px-3 py-2 bg-white/[0.06] border border-white/10 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 rounded-lg font-medium text-slate-300 transition truncate"
            >
              Alex (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("sarah@university.edu")}
              className="px-3 py-2 bg-white/[0.06] border border-white/10 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 rounded-lg font-medium text-slate-300 transition truncate"
            >
              Sarah (Student)
            </button>
          </div>
        </div>

        {/* Footer link */}
        <div className="text-center text-xs text-slate-400">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-bold text-emerald-400 hover:text-emerald-300"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
