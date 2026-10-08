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
  Sparkles,
  MapPin,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";

// Featured interactive drop items for the Top-Right Hero Showcase (inspired by Nike/Jordan reference)
const heroDrops = [
  {
    id: "drop-1",
    tag: "HOTTEST DROP",
    title: "Air Jordan Retro 1 'Chicago'",
    sub: "BASKETBALL & CAMPUS KICKS",
    price: 135,
    condition: "LIKE NEW",
    colorName: "Varsity Red",
    bgWatermark: "JUMP",
    glowColor: "from-rose-500/25 via-red-500/10 to-transparent",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80",
    seller: "Marcus (Dorm B)",
    categorySlug: "clothing",
  },
  {
    id: "drop-2",
    tag: "TECH SPOTLIGHT",
    title: "Apple MacBook Pro M2 14\"",
    sub: "COMPUTER SCIENCE SPEC",
    price: 890,
    condition: "FLAWLESS",
    colorName: "Space Grey",
    bgWatermark: "TECH",
    glowColor: "from-emerald-500/25 via-teal-500/10 to-transparent",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80",
    seller: "Sarah (Engineering)",
    categorySlug: "electronics",
  },
  {
    id: "drop-3",
    tag: "AUDIO GEAR",
    title: "Sony WH-1000XM5 ANC",
    sub: "NOISE CANCEL FOR STUDY",
    price: 195,
    condition: "MINT",
    colorName: "Silver Mist",
    bgWatermark: "SONIC",
    glowColor: "from-blue-500/25 via-cyan-500/10 to-transparent",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80",
    seller: "Alex (West Quad)",
    categorySlug: "electronics",
  },
];

