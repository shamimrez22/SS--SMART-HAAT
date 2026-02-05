
"use client";

import React, { useRef, useMemo, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Loader2, Apple, Play, MapPin, Radio, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
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
        <div className="relative h-[300px] md:h-[420px] w-full bg-black overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority={priority}
          />
          {/* Extremely light overlay for maximum brightness */}
          <div className="absolute inset-0 bg-black/5 flex flex-col justify-center px-6 md:px-12 space-y-4">
            <h2 className="text-lg md:text-2xl font-headline font-black text-white uppercase tracking-tight max-w-[400px] leading-tight drop-shadow-2xl">
              {item.name}
            </h2>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-4">
                <div className="flex items-baseline text-[18px] md:text-[22px] font-black text-[#01a3a4] tracking-tighter drop-shadow-2xl">
                  <span className="text-[11px] font-normal mr-1 translate-y-[-4px] text-white/90">৳</span>
                  {item.price.toLocaleString()}
                </div>
              </div>
              <button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white h-9 md:h-10 px-6 md:px-8 font-black rounded-none text-[9px] md:text-[10px] hover:bg-white hover:text-black transition-all uppercase tracking-widest flex items-center gap-2 shadow-2xl w-fit mt-2">
                <ShoppingCart className="h-3.5 w-3.5" /> অর্ডার করুন
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
      <div className="relative h-[300px] md:h-[420px] w-full bg-black">
        <Image 
          src={item.imageUrl} 
          alt={item.title || "Banner"} 
          fill 
          sizes="100vw" 
          className="object-cover" 
          priority={priority} 
        />
        <div className="absolute inset-0 bg-black/5 flex flex-col justify-center px-6 md:px-12">
           <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-tight max-w-[400px] leading-none drop-shadow-2xl">{item.title}</h2>
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
    <div className="h-[300px] md:h-[420px] bg-black overflow-hidden relative group w-full">
      {activeItem ? (
        <div className="h-full w-full relative">
          <Image 
            src={activeItem.imageUrl} 
            alt="Flash Offer" 
            fill 
            sizes="(max-width: 768px) 100vw, 25vw" 
            className="object-cover" 
            priority={true}
          />
          <div className="absolute top-4 left-4 bg-[#01a3a4] px-3 md:px-4 py-1.5 text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest z-10 shadow-lg">FLASH OFFER</div>
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 via-black/20 to-transparent pt-12 pb-6 text-center px-4 space-y-2">
             <p className="text-white font-black text-[10px] md:text-[12px] uppercase tracking-widest mb-1 truncate drop-shadow-2xl">{activeItem.name || activeItem.title}</p>
             {activeItem.price && (
               <div className="flex flex-col items-center">
                 <span className="text-[#01a3a4] font-black text-base md:text-lg drop-shadow-2xl">৳{activeItem.price.toLocaleString()}</span>
               </div>
             )}
             <button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white px-4 md:px-6 py-2 h-9 md:h-10 font-black text-[8px] md:text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all mt-2 active:scale-95 shadow-xl">অর্ডার করুন</button>
             <OrderModal product={activeItem} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-[#01a3a4] animate-spin" />
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {settings?.liveStatus && (
        <div className="bg-black/80 backdrop-blur-md border-b border-white/5 py-2 px-4 overflow-hidden whitespace-nowrap">
          <div className="container mx-auto flex items-center gap-6 animate-marquee">
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-[#01a3a4] uppercase tracking-widest shrink-0">
              <Radio className="h-3 w-3 animate-pulse" /> LIVE STATUS:
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
              {settings.liveStatus} <span className="text-white/20">•</span> 
              <MapPin className="h-3 w-3 text-[#01a3a4]" /> {settings.liveLocation || 'BANANI, DHAKA'}
            </p>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto space-y-2">
        <section className="grid grid-cols-12 gap-0">
          <div className="col-span-12 md:col-span-3 order-2 md:order-1"><FlashOfferCard /></div>
          <div className="col-span-12 md:col-span-6 order-1 md:order-2 relative overflow-hidden h-[300px] md:h-[420px] bg-black">
            {combinedSliderItems.length > 0 ? (
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[autoplay.current]}>
                <CarouselContent className="h-full">
                  {combinedSliderItems.map((item, index) => <SlideItem key={index} item={item} priority={index < 2} />)}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 text-[#01a3a4] animate-spin" />
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-3 order-3 bg-[#01a3a4] flex flex-col items-center justify-center p-6 md:p-8 space-y-6 h-[250px] md:h-[420px]">
            <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-widest leading-none italic text-center drop-shadow-xl">DOWNLOAD APP</h3>
            <div className="bg-white p-2 w-28 h-28 md:w-36 md:h-36 flex items-center justify-center border-4 border-white/20 shadow-2xl">
              <Image src={qrCodeUrl} alt="QR Code" width={150} height={150} className="w-full h-full" loading="lazy" />
            </div>
            <div className="flex flex-row md:flex-col gap-3 w-full max-w-[280px]">
              <button className="flex-1 bg-white text-black h-9 md:h-10 px-4 md:px-6 flex items-center justify-center gap-2 md:gap-4 font-black text-[8px] md:text-[10px] uppercase shadow-lg hover:bg-black hover:text-white transition-all active:scale-95"><Apple className="h-3 w-3 md:h-4 md:w-4" /> APP STORE</button>
              <button className="flex-1 bg-white text-black h-9 md:h-10 px-4 md:px-6 flex items-center justify-center gap-2 md:gap-4 font-black text-[8px] md:text-[10px] uppercase shadow-lg hover:bg-black hover:text-white transition-all active:scale-95"><Play className="h-3 w-3 md:h-4 md:w-4" /> PLAY STORE</button>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-12 px-4 md:px-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1.5 bg-[#01a3a4]" />
              <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter">TOP SELLING PRODUCTS</h2>
            </div>
            <Link href="/shop" className="text-[8px] md:text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2">
              VIEW ALL <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 min-h-[400px]">
            {isProductsLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" />
                <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">Loading Products...</p>
              </div>
            ) : products?.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          <div className="mt-12 md:mt-16 flex justify-center px-4">
            <Link href="/shop" className="w-full md:w-auto">
              <button className="w-full bg-white/5 border border-white/10 hover:border-[#01a3a4] text-white px-12 h-14 md:h-16 font-black uppercase tracking-widest text-[10px] md:text-[12px] flex items-center justify-center gap-4 transition-all hover:bg-[#01a3a4] hover:text-black active:scale-95 shadow-2xl">
                MORE PRODUCT
              </button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
