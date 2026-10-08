import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product, Category, PaginationMeta } from "../types";
import { api } from "../services/api";
import { ProductCard } from "../components/products/ProductCard";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
  RotateCcw,
} from "lucide-react";

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter states derived from searchParams
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const condition = searchParams.get("condition") || "";
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // Local state for search input to allow smooth typing
  const [searchInput, setSearchInput] = useState(search);

  // Load categories
  useEffect(() => {
    api
      .get<{ success: boolean; data: Category[] }>("/products/categories")
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // Fetch products whenever searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set("limit", "12");
        if (!queryParams.has("page")) queryParams.set("page", "1");

        const res = await api.get<{
          success: boolean;
          data: Product[];
          meta: PaginationMeta;
        }>(`/products?${queryParams.toString()}`);

        setProducts(res.data.data || []);
        if (res.data.meta) {
          setMeta(res.data.meta);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateParam = (key: string, value: string | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    // Reset to page 1 whenever filters change (except when changing page itself)
    if (key !== "page") {
      nextParams.set("page", "1");
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("search", searchInput.trim() || null);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white">Campus Marketplace</h1>
          <p className="text-sm text-slate-400 mt-1">
            Showing {meta.total} {meta.total === 1 ? "item" : "items"} available on campus
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/[0.06] text-white text-sm rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none placeholder:text-slate-500 shadow-sm"
            />
          </form>

          {/* Toggle filter mobile */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="md:hidden p-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white hover:bg-white/10 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => updateParam("sortBy", e.target.value)}
            className="bg-white/[0.06] border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none shadow-sm [&>option]:bg-slate-900"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`space-y-6 md:block ${
            filtersOpen ? "block" : "hidden"
          } bg-white/[0.03] md:bg-transparent p-5 md:p-0 rounded-2xl border border-white/10 md:border-0`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="font-bold text-slate-300 flex items-center gap-2 text-sm uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
              Filter Items
            </span>
            {(categoryId || condition || search || minPrice || maxPrice) && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => updateParam("categoryId", null)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
                  !categoryId
                    ? "bg-emerald-500 text-black font-bold"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam("categoryId", cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                    categoryId === cat.id
                      ? "bg-emerald-500 text-black font-bold"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {cat._count?.products !== undefined && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        categoryId === cat.id
                          ? "bg-black/20 text-black"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {cat._count.products}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Condition
            </label>
            <div className="space-y-1">
              {[
                { label: "All Conditions", value: "" },
                { label: "Brand New", value: "NEW" },
                { label: "Like New", value: "LIKE_NEW" },
                { label: "Good", value: "GOOD" },
                { label: "Fair", value: "FAIR" },
              ].map((cond) => (
                <button
                  key={cond.value}
                  onClick={() => updateParam("condition", cond.value || null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
                    condition === cond.value
                      ? "bg-emerald-500/20 text-emerald-300 font-bold"
                      : "text-slate-400 hover:bg-white/[0.06]"
                  }`}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Price Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={minPrice}
                onBlur={(e) => updateParam("minPrice", e.target.value || null)}
                className="w-full px-3 py-1.5 text-sm bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max"
                defaultValue={maxPrice}
                onBlur={(e) => updateParam("maxPrice", e.target.value || null)}
                className="w-full px-3 py-1.5 text-sm bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid & Pagination */}
        <div className="md:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.06] animate-pulse space-y-4"
                >
                  <div className="aspect-[4/3] bg-white/10 rounded-xl" />
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white/[0.04] rounded-2xl p-16 text-center border border-white/10">
              <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">No items found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                Try adjusting your search keywords, clearing your filters, or broadening your price range.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-white/10">
              <button
                disabled={page <= 1}
                onClick={() => updateParam("page", String(page - 1))}
                className="p-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-sm font-medium text-slate-400 px-4">
                Page <span className="font-bold text-white">{meta.page}</span> of{" "}
                <span className="font-bold text-white">{meta.totalPages}</span>
              </span>

              <button
                disabled={page >= meta.totalPages}
                onClick={() => updateParam("page", String(page + 1))}
                className="p-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
