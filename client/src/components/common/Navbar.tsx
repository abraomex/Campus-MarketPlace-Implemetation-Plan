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
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-xl text-slate-900 hover:text-emerald-600 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-extrabold tracking-tight">
                Campus<span className="text-emerald-600">Market</span>
              </span>
              <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                Student Buy & Sell
              </span>
            </div>
          </Link>

          {/* Search bar (desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              placeholder="Search books, laptops, dorm gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-800 text-sm rounded-full border border-transparent focus:border-emerald-500 focus:outline-none transition"
            />
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/products"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition"
            >
              <Compass className="w-4 h-4" />
              Browse
            </Link>

            <Link
              to="/sell"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-200 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Sell Item
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/messages"
                  className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Messages</span>
                  {unreadMessages > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full leading-none shadow-xs">
                      {unreadMessages}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-300">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    {pendingOrders > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
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
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu content */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Search campus items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 text-sm rounded-lg border border-transparent focus:border-emerald-500 focus:outline-none"
              />
            </form>

            <div className="flex flex-col gap-1 pt-2">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <Compass className="w-4 h-4" />
                Browse All Items
              </Link>
              <Link
                to="/sell"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg"
              >
                <PlusCircle className="w-4 h-4" />
                Sell an Item
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
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
                    className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
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
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg text-left"
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
                    className="flex-1 text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg"
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

