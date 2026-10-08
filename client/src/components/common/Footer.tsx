import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, MapPin, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-xl font-bold text-white tracking-tight">
              Campus<span className="text-emerald-400">Market</span>
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">
              The student-to-student marketplace. Buy and sell textbooks, electronics, dorm essentials, and campus gear securely with peers.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exclusively for university students</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/products" className="hover:text-white transition">
                  All Listings
                </Link>
              </li>
              <li>
                <Link to="/products?category=textbooks" className="hover:text-white transition">
                  Course Textbooks
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="hover:text-white transition">
                  Electronics & Laptops
                </Link>
              </li>
              <li>
                <Link to="/products?category=dorm-furniture" className="hover:text-white transition">
                  Dorm & Furniture
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-white transition">
                  Post a Listing
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Safety */}
          <div className="md:col-span-2 bg-slate-800/50 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Campus Safety Guidelines</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Meet in busy campus locations (student union, library lobby, quad).</span>
              </li>
              <li>• Always inspect items in person before completing peer payments.</li>
              <li>• Use university email addresses to verify fellow student identities.</li>
              <li>• Never send wire transfers or pay without seeing high-value items.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Campus Marketplace. Built for students.</p>
          <p className="flex items-center gap-1">
            Made with React, Express, Prisma & PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
};

