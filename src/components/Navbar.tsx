
"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-orange-600 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between gap-6">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center shadow-2xl">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-headline font-black text-white leading-none uppercase tracking-tighter">
                SS SMART HAAT
              </h1>
              <span className="text-[8px] text-white/90 font-bold uppercase tracking-[0.3em] mt-1">PREMIUM STORE</span>
            </div>
          </Link>

          {/* SEARCH BAR & LINKS (COMPACT ON ONE LINE) */}
          <div className="flex-grow flex items-center gap-6">
            <div className="flex-grow relative group max-w-3xl">
              <Input 
                type="search" 
                placeholder="SEARCH PREMIUM PRODUCTS..." 
                className="w-full bg-black/10 border-white/20 h-12 pl-12 pr-28 focus-visible:ring-black focus-visible:bg-black/20 transition-all rounded-full text-xs text-white uppercase placeholder:text-white/70 font-bold"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
              <Button className="absolute right-0 top-0 h-12 rounded-r-full px-8 bg-black text-white hover:bg-black/90 font-black text-[10px] uppercase border-l border-white/10">
                SEARCH
              </Button>
            </div>

            <ul className="hidden xl:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-white shrink-0">
              <li><Link href="/" className="hover:opacity-70 transition-opacity">HOME</Link></li>
              <li><Link href="#" className="hover:opacity-70 transition-opacity">SHOP</Link></li>
              <li><Link href="#" className="hover:opacity-70 transition-opacity">CATEGORY</Link></li>
              <li><Link href="#" className="hover:opacity-70 transition-opacity">SIGN UP</Link></li>
            </ul>
          </div>

          {/* SECURE ICON AREA */}
          <div className="flex items-center gap-4 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-full hover:bg-black/10 text-white group">
                  <ShoppingBag className="h-7 w-7 transition-transform group-hover:scale-110" />
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-orange-600">
                    0
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 text-white p-2 rounded-2xl shadow-2xl">
                <DropdownMenuItem className="h-12 focus:bg-orange-600 focus:text-white cursor-pointer rounded-xl font-black text-[11px] uppercase tracking-widest px-4">
                  <Link href="#" className="w-full">MY SHOPPING CART</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="h-12 focus:bg-orange-600 focus:text-white cursor-pointer rounded-xl font-black text-[11px] uppercase tracking-widest px-4 mt-1">
                  <Link href="/admin" className="w-full">SECURE ADMIN PANEL</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
