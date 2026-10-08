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
      className="group flex min-w-0 flex-col rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#222]">
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
            <Package className="h-8 w-8" strokeWidth={1.5} />
            <span className="text-xs font-medium">No photo provided</span>
          </div>
        )}
        <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 text-[11px] font-medium text-white">
          {condition}
        </span>
        {product.status !== "AVAILABLE" && (
          <span className="absolute right-2 top-2 rounded bg-black/75 px-2 py-1 text-[10px] font-medium text-amber-200">
            {product.status}
          </span>
        )}
      </div>

      <div className="pt-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-5 text-white group-hover:text-emerald-200">
          {product.title}
        </h3>
        <p className="mt-1.5 font-mono text-sm font-semibold tabular-nums text-slate-100">
          ${Number(product.price).toFixed(2)}
        </p>
        <div className="mt-1.5 flex items-center gap-1 truncate text-xs text-slate-500">
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
