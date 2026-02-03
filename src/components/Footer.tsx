
"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, ShoppingBag, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function Footer() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
  const { data: settings } = useDoc(settingsRef);

  // Fallback data if settings aren't loaded or set
  const contact = {
    email: settings?.email || 'INFO@SSSMARTHAAT.COM',
    phone: settings?.phone || '+880 1XXX XXXXXX',
    address: settings?.address || 'BANANI, DHAKA, BANGLADESH',
    description: settings?.descriptionBengali || 'এসএস স্মার্ট হাট — বাংলাদেশের প্রিমিয়াম ফ্যাশন এবং লাইফস্টাইল মার্কেটপ্লেস। আমরা বিশ্বাস করি আভিজাত্য এবং আধুনিকতার সঠিক সমন্বয়ে। আমাদের লক্ষ্য হচ্ছে উন্নত মানের পণ্য আপনার দোরগোড়ায় পৌঁছে দেওয়া।',
    social: {
      facebook: settings?.facebookUrl || '#',
      instagram: settings?.instagramUrl || '#',
      twitter: settings?.twitterUrl || '#',
      youtube: settings?.youtubeUrl || '#',
    }
  };

  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* BRANDING & BENGALI INFO */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-none flex items-center justify-center shadow-lg shadow-orange-600/10">
                <ShoppingBag className="h-6 w-6 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-black font-headline text-white tracking-tighter uppercase">SS SMART HAAT</h3>
                <p className="text-[8px] font-black text-orange-600 tracking-[0.4em] uppercase leading-none mt-1">Premium Marketplace</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-tight">
                YOUR CURATED DESTINATION FOR SMART FASHION AND MODERN MARKETPLACE ESSENTIALS. REDEFINING ELEGANCE THROUGH SIMPLICITY AND LUXURY.
              </p>
              <div className="pt-2 border-l-2 border-orange-600 pl-4">
                <p className="text-[13px] font-bold text-white/90 font-headline leading-relaxed">
                  {contact.description}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href={contact.social.facebook} className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-500 border border-white/5"><Facebook className="h-4 w-4" /></Link>
              <Link href={contact.social.instagram} className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-500 border border-white/5"><Instagram className="h-4 w-4" /></Link>
              <Link href={contact.social.twitter} className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-500 border border-white/5"><Twitter className="h-4 w-4" /></Link>
              <Link href={contact.social.youtube} className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-500 border border-white/5"><Youtube className="h-4 w-4" /></Link>
            </div>
          </div>
          
          {/* NAVIGATION LINKS */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="font-black text-orange-600 uppercase text-[10px] tracking-[0.3em]">SHOPPING</h4>
            <ul className="space-y-4 text-[11px] text-muted-foreground font-black uppercase tracking-widest">
              <li><Link href="/shop" className="hover:text-white transition-colors">CLOTHING STORE</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">TRENDING SHOES</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">ACCESSORIES</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">SALE ITEMS</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <h4 className="font-black text-orange-600 uppercase text-[10px] tracking-[0.3em]">COMPANY</h4>
            <ul className="space-y-4 text-[11px] text-muted-foreground font-black uppercase tracking-widest">
              <li><Link href="#" className="hover:text-white transition-colors">OUR STORY</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">CAREERS</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">AFFILIATE</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">PRIVACY</Link></li>
            </ul>
          </div>
          
          {/* CONTACT INFO */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="font-black text-orange-600 uppercase text-[10px] tracking-[0.3em]">GET IN TOUCH</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-orange-600/50 transition-colors">
                  <Mail className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-[12px] font-black text-white uppercase tracking-tighter">{contact.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-orange-600/50 transition-colors">
                  <Phone className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Phone Helpline</p>
                  <p className="text-[12px] font-black text-white uppercase tracking-tighter">{contact.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-orange-600/50 transition-colors">
                  <MapPin className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Official Location</p>
                  <p className="text-[12px] font-black text-white uppercase tracking-tighter">{contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-white/5 mb-10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-black">
            © 2024 <span className="text-orange-600">SS SMART HAAT</span>. ELEVATING DHAKA'S LIFESTYLE.
          </p>
          <div className="flex gap-8 text-[9px] uppercase tracking-widest text-muted-foreground font-black">
            <Link href="#" className="hover:text-white transition-colors">PAYMENT METHODS</Link>
            <Link href="#" className="hover:text-white transition-colors">SHIPPING POLICY</Link>
            <Link href="#" className="hover:text-white transition-colors">TERMS OF USE</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
