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
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Pending Pickup
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 w-fit mx-auto sm:mx-0">
              {user?.role || "STUDENT"}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.email}</span>
            </div>
            {user?.campus && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.campus}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Verified Campus Student</span>
            </div>
          </div>
        </div>

        <Link
          to="/sell"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-2 text-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Listing
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("listings")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === "listings"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="w-4 h-4" />
          My Listings ({myProducts.length})
        </button>

        <button
          onClick={() => setActiveTab("purchases")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === "purchases"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          My Purchases ({purchases.length})
        </button>

        <button
          onClick={() => setActiveTab("sales")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === "sales"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
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
                <div key={n} className="bg-white p-4 rounded-2xl border border-slate-200 animate-pulse h-20" />
              ))}
            </div>
          ) : myProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">No listings posted yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Post textbooks, gadgets, or event tickets you want to sell.
              </p>
              <Link
                to="/sell"
                className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
              >
                List Your First Item
              </Link>
            </div>
          ) : (
            myProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0].url
                          : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === "AVAILABLE"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-extrabold text-emerald-600 text-sm">
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
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/products/${item.id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDeleteListing(item.id, item.title)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">No purchases yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Browse student listings on campus and reserve books, gadgets, or event tickets.
              </p>
              <Link
                to="/products"
                className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
              >
                Explore Marketplace
              </Link>
            </div>
          ) : (
            purchases.map((order) => (
              <div
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
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
                      <h4 className="font-bold text-slate-900 text-base">
                        {order.product?.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-extrabold text-emerald-600 text-sm">
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
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Meetup at: <strong>{order.meetupLocation}</strong>
                      {order.meetupNote && ` (${order.meetupNote})`}
                    </span>
                  </div>

                  <span className="text-slate-400">
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
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">No orders received yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                When a student buys one of your listings, their order and meetup request will show up here.
              </p>
            </div>
          ) : (
            sales.map((order) => (
              <div
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
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
                      <h4 className="font-bold text-slate-900 text-base">
                        {order.product?.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-extrabold text-emerald-600 text-sm">
                          ${Number(order.price).toFixed(2)}
                        </span>
                        <span>•</span>
                        <span>Buyer: <strong>{order.buyer?.name}</strong> ({order.buyer?.email})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Meetup requested at: <strong>{order.meetupLocation}</strong>
                      {order.meetupNote && ` (${order.meetupNote})`}
                    </span>
                  </div>

                  {order.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "COMPLETED")}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition"
                      >
                        Mark as Handed Over / Completed
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "CANCELLED")}
                        className="px-3 py-1 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded-lg font-bold text-xs transition"
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
