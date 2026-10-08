import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Product, PaymentMethod } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  Calendar,
  MessageCircle,
  Share2,
  Trash2,
  Edit,
  ArrowLeft,
  X,
  ShoppingBag,
  CheckCircle,
  CreditCard,
  DollarSign,
  Smartphone,
} from "lucide-react";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Modals state
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // Buy form state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CAMPUS_MEETUP_CASH");
  const [meetupLocation, setMeetupLocation] = useState("");
  const [meetupNote, setMeetupNote] = useState("");
  const [buying, setBuying] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get<{ success: boolean; data: Product }>(`/products/${id}`);
        setProduct(res.data.data);
        if (res.data.data.images && res.data.data.images.length > 0) {
          setSelectedImage(res.data.data.images[0].url);
        }
        if (res.data.data.location) {
          setMeetupLocation(res.data.data.location);
        } else {
          setMeetupLocation("Student Union Atrium");
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const isOwner = user && product && user.id === product.sellerId;

  // Handle Chat with Seller
  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    if (isOwner) {
      alert("This is your own listing!");
      return;
    }

    setChatLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: { id: string } }>(
        "/messages/start",
        { productId: product!.id }
      );
      navigate(`/messages?id=${res.data.data.id}`);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to start conversation");
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Buy / Place Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    setBuying(true);
    try {
      await api.post("/orders", {
        productId: product!.id,
        paymentMethod,
        meetupLocation,
        meetupNote: meetupNote.trim() || undefined,
      });

      setOrderSuccess(true);
      setProduct((prev) => (prev ? { ...prev, status: "PENDING" } : null));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to place order");
    } finally {
      setBuying(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${id}`);
      navigate("/products");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete listing");
      setDeleting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-[4/3] bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          This listing may have been sold or removed by the seller.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const defaultImg =
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images Column */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
            <img
              src={selectedImage || defaultImg}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImg;
              }}
            />
            {product.status !== "AVAILABLE" && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider shadow">
                {product.status === "PENDING" ? "Pending Pickup" : "Sold"}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img.url
                      ? "border-emerald-600 shadow-md"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultImg;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                {product.condition.replace("_", " ")}
              </span>
              {product.category && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                  {product.category.name}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-emerald-600">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">Fixed student price</span>
            </div>
          </div>

          {/* Location & Time info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-sm text-slate-600">
            {product.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Pickup at: <strong className="text-slate-800">{product.location}</strong>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Posted on {new Date(product.createdAt).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              {product.description}
            </p>
          </div>

          {/* Action buttons (Buy & Chat) */}
          <div className="space-y-3 pt-2">
            {isOwner ? (
              <div className="flex gap-3">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Listing
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {product.status === "AVAILABLE" ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Buy Now Button */}
                    <button
                      onClick={() => setBuyModalOpen(true)}
                      className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Buy & Reserve Item
                    </button>

                    {/* Chat with Seller Button */}
                    <button
                      onClick={handleStartChat}
                      disabled={chatLoading}
                      className="flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                      {chatLoading ? "Opening chat..." : "Chat with Seller"}
                    </button>

                    <button
                      onClick={handleShare}
                      title="Share item"
                      className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center justify-center"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
                    <p className="font-bold text-amber-800">
                      {product.status === "PENDING"
                        ? "Item Currently Reserved / Pending Pickup"
                        : "Item Sold"}
                    </p>
                    <p className="text-xs text-amber-600">
                      Another student has arranged to buy this item.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Seller Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold text-lg flex items-center justify-center border border-emerald-200 shrink-0">
              {product.seller?.name ? product.seller.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 truncate">
                {product.seller?.name || "Student"}
              </h4>
              <p className="text-xs text-slate-500 truncate">
                {product.seller?.campus || "Verified Campus Student"}
              </p>
              {product.seller?.bio && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  "{product.seller.bio}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buy / Reserve Checkout Modal */}
      {buyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => {
                setBuyModalOpen(false);
                setOrderSuccess(false);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {orderSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Item Reserved Successfully!
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  We notified <strong>{product.seller?.name}</strong> and started a chat message to confirm your campus meeting details.
                </p>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      setBuyModalOpen(false);
                      handleStartChat();
                    }}
                    className="flex-1 py-3 px-4 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition"
                  >
                    Open Chat with Seller
                  </button>
                  <Link
                    to="/profile"
                    className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition text-center"
                  >
                    View My Purchases
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Campus Purchase & Pickup
                    </h3>
                    <p className="text-xs text-slate-500">
                      Reserve this item directly from {product.seller?.name}
                    </p>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-800 text-sm truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      Condition: {product.condition.replace("_", " ")}
                    </p>
                  </div>
                  <span className="text-xl font-black text-emerald-600 shrink-0">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        id: "CAMPUS_MEETUP_CASH",
                        label: "Cash in Person (Recommended)",
                        desc: "Inspect item before handing over cash at meetup",
                        icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
                      },
                      {
                        id: "VENMO_OR_ZELLE",
                        label: "Venmo / Zelle on Campus",
                        desc: "Pay peer digitally upon meeting in person",
                        icon: <Smartphone className="w-4 h-4 text-blue-600" />,
                      },
                      {
                        id: "CARD",
                        label: "Campus Student Pay",
                        desc: "Instant card checkout simulation",
                        icon: <CreditCard className="w-4 h-4 text-purple-600" />,
                      },
                    ].map((m) => (
                      <label
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                          paymentMethod === m.id
                            ? "border-emerald-600 bg-emerald-50/50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === m.id}
                          onChange={() => {}}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                            {m.icon}
                            <span>{m.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Meetup Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Campus Meetup Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Student Union, Library Lobby, Quad"
                    value={meetupLocation}
                    onChange={(e) => setMeetupLocation(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex gap-1.5 pt-1 text-[11px] text-slate-400 flex-wrap">
                    <span>Quick options:</span>
                    {["Main Library", "Student Union", "Dorm Quad"].map((loc) => (
                      <button
                        type="button"
                        key={loc}
                        onClick={() => setMeetupLocation(loc)}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meetup Note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Note / Availability Time (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free after 3 PM today or tomorrow lunch"
                    value={meetupNote}
                    onChange={(e) => setMeetupNote(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={buying}
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {buying ? "Reserving item..." : `Confirm Order — $${Number(product.price).toFixed(2)}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
