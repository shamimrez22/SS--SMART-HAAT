
"use client";

import React, { useRef, useMemo, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Loader2, Apple, Play, ArrowRight } from 'lucide-react';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, limit, orderBy, doc, increment } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { OrderModal } from '@/components/OrderModal';

const SlideItem = memo(({ item, priority }: { item: any, priority: boolean }) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  // Determine if it's a product or a banner
  const isProduct = item.price !== undefined;

  return (
    <CarouselItem className="h-full">
      <div className="relative h-full w-full bg-black overflow-hidden gpu-accelerated">
        <Image
          src={item.imageUrl || 'https://picsum.photos/seed/placeholder/800/450'}
          alt={item.name || item.title || 'Banner'}
          fill
          sizes="100vw"
          className="object-cover"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-black/10 flex flex-col justify-center px-4 md:px-12 space-y-1 md:space-y-3">
          <h2 className="text-[16px] md:text-4xl font-headline font-black text-white uppercase tracking-tight max-w-[600px] leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            {item.name || item.title}
          </h2>
          
          {isProduct && (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-1 md:gap-4">
                <div className="flex items-baseline text-[14px] md:text-3xl font-black text-[#01a3a4] tracking-tighter drop-shadow-2xl">
                  <span className="text-[10px] md:text-[16px] font-normal mr-1 translate-y-[-4px] text-white/90">৳</span>
                  {(item.price || 0).toLocaleString()}
                </div>
              </div>
              <button 
                onClick={() => setIsOrderOpen(true)} 
                className="bg-[#01a3a4] text-white h-8 md:h-12 px-6 md:px-10 font-black rounded-none text-[9px] md:text-[12px] hover:bg-white hover:text-black transition-all uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl w-fit mt-2 active:scale-95 border-none"
              >
                <ShoppingCart className="h-3.5 w-3.5 md:h-5 md:w-5" /> অর্ডার করুন
              </button>
            </div>
          )}
        </div>
      </div>
      <OrderModal product={item} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </CarouselItem>
  );
});

SlideItem.displayName = 'SlideItem';

const FlashOfferCard = memo(() => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const db = useFirestore();
  
  const flashProductQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), where('showInFlashOffer', '==', true), limit(5));
  }, [db]);

  const flashBannerQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'featured_banners'), where('type', '==', 'FLASH'), limit(5));
  }, [db]);
  
  const { data: flashProducts } = useCollection(flashProductQuery);
  const { data: flashBanners } = useCollection(flashBannerQuery);

  const combinedItems = useMemo(() => {
    const products = flashProducts || [];
    const banners = flashBanners || [];
    return [...banners, ...products];
  }, [flashProducts, flashBanners]);

  useEffect(() => {
    if (combinedItems.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % combinedItems.length), 6000);
    return () => clearInterval(interval);
  }, [combinedItems]);
  
  const activeItem = combinedItems[currentIndex];

  return (
    <div className="h-full bg-black overflow-hidden relative group w-full gpu-accelerated">
      {activeItem ? (
        <div className="h-full w-full relative">
          <Image 
            src={activeItem.imageUrl || 'https://picsum.photos/seed/flash/400/400'} 
            alt="Flash Offer" 
            fill 
            sizes="(max-width: 768px) 33vw, 25vw" 
            className="object-cover" 
            priority={true}
            loading="eager"
          />
          <div className="absolute top-2 left-2 bg-red-600 px-2 md:px-4 py-1 text-[6px] md:text-[10px] font-black text-white uppercase tracking-widest z-10 shadow-lg">FLASH</div>
          <div className="absolute bottom-0 w-full pb-2 md:pb-4 text-center px-2 bg-gradient-to-t from-black/80 to-transparent">
             <p className="text-white font-black text-[7px] md:text-[12px] uppercase tracking-widest mb-1 truncate drop-shadow-2xl">{activeItem.name || activeItem.title}</p>
             {activeItem.price !== undefined && (
               <div className="flex flex-col items-center mb-1">
                 <span className="text-[#01a3a4] font-black text-[10px] md:text-lg drop-shadow-2xl">৳{(activeItem.price || 0).toLocaleString()}</span>
               </div>
             )}
             <button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white px-3 md:px-6 py-1 md:h-10 font-black text-[6px] md:text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-2xl border-none">অর্ডার করুন</button>
             <OrderModal product={activeItem} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 text-[#01a3a4] animate-spin" />
        </div>
      )}
    </div>
  );
});

FlashOfferCard.displayName = 'FlashOfferCard';

