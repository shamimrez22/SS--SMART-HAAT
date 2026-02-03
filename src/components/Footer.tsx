import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, ShoppingBag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-background" />
              </div>
              <h3 className="text-xl font-bold font-headline text-primary tracking-tight">SS SMART HAAT</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your curated destination for smart fashion and modern marketplace essentials. Redefining elegance through simplicity and luxury.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.2em] text-primary">Shopping</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Clothing Store</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Trending Shoes</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Accessories</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Sale Items</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.2em] text-primary">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Affiliate Program</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Sustainability</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.2em] text-primary">Customer Care</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Track Order</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="h-px bg-white/5 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
          <p>© 2024 SS Smart Haat. Elevating Dhaka's Lifestyle.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}