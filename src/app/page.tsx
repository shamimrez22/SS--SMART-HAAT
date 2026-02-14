"use client";

import React, { useRef, useMemo, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Loader2, Apple, Play, ArrowRight, Sparkles } from 'lucide-react';
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
          decoding="async"
          {...(priority ? { fetchPriority: "high" } : {})}
        />
        
        <div className="absolute bottom-2 left-2 z-10 flex flex-col items-start max-w-[90%] pointer-events-none">
          <h2 className="text-[6px] md:text-[12px] font-headline font-black text-white uppercase tracking-wider mb-0.5 drop-shadow-lg truncate w-full">
            {item.name || item.title}
          </h2>
          
          {isProduct && (
            <div className="flex flex-col space-y-0.5 md:space-y-1 pointer-events-auto">
              <div className="text-[8px] md:text-lg font-black text-primary tracking-tighter drop-shadow-lg leading-none">
                <span className="text-[6px] md:text-[10px] font-normal mr-0.5 text-white">৳</span>
                {(item.price || 0).toLocaleString()}
              </div>
              <button 
                onClick={() => setIsOrderOpen(true)} 
                style={{ backgroundColor: 'var(--button-bg)' }}
                className="text-white px-1.5 md:px-4 py-0.5 md:py-1.5 h-4 md:h-7 font-black text-[4px] md:text-[8px] uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 shadow-xl border-none flex items-center gap-1"
              >
                <ShoppingCart className="h-1.5 w-1.5 md:h-3 md:w-3" /> অর্ডার করুন
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

const AnimatedFlashBar = memo(() => {
  const db = useFirestore();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const flashProductQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), where('showInFlashOffer', '==', true), limit(10));
  }, [db]);

  const flashBannerQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'featured_banners'), where('type', '==', 'FLASH'), limit(20));
  }, [db]);
  
  const { data: flashProducts } = useCollection(flashProductQuery);
  const { data: flashBanners } = useCollection(flashBannerQuery);

  const combinedItems = useMemo(() => {
    const products = flashProducts || [];
    const banners = (flashBanners || []).filter(b => b.showOnRight !== false);
    return [...banners, ...products].sort((a, b) => 
      new Date(b.createdAt || '2024-01-01').getTime() - new Date(a.createdAt || '2024-01-01').getTime()
    );
  }, [flashProducts, flashBanners]);

  useEffect(() => {
    if (combinedItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % combinedItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [combinedItems.length]);

  if (combinedItems.length === 0) return null;
  const activeItem = combinedItems[currentIndex];

  return (
    <div className="h-full w-full relative overflow-hidden bg-black group cursor-pointer">
      <div key={activeItem.id} className="h-full w-full absolute inset-0 animate-ken-burns">
        <Image 
          src={activeItem.imageUrl} 
          alt="Flash" 
          fill 
          className="object-fill"
          priority={true}
          decoding="async"
          {...{ fetchPriority: "high" }}
        />
      </div>
      <div className="absolute top-1 right-1 bg-primary/40 backdrop-blur-sm border border-white/20 px-1 py-0.5 text-[4px] md:text-[7px] text-white font-black uppercase tracking-widest flex items-center gap-0.5">
        <Sparkles className="h-1 w-1 animate-pulse" /> FLASH LIVE
      </div>
      <div className="absolute bottom-1 left-1 right-1 z-10 space-y-0">
        <p className="text-[6px] md:text-[10px] font-black text-white uppercase tracking-widest truncate drop-shadow-md">
          {activeItem.name || activeItem.title}
        </p>
        <div className="h-0.5 w-4 bg-primary rounded-full" />
      </div>
    </div>
  );
});

