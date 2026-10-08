import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product, Order, OrderStatus } from "../types";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  Mail,
  MapPin,
  Calendar,
  PlusCircle,
  Package,
  Edit,
  Trash2,
  ExternalLink,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"listings" | "purchases" | "sales">("listings");

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    if (!user) return;
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.get<{ success: boolean; data: Product[] }>(`/products?sellerId=${user.id}&status=`),
        api.get<{ success: boolean; data: { purchases: Order[]; sales: Order[] } }>("/orders/my-orders"),
      ]);

      setMyProducts(prodRes.data.data || []);
      setPurchases(orderRes.data.data?.purchases || []);
      setSales(orderRes.data.data?.sales || []);
    } catch (err) {
      console.error("Error loading profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleDeleteListing = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      setMyProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete listing");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchProfileData(); // Refresh orders and listing statuses
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update order status");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 flex items-center gap-1 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 flex items-center gap-1 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pending Pickup
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 flex items-center gap-1 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-black text-white">{user?.name}</h1>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mx-auto sm:mx-0">
              {user?.role || "STUDENT"}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.email}</span>
            </div>
            {user?.campus && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{user.campus}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Verified Campus Student</span>
            </div>
          </div>
        </div>

        <Link
          to="/sell"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 text-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Listing
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-white/[0.08] gap-2 sm:gap-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "listings"
              ? "bg-emerald-500 text-black font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/[0.06] font-bold"
          }`}
        >
          <Package className="w-4 h-4" />
          My Listings ({myProducts.length})
        </button>

        <button
          onClick={() => setActiveTab("purchases")}
          className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "purchases"
              ? "bg-emerald-500 text-black font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/[0.06] font-bold"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          My Purchases ({purchases.length})
        </button>

        <button
          onClick={() => setActiveTab("sales")}
          className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "sales"
              ? "bg-emerald-500 text-black font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/[0.06] font-bold"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Orders Received ({sales.length})
        </button>
      </div>

      {/* Tab 1: My Listings */}
      {activeTab === "listings" && (
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.08] animate-pulse h-20" />
              ))}
            </div>
          ) : myProducts.length === 0 ? (
            <div className="bg-white/[0.03] rounded-3xl p-12 text-center border border-white/[0.08] text-white">
              <Package className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="font-bold text-white text-lg">No listings posted yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                Post textbooks, gadgets, or event tickets you want to sell.
              </p>
              <Link
                to="/sell"
                className="px-5 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition"
              >
                List Your First Item
              </Link>
            </div>
          ) : (
            myProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden hover:border-emerald-500/40 transition group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0].url
                          : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white truncate">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.status === "AVAILABLE"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : item.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/20"
                            : "bg-white/5 text-slate-400 border-white/10"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-extrabold text-emerald-400 text-sm">
                        ${Number(item.price).toFixed(2)}
                      </span>
                      <span>•</span>
                      <span>{item.condition.replace("_", " ")}</span>
                      <span>•</span>
                      <span>{item.category?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    to={`/products/${item.id}`}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/products/${item.id}/edit`}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDeleteListing(item.id, item.title)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: My Purchases */}
      {activeTab === "purchases" && (
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <div className="bg-white/[0.03] rounded-3xl p-12 text-center border border-white/[0.08] text-white">
              <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="font-bold text-white text-lg">No purchases yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                Browse student listings on campus and reserve books, gadgets, or event tickets.
              </p>
              <Link
                to="/products"
                className="px-5 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition"
              >
                Explore Marketplace
              </Link>
            </div>
          ) : (
            purchases.map((order) => (
              <div
                key={order.id}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 text-white transition hover:border-emerald-500/20 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={
                          order.product?.images && order.product.images[0]
                            ? order.product.images[0].url
                            : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80"
                        }
                        alt={order.product?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {order.product?.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="font-extrabold text-emerald-400 text-sm">
                          ${Number(order.price).toFixed(2)}
                        </span>
                        <span>•</span>
                        <span>Seller: {order.seller?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {getStatusBadge(order.status)}
                    <Link
                      to={`/products/${order.productId}`}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] rounded-xl text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2 border border-white/[0.05]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Meetup at: <strong className="text-white">{order.meetupLocation}</strong>
                      {order.meetupNote && ` (${order.meetupNote})`}
                    </span>
                  </div>

                  <span className="text-slate-500">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Orders Received (Sales to fulfill) */}
      {activeTab === "sales" && (
        <div className="space-y-4">
          {sales.length === 0 ? (
            <div className="bg-white/[0.03] rounded-3xl p-12 text-center border border-white/[0.08] text-white">
              <DollarSign className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="font-bold text-white text-lg">No orders received yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
                When a student buys one of your listings, their order and meetup request will show up here.
              </p>
            </div>
          ) : (
            sales.map((order) => (
              <div
                key={order.id}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 text-white transition hover:border-emerald-500/20 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={
                          order.product?.images && order.product.images[0]
                            ? order.product.images[0].url
                            : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80"
                        }
                        alt={order.product?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {order.product?.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="font-extrabold text-emerald-400 text-sm">
                          ${Number(order.price).toFixed(2)}
                        </span>
                        <span>•</span>
                        <span>Buyer: <strong className="text-white">{order.buyer?.name}</strong> ({order.buyer?.email})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] rounded-xl text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2 border border-white/[0.05]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Meetup requested at: <strong className="text-white">{order.meetupLocation}</strong>
                      {order.meetupNote && ` (${order.meetupNote})`}
                    </span>
                  </div>

                  {order.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "COMPLETED")}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-bold text-xs transition shadow-lg shadow-emerald-500/20"
                      >
                        Mark as Handed Over / Completed
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "CANCELLED")}
                        className="px-3 py-1.5 bg-transparent border border-white/20 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 rounded-lg font-bold text-xs transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
