import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Category, ItemCondition, ProductStatus } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Edit, DollarSign, MapPin, Tag, ArrowRight } from "lucide-react";

export const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<ItemCondition>("GOOD");
  const [status, setStatus] = useState<ProductStatus>("AVAILABLE");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get<{ success: boolean; data: Category[] }>("/products/categories"),
          api.get<{ success: boolean; data: any }>(`/products/${id}`),
        ]);

        setCategories(catRes.data.data || []);
        const p = prodRes.data.data;

        // Verify ownership
        if (user && p.sellerId !== user.id && user.role !== "ADMIN") {
          alert("You do not have permission to edit this listing");
          navigate(`/products/${id}`);
          return;
        }

        setTitle(p.title);
        setCategoryId(p.categoryId);
        setPrice(String(p.price));
        setCondition(p.condition);
        setStatus(p.status);
        setLocation(p.location || "");
        setDescription(p.description);
      } catch (err) {
        console.error("Failed to load listing for editing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError("Please provide a valid price greater than $0");
      return;
    }

    setSubmitting(true);

    try {
      await api.put(`/products/${id}`, {
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        categoryId,
        condition,
        status,
        location: location.trim() || undefined,
      });

      navigate(`/products/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update listing");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center animate-pulse">
        <div className="h-8 bg-white/10 rounded w-1/3 mx-auto mb-4" />
        <div className="h-64 bg-white/5 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl text-white space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Edit className="w-8 h-8 text-emerald-400" />
            Edit Listing
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Update pricing, item availability, or description
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Category *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#0f172a] text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none"
              >
                <option value="NEW" className="bg-[#0f172a] text-white">Brand New</option>
                <option value="LIKE_NEW" className="bg-[#0f172a] text-white">Like New</option>
                <option value="GOOD" className="bg-[#0f172a] text-white">Good</option>
                <option value="FAIR" className="bg-[#0f172a] text-white">Fair</option>
                <option value="POOR" className="bg-[#0f172a] text-white">Poor</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Availability Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none"
              >
                <option value="AVAILABLE" className="bg-[#0f172a] text-white">Available</option>
                <option value="PENDING" className="bg-[#0f172a] text-white">Pending Pickup</option>
                <option value="SOLD" className="bg-[#0f172a] text-white">Sold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.50"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Campus Meetup Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Description & Details *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none resize-y"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/products/${id}`)}
              className="flex-1 py-3.5 px-6 border border-white/20 text-white hover:bg-white/10 font-bold rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-[2] py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-wider shadow-lg shadow-emerald-500/20 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? "Saving changes..." : "Save Changes"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
