
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Languages, MapPin, MoreVertical, LayoutGrid, X, Home, ShoppingBag, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminLoginModal } from '@/components/AdminLoginModal';
import { LocationModal } from '@/components/LocationModal';
import { useRouter } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

const LogoIcon = () => (
  <div className="w-10 h-10 bg-black rounded-none flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 border border-white/10">
    <span className="text-[#01a3a4] font-black text-xl tracking-tighter">SS</span>
  </div>
);

export function Navbar() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const db = useFirestore();

  // Fetch today's orders for notification
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayOrdersQuery = useMemoFirebase(() => {
    return query(collection(db, 'orders'), where('createdAt', '>=', today));
  }, [db, today]);
  
  const { data: todayOrders } = useCollection(todayOrdersQuery);
  const orderCount = todayOrders?.length || 0;

  useEffect(() => {
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

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#01a3a4] shadow-lg border-b border-black/10 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-2 h-12">
            
            {/* LEFT: BRANDING */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <LogoIcon />
              <div className="flex flex-col">
                <h1 className="text-[12px] md:text-[14px] font-headline font-black text-white leading-none uppercase tracking-tighter">
                  SS SMART HAAT
                </h1>
                <span className="text-[6px] text-white/90 font-bold uppercase tracking-[0.2em]">PREMIUM</span>
              </div>
            </Link>

            {/* RIGHT: NAVIGATION LINKS */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0 flex-grow justify-end">
              <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white">
                
                {/* Desktop Search */}
                <div className="hidden md:flex items-center relative flex-grow max-w-[700px]">
                  <Input 
                    type="search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="SEARCH PRODUCTS..." 
                    className="bg-black/10 border-white/20 h-9 w-[400px] lg:w-[650px] focus:lg:w-[700px] transition-all rounded-none text-[9px] text-white uppercase placeholder:text-white/70"
                  />
                  <Search className="absolute right-3 h-3.5 w-3.5 text-white/50" />
                </div>

                <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                  <Home className="h-3 w-3 md:h-3.5 md:w-3.5" /> <span className="hidden sm:inline">{language === 'EN' ? "HOME" : "হোম"}</span>
                </Link>

                <Link href="/shop" className="hover:text-black transition-colors flex items-center gap-1">
                  <LayoutGrid className="h-3 w-3 md:h-3.5 md:w-3.5" /> <span className="hidden sm:inline">{language === 'EN' ? "SHOP" : "দোকান"}</span>
                </Link>
                
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 hover:text-black transition-colors font-black uppercase tracking-widest"
                >
                  <Languages className="h-3 w-3 md:h-3.5 md:w-3.5" /> {language}
                </button>

                <button 
                  onClick={() => setIsLocationModalOpen(true)}
                  className="hidden md:flex items-center gap-1 hover:text-black transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" /> {language === 'EN' ? "LOCATION" : "লোকেশন"}
                </button>

                {/* 3-DOT MENU WITH NOTIFICATION BUBBLE */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9 text-white hover:bg-black/10 rounded-none border border-white/20 flex items-center justify-center">
                      <MoreVertical className="h-5 w-5" />
                      {orderCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-none h-4 w-4 bg-red-600 text-[7px] font-black items-center justify-center border border-white/20">
                            {orderCount}
                          </span>
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border-none rounded-none shadow-2xl p-2 min-w-[160px] z-[100]">
                    
                    <DropdownMenuItem className="p-3 cursor-pointer md:hidden" onClick={() => setShowSearchInput(!showSearchInput)}>
                      <Search className="h-4 w-4 mr-2 text-[#01a3a4]" />
                      <span className="text-[10px] font-black uppercase text-black">{language === 'EN' ? "SEARCH" : "খুঁজুন"}</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="p-3 cursor-pointer md:hidden" onClick={() => setIsLocationModalOpen(true)}>
                      <MapPin className="h-4 w-4 mr-2 text-[#01a3a4]" />
                      <span className="text-[10px] font-black uppercase text-black">{language === 'EN' ? "LOCATION" : "লোকেশন"}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="p-3 cursor-pointer flex justify-between items-center" onClick={() => setIsAdminModalOpen(true)}>
                      <div className="flex items-center">
                        <span className="text-[10px] font-black uppercase text-black">ADMIN</span>
                      </div>
                      {orderCount > 0 && (
                        <Badge className="bg-red-600 text-white text-[8px] font-black rounded-none border-none">
                          {orderCount} NEW
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Shopping Bag */}
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-none hover:bg-black/10 text-white group border border-white/20">
                <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[8px] font-black rounded-none flex items-center justify-center border border-[#01a3a4]">
                  0
                </span>
              </Button>
            </div>
          </div>

          {/* EXPANDABLE SEARCH BAR (Mobile Toggle) */}
          {showSearchInput && (
            <div className="mt-2 pb-2 relative animate-in slide-in-from-top-2 duration-300 md:hidden">
              <Input 
                type="search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder={language === 'EN' ? "SEARCH PRODUCTS..." : "পণ্য খুঁজুন..."} 
                className="w-full bg-black/10 border-white/20 h-10 pl-10 pr-10 focus-visible:ring-black focus-visible:bg-black/20 transition-all rounded-none text-[10px] text-white uppercase placeholder:text-white/70 font-bold"
              />
              <Search className="absolute left-3.5 top-[20px] -translate-y-1/2 h-4 w-4 text-white" />
              <button 
                onClick={() => {
                  setShowSearchInput(false);
                  setSearchQuery('');
                }}
                className="absolute right-3 top-[20px] -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </nav>

      <AdminLoginModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
      />

      <LocationModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  );
}
