import React from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { MapPin, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const conditionLabels: Record<string, { text: string; color: string }> = {
  NEW: { text: "Brand New", color: "bg-emerald-100 text-emerald-800" },
  LIKE_NEW: { text: "Like New", color: "bg-teal-100 text-teal-800" },
  GOOD: { text: "Good", color: "bg-blue-100 text-blue-800" },
  FAIR: { text: "Fair", color: "bg-amber-100 text-amber-800" },
  POOR: { text: "Poor", color: "bg-orange-100 text-orange-800" },
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80";

  const conditionInfo = conditionLabels[product.condition] || {
    text: product.condition,
    color: "bg-slate-100 text-slate-800",
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback image if broken link
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Condition Badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md ${conditionInfo.color}`}
        >
          {conditionInfo.text}
        </span>

        {/* Category Pill */}
        {product.category && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[11px] font-medium bg-slate-900/75 text-white rounded-md backdrop-blur-sm">
            {product.category.name.split(" ")[0]}
          </span>
        )}
      </div>

      {/* Info Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <span className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.status !== "AVAILABLE" && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                {product.status}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 line-clamp-2 text-sm leading-snug mb-2">
            {product.title}
          </h3>
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
          {product.location ? (
            <div className="flex items-center gap-1 truncate text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 truncate text-slate-500">
              <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Campus Pickup</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-600">
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

