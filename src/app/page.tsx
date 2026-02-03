
"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Flame, Star, LayoutGrid, Smartphone, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600",
      title: "GRAND <span className='text-orange-600 italic'>RAMADAN</span> BAZAAR",
      subtitle: "UP TO 80% OFF + FREE DELIVERY"
    },
    {
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=1600",
      title: "EXCLUSIVE <span className='text-orange-600'>FASHION</span> EDIT",
      subtitle: "CURATED COLLECTIONS FOR THE ELITE"
    },
    {
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600",
      title: "PREMIUM <span className='text-orange-600'>TECH</span> DEALS",
      subtitle: "LATEST SMARTPHONES & ACCESSORIES"
    },
    {
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600",
      title: "LUXURY <span className='text-orange-600'>TIMEPIECES</span>",
      subtitle: "TIMELESS ELEGANCE ON YOUR WRIST"
    },
    {
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600",
      title: "URBAN <span className='text-orange-600'>SNEAKER</span> DROP",
      subtitle: "STEP INTO THE FUTURE OF STYLE"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 space-y-10">
        {/* BANNER SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 relative rounded-none overflow-hidden h-[280px] border border-white/5 bg-card">
            <Carousel 
              className="w-full h-full" 
              opts={{ loop: true }}
              plugins={[plugin.current]}
            >
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[280px] w-full">
                      <Image
                        src={slide.image}
                        alt={slide.title.replace(/<[^>]*>?/gm, '')}
                        fill
                        className="object-cover opacity-70"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-10 space-y-2">
                        <div 
                          className="text-xl md:text-2xl font-headline font-black text-white leading-none uppercase tracking-tighter"
                          dangerouslySetInnerHTML={{ __html: slide.title }}
                        />
                        <p className="text-white/90 text-[7px] font-black tracking-[0.2em] uppercase">{slide.subtitle}</p>
                        <Button className="bg-orange-600 text-white h-6 px-3 font-black rounded-none text-[7px] hover:bg-orange-700 transition-all uppercase w-fit mt-1">
                          SHOP NOW <ArrowRight className="ml-1 h-2 w-2" />
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/10 border-none text-white hover:bg-white/30 h-6 w-6 rounded-none translate-x-0" />
              <CarouselNext className="right-4 bg-white/10 border-none text-white hover:bg-white/30 h-6 w-6 rounded-none translate-x-0" />
            </Carousel>
          </div>
          
          {/* DOWNLOAD APP CARD */}
          <div className="hidden lg:flex lg:col-span-3 bg-card rounded-none border border-white/5 p-4 flex-col justify-between group hover:border-orange-600/20 transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-600/10 rounded-none">
                  <Smartphone className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="font-black text-[9px] uppercase tracking-tight text-white">DOWNLOAD APP</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-600/20 to-transparent p-3 rounded-none border border-orange-600/10 relative overflow-hidden">
                <div className="flex items-center gap-1 mb-1.5">
                  <Star className="h-2.5 w-2.5 text-orange-600 fill-current" />
                  <span className="text-[8px] font-black text-white">4.8 RATED</span>
                </div>
                <p className="text-[9px] font-black leading-tight uppercase mb-2 text-white">EXCLUSIVE MOBILE OFFERS</p>
                <div className="flex flex-col gap-1.5">
                   <div className="h-7 bg-black rounded-none flex items-center justify-center border border-white/10 text-[8px] font-black cursor-pointer hover:bg-white/5 transition-colors uppercase text-white">APP STORE</div>
                   <div className="h-7 bg-black rounded-none flex items-center justify-center border border-white/10 text-[8px] font-black cursor-pointer hover:bg-white/5 transition-colors uppercase text-white">PLAY STORE</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
              <div className="bg-white p-0.5 rounded-none">
                <QrCode className="h-8 w-8 text-black" />
              </div>
              <p className="text-[8px] font-black text-muted-foreground leading-snug uppercase">SCAN TO DOWNLOAD</p>
            </div>
          </div>
        </section>

        {/* TOP PRODUCT SECTION */}
        <section id="top-products" className="bg-card/30 rounded-none p-6 border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter text-white">
              <Flame className="h-5 w-5 text-orange-600 fill-current" /> TOP PRODUCT
            </h2>
            <Button variant="link" className="text-orange-600 font-black text-[9px] hover:translate-x-1 transition-transform uppercase p-0 h-auto">
              VIEW ALL <ArrowRight className="ml-1.5 h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.concat(products).slice(0, 12).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
        </section>

        {/* SHOP BY CATEGORY */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1.5 bg-orange-600" />
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">SHOP BY CATEGORY</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'SMARTPHONES', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'FASHION', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'WATCHES', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'BEAUTY', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'LAPTOPS', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'FOOTWEAR', color: 'bg-orange-500/5 text-orange-400' }
            ].map((cat) => (
              <div key={cat.name} className="group cursor-pointer text-center space-y-1.5 p-2 hover:bg-white/5 rounded-none transition-all border border-transparent hover:border-white/10">
                <div className={`aspect-square ${cat.color} rounded-none flex items-center justify-center group-hover:scale-105 transition-transform border border-white/5`}>
                  <Star className="h-5 w-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* JUST FOR YOU */}
        <section className="space-y-6 pb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1.5 bg-orange-600" />
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">JUST FOR YOU</h2>
            </div>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.concat(products).slice(0, 12).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
          <div className="flex justify-center pt-6">
            <Button variant="outline" size="lg" className="w-full max-w-[200px] h-10 border-white/10 text-white hover:bg-orange-600 hover:text-white rounded-none text-[9px] font-black transition-all uppercase">
              LOAD MORE
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
