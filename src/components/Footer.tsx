import React from 'react';
import { Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 mt-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg grid place-items-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">SPRINTER<span className="text-sky-500">PLUS</span></span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              OEM & premium parts for Every Car 1970-2025. EU based & globally shipped.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Shop</h4>
            <ul className="space-y-2.5 text-sm text-zinc-600">
              <li><Link to="/products" className="hover:text-zinc-900">Engine Parts</Link></li>
              <li><Link to="/products" className="hover:text-zinc-900">Brake System</Link></li>
              <li><Link to="/products" className="hover:text-zinc-900">Suspension</Link></li>
              <li><Link to="/products" className="hover:text-zinc-900">Lighting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2.5 text-sm text-zinc-600">
              <li><Link to="/about" className="hover:text-zinc-900">About Us</Link></li>
              <li><Link to="/brands" className="hover:text-zinc-900">Brands</Link></li>
              <li><Link to="/contact" className="hover:text-zinc-900">Contact</Link></li>
              <li><Link to="/about" className="hover:text-zinc-900">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2.5 text-sm text-zinc-600">
              <li><Link to="/contact" className="hover:text-zinc-900">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-zinc-900">Shipping</Link></li>
              <li><Link to="/contact" className="hover:text-zinc-900">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-zinc-900">Fitment Guide</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-sm mb-3">Newsletter</h4>
            <p className="text-sm text-zinc-600 mb-3">Get new parts alerts & car tips.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="Email"
                className="flex-1 h-10 px-3 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button className="h-10 px-4 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>© 2026 SprinterPlus GmbH. All rights reserved. Based in Prizren, Kosovo – Shipping across EU.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-zinc-700 transition">Privacy</a>
            <a href="#" className="hover:text-zinc-700 transition">Terms</a>
            <a href="#" className="hover:text-zinc-700 transition">Imprint</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
