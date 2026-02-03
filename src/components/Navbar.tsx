"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Top Row: Logo, Search, and Icons */}
        <div className="h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Link href="/" className="lg:block">
              <h1 className="text-xl font-headline font-bold gold-gradient whitespace-nowrap">SS SMART HAAT</h1>
            </Link>
          </div>

          <div className="flex-grow max-w-xl relative hidden md:block">
            <Input 
              type="search" 
              placeholder="Search in Smart Haat..." 
              className="w-full bg-secondary border-none h-10 pl-10 focus-visible:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Button className="absolute right-0 top-0 h-10 rounded-l-none bg-primary text-background hover:bg-primary/90">
              Search
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="hidden lg:flex font-bold text-xs uppercase tracking-widest gap-2">
                <LogIn className="h-4 w-4" /> Sign Up
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>

        {/* Bottom Row: Navigation Links */}
        <div className="h-10 flex items-center justify-center border-t border-primary/5">
          <ul className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">Shop</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">Category</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors text-primary">Admin Panel</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
