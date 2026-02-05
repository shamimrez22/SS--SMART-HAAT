
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Truck, Tag, Flame, Loader2, Apple, Play, MapPin, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, limit, orderBy, doc, increment, setDoc } from 'firebase/firestore';
import { OrderModal } from '@/components/OrderModal';

const SlideItem = ({ item, priority }: { item: any, priority: boolean }) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  if (item.price !== undefined) {
    return (
      <CarouselItem className="h-full">
        <div className="relative h-[420px] w-full bg-black overflow-hidden group">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority={priority}
            quality={40}
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12 space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-black text-white uppercase tracking-tight max-w-[400px] leading-tight">
              {item.name}
            </h2>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-4">
                <div className="flex items-baseline text-[22px] font-black text-[#01a3a4] tracking-tighter">
                  <span className="text-[11px] font-normal mr-1 translate-y-[-4px] text-white/50">৳</span>
                  {item.price.toLocaleString()}
                </div>
              </div>
              {item.originalPrice > item.price && (
                <span className="text-[10px] text-white/40 line-through font-bold translate-y-[-4px]">
                  ৳{item.originalPrice.toLocaleString()}
                </span>
              )}
              <button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white h-10 px-8 font-black rounded-none text-[10px] hover:bg-black transition-all uppercase tracking-widest flex items-center gap-2 shadow-xl w-fit mt-2">
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
      <div className="relative h-[420px] w-full bg-black">
        <Image src={item.imageUrl} alt={item.title || "Banner"} fill sizes="100vw" className="object-cover" priority={priority} quality={40} />
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-12">
           <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight max-w-[400px] leading-none">{item.title}</h2>
        </div>
      </div>
    </CarouselItem>
  );
};

const FlashOfferCard = () => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const db = useFirestore();
  
  const flashProductQuery = useMemoFirebase(() => query(collection(db, 'products'), where('showInFlashOffer', '==', true), limit(3)), [db]);
  const flashBannerQuery = useMemoFirebase(() => query(collection(db, 'featured_banners'), where('type', '==', 'FLASH'), limit(3)), [db]);
  
  const { data: flashProducts } = useCollection(flashProductQuery);
  const { data: flashBanners } = useCollection(flashBannerQuery);

  const combinedItems = useMemo(() => [...(flashBanners || []), ...(flashProducts || [])], [flashProducts, flashBanners]);

  useEffect(() => {
    if (combinedItems.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % combinedItems.length), 6000);
    return () => clearInterval(interval);
  }, [combinedItems]);
  
  const activeItem = combinedItems[currentIndex];

  return (
    <div className="h-[420px] bg-black overflow-hidden relative group w-full">
      {activeItem ? (
        <div className="h-full w-full relative">
          <Image src={activeItem.imageUrl} alt="Flash Offer" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" priority quality={40} />
          <div className="absolute top-4 left-4 bg-[#01a3a4] px-4 py-1.5 text-[9px] font-black text-white uppercase tracking-widest z-10">FLASH OFFER</div>
          <div className="absolute bottom-6 w-full text-center px-4 space-y-2">
             <p className="text-white font-black text-[12px] uppercase tracking-widest mb-1">{activeItem.name || activeItem.title}</p>
             {activeItem.price && (
               <div className="flex flex-col items-center">
                 <span className="text-[#01a3a4] font-black text-lg">৳{activeItem.price.toLocaleString()}</span>
                 {activeItem.originalPrice > activeItem.price && (
                   <span className="text-white/40 line-through text-[10px] font-bold">৳{activeItem.originalPrice.toLocaleString()}</span>
                 )}
               </div>
             )}
             <button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white px-6 py-2 h-10 font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all mt-2">অর্ডার করুন</button>
             <OrderModal product={activeItem} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
          </div>
        </div>
      ) : <div className="h-full flex items-center justify-center bg-black"><Loader2 className="h-6 w-6 text-[#01a3a4] animate-spin" /></div>}
    </div>
  );
};

