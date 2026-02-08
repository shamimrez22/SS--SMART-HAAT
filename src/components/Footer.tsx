"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.029c0 2.119.554 4.187 1.605 6.006L0 24l6.117-1.605a11.821 11.821 0 005.928 1.603h.005c6.635 0 12.03-5.393 12.033-12.03a11.75 11.75 0 00-3.517-8.482z"/>
  </svg>
);

export function Footer() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => doc(db!, 'settings', 'site-config'), [db]);
  const { data: settings } = useDoc(settingsRef);

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
      whatsapp: settings?.whatsappUrl || '#',
    }
  };

  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#01a3a4] rounded-none flex items-center justify-center shadow-lg shadow-[#01a3a4]/10 border border-white/5">
                <span className="text-black font-black text-2xl tracking-tighter">SS</span>
              </div>
              <div>
                <h3 className="text-2xl font-black font-headline text-white tracking-tighter uppercase">SS SMART HAAT</h3>
                <p className="text-[8px] font-black text-[#01a3a4] tracking-[0.4em] uppercase leading-none mt-1">Premium Market Place</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-[11px] text-white/90 leading-relaxed uppercase tracking-tight">
                YOUR CURATED DESTINATION FOR SMART FASHION AND MODERN MARKETPLACE ESSENTIALS. REDEFINING ELEGANCE THROUGH SIMPLICITY AND LUXURY.
              </p>
              <div className="pt-2 border-l-2 border-[#01a3a4] pl-4">
                <p className="text-[13px] font-bold text-white font-headline leading-relaxed">
                  {contact.description}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href={contact.social.facebook} className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-[#01a3a4] hover:text-white transition-all duration-500 border border-white/5"><Facebook className="h-4 w-4" /></Link>
              <Link href={contact.social.instagram} className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-[#01a3a4] hover:text-white transition-all duration-500 border border-white/5"><Instagram className="h-4 w-4" /></Link>
              <Link href={contact.social.whatsapp} className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-500 border border-white/5"><WhatsAppIcon className="h-4 w-4" /></Link>
              <Link href={contact.social.twitter} className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-[#01a3a4] hover:text-white transition-all duration-500 border border-white/5"><Twitter className="h-4 w-4" /></Link>
              <Link href={contact.social.youtube} className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-[#01a3a4] hover:text-white transition-all duration-500 border border-white/5"><Youtube className="h-4 w-4" /></Link>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <h4 className="font-black text-[#01a3a4] uppercase text-[10px] tracking-[0.3em]">SHOPPING</h4>
            <ul className="space-y-4 text-[11px] text-white font-black uppercase tracking-widest">
              <li><Link href="/shop" className="hover:text-primary transition-colors">CLOTHING STORE</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">TRENDING SHOES</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">ACCESSORIES</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">SALE ITEMS</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <h4 className="font-black text-[#01a3a4] uppercase text-[10px] tracking-[0.3em]">COMPANY</h4>
            <ul className="space-y-4 text-[11px] text-white font-black uppercase tracking-widest">
              <li><Link href="#" className="hover:text-primary transition-colors">OUR STORY</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">CAREERS</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">AFFILIATE</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">PRIVACY</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-4 space-y-8">
            <h4 className="font-black text-[#01a3a4] uppercase text-[10px] tracking-[0.3em]">GET IN TOUCH</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#01a3a4]/50 transition-colors">
                  <Mail className="h-4 w-4 text-[#01a3a4]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-[12px] font-black text-white uppercase tracking-tighter">{contact.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#01a3a4]/50 transition-colors">
                  <Phone className="h-4 w-4 text-[#01a3a4]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1">Phone Helpline</p>
                  <p className="text-[12px] font-black text-white uppercase tracking-tighter">{contact.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#01a3a4]/50 transition-colors">
                  <MapPin className="h-4 w-4 text-[#01a3a4]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1">Official Location</p>
                  <p className="text-[12px] font-black text-white uppercase tracking-tighter">{contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-white/5 mb-10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/70 font-black">
            © 2024 <span className="text-[#01a3a4]">SS SMART HAAT</span>. ELEVATING DHAKA'S LIFESTYLE.
          </p>
          <div className="flex gap-8 text-[9px] uppercase tracking-widest text-white/70 font-black">
            <Link href="#" className="hover:text-white transition-colors">PAYMENT METHODS</Link>
            <Link href="#" className="hover:text-white transition-colors">SHIPPING POLICY</Link>
            <Link href="#" className="hover:text-white transition-colors">TERMS OF USE</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
