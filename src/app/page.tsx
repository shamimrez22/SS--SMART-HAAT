
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
import { collection, query, where, limit, doc, increment } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { OrderModal } from '@/components/OrderModal';

const SlideItem = memo(({ item, priority }: { item: any, priority: boolean }) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isProduct = item.price !== undefined;

  return (
    <CarouselItem className="h-full">
      <div className="relative h-full w-full bg-black overflow-hidden gpu-accelerated flex items-center justify-center">
        <Image
          src={item.imageUrl || 'https://picsum.photos/seed/placeholder/800/450'}
          alt={item.name || item.title || 'Banner'}
          fill
          sizes="100vw"
          className="object-fill"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-black/10 flex flex-col justify-center px-4 md:px-12 space-y-1 md:space-y-3 pointer-events-none">
          <h2 className="text-[14px] md:text-5xl font-headline font-black text-white uppercase tracking-tight max-w-[700px] leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            {item.name || item.title}
          </h2>
          
          {isProduct && (
            <div className="flex flex-col space-y-1 md:space-y-2 pointer-events-auto">
              <div className="flex items-baseline text-[12px] md:text-4xl font-black text-[#01a3a4] tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                <span className="text-[10px] md:text-[20px] font-normal mr-1 translate-y-[-2px] md:translate-y-[-4px] text-white">৳</span>
                {(item.price || 0).toLocaleString()}
              </div>
              <button 
                onClick={() => setIsOrderOpen(true)} 
                className="bg-[#01a3a4] text-white h-7 md:h-14 px-4 md:px-12 font-black rounded-none text-[8px] md:text-[14px] hover:bg-white hover:text-black transition-all uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-2 md:gap-3 shadow-2xl w-fit mt-1 md:mt-4 active:scale-95 border-none"
              >
                <ShoppingCart className="h-3 w-3 md:h-6 md:w-6" /> অর্ডার করুন
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
    return query(collection(db, 'products'), where('showInFlashOffer', '==', true), limit(10));
  }, [db]);

  const flashBannerQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'featured_banners'), where('type', '==', 'FLASH'), limit(10));
  }, [db]);
  
  const { data: flashProducts } = useCollection(flashProductQuery);
  const { data: flashBanners } = useCollection(flashBannerQuery);

  const combinedItems = useMemo(() => {
    const products = flashProducts || [];
    const banners = flashBanners || [];
    const items = [...banners, ...products].sort((a, b) => 
      new Date(b.createdAt || '2024-01-01').getTime() - new Date(a.createdAt || '2024-01-01').getTime()
    );
    return items;
  }, [flashProducts, flashBanners]);

  useEffect(() => {
    if (combinedItems.length <= 1) {
      setCurrentIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % combinedItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [combinedItems.length]);
  
  const activeItem = combinedItems[currentIndex];

  if (!flashProducts && !flashBanners) {
    return (
      <div className="h-full flex items-center justify-center bg-black/50">
        <Loader2 className="h-4 w-4 text-[#01a3a4] animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full bg-black overflow-hidden relative group w-full gpu-accelerated border-r border-white/5 flex items-center justify-center">
      {activeItem ? (
        <div className="h-full w-full relative flex items-center justify-center" key={activeItem.id}>
          <Image 
            src={activeItem.imageUrl || 'https://picsum.photos/seed/flash/400/400'} 
            alt="Flash Offer" 
            fill 
            sizes="(max-width: 768px) 33vw, 25vw" 
            className="object-fill" 
            priority={true}
            loading="eager"
          />
          <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-red-600 px-2 md:px-6 py-1 md:py-1.5 text-[6px] md:text-[10px] font-black text-white uppercase tracking-widest z-10 shadow-2xl">FLASH OFFER</div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          
          {/* UPDATED OVERLAY: SMALLER AND IN THE CORNER */}
          <div className="absolute bottom-2 md:bottom-6 left-2 md:left-6 z-10 flex flex-col items-start max-w-[90%]">
             <p className="text-white font-black text-[7px] md:text-[12px] uppercase tracking-wider mb-0.5 md:mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate w-full">
               {activeItem.name || activeItem.title}
             </p>
             {activeItem.price !== undefined && (
               <div className="mb-1 md:mb-3">
                 <span className="text-[#01a3a4] font-black text-[9px] md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                   ৳{(activeItem.price || 0).toLocaleString()}
                 </span>
               </div>
             )}
             <button 
               onClick={() => setIsOrderOpen(true)} 
               className="bg-[#01a3a4] text-white px-2 md:px-5 py-1 md:py-2.5 h-5 md:h-10 font-black text-[5px] md:text-[10px] uppercase tracking-widest transition-all hover:bg-white hover:text-black active:scale-95 shadow-xl border-none flex items-center gap-1 md:gap-2"
             >
               <ShoppingCart className="h-2.5 w-2.5 md:h-4 md:w-4" /> অর্ডার করুন
             </button>
             <OrderModal product={activeItem} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-2 border border-white/5">
          <ShoppingCart className="h-6 w-6 text-white/10" />
        </div>
      )}
    </div>
  );
});

FlashOfferCard.displayName = 'FlashOfferCard';

export default function Home() {
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  
  const categoriesRef = useMemoFirebase(() => db ? collection(db, 'categories') : null, [db]);
  const productsRef = useMemoFirebase(() => db ? collection(db, 'products') : null, [db]);

  const sliderProductQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), where('showInSlider', '==', true), limit(15));
  }, [db]);

  const sliderBannerQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'featured_banners'), where('type', '==', 'SLIDER'), limit(15));
  }, [db]);

  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  
  const { data: categories, isLoading: isCategoriesLoading } = useCollection(categoriesRef);
  const { data: allProducts, isLoading: isProductsLoading } = useCollection(productsRef);
  const { data: sliderProducts } = useCollection(sliderProductQuery);
  const { data: sliderBanners } = useCollection(sliderBannerQuery);
  const { data: settings } = useDoc(settingsRef);

  const combinedSliderItems = useMemo(() => {
    const products = sliderProducts || [];
    const banners = sliderBanners || [];
    return [...banners, ...products].sort((a, b) => 
      new Date(b.createdAt || '2024-01-01').getTime() - new Date(a.createdAt || '2024-01-01').getTime()
    );
  }, [sliderProducts, sliderBanners]);

  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const qrCodeUrl = useMemo(() => {
    const link = settings?.qrCodeLink || 'https://sssmarthaat.com';
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(link)}`;
  }, [settings?.qrCodeLink]);

  useEffect(() => {
    setIsMounted(true);
    if (db) {
      try {
        const dateStr = new Date().toISOString().split('T')[0];
        const statsRef = doc(db, 'visitorStats', dateStr);
        setDocumentNonBlocking(statsRef, { count: increment(1), date: dateStr }, { merge: true });
      } catch (err) {}
    }
  }, [db]);

  const carouselKey = useMemo(() => {
    return combinedSliderItems.map(item => item.id).join('-');
  }, [combinedSliderItems]);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30 relative">
      <MainHeader />

      <main className="flex-grow container mx-auto">
        <section className="grid grid-cols-12 gap-0 h-[130px] md:h-[300px] lg:h-[450px] gpu-accelerated bg-black overflow-hidden border-b border-white/10">
          
          <div className="col-span-3 h-full overflow-hidden">
            <FlashOfferCard />
          </div>
          
          <div className="col-span-6 h-full relative overflow-hidden bg-black">
            {combinedSliderItems.length > 0 ? (
              <Carousel 
                key={carouselKey} 
                className="w-full h-full" 
                opts={{ loop: true }} 
                plugins={[autoplay.current]}
              >
                <CarouselContent className="h-full">
                  {combinedSliderItems.map((item, index) => (
                    <SlideItem 
                      key={item.id || index} 
                      item={item} 
                      priority={index < 2} 
                    />
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (sliderProducts || sliderBanners) ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 border-x border-white/5">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No Featured Content</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 text-[#01a3a4] animate-spin" />
              </div>
            )}
          </div>

          <div className="col-span-3 h-full bg-[#01a3a4] flex flex-col items-center justify-center p-1 md:p-6 space-y-1 md:space-y-6 gpu-accelerated shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]">
            <h3 className="text-white font-black text-[6px] md:text-xl lg:text-2xl uppercase tracking-[0.2em] md:tracking-[0.3em] italic text-center drop-shadow-xl font-headline">
              DOWNLOAD APP
            </h3>
            
            <div className="bg-white p-0.5 md:p-4 w-10 h-10 md:w-40 md:h-40 lg:w-56 lg:h-56 flex items-center justify-center border-1 md:border-4 border-white/30 shadow-2xl transition-transform hover:scale-105 duration-500">
              <Image src={qrCodeUrl} alt="QR Code" width={250} height={250} className="w-full h-full" loading="lazy" />
            </div>
            
            <div className="flex flex-col gap-0.5 md:gap-3 w-full max-w-[280px]">
              <button className="w-full bg-white text-black h-5 md:h-12 px-1 md:px-8 flex items-center justify-center gap-1 md:gap-4 font-black text-[5px] md:text-[12px] uppercase shadow-lg hover:bg-black hover:text-white transition-all active:scale-95 border-none group">
                <Apple className="h-2 w-2 md:h-6 md:w-6 transition-transform group-hover:scale-110" /> APP STORE
              </button>
              <button className="w-full bg-white text-black h-5 md:h-12 px-1 md:px-8 flex items-center justify-center gap-1 md:gap-4 font-black text-[5px] md:text-[12px] uppercase shadow-lg hover:bg-black hover:text-white transition-all active:scale-95 border-none group">
                <Play className="h-2 w-2 md:h-6 md:w-6 transition-transform group-hover:scale-110" /> PLAY STORE
              </button>
            </div>
          </div>
        </section>

        {isCategoriesLoading || isProductsLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
            <p className="text-[10px] font-black uppercase text-[#01a3a4] tracking-widest">Initialising Archive...</p>
          </div>
        ) : categories?.map((cat) => {
          const catProducts = allProducts?.filter(p => p.category === cat.name).slice(0, 16) || [];
          if (catProducts.length === 0) return null;

          return (
            <section key={cat.id} className="py-8 md:py-16 px-4 md:px-12 gpu-accelerated border-b border-white/5">
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <div className="flex items-center gap-3">
                  <div className="h-5 md:h-6 w-1 bg-[#01a3a4]" />
                  <h2 className="text-[11px] md:text-[13px] font-black text-white uppercase tracking-[0.4em]">{cat.name} COLLECTION</h2>
                </div>
                <Link href={`/shop?category=${cat.name}`} className="text-[8px] md:text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2">
                  VIEW ARCHIVE <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
                {catProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          );
        })}

        <div className="mt-12 md:mt-20 flex justify-center pb-24 px-4">
          <Link href="/shop" className="w-full md:w-auto">
            <button className="w-full md:w-[600px] bg-white/5 border border-white/10 hover:border-[#01a3a4] text-white px-12 h-20 md:h-28 font-black uppercase tracking-[0.6em] text-[12px] md:text-[16px] flex items-center justify-center gap-10 transition-all hover:bg-[#01a3a4] hover:text-black active:scale-95 shadow-2xl group">
              MORE PRODUCT <ArrowRight className="h-8 w-8 group-hover:translate-x-4 transition-transform" />
            </button>
          </Link>
        </div>

        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  );
}
