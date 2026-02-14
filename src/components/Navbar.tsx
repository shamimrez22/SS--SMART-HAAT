"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Languages, MoreVertical, LayoutGrid, X, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminLoginModal } from '@/components/AdminLoginModal';
import { CategoryNavModal } from '@/components/CategoryNavModal';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LogoIcon = () => (
  <div className="w-9 h-9 bg-black rounded-none flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 border border-white/10 shrink-0">
    <span className="text-[#01a3a4] font-black text-xl tracking-tighter">SS</span>
  </div>
);

export function Navbar() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const storedLang = localStorage.getItem('app_lang') as 'EN' | 'BN';
    if (storedLang) setLanguage(storedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'EN' ? 'BN' : 'EN';
    setLanguage(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
      setShowSearchInput(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <nav className="w-full bg-transparent min-h-[52px] md:min-h-[56px] py-1 flex items-center relative z-[110] px-4">
        <div className="w-full">
          <div className="flex items-center justify-between gap-4">
            
            {/* LEFT: LOGO & NAME */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <LogoIcon />
              <div className="flex flex-col">
                <h1 className="text-[10px] sm:text-[12px] md:text-[13px] font-headline font-black text-white leading-none uppercase tracking-tighter">SS SMART HAAT</h1>
                <span className="text-[5px] sm:text-[6px] text-white font-bold uppercase tracking-[0.2em]">PREMIUM MARKET PLACE</span>
              </div>
            </Link>

            {/* CENTER: SEARCH BAR (Desktop) */}
            <div className="hidden md:flex items-center relative flex-grow max-w-[400px] px-4">
              <div className="relative w-full">
                <Input 
                  type="search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="SEARCH PRODUCTS..." 
                  className="bg-white/10 border-white/20 h-8 w-full rounded-none text-[9px] text-white font-medium uppercase placeholder:text-white/50 focus:ring-1 focus:ring-white pr-10"
                />
                <div className="absolute right-0 top-0 h-8 w-8 flex items-center justify-center border-l border-white/10">
                  <Search className="h-3 w-3 text-white stroke-[2.5px]" />
                </div>
              </div>
            </div>

            {/* RIGHT: NAVIGATION LINKS */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className="flex items-center gap-2 md:gap-4 text-[9px] font-bold uppercase tracking-widest text-white">
                
                <Link href="/" className="hover:opacity-70 transition-opacity flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5" /> <span className="hidden lg:inline">{language === 'EN' ? "HOME" : "হোম"}</span>
                </Link>

                <Link href="/shop" className="hover:opacity-70 transition-opacity flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5" /> <span className="hidden lg:inline">{language === 'EN' ? "SHOP" : "শপ"}</span>
                </Link>

                <button onClick={() => setIsCategoryModalOpen(true)} className="hover:opacity-70 transition-opacity flex items-center gap-1.5 uppercase tracking-widest">
                  <LayoutGrid className="h-3.5 w-3.5" /> <span className="hidden lg:inline">{language === 'EN' ? "CATEGORY" : "ক্যাটাগরি"}</span>
                </button>
                
                <button onClick={toggleLanguage} className="flex items-center gap-1 hover:opacity-70 transition-opacity uppercase tracking-widest border border-white/20 px-1.5 py-0.5">
                  {language}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-7 w-7 text-white hover:bg-white/10 rounded-none border border-white/10 flex items-center justify-center group">
                      <MoreVertical className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black border border-white/10 rounded-none shadow-2xl p-2 min-w-[180px] z-[150]">
                    <DropdownMenuItem className="p-3 cursor-pointer md:hidden text-white hover:bg-white/5" onClick={() => setShowSearchInput(!showSearchInput)}>
                      <Search className="h-4 w-4 mr-2 text-[#01a3a4]" />
                      <span className="text-[10px] font-bold uppercase">{language === 'EN' ? "SEARCH" : "খুঁজুন"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 cursor-pointer group text-white hover:bg-white/5" onClick={() => setIsAdminModalOpen(true)}>
                      <span className="text-[10px] font-bold uppercase group-hover:text-[#01a3a4] transition-colors">ADMIN PANEL</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* MOBILE SEARCH BAR */}
          {showSearchInput && (
            <div className="mt-2 pb-1 relative animate-in slide-in-from-top-2 duration-300 md:hidden">
              <Input 
                type="search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder={language === 'EN' ? "SEARCH PRODUCTS..." : "পণ্য খুঁজুন..."} 
                className="w-full bg-white/10 border-white/20 h-9 pl-10 pr-10 rounded-none text-[10px] text-white font-medium uppercase placeholder:text-white/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white stroke-[2.5px]" />
              <button onClick={() => { setShowSearchInput(false); setSearchQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"><X className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </nav>

      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
      <CategoryNavModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
    </>
  );
}
