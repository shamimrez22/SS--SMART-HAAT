
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Truck, Tag, Flame, Loader2, Apple, Play } from 'lucide-react';
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
            quality={50}
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-headline font-black text-white uppercase tracking-tighter max-w-[500px] leading-tight">
              {item.name}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-baseline text-2xl font-black text-[#01a3a4] tracking-tighter">
                <span className="text-[7px] font-normal mr-1 translate-y-[-12px] text-white/50">৳</span>
                {item.price.toLocaleString()}
              </div>
              <button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white h-11 px-8 font-black rounded-none text-[10px] hover:bg-black transition-all uppercase tracking-widest flex items-center gap-2 shadow-xl">
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
        <Image src={item.imageUrl} alt={item.title || "Banner"} fill sizes="100vw" className="object-cover" priority={priority} quality={50} />
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-12">
           <h2 className="text-4xl font-black text-white uppercase tracking-tighter max-w-[500px] leading-none">{item.title}</h2>
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
          <Image src={activeItem.imageUrl} alt="Flash Offer" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" priority quality={50} />
          <div className="absolute top-4 left-4 bg-[#01a3a4] px-4 py-1.5 text-[9px] font-black text-white uppercase tracking-widest z-10">FLASH OFFER</div>
          <div className="absolute bottom-6 w-full text-center px-4">
             <p className="text-white font-black text-[12px] uppercase tracking-widest mb-1">{activeItem.name || activeItem.title}</p>
             <button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white px-6 py-2 font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">অর্ডার করুন</button>
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
  
  const { data: categories } = useCollection(categoriesRef);
  const { data: products } = useCollection(productsRef);
  const { data: sliderProducts } = useCollection(sliderProductQuery);
  const { data: sliderBanners } = useCollection(sliderBannerQuery);

  const combinedSliderItems = useMemo(() => [...(sliderBanners || []), ...(sliderProducts || [])], [sliderProducts, sliderBanners]);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto space-y-2">
        <section className="grid grid-cols-12 gap-0 h-[420px] overflow-hidden">
          <div className="col-span-3"><FlashOfferCard /></div>
          <div className="col-span-6 relative overflow-hidden h-[420px] bg-black">
            {combinedSliderItems.length > 0 ? (
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[plugin.current]}>
                <CarouselContent className="h-[420px]">
                  {combinedSliderItems.map((item, index) => <SlideItem key={index} item={item} priority={index < 1} />)}
                </CarouselContent>
              </Carousel>
            ) : <div className="h-full flex items-center justify-center"><Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" /></div>}
          </div>
          <div className="col-span-3 bg-[#01a3a4] flex flex-col items-center justify-center p-8 space-y-8 h-[420px]">
            <h3 className="text-white font-black text-4xl uppercase tracking-tighter leading-none italic">DOWNLOAD APP</h3>
            <div className="bg-white p-1.5 w-32 h-32 flex items-center justify-center border-4 border-white/20">
              <Image 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sssmarthaat.com" 
                alt="QR Code" 
                width={150} 
                height={150} 
                className="w-full h-full"
              />
            </div>
            <div className="space-y-3 w-full max-w-[220px]">
              <button className="bg-white text-black h-12 px-6 flex items-center gap-4 w-full font-black text-[11px] uppercase shadow-lg hover:bg-black hover:text-white transition-all"><Apple className="h-5 w-5" /> APP STORE</button>
              <button className="bg-white text-black h-12 px-6 flex items-center gap-4 w-full font-black text-[11px] uppercase shadow-lg hover:bg-black hover:text-white transition-all"><Play className="h-5 w-5" /> GOOGLE PLAY</button>
            </div>
          </div>
        </section>

        <section className="py-2 px-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-1 bg-[#01a3a4]" />
              <h2 className="text-lg font-black text-white uppercase tracking-tighter">TOP SELLING</h2>
            </div>
            <Link href="/shop" className="text-[9px] font-black text-[#01a3a4] uppercase tracking-widest">VIEW ALL</Link>
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
