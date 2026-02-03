
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminLoginModal } from '@/components/AdminLoginModal';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdminModalOpen(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#01a3a4] shadow-lg border-b border-black/10 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-6 h-12">
            {/* LEFT: BRANDING */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 bg-black rounded-none flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <ShoppingBag className="h-5 w-5 text-[#01a3a4]" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-[16px] font-headline font-black text-white leading-none uppercase tracking-tighter">
                  SS SMART HAAT
                </h1>
                <span className="text-[7px] text-white/90 font-bold uppercase tracking-[0.2em]">PREMIUM STORE</span>
              </div>
            </Link>

            {/* MIDDLE: CENTERED SEARCH BAR */}
            <div className="flex-grow max-w-lg relative group hidden md:block">
              <Input 
                type="search" 
                placeholder="SEARCH PRODUCTS..." 
                className="w-full bg-black/10 border-white/20 h-8 pl-10 pr-20 focus-visible:ring-black focus-visible:bg-black/20 transition-all rounded-none text-[10px] text-white uppercase placeholder:text-white/70 font-bold"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
              <Button className="absolute right-0 top-0 h-8 rounded-none px-4 bg-black text-white hover:bg-black/90 font-black text-[10px] uppercase border-l border-white/10">
                SEARCH
              </Button>
            </div>

            {/* RIGHT: LINKS */}
            <div className="flex items-center gap-6 shrink-0">
              <ul className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white">
                <li><Link href="/" className="hover:text-black transition-colors">HOME</Link></li>
                <li><Link href="/shop" className="hover:text-black transition-colors">SHOP</Link></li>
                <li><Link href="/categories" className="hover:text-black transition-colors">CATEGORY</Link></li>
                <li>
                  <button 
                    onClick={handleAdminClick}
                    className="hover:text-black transition-colors font-black uppercase tracking-widest"
                  >
                    ADMIN
                  </button>
                </li>
              </ul>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-none hover:bg-black/10 text-white group">
                  <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[8px] font-black rounded-none flex items-center justify-center border border-[#01a3a4]">
                    0
                  </span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden h-9 w-9 rounded-none text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#01a3a4] brightness-90 border-t border-black/5 p-4 space-y-4">
            <ul className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest text-white">
              <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link></li>
              <li><Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>SHOP</Link></li>
              <li><Link href="/categories" onClick={() => setIsMobileMenuOpen(false)}>CATEGORY</Link></li>
              <li>
                <button onClick={(e) => { setIsMobileMenuOpen(false); handleAdminClick(e); }}>
                  ADMIN
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <AdminLoginModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
      />
    </>
  );
}
