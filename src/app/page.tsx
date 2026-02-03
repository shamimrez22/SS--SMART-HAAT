
"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Flame, Star, Apple, Play, Truck, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600",
      title: "GRAND <span class='text-orange-600 italic'>RAMADAN</span> BAZAAR",
      subtitle: "UP TO 80% OFF + FREE DELIVERY"
    },
    {
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=1600",
      title: "EXCLUSIVE <span class='text-orange-600'>FASHION</span> EDIT",
      subtitle: "CURATED COLLECTIONS FOR THE ELITE"
    },
    {
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600",
      title: "PREMIUM <span class='text-orange-600'>TECH</span> DEALS",
      subtitle: "LATEST SMARTPHONES & ACCESSORIES"
    },
    {
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600",
      title: "LUXURY <span class='text-orange-600'>TIMEPIECES</span>",
      subtitle: "TIMELESS ELEGANCE ON YOUR WRIST"
    },
    {
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600",
      title: "URBAN <span class='text-orange-600'>SNEAKER</span> DROP",
      subtitle: "STEP INTO THE FUTURE OF STYLE"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-4 space-y-8">
        {/* BANNER SECTION - 400PX HEIGHT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 relative rounded-none overflow-hidden h-[400px] border border-white/5 bg-card">
            <Carousel 
              className="w-full h-full" 
              opts={{ loop: true }}
              plugins={[plugin.current]}
            >
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full">
                      <Image
                        src={slide.image}
                        alt="Slider"
                        fill
                        className="object-cover opacity-60"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent flex flex-col justify-center px-12 space-y-3">
                        <div 
                          className="text-lg md:text-xl font-headline font-black text-white leading-tight uppercase tracking-tighter"
                          dangerouslySetInnerHTML={{ __html: slide.title }}
                        />
                        <p className="text-white/90 text-[10px] font-black tracking-[0.2em] uppercase">{slide.subtitle}</p>
                        <Button className="bg-orange-600 text-white h-8 px-4 font-black rounded-none text-[10px] hover:bg-orange-700 transition-all uppercase w-fit mt-2">
                          SHOP NOW <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex left-4 bg-white/5 border-none text-white hover:bg-white/20 h-10 w-10 rounded-none" />
              <CarouselNext className="hidden md:flex right-4 bg-white/5 border-none text-white hover:bg-white/20 h-10 w-10 rounded-none" />
            </Carousel>
          </div>
          
          {/* DOWNLOAD APP CARD - UNIQUE STYLE */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            {/* Top Gradient Card */}
            <div className="relative bg-gradient-to-br from-[#ff5f00] via-[#ff4b2b] to-[#ff0080] p-6 pt-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 h-[280px] flex flex-col">
              <div className="absolute top-0 left-0 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-br-2xl flex items-center gap-1 border-b border-r border-white/30">
                <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">4.8 Rated</span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-white font-black text-lg tracking-tight uppercase leading-none">Download App</h3>
              </div>

              <div className="space-y-4 flex-grow flex flex-col justify-center">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#c7f9ee] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                    <Truck className="h-6 w-6 text-[#00b894]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-[10px] leading-none uppercase opacity-80">Free</span>
                    <span className="text-white font-black text-[14px] leading-tight uppercase">Delivery</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#ffe0e6] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                    <Tag className="h-6 w-6 text-[#ff4d6d]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-[10px] leading-none uppercase opacity-80">Limited</span>
                    <span className="text-white font-black text-[14px] leading-tight uppercase">Time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom QR Area with UNIQUE QR Code */}
            <div className="flex items-center gap-4 px-2">
              <div className="bg-white p-2 w-24 h-24 shrink-0 rounded-xl shadow-xl border border-white/5 flex items-center justify-center">
                {/* UNIQUE CUSTOM QR CODE SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                  <path fill="currentColor" d="M0 0h35v35H0V0zm5 5v25h25V5H5zm5 5h15v15H10V10zM65 0h35v35H65V0zm5 5v25h25V5H70zm5 5h15v15H75V10zM0 65h35v35H0V65zm5 5v25h25V70H5zm5 5h15v15H10V75zM45 0h10v10H45V0zm0 25h10v10H45V25zm20 45h10v10H65V70zm20 0h10v10H85V70zm-20 20h10v10H65V90zm0-45h10v10H65V45zm20 0h10v10H85V45zm-40 25h10v10H45V70zm0 20h10v10H45V90zm20-65h10v10H65V25zm-20 20h10v10H45V45zM0 45h10v10H0V45zm25 0h10v10H25V45z" />
                  <rect x="42" y="42" width="16" height="16" fill="white" />
                  <path fill="#ea580c" d="M44 44h12v12H44z" />
                  <text x="50" y="52" fontSize="6" fontWeight="900" textAnchor="middle" fill="white" className="font-sans">SS</text>
                </svg>
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                <div className="bg-white border border-white/10 h-10 px-4 flex items-center gap-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-all shadow-md group">
                  <Apple className="h-4 w-4 text-black" />
                  <span className="text-[10px] text-black font-black uppercase tracking-tight">App Store</span>
                </div>
                <div className="bg-white border border-white/10 h-10 px-4 flex items-center gap-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-all shadow-md group">
                  <Play className="h-4 w-4 text-black fill-black" />
                  <span className="text-[10px] text-black font-black uppercase tracking-tight">Google Play</span>
                </div>
              </div>
            </div>
            
            <p className="text-[12px] font-black text-orange-600 uppercase tracking-[0.1em] px-2 leading-none mt-1">Download the App Now!</p>
          </div>
        </section>

        {/* TOP PRODUCT SECTION - 12 ITEMS */}
        <section className="bg-card/30 rounded-none p-6 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter text-white">
              <Flame className="h-5 w-5 text-orange-600 fill-current" /> TOP PRODUCT
            </h2>
            <Button variant="link" className="text-orange-600 font-black text-[12px] uppercase p-0 h-auto">
              VIEW ALL <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {products.concat(products).slice(0, 12).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
        </section>

        {/* SHOP BY CATEGORY */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 bg-orange-600" />
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">SHOP BY CATEGORY</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'SMARTPHONES' }, { name: 'FASHION' }, { name: 'WATCHES' },
              { name: 'BEAUTY' }, { name: 'LAPTOPS' }, { name: 'FOOTWEAR' }
            ].map((cat) => (
              <div key={cat.name} className="group cursor-pointer text-center p-4 bg-card border border-white/5 hover:border-orange-600/30 transition-all">
                <Star className="h-5 w-5 text-orange-600 mx-auto mb-2 opacity-40 group-hover:opacity-100" />
                <p className="text-[12px] font-black uppercase tracking-widest text-white">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
