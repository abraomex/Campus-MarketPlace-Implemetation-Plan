import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Category, PaginationMeta, Product } from "../types";
import { api } from "../services/api";
import { ProductCard } from "../components/products/ProductCard";
import {
  ArrowDownRight,
  ArrowRight,
  Bike,
  BookOpen,
  Check,
  Handshake,
  Heart,
  Home,
  Laptop,
  Leaf,
  MapPin,
  MessageCircle,
  Package,
  Shirt,
  Ticket,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [listingTotal, setListingTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [spotlightImageFailed, setSpotlightImageFailed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get<{
            success: boolean;
            data: Product[];
            meta?: PaginationMeta;
          }>("/products?limit=8&sortBy=newest"),
          api.get<{ success: boolean; data: Category[] }>("/products/categories"),
        ]);

        const products = productsResponse.data.data || [];
        setRecentProducts(products);
        setListingTotal(productsResponse.data.meta?.total ?? products.length);
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
        return <Ticket className={iconClass} strokeWidth={1.5} />;
      case "textbooks":
        return <BookOpen className={iconClass} strokeWidth={1.5} />;
      case "electronics":
        return <Laptop className={iconClass} strokeWidth={1.5} />;
      case "dorm-furniture":
        return <Home className={iconClass} strokeWidth={1.5} />;
      case "clothing":
        return <Shirt className={iconClass} strokeWidth={1.5} />;
      case "bikes":
        return <Bike className={iconClass} strokeWidth={1.5} />;
      default:
        return <Package className={iconClass} strokeWidth={1.5} />;
    }
  };

  const spotlightProduct = recentProducts[0];
  const recentSellerCount = new Set(recentProducts.map((product) => product.sellerId)).size;
  const stats = [
    { value: listingTotal, label: "Items available now" },
    { value: categories.length, label: "Campus categories" },
    { value: recentSellerCount, label: "Student sellers in recent finds" },
  ];

  return (
    <div className="overflow-hidden pb-20">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-14 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_0.86fr] lg:gap-20 lg:px-12 lg:pb-20">
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#647663]">
            <Leaf className="h-4 w-4" strokeWidth={1.5} />
            A little more local. A little less waste.
          </p>
          <h1 className="max-w-2xl font-serif text-5xl font-semibold leading-[1.08] tracking-tight text-[#2d3a31] sm:text-6xl lg:text-7xl">
            Find good things.
            <br />
            <span className="font-serif italic font-medium text-[#8c9a84]">
              Pass them on.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#667168]">
            A campus marketplace for the books, room finds, and everyday things
            that are better when they find a second home.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#2d3a31] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(45,58,49,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#425348] hover:shadow-[0_12px_24px_rgba(45,58,49,0.16)] focus:outline-none focus:ring-2 focus:ring-[#8c9a84] focus:ring-offset-2"
            >
              Explore the marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/sell"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#8c9a84] px-6 py-3 text-sm font-semibold text-[#647663] transition duration-300 hover:-translate-y-0.5 hover:border-[#c27b66] hover:text-[#a86450] focus:outline-none focus:ring-2 focus:ring-[#8c9a84] focus:ring-offset-2"
            >
              Share something
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#667168]">
            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-[#8c9a84]" strokeWidth={1.7} />
              Student-to-student
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#8c9a84]" strokeWidth={1.7} />
              Meet right on campus
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div
            aria-hidden="true"
            className="absolute -right-8 top-8 h-4/5 w-4/5 rounded-t-full bg-[#e9e4d9] sm:-right-10"
          />
          <div className="relative mx-auto aspect-[3/4] w-[86%] rounded-t-full rounded-b-[42%] bg-[#e7e4dc] shadow-[0_25px_50px_-12px_rgba(45,58,49,0.15)] sm:aspect-square sm:w-full sm:rounded-[48%_48%_40%_40%]">
            <div className="absolute inset-0 overflow-hidden rounded-t-full rounded-b-[42%] sm:rounded-[48%_48%_40%_40%]">
              {spotlightProduct?.images?.[0]?.url && !spotlightImageFailed ? (
                <img
                  src={spotlightProduct.images[0].url}
                  alt={spotlightProduct.title}
                  className="h-full w-full object-cover"
                  onError={() => setSpotlightImageFailed(true)}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-[#8c9a84]">
                  <Package className="h-16 w-16" strokeWidth={1} />
                  <span className="text-sm">A new find could be here</span>
                </div>
              )}
            </div>
            {spotlightProduct && (
              <Link
                to={`/products/${spotlightProduct.id}`}
                className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-[#f9f8f4]/90 p-4 shadow-[0_10px_24px_rgba(45,58,49,0.1)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 sm:inset-x-6 sm:bottom-6"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-medium uppercase tracking-[0.12em] text-[#8c9a84]">
                    A recent find
                  </span>
                  <span className="mt-1 block truncate font-serif text-lg font-semibold text-[#2d3a31]">
                    {spotlightProduct.title}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-sm font-semibold tabular-nums text-[#2d3a31]">
                    ${Number(spotlightProduct.price).toFixed(2)}
                  </span>
                  <ArrowDownRight className="ml-auto mt-1 h-4 w-4 text-[#c27b66]" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 divide-y divide-[#e6e2da] rounded-3xl border border-[#e6e2da] bg-white/70 px-6 py-2 shadow-[0_10px_24px_rgba(45,58,49,0.04)] sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 px-2 py-5 sm:justify-center sm:px-5">
              <span className="font-serif text-3xl font-semibold tabular-nums text-[#2d3a31] sm:text-4xl">
                {loading ? "—" : stat.value.toLocaleString()}
              </span>
              <span className="max-w-28 text-sm leading-5 text-[#667168]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#8c9a84]">Follow your curiosity</p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#2d3a31] sm:text-4xl">
              Browse by category
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#647663] transition hover:gap-3 hover:text-[#c27b66]"
          >
            See every listing <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?categoryId=${category.id}`}
              className={`group flex min-h-36 items-end justify-between rounded-3xl border border-[#e6e2da] p-5 shadow-[0_4px_6px_-1px_rgba(45,58,49,0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(45,58,49,0.08)] focus:outline-none focus:ring-2 focus:ring-[#8c9a84] ${
                index % 3 === 1 ? "bg-[#f2f0eb]" : "bg-white"
              }`}
            >
              <span>
                <span className="mb-4 block text-[#8c9a84] transition duration-500 group-hover:rotate-[-6deg] group-hover:text-[#c27b66]">
                  {getCategoryIcon(category.slug)}
                </span>
                <span className="block font-serif text-lg font-semibold leading-snug text-[#2d3a31]">
                  {category.name}
                </span>
                <span className="mt-1 block text-sm text-[#667168]">
                  {category._count?.products || 0} items to explore
                </span>
              </span>
              <ArrowRight className="mb-1 h-4 w-4 shrink-0 text-[#8c9a84] transition duration-500 group-hover:translate-x-1 group-hover:text-[#c27b66]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#8c9a84]">Recently shared</p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#2d3a31] sm:text-4xl">
              Fresh finds from campus
            </h2>
            <p className="mt-2 text-base text-[#667168]">
              Useful things, ready for their next chapter.
            </p>
          </div>
          <Link
            to="/products"
            className="hidden min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-[#647663] transition hover:gap-3 hover:text-[#c27b66] sm:inline-flex"
          >
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[4/3] rounded-3xl bg-[#e8e5dd]" />
                <div className="mt-4 h-4 w-1/3 rounded-full bg-[#e8e5dd]" />
                <div className="mt-3 h-4 w-3/4 rounded-full bg-[#e8e5dd]" />
              </div>
            ))}
          </div>
        ) : recentProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#e6e2da] bg-white px-6 py-16 text-center shadow-[0_10px_24px_rgba(45,58,49,0.04)]">
            <Package className="mx-auto h-10 w-10 text-[#8c9a84]" strokeWidth={1.4} />
            <h3 className="mt-4 font-serif text-xl font-semibold text-[#2d3a31]">
              The first find is waiting
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-base leading-7 text-[#667168]">
              Give something useful a new home. Your listing might be just what
              another student needs.
            </p>
            <Link
              to="/sell"
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#2d3a31] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#c27b66]"
            >
              Create the first listing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold text-[#8c9a84]">Simple by nature</p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#2d3a31] sm:text-4xl">
            From “I need that” to “glad it found you.”
          </h2>
          <p className="mt-3 text-base leading-7 text-[#667168]">
            A good campus exchange should feel easy, personal, and close to home.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {[
            {
              number: "01",
              icon: <BookOpen className="h-6 w-6" strokeWidth={1.5} />,
              title: "Find something useful",
              description:
                "Explore books, technology, room essentials, and more from students nearby.",
            },
            {
              number: "02",
              icon: <MessageCircle className="h-6 w-6" strokeWidth={1.5} />,
              title: "Talk it through",
              description:
                "Message the seller to ask questions and settle on a time that works.",
            },
            {
              number: "03",
              icon: <Handshake className="h-6 w-6" strokeWidth={1.5} />,
              title: "Meet and pass it on",
              description:
                "Arrange a campus meetup, check the item, and give it a new chapter.",
            },
          ].map((step) => (
            <article key={step.number} className="relative border-t border-[#d9ded5] pt-6">
              <span className="absolute right-0 top-5 font-mono text-xs tracking-[0.14em] text-[#9ba697]">
                {step.number}
              </span>
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e9ede6] text-[#647663]">
                {step.icon}
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#2d3a31]">
                {step.title}
              </h3>
              <p className="mt-2 max-w-sm text-base leading-7 text-[#667168]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid items-center gap-8 rounded-[2rem] bg-[#e9e4d9] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#647663]">
              <Heart className="h-4 w-4" strokeWidth={1.5} />
              Keep good things in circulation
            </span>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-[#2d3a31] sm:text-4xl">
              Your next great find may already be on campus.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#667168]">
              Shop locally, find a new favorite, or help someone else make use
              of what you no longer need.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              to="/products"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2d3a31] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#c27b66]"
            >
              Browse the listings <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/sell"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#8c9a84] px-6 py-3 text-sm font-semibold text-[#52644f] transition duration-300 hover:border-[#c27b66] hover:text-[#a86450]"
            >
              List something you love
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
