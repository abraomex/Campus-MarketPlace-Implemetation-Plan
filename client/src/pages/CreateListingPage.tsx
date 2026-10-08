import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Category, ItemCondition } from "../types";
import { api } from "../services/api";
import { PlusCircle, DollarSign, MapPin, Image, Tag, ArrowRight } from "lucide-react";

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<ItemCondition>("GOOD");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ success: boolean; data: Category[] }>("/products/categories")
      .then((res) => {
        setCategories(res.data.data || []);
        if (res.data.data && res.data.data.length > 0) {
          setCategoryId(res.data.data[0].id);
        }
      })
      .catch((err) => console.error("Error loading categories:", err))
      .finally(() => setLoadingCats(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError("Please provide a valid price greater than $0");
      return;
    }

    if (!title.trim() || title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    if (!description.trim() || description.length < 10) {
      setError("Description must be at least 10 characters");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        categoryId,
        condition,
        location: location.trim() || undefined,
        imageUrls: imageUrl.trim() ? [imageUrl.trim()] : undefined,
      };

      const res = await api.post("/products", payload);
      const newProduct = res.data.data;
      navigate(`/products/${newProduct.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create listing");
      setSubmitting(false);
    }
  };

  const sampleImages = [
    { label: "Book", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80" },
    { label: "Laptop", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" },
    { label: "Desk / Lamp", url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80" },
    { label: "Bike", url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl text-white space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <PlusCircle className="w-8 h-8 text-emerald-400" />
            Create Campus Listing
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Post an item for sale to students on your university campus
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Chemistry (8th Ed) or Apple Magic Mouse 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none"
            />
          </div>

          {/* Category & Condition Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Category *
              </label>
              <select
                required
                disabled={loadingCats}
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
                <option value="NEW" className="bg-[#0f172a] text-white">Brand New (Unopened/Unused)</option>
                <option value="LIKE_NEW" className="bg-[#0f172a] text-white">Like New (Barely used, flawless)</option>
                <option value="GOOD" className="bg-[#0f172a] text-white">Good (Light signs of use)</option>
                <option value="FAIR" className="bg-[#0f172a] text-white">Fair (Visible cosmetic wear, works 100%)</option>
                <option value="POOR" className="bg-[#0f172a] text-white">Poor (Heavy wear or damaged)</option>
              </select>
            </div>
          </div>

          {/* Price & Location Row */}
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
                placeholder="25.00"
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
                placeholder="e.g. Science Library, Student Union 2nd Fl"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-slate-400" />
              Product Photo URL (Direct Link)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none"
            />
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <span>Quick sample photos:</span>
              {sampleImages.map((s) => (
                <button
                  type="button"
                  key={s.label}
                  onClick={() => setImageUrl(s.url)}
                  className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Description & Details *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide edition details, condition specifics, what's included, and preferred meeting times..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white/[0.08] rounded-xl text-sm transition focus:outline-none resize-y"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-wider shadow-lg shadow-emerald-500/20 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? "Publishing listing..." : "Publish Campus Listing"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
