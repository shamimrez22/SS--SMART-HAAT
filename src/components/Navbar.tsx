"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Row 1: Top Navigation Links (Above Search) */}
        <div className="h-10 flex items-center justify-center border-b border-primary/5">
          <ul className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em]">
            <li>
              <Link href="/" className="hover:text-primary transition-all duration-300">Home</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-all duration-300">Shop</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-all duration-300">Category</Link>
            </li>
            <li>
              <Link href="/admin" className="text-primary hover:text-primary/80 transition-all duration-300 flex items-center gap-1">
                Admin Panel
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-all duration-300 flex items-center gap-1">
                <LogIn className="h-3 w-3" /> Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* Row 2: Logo, Search, and Icons */}
        <div className="h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <ShoppingBag className="h-5 w-5 text-background" />
              </div>
              <h1 className="text-xl font-headline font-bold gold-gradient whitespace-nowrap hidden sm:block">
                SS SMART HAAT
              </h1>
            </Link>
          </div>

          <div className="flex-grow max-w-2xl relative group">
            <Input 
              type="search" 
              placeholder="Search in Smart Haat..." 
              className="w-full bg-secondary/50 border-none h-11 pl-12 focus-visible:ring-primary focus-visible:bg-secondary transition-all rounded-full"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Button className="absolute right-0 top-0 h-11 rounded-r-full px-8 bg-primary text-background hover:bg-primary/90 font-bold">
              Search
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <User className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-background text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
