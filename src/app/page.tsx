
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Apple, Play, Truck, Tag, Flame, Loader2, ShoppingCart, Smartphone, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { OrderModal } from '@/components/OrderModal';

const SlideItem = ({ item, priority }: { item: any, priority: boolean }) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  // If item is a product
  if (item.price !== undefined) {
    return (
      <CarouselItem className="h-full">
        <div className="relative h-full w-full bg-black overflow-hidden group">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="1200px"
            className="object-cover opacity-90"
            priority={priority}
            loading="eager"
            quality={95}
          />
          {/* Transparent Overlay for Text */}
          <div className="absolute inset-0 bg-black/10 flex flex-col justify-center px-12 space-y-4">
            <div className="space-y-1">
              <h2 className="text-4xl md:text-5xl font-headline font-black text-white leading-tight uppercase tracking-tighter max-w-[400px]">
                {item.name}
              </h2>
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-[12px] font-black uppercase tracking-[0.2em]">SPECIAL EDITION</span>
                <span className="text-white/40">|</span>
                <div className="flex items-baseline text-2xl font-black tracking-tighter">
                  <span className="text-[0.5em] font-normal mr-1 translate-y-[-0.1em]">৳</span>
                  {item.price.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button asChild variant="outline" className="bg-black border-none text-white h-11 px-8 font-black rounded-none text-[10px] hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                <Link href={`/products/${item.id}`}>DETAILS</Link>
              </Button>
              <button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white h-11 px-8 font-black rounded-none text-[10px] hover:bg-black transition-all uppercase tracking-widest flex items-center gap-2 shadow-xl">
                <ShoppingCart className="h-3.5 w-3.5" /> ORDER NOW
              </button>
            </div>
          </div>
        </div>
        <OrderModal 
          product={item} 
          isOpen={isOrderOpen} 
          onClose={() => setIsOrderOpen(false)} 
        />
      </CarouselItem>
    );
  }

  // If item is a direct banner
  return (
    <CarouselItem className="h-full">
      <div className="relative h-full w-full bg-black">
        <Image
          src={item.imageUrl}
          alt={item.title || "Banner"}
          fill
          sizes="1200px"
          className="object-cover opacity-100"
          priority={priority}
          loading="eager"
          quality={95}
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-12">
           <h2 className="text-4xl font-black text-white uppercase tracking-tighter max-w-[400px] leading-none">{item.title}</h2>
        </div>
      </div>
    </CarouselItem>
  );
};

