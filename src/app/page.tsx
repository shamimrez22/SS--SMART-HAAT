
"use client";

import React, { useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Apple, Play, Truck, Tag, Flame, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

// Memoized carousel item for performance
const SlideItem = memo(({ slide, priority }: { slide: any, priority: boolean }) => (
  <CarouselItem className="h-full">
    <div className="relative h-full w-full">
      <Image
        src={slide.image}
        alt="Slider"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover opacity-60"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent flex flex-col justify-center px-8 space-y-3">
        <div 
          className="text-lg md:text-2xl font-headline font-black text-white leading-tight uppercase tracking-tighter"
          dangerouslySetInnerHTML={{ __html: slide.title }}
        />
        <p className="text-white/90 text-[10px] font-black tracking-[0.2em] uppercase">{slide.subtitle}</p>
        <Button asChild className="bg-orange-600 text-white h-8 px-4 font-black rounded-none text-[10px] hover:bg-orange-700 transition-all uppercase w-fit mt-2">
          <Link href="/shop">SHOP NOW <ArrowRight className="ml-2 h-3 w-3" /></Link>
        </Button>
      </div>
    </div>
  </CarouselItem>
));
SlideItem.displayName = 'SlideItem';

// Updated OfferCard - Just a single large image highlight
const OfferCard = () => {
  const offerProduct = products.find(p => p.discountPercentage > 0) || products[0];
  return (
    <div className="h-[350px] bg-card overflow-hidden relative">
      <Link href="/shop" className="block h-full w-full group">
        <Image 
          src={offerProduct.imageUrl} 
          alt="Offer Highlight" 
          fill 
          sizes="400px"
          className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
      </Link>
    </div>
  );
};

export default function Home() {
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories, isLoading: categoriesLoading } = useCollection(categoriesRef);

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
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-4 space-y-8">
        {/* HERO GRID SECTION - Height 350px */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="hidden lg:block lg:col-span-3">
            <OfferCard />
          </div>

          <div className="lg:col-span-6 relative rounded-none overflow-hidden h-[350px] bg-card">
            <Carousel 
              className="w-full h-full" 
              opts={{ loop: true }}
              plugins={[plugin.current]}
            >
              <CarouselContent className="h-[350px]">
                {slides.map((slide, index) => (
                  <SlideItem key={index} slide={slide} priority={index === 0} />
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex left-4 bg-white/5 border-none text-white hover:bg-white/20 h-10 w-10 rounded-none" />
              <CarouselNext className="hidden md:flex right-4 bg-white/5 border-none text-white hover:bg-white/20 h-10 w-10 rounded-none" />
            </Carousel>
          </div>
          
          <div className="hidden lg:flex lg:col-span-3 flex-col h-[350px] gap-4">
            <div className="relative flex-grow bg-gradient-to-br from-[#ff8c00] to-[#ff0080] p-5 pt-10 rounded-none overflow-hidden shadow-2xl border border-white/10 flex flex-col">
              <div className="text-center mb-6">
                <h3 className="text-white font-black text-base tracking-tight uppercase leading-none">Download App</h3>
              </div>

              <div className="space-y-4 flex-grow flex flex-col justify-center">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-none bg-black/20 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 border border-white/10">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-[9px] leading-none uppercase opacity-80">Free</span>
                    <span className="text-white font-black text-[12px] leading-tight uppercase">Delivery</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-none bg-black/20 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 border border-white/10">
                    <Tag className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-[9px] leading-none uppercase opacity-80">Limited</span>
                    <span className="text-white font-black text-[12px] leading-tight uppercase">Time</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3 px-1 mt-auto">
              <div className="bg-white p-1.5 w-20 h-20 shrink-0 rounded-none shadow-xl border border-white/5 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                  <path fill="currentColor" d="M0 0h35v35H0V0zm5 5v25h25V5H5zm5 5h15v15H10V10zM65 0h35v35H65V0zm5 5v25h25V5H70zm5 5h15v15H75V10zM0 65h35v35H0V65zm5 5v25h25V70H5zm5 5h15v15H10V75zM45 0h10v10H45V0zm0 25h10v10H45V25zm20 45h10v10H65V70zm20 0h10v10H85V70zm-20 20h10v10H65V90zm0-45h10v10H65V45zm20 0h10v10H85V45zm-40 25h10v10H45V70zm0 20h10v10H45V90zm20-65h10v10H65V25zm-20 20h10v10H45V45zM0 45h10v10H0V45zm25 0h10v10H25V45z" />
                  <rect x="42" y="42" width="16" height="16" fill="white" />
                  <path fill="#ea580c" d="M44 44h12v12H44z" />
                  <text x="50" y="52" fontSize="6" fontWeight="900" textAnchor="middle" fill="white" className="font-sans">SS</text>
                </svg>
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                <div className="bg-white border border-white/10 h-9 px-3 flex items-center gap-2 rounded-none cursor-pointer hover:bg-gray-100 transition-all shadow-md group">
                  <Apple className="h-3.5 w-3.5 text-black" />
                  <span className="text-[9px] text-black font-black uppercase tracking-tight">App Store</span>
                </div>
                <div className="bg-white border border-white/10 h-9 px-3 flex items-center gap-2 rounded-none cursor-pointer hover:bg-gray-100 transition-all shadow-md group">
                  <Play className="h-3.5 w-3.5 text-black fill-black" />
                  <span className="text-[9px] text-black font-black uppercase tracking-tight">Google Play</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TOP PRODUCT SECTION */}
        <section className="bg-card/30 rounded-none p-6 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter text-white">
              <Flame className="h-5 w-5 text-orange-600 fill-current" /> TOP PRODUCT
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {products.map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white font-black text-[12px] uppercase h-12 px-10 rounded-none shadow-xl transition-all">
              <Link href="/shop">
                MORE PRODUCT <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* SHOP BY CATEGORY - Real-time from Firestore with Images */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 bg-orange-600" />
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">SHOP BY CATEGORY</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categoriesLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-28 bg-white/5 animate-pulse border border-white/5" />
              ))
            ) : categories && categories.length > 0 ? (
              categories.map((cat) => (
                <Link 
                  href={`/shop?category=${cat.name}`} 
                  key={cat.id} 
                  className="group relative h-32 overflow-hidden border border-white/5 hover:border-orange-600/50 transition-all bg-card"
                >
                  {cat.imageUrl && (
                    <Image 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      fill 
                      className="object-cover transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="relative z-10 text-[10px] font-black uppercase tracking-widest text-white leading-tight px-2 text-center drop-shadow-md">
                      {cat.name}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-[8px] uppercase text-muted-foreground">No categories available.</p>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
