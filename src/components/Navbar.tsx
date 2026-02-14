"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MoreVertical, LayoutGrid, X, Home, ShoppingBag, MoreHorizontal } from 'lucide-react';
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
  <div className="w-9 h-9 md:w-10 md:h-10 bg-black rounded-none flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 border border-white/10 shrink-0">
    <span className="text-white font-black text-xl md:text-2xl tracking-tighter">SS</span>
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
      <nav className="w-full bg-transparent min-h-[44px] md:min-h-[48px] py-0.5 flex items-center relative z-[110] px-4">
        <div className="w-full">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 md:gap-3 shrink-0 group">
              <Link href="/"><LogoIcon /></Link>
              
              {/* SECRET ADMIN TRIGGER: Subtle 3 dots next to logo */}
              <div 
                onClick={() => setIsAdminModalOpen(true)}
                className="cursor-default select-none flex items-center h-full px-1"
              >
                <MoreHorizontal className="h-3 w-3 text-white/20 hover:text-white/40 transition-colors" />
              </div>

              <div className="flex flex-col">
                <Link href="/"><h1 className="text-[10px] sm:text-[12px] md:text-[14px] font-headline font-black text-white leading-none uppercase tracking-tighter">SS SMART HAAT</h1></Link>
                <span className="text-[6px] sm:text-[7px] text-white font-bold uppercase tracking-[0.2em] opacity-90">
                  PREMIUM MARKET PLACE
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center relative flex-grow max-w-[500px] px-6">
              <div className="relative w-full">
                <Input 
                  type="search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="SEARCH FOR PREMIUM PRODUCTS..." 
                  className="bg-white border-none h-9 w-full rounded-none text-[10px] text-black font-black uppercase placeholder:text-black/40 focus:ring-2 focus:ring-white pr-12 shadow-inner"
                />
                <div className="absolute right-0 top-0 h-9 w-9 flex items-center justify-center border-l border-black/5">
                  <Search className="h-3 w-3 text-[#01a3a4] stroke-[3px]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-5 shrink-0">
              <div className="flex items-center gap-3 md:gap-5 text-[10px] font-bold uppercase tracking-widest text-white">
                
                <Link href="/" className="hover:opacity-70 transition-opacity flex items-center gap-1.5">
                  <Home className="h-4 w-4" /> <span className="hidden lg:inline">{language === 'EN' ? "HOME" : "হোম"}</span>
                </Link>

                <Link href="/shop" className="hover:opacity-70 transition-opacity flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4" /> <span className="hidden lg:inline">{language === 'EN' ? "SHOP" : "শপ"}</span>
                </Link>

                <button onClick={() => setIsCategoryModalOpen(true)} className="hover:opacity-70 transition-opacity flex items-center gap-1.5 uppercase tracking-widest">
                  <LayoutGrid className="h-4 w-4" /> <span className="hidden lg:inline">{language === 'EN' ? "CATEGORY" : "ক্যাটাগরি"}</span>
                </button>
                
                <button onClick={toggleLanguage} className="flex items-center gap-1 hover:opacity-70 transition-opacity uppercase tracking-widest border border-white/30 px-2 py-1 bg-black/10">
                  {language}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-8 w-8 text-white hover:bg-white/10 rounded-none border border-white/20 flex items-center justify-center group z-[120]">
                      <MoreVertical className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black border border-white/20 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 min-w-[180px] z-[200] relative">
                    <DropdownMenuItem className="p-3 cursor-pointer md:hidden text-white hover:bg-white/10 focus:bg-white/10 rounded-none border-b border-white/5" onClick={() => setShowSearchInput(!showSearchInput)}>
                      <Search className="h-4 w-4 mr-3 text-[#01a3a4]" />
                      <span className="text-[10px] font-black uppercase">{language === 'EN' ? "SEARCH" : "খুঁজুন"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 cursor-pointer text-white/40 hover:text-white focus:bg-white/10 rounded-none" onClick={() => router.push('/')}>
                      <span className="text-[10px] font-black uppercase">SUPPORT</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {showSearchInput && (
            <div className="mt-2 pb-2 relative animate-in slide-in-from-top-2 duration-300 md:hidden">
              <Input 
                type="search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder={language === 'EN' ? "SEARCH PRODUCTS..." : "পণ্য খুঁজুন..."} 
                className="w-full bg-white border-none h-10 pl-10 pr-10 rounded-none text-[10px] text-black font-black uppercase placeholder:text-black/40 shadow-xl"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#01a3a4] stroke-[3px]" />
              <button onClick={() => { setShowSearchInput(false); setSearchQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"><X className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </nav>

      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
      <CategoryNavModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
    </>
  );
}
