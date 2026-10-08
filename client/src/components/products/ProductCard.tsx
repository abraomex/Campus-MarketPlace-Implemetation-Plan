import React from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { MapPin, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const conditionLabels: Record<string, { text: string; color: string }> = {
  NEW: { text: "Brand New", color: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
  LIKE_NEW: { text: "Like New", color: "bg-teal-500/20 text-teal-300 border border-teal-500/30" },
  GOOD: { text: "Good", color: "bg-blue-500/20 text-blue-300 border border-blue-500/30" },
  FAIR: { text: "Fair", color: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
  POOR: { text: "Poor", color: "bg-orange-500/20 text-orange-300 border border-orange-500/30" },
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80";

  const conditionInfo = conditionLabels[product.condition] || {
    text: product.condition,
    color: "bg-white/10 text-slate-300 border border-white/10",
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white/[0.04] rounded-2xl border border-white/[0.08] hover:border-emerald-500/40 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-white/[0.02] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Dark gradient overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Condition Badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg backdrop-blur-md ${conditionInfo.color}`}
        >
          {conditionInfo.text}
        </span>

        {/* Category Pill */}
        {product.category && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-semibold bg-black/60 text-white/80 rounded-md backdrop-blur-sm border border-white/10">
            {product.category.name.split(" ")[0]}
          </span>
        )}
      </div>

      {/* Info Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <span className="text-xl font-extrabold text-emerald-400 group-hover:text-emerald-300 transition">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.status !== "AVAILABLE" && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {product.status}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-slate-200 group-hover:text-white line-clamp-2 text-sm leading-snug mb-2">
            {product.title}
          </h3>
        </div>

        <div className="pt-3 border-t border-white/[0.08] space-y-1.5 text-xs text-slate-500">
          {product.location ? (
            <div className="flex items-center gap-1 truncate text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 truncate text-slate-400">
              <Tag className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Campus Pickup</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>By {product.seller?.name || "Student"}</span>
            <span>
              {new Date(product.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
