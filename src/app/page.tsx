
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Apple, Play, Truck, Tag, Flame, Loader2, ShoppingCart } from 'lucide-react';
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

  // If item is a product (has price property)
  if (item.price !== undefined) {
    return (
      <CarouselItem className="h-full">
        <div className="relative h-full w-full bg-black">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="800px"
            className="object-cover opacity-80"
            priority={priority}
            loading="eager"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-12 space-y-6">
            <div className="text-4xl md:text-5xl font-headline font-black text-white leading-tight uppercase tracking-tighter max-w-[400px]">
              {item.name}
            </div>
            <div className="flex items-baseline gap-4">
              <div className="text-white text-[12px] font-black tracking-[0.3em] uppercase leading-tight border-l-2 border-[#01a3a4] pl-4">
                PREMIUM<br/>COLLECTION
              </div>
              <div className="text-5xl font-black text-white tracking-tighter flex items-baseline">
                <span className="text-[0.45em] font-normal mr-1 translate-y-[-0.1em]">৳</span>
                {item.price.toLocaleString()}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button asChild variant="outline" className="border-white/20 text-white h-12 px-10 font-black rounded-none text-[11px] hover:bg-white/10 transition-all uppercase tracking-widest">
                <Link href={`/products/${item.id}`}>EXPLORE</Link>
              </Button>
              <Button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white h-12 px-10 font-black rounded-none text-[11px] hover:bg-[#01a3a4]/90 transition-all uppercase tracking-widest">
                <ShoppingCart className="mr-2 h-4 w-4" /> ORDER NOW
              </Button>
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

  // If item is a standalone banner (from Featured Content)
  return (
    <CarouselItem className="h-full">
      <div className="relative h-full w-full bg-black">
        <Image
          src={item.imageUrl}
          alt={item.title || "Banner"}
          fill
          sizes="800px"
          className="object-cover opacity-100"
          priority={priority}
          loading="eager"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </CarouselItem>
  );
};

const FlashOfferCard = () => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const db = useFirestore();
  
  // Get products marked as flash
  const flashProductQuery = useMemoFirebase(() => query(
    collection(db, 'products'),
    where('showInFlashOffer', '==', true),
    limit(10)
  ), [db]);

  // Get standalone banners marked as flash
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
    <div className="h-full bg-black overflow-hidden relative group border border-white/5 w-full">
      {activeItem ? (
        <div className="h-full w-full relative">
          <Image 
            src={activeItem.imageUrl} 
            alt="Flash Offer" 
            fill 
            sizes="400px"
            className="object-cover group-hover:scale-110 transition-transform duration-[3000ms]"
            key={activeItem.id || activeItem.imageUrl}
            priority={true}
            loading="eager"
            quality={80}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
          <div className="absolute top-4 left-4 bg-[#01a3a4] px-4 py-1.5 text-[9px] font-black text-white uppercase tracking-widest z-10 animate-pulse border border-black/10">
            FLASH OFFER
          </div>

          {activeItem.price !== undefined ? (
            <>
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-center">
                <div className="bg-black/70 backdrop-blur-lg p-5 w-full border border-white/10 shadow-2xl">
                  <h3 className="text-white font-black text-[11px] uppercase mb-2 tracking-widest line-clamp-1">{activeItem.name}</h3>
                  <div className="text-[#01a3a4] font-black text-2xl mb-4 flex items-baseline justify-center">
                    <span className="text-[0.45em] font-normal mr-1 translate-y-[-0.1em]">৳</span>
                    {activeItem.price.toLocaleString()}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => setIsOrderOpen(true)}
                      className="bg-[#01a3a4] hover:bg-white hover:text-black text-white font-black text-[10px] uppercase h-10 px-4 rounded-none w-full transition-all"
                    >
                      ORDER NOW
                    </Button>
                  </div>
                </div>
              </div>
              <OrderModal product={activeItem} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
            </>
          ) : (
             <div className="absolute inset-0 flex items-end justify-center p-8">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.5em] animate-pulse">PROMOTIONAL OFFER</p>
             </div>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">WAITING FOR PACKETS...</p>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  
  // Show ALL products in main grid
  const productsRef = useMemoFirebase(() => query(
    collection(db, 'products'),
    orderBy('createdAt', 'desc'),
    limit(18)
  ), [db]);

  // Featured Products (from Checkboxes)
  const sliderProductQuery = useMemoFirebase(() => query(
    collection(db, 'products'),
    where('showInSlider', '==', true)
  ), [db]);

  // Featured Banners (Standalone uploads)
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
      
      <main className="flex-grow container mx-auto py-8 space-y-12">
        {/* HERO FEATURED SECTION */}
        <section className="grid grid-cols-12 gap-4 h-[450px]">
          {/* LEFT: FLASH OFFER (DUAL MODE) */}
          <div className="col-span-3 h-full">
            <FlashOfferCard />
          </div>

          {/* MIDDLE: MAIN SLIDER (DUAL MODE) */}
          <div className="col-span-6 relative rounded-none overflow-hidden h-full bg-card border border-white/5 shadow-2xl">
            {combinedSliderItems.length > 0 ? (
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[plugin.current]}>
                <CarouselContent className="h-[450px]">
                  {combinedSliderItems.map((item, index) => (
                    <SlideItem key={item.id || index} item={item} priority={index < 3} />
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" />
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">LOADING FEATURED ASSETS...</p>
              </div>
            )}
          </div>
          
          {/* RIGHT: PROMOTIONAL TILES */}
          <div className="col-span-3 flex flex-col h-full gap-4">
            <div className="relative flex-grow bg-gradient-to-br from-[#01a3a4] to-[#00b894] p-8 rounded-none overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10 group">
              <div className="relative z-10">
                <h3 className="text-white font-black text-2xl tracking-tighter uppercase leading-none">PREMIUM<br/>EXPERIENCE</h3>
                <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.4em] mt-3">EXCLUSIVE MEMBER ACCESS</p>
              </div>
              <div className="space-y-5 relative z-10">
                <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 bg-black/20 flex items-center justify-center border border-white/10"><Truck className="h-6 w-6 text-white" /></div>
                  <div className="flex flex-col"><span className="text-white font-black text-[10px] uppercase opacity-70 tracking-widest">Expedited</span><span className="text-white font-black text-[14px] uppercase tracking-tighter">Shipping</span></div>
                </div>
                <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 bg-black/20 flex items-center justify-center border border-white/10"><Tag className="h-6 w-6 text-white" /></div>
                  <div className="flex flex-col"><span className="text-white font-black text-[10px] uppercase opacity-70 tracking-widest">Global</span><span className="text-white font-black text-[14px] uppercase tracking-tighter">Standards</span></div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>
            
            <div className="flex items-center gap-4 bg-card border border-white/10 p-4 hover:border-[#01a3a4] transition-all cursor-pointer">
              <div className="bg-white p-2 w-16 h-16 shrink-0 border border-white/5 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                  <path fill="currentColor" d="M0 0h18v18H0V0zm2 2v14h14V2H2zm2 2h10v10H4V4zm78-4h18v18H82V0zm2 2v14h14V2H84zm2 2h10v10H86V4zM0 82h18v18H0V82zm2 2v14h14V84H2zm2 2h10v10H4V86zm20-80h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm-44 4h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-40 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1.5 flex-grow">
                <div className="bg-white h-7 px-4 flex items-center gap-2 hover:bg-[#01a3a4] hover:text-white transition-colors"><Apple className="h-3 w-3" /><span className="text-[9px] font-black uppercase tracking-widest">APP STORE</span></div>
                <div className="bg-white h-7 px-4 flex items-center gap-2 hover:bg-[#01a3a4] hover:text-white transition-colors"><Play className="h-3 w-3 fill-current" /><span className="text-[9px] font-black uppercase tracking-widest">GOOGLE PLAY</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* TOP SELLING PRODUCTS GRID */}
        <section className="bg-card/20 p-10 border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="h-10 w-2 bg-[#01a3a4]" />
              <h2 className="text-3xl font-black flex items-center gap-3 uppercase tracking-tighter text-white">
                <Flame className="h-8 w-8 text-[#01a3a4] fill-current" /> TOP SELLING PRODUCTS
              </h2>
            </div>
            <div className="h-px flex-grow mx-10 bg-white/5" />
            <Link href="/shop" className="text-[10px] font-black text-[#01a3a4] hover:text-white transition-colors uppercase tracking-[0.3em]">VIEW ARCHIVE</Link>
          </div>
          
          <div className="grid grid-cols-6 gap-6">
            {productsLoading ? (
               Array.from({length: 12}).map((_, i) => <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse border border-white/5" />)
            ) : products?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          
          <div className="flex justify-center mt-20">
            <Button asChild className="bg-[#01a3a4] hover:bg-white hover:text-black text-white font-black text-[13px] uppercase h-16 px-16 rounded-none shadow-2xl shadow-[#01a3a4]/20 transition-all duration-500">
              <Link href="/shop">LOAD ALL COLLECTIONS <ArrowRight className="ml-4 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        {/* CATEGORY EXPLORATION */}
        <section className="space-y-12 pb-20">
          <div className="flex items-center gap-5">
            <div className="h-10 w-2 bg-[#01a3a4]" />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">EXPLORE BY CLASSIFICATION</h2>
          </div>
          <div className="grid grid-cols-8 gap-8">
            {categoriesLoading ? (
              Array.from({length: 8}).map((_, i) => <div key={i} className="aspect-square bg-white/5 animate-pulse border border-white/5" />)
            ) : categories?.map((cat) => (
              <Link href={`/shop?category=${cat.name}`} key={cat.id} className="group flex flex-col items-center space-y-4">
                <div className="relative w-full aspect-square overflow-hidden border border-white/5 group-hover:border-[#01a3a4] transition-all bg-black shadow-xl">
                  {cat.imageUrl && (
                    <Image 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      fill 
                      sizes="200px" 
                      quality={70} 
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
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

