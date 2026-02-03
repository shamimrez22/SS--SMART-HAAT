
"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Flame, Star, Smartphone, QrCode } from 'lucide-react';
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
      
      <main className="flex-grow container mx-auto px-4 py-2 space-y-6">
        {/* BANNER SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-9 relative rounded-none overflow-hidden h-[200px] border border-white/5 bg-card">
            <Carousel 
              className="w-full h-full" 
              opts={{ loop: true }}
              plugins={[plugin.current]}
            >
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[200px] w-full">
                      <Image
                        src={slide.image}
                        alt="Slider"
                        fill
                        className="object-cover opacity-50"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-6 space-y-1">
                        <div 
                          className="text-sm md:text-base font-headline font-black text-white leading-tight uppercase tracking-tighter"
                          dangerouslySetInnerHTML={{ __html: slide.title }}
                        />
                        <p className="text-white/80 text-[6px] font-black tracking-[0.1em] uppercase">{slide.subtitle}</p>
                        <Button className="bg-orange-600 text-white h-4 px-2 font-black rounded-none text-[6px] hover:bg-orange-700 transition-all uppercase w-fit mt-1">
                          SHOP NOW <ArrowRight className="ml-1 h-2 w-2" />
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex left-2 bg-white/5 border-none text-white hover:bg-white/20 h-5 w-5 rounded-none" />
              <CarouselNext className="hidden md:flex right-2 bg-white/5 border-none text-white hover:bg-white/20 h-5 w-5 rounded-none" />
            </Carousel>
          </div>
          
          {/* DOWNLOAD APP CARD */}
          <div className="hidden lg:flex lg:col-span-3 bg-card rounded-none border border-white/5 p-3 flex-col justify-between group hover:border-orange-600/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="h-3 w-3 text-orange-600" />
                <h3 className="font-black text-[7px] uppercase tracking-tight text-white">DOWNLOAD APP</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-600/10 to-transparent p-2 rounded-none border border-orange-600/5">
                <p className="text-[7px] font-black leading-tight uppercase mb-2 text-white">EXCLUSIVE OFFERS</p>
                <div className="flex flex-col gap-1">
                   <div className="h-5 bg-black rounded-none flex items-center justify-center border border-white/10 text-[6px] font-black text-white uppercase">APP STORE</div>
                   <div className="h-5 bg-black rounded-none flex items-center justify-center border border-white/10 text-[6px] font-black text-white uppercase">PLAY STORE</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <QrCode className="h-5 w-5 text-white" />
              <p className="text-[6px] font-black text-muted-foreground uppercase">SCAN TO DOWNLOAD</p>
            </div>
          </div>
        </section>

        {/* TOP PRODUCT SECTION - 12 ITEMS, NO TIMER */}
        <section className="bg-card/30 rounded-none p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-tighter text-white">
              <Flame className="h-3.5 w-3.5 text-orange-600 fill-current" /> TOP PRODUCT
            </h2>
            <Button variant="link" className="text-orange-600 font-black text-[7px] uppercase p-0 h-auto">
              VIEW ALL <ArrowRight className="ml-1 h-2 w-2" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.concat(products).slice(0, 12).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
        </section>

        {/* SHOP BY CATEGORY */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-1 bg-orange-600" />
            <h2 className="text-sm font-black uppercase tracking-tighter text-white">SHOP BY CATEGORY</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'SMARTPHONES' }, { name: 'FASHION' }, { name: 'WATCHES' },
              { name: 'BEAUTY' }, { name: 'LAPTOPS' }, { name: 'FOOTWEAR' }
            ].map((cat) => (
              <div key={cat.name} className="group cursor-pointer text-center p-2 bg-card border border-white/5 hover:border-orange-600/30 transition-all">
                <Star className="h-3 w-3 text-orange-600 mx-auto mb-1 opacity-40 group-hover:opacity-100" />
                <p className="text-[7px] font-black uppercase tracking-widest text-white">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
