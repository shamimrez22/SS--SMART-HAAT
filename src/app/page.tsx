
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

  if (item.price !== undefined) {
    return (
      <CarouselItem className="h-full">
        <div className="relative h-[420px] w-full bg-black overflow-hidden group">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="1200px"
            className="object-cover opacity-100"
            priority={priority}
            quality={80}
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12 space-y-4">
            <div className="space-y-1">
              <h2 className="text-4xl md:text-5xl font-headline font-black text-white leading-tight uppercase tracking-tighter max-w-[500px]">
                {item.name}
              </h2>
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-[12px] font-black uppercase tracking-[0.2em]">SPECIAL EDITION</span>
                <span className="text-white/40">|</span>
                <div className="flex items-baseline text-2xl font-black tracking-tighter text-[#01a3a4]">
                  <span className="text-[7px] font-normal mr-1 translate-y-[-12px] text-white/50">৳</span>
                  {item.price.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button asChild variant="outline" className="bg-black border-none text-white h-11 px-8 font-black rounded-none text-[10px] hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                <Link href={`/products/${item.id}`}>DETAILS</Link>
              </Button>
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
        <Image src={item.imageUrl} alt={item.title || "Banner"} fill sizes="1200px" className="object-cover opacity-100" priority={priority} quality={80} />
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
    <div className="h-[420px] bg-black overflow-hidden relative group w-full">
      {activeItem ? (
        <div className="h-full w-full relative flex flex-col items-center justify-center">
          <div className="absolute top-4 left-4 bg-[#01a3a4] px-4 py-1.5 text-[9px] font-black text-white uppercase tracking-widest z-10 shadow-lg">
            FLASH OFFER
          </div>
          
          <div className="relative w-full h-full">
            <Image src={activeItem.imageUrl} alt="Flash Offer" fill sizes="400px" className="object-cover" priority={true} quality={80} />
          </div>

          <div className="absolute bottom-0 w-full text-center px-4 py-6">
             <p className="text-white font-black text-[12px] uppercase tracking-[0.2em] mb-1 line-clamp-1 drop-shadow-md">{activeItem.name || activeItem.title}</p>
             <p className="text-[#01a3a4] text-[9px] font-black uppercase tracking-[0.4em] drop-shadow-md">SPECIAL COLLECTION</p>
          </div>

          {activeItem.price !== undefined && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6">
              <Button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] hover:bg-black text-white font-black text-[10px] uppercase h-12 px-8 rounded-none transition-all shadow-2xl">
                অর্ডার করুন
              </Button>
              <OrderModal product={activeItem} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
            </div>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="h-6 w-6 text-[#01a3a4] animate-spin" />
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(18)), [db]);
  const sliderProductQuery = useMemoFirebase(() => query(collection(db, 'products'), where('showInSlider', '==', true)), [db]);
  const sliderBannerQuery = useMemoFirebase(() => query(collection(db, 'featured_banners'), where('type', '==', 'SLIDER'), orderBy('createdAt', 'desc')), [db]);
  
  const { data: categories, isLoading: categoriesLoading } = useCollection(categoriesRef);
  const { data: products, isLoading: productsLoading } = useCollection(productsRef);
  const { data: sliderProducts } = useCollection(sliderProductQuery);
  const { data: sliderBanners } = useCollection(sliderBannerQuery);

  const combinedSliderItems = useMemo(() => {
    return [...(sliderBanners || []), ...(sliderProducts || [])];
  }, [sliderProducts, sliderBanners]);

  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-0 space-y-12">
        <section className="grid grid-cols-12 gap-0 h-[420px] max-h-[420px] overflow-hidden">
          <div className="col-span-3 h-[420px]"><FlashOfferCard /></div>
          <div className="col-span-6 relative overflow-hidden h-[420px] bg-black">
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
          <div className="col-span-3 flex flex-col h-[420px] bg-[#01a3a4] overflow-hidden">
            <div className="h-2/3 p-10 flex flex-col items-center justify-center space-y-10">
              <h3 className="text-white font-black text-3xl tracking-tighter uppercase font-headline">DOWNLOAD APP</h3>
              <div className="w-full space-y-5">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-black/10 flex items-center justify-center border border-white/20 shrink-0"><Truck className="h-7 w-7 text-white" /></div>
                  <div className="flex flex-col"><span className="text-white/80 font-black text-[10px] uppercase tracking-widest leading-none mb-1">FREE</span><span className="text-white font-black text-[18px] uppercase tracking-tighter">DELIVERY</span></div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-black/10 flex items-center justify-center border border-white/20 shrink-0"><Tag className="h-7 w-7 text-white" /></div>
                  <div className="flex flex-col"><span className="text-white/80 font-black text-[10px] uppercase tracking-widest leading-none mb-1">LIMITED</span><span className="text-white font-black text-[18px] uppercase tracking-tighter">TIME</span></div>
                </div>
              </div>
            </div>
            <div className="h-1/3 p-6 flex items-center gap-6 border-t border-white/10">
              <div className="bg-white p-2 w-24 h-24 shrink-0 flex items-center justify-center shadow-2xl">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black"><path fill="currentColor" d="M0 0h20v20H0V0zm4 4v12h12V4H4zm2 2h8v8H6V6zm60-6h20v20H66V0zm4 4v12h12V4H70zm2 2h8v8H72V6zM0 66h20v20H0V66zm4 4v12h12V70H4zm2 2h8v8H6V72zm22-60h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4z" /></svg>
              </div>
              <div className="flex flex-col gap-3 flex-grow">
                <button className="bg-white text-black h-10 px-4 flex items-center gap-4 hover:bg-black hover:text-white border-none w-full shadow-lg"><Apple className="h-5 w-5 fill-current" /><span className="text-[11px] font-black uppercase tracking-widest">APP STORE</span></button>
                <button className="bg-white text-black h-10 px-4 flex items-center gap-4 hover:bg-black hover:text-white border-none w-full shadow-lg"><Play className="h-5 w-5 fill-current" /><span className="text-[11px] font-black uppercase tracking-widest">GOOGLE PLAY</span></button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card/20 p-10 border-y border-white/5 mx-0">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-5">
              <div className="h-12 w-2.5 bg-[#01a3a4]" /><h2 className="text-4xl font-black flex items-center gap-4 uppercase tracking-tighter text-white"><Flame className="h-10 w-10 text-[#01a3a4] fill-current" /> TOP SELLING</h2>
            </div>
            <Link href="/shop" className="text-[11px] font-black text-[#01a3a4] hover:text-white transition-colors uppercase tracking-[0.4em]">VIEW ALL ARCHIVE</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {productsLoading ? (Array.from({length: 12}).map((_, i) => <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse" />)) : products?.map((product, index) => (<ProductCard key={product.id} product={product} index={index} />))}
          </div>
        </section>

        <section className="space-y-12 pb-24 px-10">
          <div className="flex items-center gap-5"><div className="h-10 w-2.5 bg-[#01a3a4]" /><h2 className="text-4xl font-black uppercase tracking-tighter text-white">SYSTEM CATEGORIES</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-8">
            {categoriesLoading ? (Array.from({length: 8}).map((_, i) => <div key={i} className="aspect-square bg-white/5 animate-pulse" />)) : categories?.map((cat) => (
              <Link href={`/shop?category=${cat.name}`} key={cat.id} className="group flex flex-col items-center space-y-4">
                <div className="relative w-full aspect-square overflow-hidden group-hover:ring-2 group-hover:ring-[#01a3a4] transition-all bg-black shadow-2xl">
                  {cat.imageUrl && (<Image src={cat.imageUrl} alt={cat.name} fill sizes="200px" quality={75} className="object-cover group-hover:scale-110 opacity-90" />)}
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50 text-center group-hover:text-[#01a3a4] transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
