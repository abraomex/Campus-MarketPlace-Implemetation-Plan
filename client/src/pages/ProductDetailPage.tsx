import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Product } from "../types";
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
  Mail,
  X,
} from "lucide-react";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get<{ success: boolean; data: Product }>(`/products/${id}`);
        setProduct(res.data.data);
        if (res.data.data.images && res.data.data.images.length > 0) {
          setSelectedImage(res.data.data.images[0].url);
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
                {product.status}
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
              <span className="text-xs text-slate-400">Fixed campus price</span>
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

          {/* Action buttons */}
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
              <div className="flex gap-3">
                <button
                  onClick={() => setContactModalOpen(true)}
                  className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Student Seller
                </button>

                <button
                  onClick={handleShare}
                  title="Share item"
                  className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                >
                  <Share2 className="w-5 h-5" />
                </button>
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

      {/* Contact Seller Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Contact Seller</h3>
                <p className="text-xs text-slate-500">Reach out to {product.seller?.name}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm space-y-2">
              <p className="font-semibold text-slate-800">
                Interested in: "{product.title}" (${Number(product.price).toFixed(2)})
              </p>
              <p className="text-xs text-slate-500">
                Meetup location suggested: {product.location || "Campus Library / Quad"}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Send a quick message via your student email or copy the seller inquiry:
              </p>

              <a
                href={`mailto:student@university.edu?subject=${encodeURIComponent(
                  `Campus Marketplace: ${product.title}`
                )}&body=${encodeURIComponent(
                  `Hi ${product.seller?.name},\n\nI saw your listing for "${product.title}" ($${Number(
                    product.price
                  ).toFixed(2)}) on Campus Marketplace and would like to buy it. Are you available to meet on campus?\n\nThanks!`
                )}`}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                <Mail className="w-4 h-4" />
                Open Email Draft
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Hi ${product.seller?.name}, I'm interested in buying "${product.title}" on Campus Marketplace!`
                  );
                  alert("Message template copied to clipboard!");
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-xs"
              >
                Copy Quick Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

