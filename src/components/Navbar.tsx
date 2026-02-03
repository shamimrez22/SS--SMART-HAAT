"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <ShoppingBag className="h-5 w-5 text-background" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-headline font-bold text-primary leading-none uppercase tracking-tight">
                SS SMART HAAT
              </h1>
              <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-[0.15em] mt-0.5">Premium Store</span>
            </div>
          </Link>

          {/* Search Bar & Links Container */}
          <div className="flex-grow flex items-center gap-6">
            <div className="flex-grow relative group">
              <Input 
                type="search" 
                placeholder="Search premium products..." 
                className="w-full bg-white/5 border-white/10 h-10 pl-10 pr-20 focus-visible:ring-primary focus-visible:bg-white/10 transition-all rounded-full text-xs text-foreground placeholder:text-muted-foreground"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Button className="absolute right-0 top-0 h-10 rounded-r-full px-6 bg-primary text-background hover:bg-primary/90 font-bold text-[10px] uppercase">
                Search
              </Button>
            </div>

            {/* Navigation Links - Side of Search Bar */}
            <ul className="hidden lg:flex items-center gap-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Shop</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Category</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Panel</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* User Icons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/5">
              <User className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full hover:bg-white/5">
              <ShoppingBag className="h-4 w-4 text-muted-foreground hover:text-primary" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary text-background text-[7px] font-bold rounded-full flex items-center justify-center border border-background">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