const FlashOfferCard = () => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const db = useFirestore();
  
  const flashProductQuery = useMemoFirebase(() => query(
    collection(db, 'products'),
    where('showInFlashOffer', '==', true),
    limit(10)
  ), [db]);

  const flashBannerQuery = useMemoFirebase(() => query(
    collection(db, 'featured_banners'),
    where('type', '==', 'FLASH'),
    limit(10)
  ), [db]);
  
  const { data: flashProducts } = useCollection(flashProductQuery);
  const { data: flashBanners } = useCollection(flashBannerQuery);

  const combinedItems = useMemo(() => {
    return [...(flashBanners || []), ...(flashProducts || [])];
  }, [flashProducts, flashBanners]);

  useEffect(() => {
    if (combinedItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % combinedItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [combinedItems]);
  
  const activeItem = combinedItems[currentIndex];

  return (
    <div className="h-full bg-[#f5f5f5] overflow-hidden relative group border border-white/5 w-full">
      {activeItem ? (
        <div className="h-full w-full relative flex flex-col items-center justify-center">
          <div className="absolute top-4 left-4 bg-[#01a3a4] px-4 py-1.5 text-[9px] font-black text-white uppercase tracking-widest z-10 shadow-lg">
            FLASH OFFER
          </div>
          
          <div className="relative w-full h-full p-6">
            <Image 
              src={activeItem.imageUrl} 
              alt="Flash Offer" 
              fill 
              sizes="400px"
              className="object-contain p-8 transition-transform duration-[3000ms] group-hover:scale-105"
              key={activeItem.id || activeItem.imageUrl}
              priority={true}
              loading="eager"
              quality={90}
            />
          </div>

          <div className="absolute bottom-6 w-full text-center px-4">
             <p className="text-black font-black text-[11px] uppercase tracking-[0.2em] mb-1 line-clamp-1">{activeItem.name || activeItem.title}</p>
             <p className="text-black/20 text-[8px] font-black uppercase tracking-[0.4em]">ROLEX EDITION</p>
          </div>

          {activeItem.price !== undefined && (
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6">
              <Button 
                onClick={() => setIsOrderOpen(true)}
                className="bg-[#01a3a4] hover:bg-black text-white font-black text-[10px] uppercase h-12 px-8 rounded-none transition-all shadow-2xl"
              >
                ORDER NOW
              </Button>
              <OrderModal product={activeItem} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
            </div>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5]">
          <Loader2 className="h-6 w-6 text-[#01a3a4] animate-spin" />
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  
  const productsRef = useMemoFirebase(() => query(
    collection(db, 'products'),
    orderBy('createdAt', 'desc'),
    limit(18)
  ), [db]);

  const sliderProductQuery = useMemoFirebase(() => query(
    collection(db, 'products'),
    where('showInSlider', '==', true)
  ), [db]);

  const sliderBannerQuery = useMemoFirebase(() => query(
    collection(db, 'featured_banners'),
    where('type', '==', 'SLIDER'),
    orderBy('createdAt', 'desc')
  ), [db]);
  
  const { data: categories, isLoading: categoriesLoading } = useCollection(categoriesRef);
  const { data: products, isLoading: productsLoading } = useCollection(productsRef);
  const { data: sliderProducts } = useCollection(sliderProductQuery);
  const { data: sliderBanners } = useCollection(sliderBannerQuery);

  const combinedSliderItems = useMemo(() => {
    return [...(sliderBanners || []), ...(sliderProducts || [])];
  }, [sliderProducts, sliderBanners]);

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-0 space-y-12">
        {/* HERO SECTION - MATCHING REFERENCE IMAGE 3-COLUMN LAYOUT */}
        <section className="grid grid-cols-12 gap-0 h-[420px]">
          {/* LEFT: FLASH BAR */}
          <div className="col-span-3 h-full">
            <FlashOfferCard />
          </div>

          {/* MIDDLE: MAIN SLIDER */}
          <div className="col-span-6 relative rounded-none overflow-hidden h-full bg-black border border-white/5 shadow-2xl">
            {combinedSliderItems.length > 0 ? (
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[plugin.current]}>
                <CarouselContent className="h-[420px]">
                  {combinedSliderItems.map((item, index) => (
                    <SlideItem key={item.id || index} item={item} priority={index < 3} />
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" />
                <p className="text-white/10 text-[10px] font-black uppercase tracking-widest">LOADING FEATURED...</p>
              </div>
            )}
          </div>
          
          {/* RIGHT: SIDEBAR BOXES (REFINED TEAL/BLACK STYLE) */}
          <div className="col-span-3 flex flex-col h-full gap-0">
            {/* TEAL TOP BOX - SOLID COVERAGE */}
            <div className="relative h-2/3 bg-[#01a3a4] p-8 flex flex-col items-center justify-center space-y-8 shadow-2xl">
              <h3 className="text-white font-black text-3xl tracking-tighter uppercase font-headline">DOWNLOAD APP</h3>
              <div className="w-full space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-black/5 flex items-center justify-center border border-white/10 shrink-0"><Truck className="h-6 w-6 text-white" /></div>
                  <div className="flex flex-col">
                    <span className="text-white/70 font-black text-[9px] uppercase tracking-widest leading-none mb-1">FREE</span>
                    <span className="text-white font-black text-[14px] uppercase tracking-tighter">DELIVERY</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-black/5 flex items-center justify-center border border-white/10 shrink-0"><Tag className="h-6 w-6 text-white" /></div>
                  <div className="flex flex-col">
                    <span className="text-white/70 font-black text-[9px] uppercase tracking-widest leading-none mb-1">LIMITED</span>
                    <span className="text-white font-black text-[14px] uppercase tracking-tighter">TIME</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* BLACK BOTTOM BOX - SEAMLESS TRANSITION */}
            <div className="relative h-1/3 bg-black border-t border-white/5 p-5 flex items-center gap-4">
              <div className="bg-white p-2 w-20 h-20 shrink-0 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                  <path fill="currentColor" d="M0 0h20v20H0V0zm4 4v12h12V4H4zm2 2h8v8H6V6zm60-6h20v20H66V0zm4 4v12h12V4H70zm2 2h8v8H72V6zM0 66h20v20H0V66zm4 4v12h12V70H4zm2 2h8v8H6V72zm22-60h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4z" />
                </svg>
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                <button className="bg-white text-black h-9 px-4 flex items-center gap-3 hover:bg-[#01a3a4] hover:text-white transition-all group border-none w-full">
                  <Apple className="h-4 w-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">APP STORE</span>
                </button>
                <button className="bg-white text-black h-9 px-4 flex items-center gap-3 hover:bg-[#01a3a4] hover:text-white transition-all group border-none w-full">
                  <Play className="h-4 w-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">GOOGLE PLAY</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TOP SELLING SECTION */}
        <section className="bg-card/20 p-8 border border-white/5 shadow-2xl mx-4">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="h-10 w-2 bg-[#01a3a4]" />
              <h2 className="text-3xl font-black flex items-center gap-3 uppercase tracking-tighter text-white">
                <Flame className="h-8 w-8 text-[#01a3a4] fill-current" /> TOP SELLING
              </h2>
            </div>
            <Link href="/shop" className="text-[10px] font-black text-[#01a3a4] hover:text-white transition-colors uppercase tracking-[0.3em]">VIEW ALL</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {productsLoading ? (
               Array.from({length: 12}).map((_, i) => <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse border border-white/5" />)
            ) : products?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="space-y-10 pb-20 px-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-2 bg-[#01a3a4]" />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">CATEGORIES</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-6">
            {categoriesLoading ? (
              Array.from({length: 8}).map((_, i) => <div key={i} className="aspect-square bg-white/5 animate-pulse border border-white/5" />)
            ) : categories?.map((cat) => (
              <Link href={`/shop?category=${cat.name}`} key={cat.id} className="group flex flex-col items-center space-y-3">
                <div className="relative w-full aspect-square overflow-hidden border border-white/5 group-hover:border-[#01a3a4] transition-all bg-white shadow-xl">
                  {cat.imageUrl && (
                    <Image 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      fill 
                      sizes="200px" 
                      quality={75} 
                      className="object-contain p-2 group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                    />
                  )}
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 text-center group-hover:text-[#01a3a4] transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
