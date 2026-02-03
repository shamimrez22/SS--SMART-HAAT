
"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '#shop' },
    { name: 'New Arrivals', path: '#' },
    { name: 'Collections', path: '#' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tight font-headline">
            SS SMART <span className="text-primary">HAAT</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 pt-10">
                  {navItems.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.path}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-4" />
                  <Button className="w-full">Sign In</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
