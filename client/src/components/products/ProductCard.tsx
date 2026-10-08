import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { MapPin, Package, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const conditionLabels: Record<string, string> = {
  NEW: "Brand new",
  LIKE_NEW: "Like new",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Well loved",
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = product.images?.[0]?.url;
  const condition = conditionLabels[product.condition] || product.condition;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex min-w-0 flex-col rounded-3xl border border-[#e6e2da] bg-white p-3 shadow-[0_4px_6px_-1px_rgba(45,58,49,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(45,58,49,0.08)] focus:outline-none focus:ring-2 focus:ring-[#8c9a84] focus:ring-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#f2f0eb]">
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
            <Package className="h-8 w-8" strokeWidth={1.5} />
            <span className="text-xs font-medium">No photo provided</span>
          </div>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-[#f9f8f4]/90 px-3 py-1 text-[11px] font-medium text-[#2d3a31] shadow-sm backdrop-blur-sm">
          {condition}
        </span>
        {product.status !== "AVAILABLE" && (
          <span className="absolute right-3 top-3 rounded-full bg-[#f9f8f4]/90 px-3 py-1 text-[10px] font-semibold text-[#856438] shadow-sm backdrop-blur-sm">
            {product.status}
          </span>
        )}
      </div>

      <div className="px-2 pb-2 pt-4">
        <h3 className="line-clamp-2 font-serif text-base font-semibold leading-6 text-[#2d3a31] group-hover:text-[#a86450]">
          {product.title}
        </h3>
        <p className="mt-2 font-mono text-sm font-semibold tabular-nums text-[#2d3a31]">
          ${Number(product.price).toFixed(2)}
        </p>
        <div className="mt-2 flex items-center gap-1 truncate text-xs text-[#667168]">
          {product.location ? (
            <>
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{product.location}</span>
            </>
          ) : (
            <>
              <Tag className="h-3 w-3 shrink-0" />
              <span>Campus pickup</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span className="truncate">By {product.seller?.name || "Student"}</span>
        </div>
      </div>
    </Link>
  );
};
