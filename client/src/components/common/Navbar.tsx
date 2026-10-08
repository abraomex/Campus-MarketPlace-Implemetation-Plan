import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import {
  ShoppingBag,
  PlusCircle,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  MessageSquare,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadMessages, pendingOrders } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#0b0f19]/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-xl text-white hover:text-emerald-400 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-extrabold tracking-tight">
                Campus<span className="text-emerald-400">Market</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Student Buy & Sell
              </span>
            </div>
          </Link>

          {/* Search bar (desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search books, laptops, dorm gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.1] text-white text-sm rounded-full border border-white/[0.08] focus:border-emerald-500/50 focus:outline-none transition placeholder:text-slate-500"
            />
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/products"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 hover:bg-white/[0.06] rounded-lg transition"
            >
              <Compass className="w-4 h-4" />
              Browse
            </Link>

            <Link
              to="/sell"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-black bg-emerald-500 hover:bg-emerald-400 rounded-lg shadow-lg shadow-emerald-500/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Sell Item
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                <Link
                  to="/messages"
                  className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 hover:bg-white/[0.06] rounded-lg transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Messages</span>
                  {unreadMessages > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full leading-none shadow-lg shadow-rose-500/30">
                      {unreadMessages}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    {pendingOrders > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-[#0b0f19]" />
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-sm font-semibold text-white bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 rounded-lg transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu content */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/[0.06] space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search campus items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/[0.06] text-white text-sm rounded-lg border border-white/[0.08] focus:border-emerald-500/50 focus:outline-none placeholder:text-slate-500"
              />
            </form>

            <div className="flex flex-col gap-1 pt-2">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
              >
                <Compass className="w-4 h-4" />
                Browse All Items
              </Link>
              <Link
                to="/sell"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-black bg-emerald-500 rounded-lg"
              >
                <PlusCircle className="w-4 h-4" />
                Sell an Item
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Messages</span>
                    </div>
                    {unreadMessages > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                        {unreadMessages}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>My Profile ({user?.name})</span>
                    </div>
                    {pendingOrders > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                        {pendingOrders} new order
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg text-left transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-sm font-semibold text-slate-300 bg-white/[0.06] border border-white/10 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-sm font-bold text-black bg-emerald-500 rounded-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
