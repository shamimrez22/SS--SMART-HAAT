
"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-orange-600 shadow-lg border-b border-black/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 gap-4">
          {/* LEFT: BRANDING */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-black rounded-none flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <ShoppingBag className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-headline font-black text-white leading-none uppercase tracking-tighter">
                SS SMART HAAT
              </h1>
              <span className="text-[6px] text-white/90 font-bold uppercase tracking-[0.2em]">PREMIUM STORE</span>
            </div>
          </Link>

          {/* MIDDLE: SEARCH BAR */}
          <div className="flex-grow max-w-xl relative group">
            <Input 
              type="search" 
              placeholder="SEARCH PRODUCTS..." 
              className="w-full bg-black/10 border-white/20 h-8 pl-10 pr-20 focus-visible:ring-black focus-visible:bg-black/20 transition-all rounded-none text-[10px] text-white uppercase placeholder:text-white/70 font-bold"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
            <Button className="absolute right-0 top-0 h-8 rounded-none px-3 bg-black text-white hover:bg-black/90 font-black text-[9px] uppercase border-l border-white/10">
              SEARCH
            </Button>
          </div>

          {/* RIGHT: NAVIGATION LINKS */}
          <div className="flex items-center gap-4 shrink-0">
            <ul className="hidden lg:flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white">
              <li><Link href="/" className="hover:text-black transition-colors">HOME</Link></li>
              <li><Link href="/shop" className="hover:text-black transition-colors">SHOP</Link></li>
              <li><Link href="/categories" className="hover:text-black transition-colors">CATEGORY</Link></li>
              <li><Link href="/admin" className="hover:text-black transition-colors flex items-center gap-1"><LayoutDashboard className="h-3 w-3"/> ADMIN</Link></li>
            </ul>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-none hover:bg-black/10 text-white group">
                <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black text-white text-[7px] font-black rounded-none flex items-center justify-center border border-orange-600">
                  0
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
