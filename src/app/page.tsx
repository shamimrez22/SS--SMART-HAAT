
"use client";

import React, { useRef, useMemo, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Loader2, Apple, Play, MapPin, Radio, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, limit, orderBy, doc, increment, setDoc } from 'firebase/firestore';
import { OrderModal } from '@/components/OrderModal';

const SlideItem = memo(({ item, priority }: { item: any, priority: boolean }) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  if (item.price !== undefined) {
    return (
      <CarouselItem className="h-full">
        <div className="relative h-full w-full bg-black overflow-hidden gpu-accelerated">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority={priority}
          />
          <div className="absolute inset-0 bg-black/5 flex flex-col justify-center px-4 md:px-12 space-y-1 md:space-y-2">
            <h2 className="text-[9px] md:text-xl font-headline font-black text-white uppercase tracking-tight max-w-[400px] leading-tight drop-shadow-2xl">
              {item.name}
            </h2>
            <div className="flex flex-col space-y-0.5">
              <div className="flex items-center gap-1 md:gap-4">
                <div className="flex items-baseline text-[10px] md:text-lg font-black text-[#01a3a4] tracking-tighter drop-shadow-2xl">
                  <span className="text-[6px] md:text-[10px] font-normal mr-0.5 translate-y-[-2px] text-white/90">৳</span>
                  {item.price.toLocaleString()}
                </div>
              </div>
              <button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white h-5 md:h-9 px-3 md:px-6 font-black rounded-none text-[6px] md:text-[9px] hover:bg-white hover:text-black transition-all uppercase tracking-widest flex items-center gap-1 shadow-2xl w-fit mt-1 active:scale-95">
                <ShoppingCart className="h-2 w-2 md:h-3 md:w-3" /> অর্ডার করুন
              </button>
            </div>
          </div>
        </div>
        <OrderModal product={item} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
      </CarouselItem>
    );
  }

  return (
    <CarouselItem className="h-full">
      <div className="relative h-full w-full bg-black gpu-accelerated">
        <Image 
          src={item.imageUrl} 
          alt={item.title || "Banner"} 
          fill 
          sizes="100vw" 
          className="object-cover" 
          priority={priority} 
        />
        <div className="absolute inset-0 bg-black/5 flex flex-col justify-center px-4 md:px-12">
           <h2 className="text-[9px] md:text-xl font-black text-white uppercase tracking-tight max-w-[400px] leading-none drop-shadow-2xl">{item.title}</h2>
        </div>
      </div>
    </CarouselItem>
  );
});

SlideItem.displayName = 'SlideItem';

const FlashOfferCard = memo(() => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const db = useFirestore();
  
  const flashProductQuery = useMemoFirebase(() => query(collection(db, 'products'), where('showInFlashOffer', '==', true), limit(3)), [db]);
  const flashBannerQuery = useMemoFirebase(() => query(collection(db, 'featured_banners'), where('type', '==', 'FLASH'), limit(3)), [db]);
  
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
            src={activeItem.imageUrl} 
            alt="Flash Offer" 
            fill 
            sizes="(max-width: 768px) 33vw, 25vw" 
            className="object-cover" 
            priority={true}
          />
          <div className="absolute top-1 left-1 bg-[#01a3a4] px-1 md:px-3 py-0.5 text-[5px] md:text-[8px] font-black text-white uppercase tracking-widest z-10 shadow-lg">FLASH</div>
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent pt-4 pb-1 text-center px-1">
             <p className="text-white font-black text-[6px] md:text-[10px] uppercase tracking-widest mb-0.5 truncate drop-shadow-2xl">{activeItem.name || activeItem.title}</p>
             {activeItem.price && (
               <div className="flex flex-col items-center">
                 <span className="text-[#01a3a4] font-black text-[8px] md:text-sm drop-shadow-2xl">৳{activeItem.price.toLocaleString()}</span>
               </div>
             )}
             <button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white px-2 md:px-4 py-0.5 md:h-8 font-black text-[5px] md:text-[8px] uppercase tracking-widest transition-all mt-0.5 active:scale-95 shadow-xl">অর্ডার করুন</button>
             <OrderModal product={activeItem} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-3 w-3 text-[#01a3a4] animate-spin" />
        </div>
      )}
    </div>
  );
});

FlashOfferCard.displayName = 'FlashOfferCard';