export default function Home() {
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => query(collection(db, 'categories'), limit(8)), [db]);
  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(12)), [db]);
  const sliderProductQuery = useMemoFirebase(() => query(collection(db, 'products'), where('showInSlider', '==', true), limit(3)), [db]);
  const sliderBannerQuery = useMemoFirebase(() => query(collection(db, 'featured_banners'), where('type', '==', 'SLIDER'), orderBy('createdAt', 'desc'), limit(3)), [db]);
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
  
  const { data: categories } = useCollection(categoriesRef);
  const { data: products } = useCollection(productsRef);
  const { data: sliderProducts } = useCollection(sliderProductQuery);
  const { data: sliderBanners } = useCollection(sliderBannerQuery);
  const { data: settings } = useDoc(settingsRef);

  const combinedSliderItems = useMemo(() => [...(sliderBanners || []), ...(sliderProducts || [])], [sliderProducts, sliderBanners]);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const qrCodeUrl = useMemo(() => {
    const link = settings?.qrCodeLink || 'https://sssmarthaat.com';
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link)}`;
  }, [settings?.qrCodeLink]);

  // Visitor Tracking
  useEffect(() => {
    const trackVisit = async () => {
      const today = new Date().toISOString().split('T')[0];
      const statsRef = doc(db, 'visitorStats', today);
      await setDoc(statsRef, { 
        count: increment(1),
        date: today
      }, { merge: true });
    };
    trackVisit();
  }, [db]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* LIVE LOCATION & STATUS BANNER */}
      {settings?.liveStatus && (
        <div className="bg-black/80 backdrop-blur-md border-b border-white/5 py-2 px-4 overflow-hidden whitespace-nowrap">
          <div className="container mx-auto flex items-center gap-6 animate-marquee">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">
              <Radio className="h-3 w-3 animate-pulse" /> LIVE STATUS:
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
              {settings.liveStatus} <span className="text-white/20">•</span> 
              <MapPin className="h-3 w-3 text-[#01a3a4]" /> {settings.liveLocation || 'BANANI, DHAKA'}
            </p>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto space-y-2">
        <section className="grid grid-cols-12 gap-0 h-[420px] overflow-hidden">
          <div className="col-span-3"><FlashOfferCard /></div>
          <div className="col-span-6 relative overflow-hidden h-[420px] bg-black">
            {combinedSliderItems.length > 0 ? (
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[plugin.current]}>
                <CarouselContent className="h-[420px]">
                  {combinedSliderItems.map((item, index) => <SlideItem key={index} item={item} priority={index < 2} />)}
                </CarouselContent>
              </Carousel>
            ) : <div className="h-full flex items-center justify-center"><Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" /></div>}
          </div>
          <div className="col-span-3 bg-[#01a3a4] flex flex-col items-center justify-center p-8 space-y-6 h-[420px]">
            <h3 className="text-white font-black text-xl uppercase tracking-widest leading-none italic text-center">DOWNLOAD APP</h3>
            <div className="bg-white p-2 w-36 h-36 flex items-center justify-center border-4 border-white/20">
              <Image 
                src={qrCodeUrl} 
                alt="QR Code" 
                width={150} 
                height={150} 
                className="w-full h-full"
              />
            </div>
            <div className="space-y-3 w-full max-w-[200px]">
              <button className="bg-white text-black h-10 px-6 flex items-center gap-4 w-full font-black text-[10px] uppercase shadow-lg hover:bg-black hover:text-white transition-all"><Apple className="h-4 w-4" /> APP STORE</button>
              <button className="bg-white text-black h-10 px-6 flex items-center gap-4 w-full font-black text-[10px] uppercase shadow-lg hover:bg-black hover:text-white transition-all"><Play className="h-4 w-4" /> GOOGLE PLAY</button>
            </div>
          </div>
        </section>

        <section className="py-2 px-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-[#01a3a4]" />
              <h2 className="text-sm font-black text-white uppercase tracking-tighter">TOP SELLING</h2>
            </div>
            <Link href="/shop" className="text-[8px] font-black text-[#01a3a4] uppercase tracking-widest">VIEW ALL</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products?.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