export const HomePage: React.FC = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropIndex, setActiveDropIndex] = useState(0);

  const activeDrop = heroDrops[activeDropIndex];

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
        return <Ticket className="w-6 h-6 text-pink-500" />;
      case "textbooks":
        return <BookOpen className="w-6 h-6 text-emerald-500" />;
      case "electronics":
        return <Laptop className="w-6 h-6 text-blue-500" />;
      case "dorm-furniture":
        return <Home className="w-6 h-6 text-purple-500" />;
      case "clothing":
        return <Shirt className="w-6 h-6 text-amber-500" />;
      case "bikes":
        return <Bike className="w-6 h-6 text-rose-500" />;
      default:
        return <Package className="w-6 h-6 text-slate-400" />;
    }
  };

  // Live item to spotlight in Bottom-Right
  const spotlightProduct = recentProducts[0] || null;

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* ======================================================== */}
      {/* 🌟 HERO BENTO GRID SECTION (Structured to wireframe spec) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#0c101a] border border-white/10 p-4 sm:p-6 lg:p-8 shadow-2xl shadow-black/90 overflow-hidden">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-1/3 -mt-16 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 -mb-16 w-96 h-96 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-0 -ml-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          {/* ---------------------------------------------------- */}
          {/* BENTO GRID: 4 Modules formatted to match wireframe  */}
          {/* ---------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">

            {/* ================================================== */}
            {/* 1. TOP-LEFT MODULE (Title + Thumb + Text + Buttons) */}
            {/* ================================================== */}
            <div className="lg:col-span-7 bg-white/[0.03] hover:bg-white/[0.04] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group">
              {/* Top Title Area */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>STUDENT QUAD MARKET • ZERO SHIPPING FEES</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase text-white leading-[0.95]">
                  CAMPUS <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                    MARKET
                  </span> <br />
                  <span className="text-slate-400 text-3xl sm:text-4xl font-extrabold not-italic">
                    STUDENT DEALS
                  </span>
                </h1>
              </div>

              {/* Lower Sub-Grid: [Thumb] alongside [Text + 2 Buttons] */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-6 mt-6 border-t border-white/[0.08]">
                {/* "Thumb" Block on left */}
                <div className="sm:col-span-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-center items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase text-white tracking-wider">
                      100% VERIFIED
                    </p>
                    <p className="text-[10px] text-slate-400">
                      University Students Only
                    </p>
                  </div>
                </div>

                {/* "Text" & 2 "Buttons" on right */}
                <div className="sm:col-span-8 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Buy, reserve & sell campus textbooks, tech devices, dorm essentials, and show tickets safely on the quad.
                  </p>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <Link
                      to="/products"
                      className="px-5 py-3 rounded-xl font-black text-xs text-black bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-400/25 transition flex items-center gap-1.5 uppercase tracking-wider"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/sell"
                      className="px-5 py-3 rounded-xl font-bold text-xs text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 transition uppercase tracking-wider"
                    >
                      List an Item
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================== */}
            {/* 2. TOP-RIGHT MODULE (Image showcase & Nike style)  */}
            {/* ================================================== */}
            <div className="lg:col-span-5 bg-gradient-to-b from-white/[0.06] to-black/50 border border-white/[0.08] rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden min-h-[380px] group">
              {/* Background Giant Watermark Typography (Nike/Jordan reference style) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="text-[7rem] sm:text-[9rem] font-black italic tracking-tighter text-white/[0.03] uppercase scale-125 transform -rotate-6">
                  {activeDrop.bgWatermark}
                </span>
              </div>

              {/* Top Bar of Card: Tag & Condition */}
              <div className="flex items-center justify-between relative z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {activeDrop.tag}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {activeDrop.sub}
                </span>
              </div>

              {/* Main Floating Product Image */}
              <div className="relative z-10 py-4 flex items-center justify-center">
                <div
                  className={`absolute inset-0 bg-gradient-to-tr ${activeDrop.glowColor} rounded-full blur-2xl transform scale-90 pointer-events-none`}
                />
                <img
                  src={activeDrop.image}
                  alt={activeDrop.title}
                  className="w-full max-w-[280px] sm:max-w-[320px] h-48 sm:h-52 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500"
                />
              </div>

              {/* Bottom Area: Price + Item Name + Choose Color Selector */}
              <div className="relative z-10 space-y-3 pt-2">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                      {activeDrop.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Seller: <span className="text-slate-300 font-semibold">{activeDrop.seller}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-rose-500 tracking-tight">
                      ${activeDrop.price}
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">
                      Campus Deal
                    </span>
                  </div>
                </div>

                {/* "CHOOSE COLOR / SWITCH DROP" Selector bar */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      DROPS:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {heroDrops.map((drop, idx) => (
                        <button
                          key={drop.id}
                          onClick={() => setActiveDropIndex(idx)}
                          className={`w-9 h-9 rounded-xl overflow-hidden border p-0.5 transition ${
                            activeDropIndex === idx
                              ? "border-emerald-400 ring-2 ring-emerald-400/30 scale-105"
                              : "border-white/10 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={drop.thumb}
                            alt={drop.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/products"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ================================================== */}
            {/* 3. BOTTOM-LEFT MODULE (Wide Image Banner Showcase) */}
            {/* ================================================== */}
            <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-white/[0.08] min-h-[220px] flex flex-col justify-between p-6 sm:p-8 group">
              {/* Background visual photo */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80")`,
                }}
              />
              {/* Deep dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-slate-950/60" />

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>CAMPUS SHOWS & CONCERT PASSES</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase">
                  SPRING FEST & CAMPUS NIGHTS
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                  Need last-minute tickets or want to transfer passes? Trade tickets directly with university classmates at face value with zero extra service fees.
                </p>
              </div>

              <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Instant Student Meetup • Verified Tickets</span>
                </div>
                <Link
                  to="/products?category=shows-events"
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-400/20 transition flex items-center gap-1.5"
                >
                  <span>Browse Tickets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* ================================================== */}
            {/* 4. BOTTOM-RIGHT MODULE (Spotlight Product Card)   */}
            {/* ================================================== */}
            <div className="lg:col-span-4 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group transition">
              {spotlightProduct ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      JUST LISTED
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      ${Number(spotlightProduct.price).toFixed(2)}
                    </span>
                  </div>

                  <Link to={`/products/${spotlightProduct.id}`} className="block relative aspect-[16/10] rounded-2xl overflow-hidden mb-3 bg-black/40">
                    <img
                      src={
                        spotlightProduct.images && spotlightProduct.images[0]
                          ? spotlightProduct.images[0].url
                          : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={spotlightProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                      <span className="font-bold truncate">{spotlightProduct.title}</span>
                      <span className="text-emerald-400 font-extrabold shrink-0">
                        ${Number(spotlightProduct.price).toFixed(2)}
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 truncate text-slate-400 text-[11px]">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{spotlightProduct.location || "Campus Quad"}</span>
                    </div>
                    <Link
                      to={`/products/${spotlightProduct.id}`}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 transition shrink-0"
                    >
                      Buy / Reserve
                    </Link>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-4">
                  <ShoppingBag className="w-10 h-10 text-emerald-400/50 mb-2" />
                  <h4 className="font-bold text-white text-sm">Post the First Item!</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Earn cash by selling unused course books & gear.
                  </p>
                  <Link
                    to="/sell"
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 transition"
                  >
                    Sell Item Now
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. POPULAR CATEGORIES SECTION                            */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Popular Categories
            </h2>
            <p className="text-sm text-slate-400 mt-1">Browse items by campus department & need</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 uppercase tracking-wider"
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
              className="group bg-white/[0.04] p-5 rounded-2xl border border-white/[0.08] backdrop-blur-sm hover:border-emerald-500/50 hover:bg-white/[0.08] transition-all flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 flex items-center justify-center transition">
                {getCategoryIcon(cat.slug)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
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

      {/* ======================================================== */}
      {/* 3. RECENT LISTINGS SECTION                               */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Recently Listed
            </h2>
            <p className="text-sm text-slate-400 mt-1">Fresh items posted by students this week</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 uppercase tracking-wider"
          >
            View all listings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white/5 rounded-2xl p-4 border border-white/10 animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-white/10 rounded-xl" />
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="bg-white/[0.04] rounded-2xl p-12 text-center border border-white/[0.08] backdrop-blur-sm">
            <Package className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No listings yet!</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-6">
              Be the first student to post an item for sale on campus.
            </p>
            <Link
              to="/sell"
              className="px-6 py-3 bg-emerald-500 text-black font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition"
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

      {/* ======================================================== */}
      {/* 4. SAFETY & PERKS ROW                                    */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.04] p-6 rounded-2xl border border-white/[0.08] shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Student Verified</h3>
              <p className="text-sm text-slate-400 mt-1">
                Every buyer and seller uses a registered university email address for accountability.
              </p>
            </div>
          </div>

          <div className="bg-white/[0.04] p-6 rounded-2xl border border-white/[0.08] shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Zero Shipping Costs</h3>
              <p className="text-sm text-slate-400 mt-1">
                Arrange effortless pickup at the campus library, student union, or dorms.
              </p>
            </div>
          </div>

          <div className="bg-white/[0.04] p-6 rounded-2xl border border-white/[0.08] shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Fair Peer Prices</h3>
              <p className="text-sm text-slate-400 mt-1">
                Save hundreds of dollars compared to campus bookstore retail prices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
