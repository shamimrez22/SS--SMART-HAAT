"use client";

import React from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="hidden lg:block">
            <h1 className="text-xl font-headline font-bold gold-gradient whitespace-nowrap">SS SMART HAAT</h1>
          </div>
        </div>

        <div className="flex-grow max-w-2xl relative">
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

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-background text-[10px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