export default function Home() {
  const db = useFirestore();
  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(12)), [db]);
  const sliderProductQuery = useMemoFirebase(() => query(collection(db, 'products'), where('showInSlider', '==', true), limit(3)), [db]);
  const sliderBannerQuery = useMemoFirebase(() => query(collection(db, 'featured_banners'), where('type', '==', 'SLIDER'), orderBy('createdAt', 'desc'), limit(3)), [db]);
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
  
  const { data: products, isLoading: isProductsLoading } = useCollection(productsRef);
  const { data: sliderProducts } = useCollection(sliderProductQuery);
  const { data: sliderBanners } = useCollection(sliderBannerQuery);
  const { data: settings } = useDoc(settingsRef);

  const combinedSliderItems = useMemo(() => {
    const products = sliderProducts || [];
    const banners = sliderBanners || [];
    return [...banners, ...products];
  }, [sliderProducts, sliderBanners]);

  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const qrCodeUrl = useMemo(() => {
    const link = settings?.qrCodeLink || 'https://sssmarthaat.com';
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link)}`;
  }, [settings?.qrCodeLink]);

  useEffect(() => {
    const trackVisit = async () => {
      const today = new Date().toISOString().split('T')[0];
      const statsRef = doc(db, 'visitorStats', today);
      setDoc(statsRef, { count: increment(1), date: today }, { merge: true });
    };
    trackVisit();
  }, [db]);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      
      {settings?.liveStatus && (
        <div className="bg-black/80 backdrop-blur-md border-b border-white/5 py-1 px-4 overflow-hidden whitespace-nowrap">
          <div className="container mx-auto flex items-center gap-6 animate-marquee">
            <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest shrink-0">
              <Radio className="h-2 w-2 animate-pulse text-white" /> LIVE STATUS:
            </div>
            <p className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
              {settings.liveStatus} <span className="text-white/40">•</span> 
              <MapPin className="h-2 w-2 text-white" /> {settings.liveLocation || 'BANANI, DHAKA'}
            </p>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto space-y-1">
        {/* COMPACT HERO SECTION - Side by side desktop look on mobile too */}
        <section className="grid grid-cols-12 gap-0 h-[160px] md:h-[320px] gpu-accelerated">
          <div className="col-span-3 h-full"><FlashOfferCard /></div>
          <div className="col-span-6 h-full relative overflow-hidden bg-black">
            {combinedSliderItems.length > 0 ? (
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[autoplay.current]}>
                <CarouselContent className="h-full">
                  {combinedSliderItems.map((item, index) => <SlideItem key={index} item={item} priority={index < 2} />)}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 text-[#01a3a4] animate-spin" />
              </div>
            )}
          </div>
          <div className="col-span-3 h-full bg-[#01a3a4] flex flex-col items-center justify-center p-1.5 md:p-6 space-y-2 md:space-y-4 gpu-accelerated">
            <h3 className="text-white font-black text-[7px] md:text-lg uppercase tracking-widest italic text-center drop-shadow-xl">DOWNLOAD APP</h3>
            <div className="bg-white p-0.5 md:p-1.5 w-14 h-14 md:w-32 md:h-32 flex items-center justify-center border md:border-2 border-white/20 shadow-2xl">
              <Image src={qrCodeUrl} alt="QR Code" width={150} height={150} className="w-full h-full" loading="lazy" />
            </div>
            <div className="flex flex-col gap-1 md:gap-2 w-full max-w-[240px]">
              <button className="w-full bg-white text-black h-5 md:h-9 px-2 md:px-4 flex items-center justify-center gap-1 md:gap-3 font-black text-[5px] md:text-[9px] uppercase shadow-lg hover:bg-black hover:text-white transition-all active:scale-95"><Apple className="h-2 w-2 md:h-3.5 md:w-3.5" /> APP STORE</button>
              <button className="w-full bg-white text-black h-5 md:h-9 px-2 md:px-4 flex items-center justify-center gap-1 md:gap-3 font-black text-[5px] md:text-[9px] uppercase shadow-lg hover:bg-black hover:text-white transition-all active:scale-95"><Play className="h-2 w-2 md:h-3.5 md:w-3.5" /> PLAY STORE</button>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-10 px-4 md:px-10 gpu-accelerated">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 bg-[#01a3a4]" />
              <h2 className="text-md md:text-xl font-black text-white uppercase tracking-tighter">TOP SELLING PRODUCTS</h2>
            </div>
            <Link href="/shop" className="text-[7px] md:text-[9px] font-black text-[#01a3a4] uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2">
              VIEW ALL <ArrowRight className="h-2 w-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 min-h-[400px]">
            {isProductsLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 text-[#01a3a4] animate-spin" />
                <p className="text-[9px] font-black text-[#01a3a4] uppercase tracking-widest">Loading Products...</p>
              </div>
            ) : products?.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          <div className="mt-10 md:mt-12 flex justify-center px-4">
            <Link href="/shop" className="w-full md:w-auto">
              <button className="w-full bg-white/5 border border-white/10 hover:border-[#01a3a4] text-white px-10 h-12 md:h-14 font-black uppercase tracking-widest text-[9px] md:text-[11px] flex items-center justify-center gap-4 transition-all hover:bg-[#01a3a4] hover:text-black active:scale-95 shadow-2xl">
                MORE PRODUCT
              </button>
            </Link>
          </div>
        </section>

        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  );
}
