
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline">SS SMART HAAT</h3>
            <p className="text-sm text-muted-foreground">
              Your curated destination for smart fashion and modern marketplace essentials. Redefining elegance through simplicity.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Youtube className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase text-sm tracking-wider">Shopping</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Clothing Store</Link></li>
              <li><Link href="#" className="hover:text-primary">Trending Shoes</Link></li>
              <li><Link href="#" className="hover:text-primary">Accessories</Link></li>
              <li><Link href="#" className="hover:text-primary">Sale Items</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Our Story</Link></li>
              <li><Link href="#" className="hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary">Affiliate Program</Link></li>
              <li><Link href="#" className="hover:text-primary">Sustainability</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase text-sm tracking-wider">Customer Care</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary">Track Order</Link></li>
              <li><Link href="#" className="hover:text-primary">Returns & Exchanges</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="h-px bg-border mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 SS Smart Haat. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
