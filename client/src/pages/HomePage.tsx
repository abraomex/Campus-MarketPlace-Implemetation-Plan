import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product, Category } from "../types";
import { api } from "../services/api";
import { ProductCard } from "../components/products/ProductCard";
import {
  BookOpen,
  Laptop,
  Home,
  Shirt,
  Bike,
  Package,
  Ticket,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get<{ success: boolean; data: Product[] }>("/products?limit=8&sortBy=newest"),
          api.get<{ success: boolean; data: Category[] }>("/products/categories"),
        ]);
        setRecentProducts(prodRes.data.data || []);
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch home page data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "shows-events":
        return <Ticket className="w-6 h-6 text-pink-600" />;
      case "textbooks":
        return <BookOpen className="w-6 h-6 text-emerald-600" />;
      case "electronics":
        return <Laptop className="w-6 h-6 text-blue-600" />;
      case "dorm-furniture":
        return <Home className="w-6 h-6 text-purple-600" />;
      case "clothing":
        return <Shirt className="w-6 h-6 text-amber-600" />;
      case "bikes":
        return <Bike className="w-6 h-6 text-rose-600" />;
      default:
        return <Package className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-8 md:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Exclusively for verified students</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Buy & Sell On Campus with <span className="text-emerald-400">Zero Hassle</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
            Pass on your course textbooks, tech gadgets, dorm furniture, and appliances to fellow students. Meet safely right on your campus quad.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/products"
              className="px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              Browse Campus Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/sell"
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm transition"
            >
              List an Item for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Popular Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Browse items by campus department & need</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            See all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="group bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition">
                {getCategoryIcon(cat.slug)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition">
                  {cat.name.split(" ")[0]}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {cat._count?.products || 0} items
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Recently Listed</h2>
            <p className="text-sm text-slate-500 mt-1">Fresh items posted by students this week</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View all listings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No listings yet!</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              Be the first student to post an item for sale on campus.
            </p>
            <Link
              to="/sell"
              className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
            >
              Post First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Safety & Perks Feature Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Student Verified</h3>
              <p className="text-sm text-slate-500 mt-1">
                Every buyer and seller uses a registered university email address for accountability.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Zero Shipping Costs</h3>
              <p className="text-sm text-slate-500 mt-1">
                Arrange effortless pickup at the campus library, student union, or dorms.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Fair Peer Prices</h3>
              <p className="text-sm text-slate-500 mt-1">
                Save hundreds of dollars compared to campus bookstore retail prices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