export default function Home() {
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  
  const categoriesRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'categories');
  }, [db]);

  const productsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const sliderProductQuery = useMemoFirebase(() => {
    if (!db) return null;
    // Added orderBy to ensure newest items appear first
    return query(collection(db, 'products'), where('showInSlider', '==', true), orderBy('createdAt', 'desc'), limit(10));
  }, [db]);

  const sliderBannerQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'featured_banners'), where('type', '==', 'SLIDER'), orderBy('createdAt', 'desc'), limit(10));
  }, [db]);

  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'site-config');
  }, [db]);
  
  const { data: categories, isLoading: isCategoriesLoading } = useCollection(categoriesRef);
  const { data: allProducts, isLoading: isProductsLoading } = useCollection(productsRef);
  const { data: sliderProducts } = useCollection(sliderProductQuery);
  const { data: sliderBanners } = useCollection(sliderBannerQuery);
  const { data: settings } = useDoc(settingsRef);

  const combinedSliderItems = useMemo(() => {
    const products = sliderProducts || [];
    const banners = sliderBanners || [];
    return [...banners, ...products];
  }, [sliderProducts, sliderBanners]);

  // Stable Autoplay configuration
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const qrCodeUrl = useMemo(() => {
    const link = settings?.qrCodeLink || 'https://sssmarthaat.com';
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link)}`;
  }, [settings?.qrCodeLink]);

  useEffect(() => {
    setIsMounted(true);
    if (db) {
      try {
        const dateStr = new Date().toISOString().split('T')[0];
        const statsRef = doc(db, 'visitorStats', dateStr);
        setDocumentNonBlocking(statsRef, { 
          count: increment(1), 
          date: dateStr 
        }, { merge: true });
      } catch (err) {
        console.warn("Stats error handled.");
      }
    }
  }, [db]);

  if (!isMounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30 relative">
      <MainHeader />

      <main className="flex-grow container mx-auto px-0 md:px-0">
        {/* TOP FOLD GRID: FLASH | SLIDER | QR */}
        <section className="grid grid-cols-12 gap-0 h-[180px] md:h-[350px] lg:h-[450px] gpu-accelerated bg-black overflow-hidden border-b border-white/5">
          <div className="col-span-3 h-full"><FlashOfferCard /></div>
          
          <div className="col-span-6 h-full relative overflow-hidden bg-black">
            {combinedSliderItems.length > 0 ? (
              <Carousel 
                key={combinedSliderItems.length} // Forces re-init when data count changes
                className="w-full h-full" 
                opts={{ loop: true }} 
                plugins={[autoplay.current]}
              >
                <CarouselContent className="h-full">
                  {combinedSliderItems.map((item, index) => (
                    <SlideItem 
                      key={item.id} // Stable key using unique ID
                      item={item} 
                      priority={index < 2} 
                    />
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 text-[#01a3a4] animate-spin" />
              </div>
            )}
          </div>

          <div className="col-span-3 h-full bg-[#01a3a4] flex flex-col items-center justify-center p-1.5 md:p-4 space-y-1.5 md:space-y-4 gpu-accelerated">
            <h3 className="text-white font-black text-[7px] md:text-sm lg:text-base uppercase tracking-[0.3em] italic text-center drop-shadow-xl">DOWNLOAD APP</h3>
            <div className="bg-white p-1 md:p-2 w-16 h-16 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center border-2 border-white/20 shadow-2xl">
              <Image src={qrCodeUrl} alt="QR Code" width={150} height={150} className="w-full h-full" loading="lazy" />
            </div>
            <div className="flex flex-col gap-1 md:gap-2 w-full max-w-[240px]">
              <button className="w-full bg-white text-black h-6 md:h-11 px-2 md:px-4 flex items-center justify-center gap-1 md:gap-3 font-black text-[6px] md:text-[10px] uppercase shadow-lg hover:bg-black hover:text-white transition-all active:scale-95 border-none"><Apple className="h-3 w-3 md:h-5 md:w-5" /> APP STORE</button>
              <button className="w-full bg-white text-black h-6 md:h-11 px-2 md:px-4 flex items-center justify-center gap-1 md:gap-3 font-black text-[6px] md:text-[10px] uppercase shadow-lg hover:bg-black hover:text-white transition-all active:scale-95 border-none"><Play className="h-3 w-3 md:h-5 md:w-5" /> PLAY STORE</button>
            </div>
          </div>
        </section>

        {/* CATEGORY WISE PRODUCT LISTS */}
        {isCategoriesLoading || isProductsLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
            <p className="text-[10px] font-black uppercase text-[#01a3a4] tracking-widest">Initialising Archive...</p>
          </div>
        ) : categories?.map((cat) => {
          const catProducts = allProducts?.filter(p => p.category === cat.name).slice(0, 16) || [];
          if (catProducts.length === 0) return null;

          return (
            <section key={cat.id} className="py-4 md:py-8 px-4 md:px-12 gpu-accelerated border-b border-white/5">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-6 md:h-8 w-1.5 md:w-2 bg-[#01a3a4]" />
                  <h2 className="text-lg md:text-3xl font-black text-white uppercase tracking-tighter">{cat.name} COLLECTION</h2>
                </div>
                <Link href={`/shop?category=${cat.name}`} className="text-[8px] md:text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2">
                  VIEW {cat.name} ARCHIVE <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-6">
                {catProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          );
        })}

        {/* MAIN CTA */}
        <div className="mt-8 md:mt-12 flex justify-center pb-20 px-4">
          <Link href="/shop" className="w-full md:w-auto">
            <button className="w-full md:w-[500px] bg-white/5 border border-white/10 hover:border-[#01a3a4] text-white px-10 h-16 md:h-24 font-black uppercase tracking-[0.5em] text-[11px] md:text-[14px] flex items-center justify-center gap-8 transition-all hover:bg-[#01a3a4] hover:text-black active:scale-95 shadow-2xl group">
              MORE PRODUCT <ArrowRight className="h-6 w-6 group-hover:translate-x-3 transition-transform" />
            </button>
          </Link>
        </div>

        {/* CATEGORY GRID AT BOTTOM */}
        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  );
}
