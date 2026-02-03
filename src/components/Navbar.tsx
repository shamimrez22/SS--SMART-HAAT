
"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-orange-600 shadow-lg border-b border-black/10 py-1">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-9">
          {/* LEFT: BRANDING */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 bg-black rounded-none flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <ShoppingBag className="h-3.5 w-3.5 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[12px] font-headline font-black text-white leading-none uppercase tracking-tighter">
                SS SMART HAAT
              </h1>
              <span className="text-[5px] text-white/90 font-bold uppercase tracking-[0.2em]">PREMIUM STORE</span>
            </div>
          </Link>

          {/* MIDDLE: CENTERED SEARCH BAR */}
          <div className="flex-grow max-w-sm relative group hidden md:block">
            <Input 
              type="search" 
              placeholder="SEARCH PRODUCTS..." 
              className="w-full bg-black/10 border-white/20 h-6 pl-8 pr-14 focus-visible:ring-black focus-visible:bg-black/20 transition-all rounded-none text-[8px] text-white uppercase placeholder:text-white/70 font-bold"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white" />
            <Button className="absolute right-0 top-0 h-6 rounded-none px-2 bg-black text-white hover:bg-black/90 font-black text-[7px] uppercase border-l border-white/10">
              SEARCH
            </Button>
          </div>

          {/* RIGHT: LINKS */}
          <div className="flex items-center gap-4 shrink-0">
            <ul className="hidden lg:flex items-center gap-4 text-[8px] font-black uppercase tracking-widest text-white">
              <li><Link href="/" className="hover:text-black transition-colors">HOME</Link></li>
              <li><Link href="/shop" className="hover:text-black transition-colors">SHOP</Link></li>
              <li><Link href="/categories" className="hover:text-black transition-colors">CATEGORY</Link></li>
            </ul>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative h-7 w-7 rounded-none hover:bg-black/10 text-white group">
                <ShoppingBag className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-black text-white text-[6px] font-black rounded-none flex items-center justify-center border border-orange-600">
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