AnimatedFlashBar.displayName = 'AnimatedFlashBar';

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
    return query(collection(db, 'featured_banners'), where('type', '==', 'FLASH'), limit(20));
  }, [db]);
  
  const { data: flashProducts } = useCollection(flashProductQuery);
  const { data: flashBanners } = useCollection(flashBannerQuery);

  const combinedItems = useMemo(() => {
    const products = flashProducts || [];
    const banners = (flashBanners || []).filter(b => b.showOnLeft !== false);
    return [...banners, ...products].sort((a, b) => 
      new Date(b.createdAt || '2024-01-01').getTime() - new Date(a.createdAt || '2024-01-01').getTime()
    );
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

  return (
    <div className="h-full bg-black overflow-hidden relative group w-full gpu-accelerated border-r border-white/10 flex items-center justify-center">
      {activeItem ? (
        <div className="h-full w-full relative flex items-center justify-center" key={activeItem.id}>
          <div className="h-full w-full absolute inset-0 animate-ken-burns">
            <Image 
              src={activeItem.imageUrl || 'https://picsum.photos/seed/flash/400/400'} 
              alt="Flash Offer" 
              fill 
              sizes="(max-width: 768px) 33vw, 25vw" 
              className="object-fill" 
              priority={true}
              loading="eager"
              decoding="async"
              {...{ fetchPriority: "high" }}
            />
          </div>
          <div className="absolute top-1 md:top-2 left-1 md:left-2 bg-red-600 px-1 md:px-2 py-0.5 text-[4px] md:text-[7px] font-black text-white uppercase tracking-widest z-10 shadow-xl">FLASH OFFER</div>
          
          <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 z-10 flex flex-col items-start max-w-[90%]">
             <p className="text-white font-black text-[5px] md:text-[10px] uppercase tracking-wider mb-0.5 drop-shadow-md truncate w-full">
               {activeItem.name || activeItem.title}
             </p>
             {activeItem.price !== undefined && (
               <div className="mb-0.5">
                 <span className="text-primary font-black text-[7px] md:text-lg drop-shadow-md">
                   ৳{(activeItem.price || 0).toLocaleString()}
                 </span>
               </div>
             )}
             <button 
               onClick={() => setIsOrderOpen(true)} 
               style={{ backgroundColor: 'var(--button-bg)' }}
               className="text-white px-1 md:px-3 py-0.5 md:py-1 h-4 md:h-6 font-black text-[4px] md:text-[7px] uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 shadow-xl border-none flex items-center gap-0.5"
             >
               <ShoppingCart className="h-1.5 w-1.5 md:h-2.5 md:w-2.5" /> অর্ডার করুন
             </button>
             <OrderModal product={activeItem} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-2 border border-white/10">
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

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen flex flex-col bg-black selection:bg-primary/30 relative">
      <MainHeader />

      <main className="flex-grow container mx-auto bg-black">
        <section className="grid grid-cols-12 gap-0 h-[130px] md:h-[300px] gpu-accelerated bg-black overflow-hidden border-b border-white/10">
          <div className="col-span-3 h-full overflow-hidden">
            <FlashOfferCard />
          </div>
          
          <div className="col-span-6 h-full relative overflow-hidden bg-black">
            {combinedSliderItems.length > 0 ? (
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[autoplay.current]}>
                <CarouselContent className="h-full">
                  {combinedSliderItems.map((item, index) => (
                    <SlideItem key={item.id || index} item={item} priority={index === 0} />
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            )}
          </div>

          <div className="col-span-3 h-full bg-primary relative overflow-hidden flex flex-col items-center justify-center p-1 md:p-4 space-y-1 md:space-y-4 gpu-accelerated shadow-[inset_0_0_100px_rgba(0,0,0,0.2)] border-l border-white/10">
            {settings?.showVideoInAppBar ? (
              <div className="absolute inset-0 w-full h-full"><AnimatedFlashBar /></div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1 md:space-y-4 relative z-10">
                <h3 className="text-white font-black text-[5px] md:text-sm lg:text-lg uppercase tracking-[0.2em] italic text-center drop-shadow-xl font-headline">DOWNLOAD APP</h3>
                <div className="bg-white p-0.5 md:p-2 w-8 h-8 md:w-28 md:h-28 flex items-center justify-center border border-white/20 shadow-2xl">
                  <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(settings?.qrCodeLink || 'https://sssmarthaat.com')}`} alt="QR" width={150} height={150} className="w-full h-full" priority />
                </div>
                <div className="flex flex-col gap-0.5 md:gap-2 w-full max-w-[140px]">
                  <button className="w-full bg-white text-black h-4 md:h-8 flex items-center justify-center gap-0.5 md:gap-2 font-black text-[4px] md:text-[9px] uppercase shadow-lg hover:opacity-90 transition-all"><Apple className="h-1.5 w-1.5 md:h-4 md:w-4" /> APP STORE</button>
                  <button className="w-full bg-white text-black h-4 md:h-8 flex items-center justify-center gap-0.5 md:gap-2 font-black text-[4px] md:text-[9px] uppercase shadow-lg hover:opacity-90 transition-all"><Play className="h-1.5 w-1.5 md:h-4 md:w-4" /> PLAY STORE</button>
                </div>
              </div>
            )}
          </div>
        </section>

        {isCategoriesLoading || isProductsLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase text-primary tracking-widest">Initialising Archive...</p>
          </div>
        ) : categories?.map((cat) => {
          const catProducts = allProducts?.filter(p => p.category === cat.name).slice(0, 18) || [];
          if (catProducts.length === 0) return null;

          return (
            <section key={cat.id} className="py-6 md:py-16 px-2 md:px-12 gpu-accelerated border-b border-white/10 product-section bg-black">
              <div className="flex items-center justify-between mb-6 md:mb-10">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="h-4 md:h-8 w-1 bg-primary" />
                  <h2 className="text-[10px] md:text-[16px] font-black text-white uppercase tracking-[0.3em] font-headline">{cat.name} COLLECTION</h2>
                </div>
                <Link href={`/shop?category=${cat.name}`} className="text-[7px] md:text-[11px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                  VIEW ALL <ArrowRight className="h-2 w-2 md:h-3 md:w-3" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-6">
                {catProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          );
        })}

        <div className="mt-10 md:mt-24 flex justify-center pb-24 px-4 bg-black">
          <Link href="/shop" className="w-full md:w-auto">
            <button className="w-full md:w-[220px] border border-white/20 bg-white/[0.05] hover:border-primary text-white px-6 h-10 md:h-12 font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px] flex items-center justify-center gap-2 md:gap-4 transition-all hover:bg-primary hover:text-white active:scale-95 shadow-lg group">
              MORE PRODUCT <ArrowRight className="h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </div>

        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  );
}
