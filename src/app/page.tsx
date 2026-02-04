
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Apple, Play, Truck, Tag, Flame, Loader2, ShoppingCart, Smartphone } from 'lucide-react';
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
        <div className="relative h-full w-full bg-black">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="1200px"
            className="object-cover opacity-80"
            priority={priority}
            loading="eager"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-12 space-y-6">
            <div className="text-4xl md:text-6xl font-headline font-black text-white leading-tight uppercase tracking-tighter max-w-[600px]">
              {item.name}
            </div>
            <div className="flex items-baseline gap-4">
              <div className="text-white text-[12px] font-black tracking-[0.3em] uppercase leading-tight border-l-2 border-[#01a3a4] pl-4">
                PREMIUM<br/>COLLECTION
              </div>
              <div className="text-6xl font-black text-white tracking-tighter flex items-baseline">
                <span className="text-[0.45em] font-normal mr-1 translate-y-[-0.1em]">৳</span>
                {item.price.toLocaleString()}
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Button asChild variant="outline" className="border-white/20 text-white h-14 px-12 font-black rounded-none text-[12px] hover:bg-white/10 transition-all uppercase tracking-widest">
                <Link href={`/products/${item.id}`}>EXPLORE</Link>
              </Button>
              <Button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white h-14 px-12 font-black rounded-none text-[12px] hover:bg-[#01a3a4]/90 transition-all uppercase tracking-widest">
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
      
      <main className="flex-grow container mx-auto py-8 space-y-12">
        <section className="grid grid-cols-12 gap-4 h-[550px]">
          <div className="col-span-3 h-full">
            <FlashOfferCard />
          </div>

          <div className="col-span-6 relative rounded-none overflow-hidden h-full bg-card border border-white/5 shadow-2xl">
            {combinedSliderItems.length > 0 ? (
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[plugin.current]}>
                <CarouselContent className="h-[550px]">
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
          
          <div className="col-span-3 flex flex-col h-full gap-4">
            <div className="relative h-3/5 bg-[#01a3a4] p-8 rounded-none overflow-hidden shadow-2xl flex flex-col justify-between group">
              <div className="relative z-10">
                <h3 className="text-white font-black text-3xl tracking-tighter uppercase leading-[0.9]">PREMIUM<br/>EXPERIENCE</h3>
                <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em] mt-4">EXCLUSIVE MEMBER ACCESS</p>
              </div>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform">
                  <div className="w-14 h-14 bg-black/10 flex items-center justify-center border border-white/10"><Truck className="h-7 w-7 text-white" /></div>
                  <div className="flex flex-col"><span className="text-white/70 font-black text-[10px] uppercase tracking-widest leading-none mb-1">Expedited</span><span className="text-white font-black text-[16px] uppercase tracking-tighter leading-none">SHIPPING</span></div>
                </div>
                <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform">
                  <div className="w-14 h-14 bg-black/10 flex items-center justify-center border border-white/10"><Tag className="h-7 w-7 text-white" /></div>
                  <div className="flex flex-col"><span className="text-white/70 font-black text-[10px] uppercase tracking-widest leading-none mb-1">Global</span><span className="text-white font-black text-[16px] uppercase tracking-tighter leading-none">STANDARDS</span></div>
                </div>
              </div>
            </div>
            
            <div className="relative h-2/5 bg-black border border-white/10 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="h-4 w-4 text-[#01a3a4]" />
                <p className="text-[#01a3a4] text-[11px] font-black uppercase tracking-[0.3em]">DOWNLOAD APP</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 w-24 h-24 shrink-0 border border-white/5 flex items-center justify-center shadow-lg group hover:scale-105 transition-transform">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                    <path fill="currentColor" d="M0 0h20v20H0V0zm4 4v12h12V4H4zm2 2h8v8H6V6zm60-6h20v20H66V0zm4 4v12h12V4H70zm2 2h8v8H72V6zM0 66h20v20H0V66zm4 4v12h12V70H4zm2 2h8v8H6V72zm22-60h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-32 8h4v4h-4zm16 0h4v4h-4zm16 0h4v4h-4zm-32 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4z" />
                    <rect x="40" y="40" width="8" height="8" fill="currentColor" className="animate-pulse" />
                    <rect x="42" y="42" width="4" height="4" fill="#01a3a4" />
                  </svg>
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <button className="bg-white text-black h-10 px-4 flex items-center gap-3 hover:bg-[#01a3a4] hover:text-white transition-all group shadow-md border-none">
                    <Apple className="h-4 w-4 fill-current text-black group-hover:text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-black group-hover:text-white">APP STORE</span>
                  </button>
                  <button className="bg-white text-black h-10 px-4 flex items-center gap-3 hover:bg-[#01a3a4] hover:text-white transition-all group shadow-md border-none">
                    <Play className="h-4 w-4 fill-current text-black group-hover:text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-black group-hover:text-white">GOOGLE PLAY</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card/20 p-10 border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="h-10 w-2 bg-[#01a3a4]" />
              <h2 className="text-4xl font-black flex items-center gap-3 uppercase tracking-tighter text-white">
                <Flame className="h-10 w-10 text-[#01a3a4] fill-current" /> TOP SELLING PRODUCTS
              </h2>
            </div>
            <div className="h-px flex-grow mx-10 bg-white/5" />
            <Link href="/shop" className="text-[11px] font-black text-[#01a3a4] hover:text-white transition-colors uppercase tracking-[0.3em]">VIEW ARCHIVE</Link>
          </div>
          
          <div className="grid grid-cols-6 gap-6">
            {productsLoading ? (
               Array.from({length: 12}).map((_, i) => <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse border border-white/5" />)
            ) : products?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          
          <div className="flex justify-center mt-20">
            <Button asChild className="bg-[#01a3a4] hover:bg-white hover:text-black text-white font-black text-[14px] uppercase h-18 px-20 rounded-none shadow-2xl shadow-[#01a3a4]/20 transition-all duration-500">
              <Link href="/shop">LOAD ALL COLLECTIONS <ArrowRight className="ml-4 h-6 w-6" /></Link>
            </Button>
          </div>
        </section>

        <section className="space-y-12 pb-20">
          <div className="flex items-center gap-5">
            <div className="h-10 w-2 bg-[#01a3a4]" />
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">EXPLORE BY CLASSIFICATION</h2>
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
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 text-center group-hover:text-[#01a3a4] transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
