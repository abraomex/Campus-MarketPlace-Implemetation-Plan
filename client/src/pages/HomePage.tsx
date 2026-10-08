import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Category, Product } from "../types";
import { api } from "../services/api";
import { ProductCard } from "../components/products/ProductCard";
import {
  ArrowRight,
  Bike,
  BookOpen,
  Home,
  Laptop,
  Package,
  Shirt,
  Ticket,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get<{ success: boolean; data: Product[] }>("/products?limit=8&sortBy=newest"),
          api.get<{ success: boolean; data: Category[] }>("/products/categories"),
        ]);
        setRecentProducts(productsResponse.data.data || []);
        setCategories(categoriesResponse.data.data || []);
      } catch (error) {
        console.error("Failed to fetch home page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (slug: string) => {
    const iconClass = "h-5 w-5";

    switch (slug) {
      case "shows-events":
        return <Ticket className={iconClass} />;
      case "textbooks":
        return <BookOpen className={iconClass} />;
      case "electronics":
        return <Laptop className={iconClass} />;
      case "dorm-furniture":
        return <Home className={iconClass} />;
      case "clothing":
        return <Shirt className={iconClass} />;
      case "bikes":
        return <Bike className={iconClass} />;
      default:
        return <Package className={iconClass} />;
    }
  };

  return (
    <div className="pb-16">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-emerald-300">
              Your campus, secondhand
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Find your next favorite.
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Good stuff from students around you.
            </p>
          </div>
          <Link
            to="/sell"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-[#07100d] transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-[#0f0f0f]"
          >
            List an item <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-5 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            to="/products"
            className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#111] transition hover:bg-slate-200"
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?categoryId=${category.id}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#272727] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <span className="text-slate-400">{getCategoryIcon(category.slug)}</span>
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Recently listed
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The latest finds from your campus
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[4/3] rounded-lg bg-[#222]" />
                <div className="mt-3 h-4 w-1/3 rounded bg-[#222]" />
                <div className="mt-2 h-4 w-3/4 rounded bg-[#222]" />
              </div>
            ))}
          </div>
        ) : recentProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-[#181818] px-6 py-14 text-center">
            <Package className="mx-auto h-9 w-9 text-slate-500" />
            <h3 className="mt-4 text-lg font-medium text-white">No listings yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Be the first to share something useful with your campus.
            </p>
            <Link
              to="/sell"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-[#07100d] transition hover:bg-emerald-300"
            >
              Create a listing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};
