
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
import { collection, query, where, limit } from 'firebase/firestore';
import { OrderModal } from '@/components/OrderModal';

const SlideItem = ({ product, priority }: { product: any, priority: boolean }) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  return (
    <CarouselItem className="h-full">
      <div className="relative h-full w-full bg-black">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="600px"
          className="object-cover opacity-80"
          priority={priority}
          loading="eager"
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-8 space-y-4">
          <div className="text-3xl font-headline font-black text-white leading-tight uppercase tracking-tighter max-w-[250px]">
            {product.name}
          </div>
          <div className="flex items-baseline gap-4">
            <div className="text-white text-[14px] font-black tracking-[0.2em] uppercase leading-tight">
              SPECIAL<br/>EDITION |
            </div>
            <div className="text-4xl font-black text-white tracking-tighter flex items-baseline">
              <span className="text-[0.45em] font-normal mr-1 translate-y-[-0.1em]">৳</span>
              {product.price.toLocaleString()}
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4 w-fit">
            <Button asChild variant="outline" className="border-white/20 text-white h-10 px-8 font-black rounded-none text-[11px] hover:bg-white/10 transition-all uppercase">
              <Link href={`/products/${product.id}`}>DETAILS</Link>
            </Button>
            <Button onClick={() => setIsOrderOpen(true)} className="bg-[#01a3a4] text-white h-10 px-8 font-black rounded-none text-[11px] hover:bg-[#01a3a4]/90 transition-all uppercase">
              <ShoppingCart className="mr-2 h-4 w-4" /> ORDER NOW
            </Button>
          </div>
        </div>
      </div>
      <OrderModal 
        product={product} 
        isOpen={isOrderOpen} 
        onClose={() => setIsOrderOpen(false)} 
      />
    </CarouselItem>
  );
};

const FlashOfferCard = () => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const db = useFirestore();
  
  const flashQuery = useMemoFirebase(() => query(
    collection(db, 'products'),
    where('showInFlashOffer', '==', true),
    limit(10)
  ), [db]);
  
  const { data: flashProducts } = useCollection(flashQuery);

  useEffect(() => {
    if (!flashProducts || flashProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [flashProducts]);
  
  const flashProduct = flashProducts?.[currentIndex];

  return (
    <div className="h-[350px] bg-black overflow-hidden relative group border border-white/5 w-full">
      {flashProduct ? (
        <div className="h-full w-full relative">
          <Image 
            src={flashProduct.imageUrl} 
            alt="Flash Offer" 
            fill 
            sizes="300px"
            className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
            key={flashProduct.id}
            priority={true}
            loading="eager"
            quality={75}
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute top-4 left-4 bg-[#01a3a4] px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest z-10 animate-pulse">
            FLASH OFFER
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 p-4 text-center">
            <div className="bg-black/60 backdrop-blur-md p-4 w-full border border-white/10">
              <h3 className="text-white font-black text-xs uppercase mb-2 tracking-tighter line-clamp-1">{flashProduct.name}</h3>
              <div className="text-[#01a3a4] font-black text-xl mb-3 flex items-baseline justify-center">
                <span className="text-[0.45em] font-normal mr-0.5 translate-y-[-0.1em]">৳</span>
                {flashProduct.price.toLocaleString()}
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => setIsOrderOpen(true)}
                  className="bg-[#01a3a4] hover:bg-[#01a3a4]/90 text-white font-black text-[9px] uppercase h-9 px-4 rounded-none w-full"
                >
                  ORDER NOW
                </Button>
                <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white hover:text-black font-black text-[9px] uppercase h-9 px-4 rounded-none w-full">
                  <Link href={`/products/${flashProduct.id}`}>DETAILS</Link>
                </Button>
              </div>
            </div>
          </div>
          <OrderModal product={flashProduct} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">No Flash Offers</p>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  
  // EXCLUSIVE LOGIC: Only show products that are NOT in slider and NOT in flash offer
  const productsRef = useMemoFirebase(() => query(
    collection(db, 'products'),
    where('showInSlider', '==', false),
    where('showInFlashOffer', '==', false),
    limit(18)
  ), [db]);

  const sliderQuery = useMemoFirebase(() => query(
    collection(db, 'products'),
    where('showInSlider', '==', true)
  ), [db]);
  
  const { data: categories, isLoading: categoriesLoading } = useCollection(categoriesRef);
  const { data: products, isLoading: productsLoading } = useCollection(productsRef);
  const { data: sliderProducts } = useCollection(sliderQuery);

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 space-y-12">
        {/* HERO SECTION: FORCED STATIC 1200PX DESKTOP GRID */}
        <section className="grid grid-cols-12 gap-4 h-[350px]">
          <div className="col-span-3 h-full">
            <FlashOfferCard />
          </div>

          <div className="col-span-6 relative rounded-none overflow-hidden h-full bg-card border border-white/5">
            {sliderProducts && sliderProducts.length > 0 ? (
              <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[plugin.current]}>
                <CarouselContent className="h-[350px]">
                  {sliderProducts.map((p, index) => (
                    <SlideItem key={p.id} product={p} priority={index < 3} />
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Slider Products Not Set</p>
              </div>
            )}
          </div>
          
          <div className="col-span-3 flex flex-col h-full gap-4">
            <div className="relative flex-grow bg-gradient-to-br from-[#01a3a4] to-[#00d2d3] p-6 rounded-none overflow-hidden shadow-2xl flex flex-col justify-between">
              <div className="text-center">
                <h3 className="text-white font-black text-lg tracking-tight uppercase leading-none">Download App</h3>
                <p className="text-white/70 text-[8px] font-black uppercase tracking-[0.3em] mt-2">Get Extra Discount</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black/20 flex items-center justify-center border border-white/10"><Truck className="h-5 w-5 text-white" /></div>
                  <div className="flex flex-col"><span className="text-white font-black text-[9px] uppercase opacity-80">Fast</span><span className="text-white font-black text-[12px] uppercase">Delivery</span></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black/20 flex items-center justify-center border border-white/10"><Tag className="h-5 w-5 text-white" /></div>
                  <div className="flex flex-col"><span className="text-white font-black text-[9px] uppercase opacity-80">Premium</span><span className="text-white font-black text-[12px] uppercase">Service</span></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card border border-white/5 p-3">
              <div className="bg-white p-1 w-16 h-16 shrink-0 border border-white/5 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                  <path fill="currentColor" d="M0 0h18v18H0V0zm2 2v14h14V2H2zm2 2h10v10H4V4zm78-4h18v18H82V0zm2 2v14h14V2H84zm2 2h10v10H86V4zM0 82h18v18H0V82zm2 2v14h14V84H2zm2 2h10v10H4V86zm20-80h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm-44 4h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-40 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm-36 4h2v2h-2zm4 0h2v2h-2zm12 0h2v2h-2zm8 0h2v2h-2zm4 0h2v2h-2zm8 0h2v2h-2z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1.5 flex-grow">
                <div className="bg-white h-7 px-3 flex items-center gap-2"><Apple className="h-3 w-3 text-black" /><span className="text-[8px] text-black font-black uppercase">App Store</span></div>
                <div className="bg-white h-7 px-3 flex items-center gap-2"><Play className="h-3 w-3 text-black fill-black" /><span className="text-[8px] text-black font-black uppercase">Google Play</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card/30 p-8 border border-white/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter text-white">
              <Flame className="h-6 w-6 text-[#01a3a4] fill-current" /> TOP SELLING PRODUCTS
            </h2>
            <div className="h-0.5 flex-grow mx-8 bg-white/5" />
          </div>
          <div className="grid grid-cols-6 gap-6">
            {productsLoading ? (
               Array.from({length: 12}).map((_, i) => <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse" />)
            ) : products?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="flex justify-center mt-16">
            <Button asChild className="bg-[#01a3a4] hover:bg-[#01a3a4]/90 text-white font-black text-[13px] uppercase h-14 px-12 rounded-none shadow-2xl shadow-[#01a3a4]/20">
              <Link href="/shop">LOAD MORE PRODUCTS <ArrowRight className="ml-3 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        <section className="space-y-8 pb-12">
          <div className="flex items-center gap-4">
            <div className="h-8 w-2 bg-[#01a3a4]" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">EXPLORE BY CATEGORY</h2>
          </div>
          <div className="grid grid-cols-8 gap-6">
            {categoriesLoading ? (
              Array.from({length: 8}).map((_, i) => <div key={i} className="aspect-square bg-white/5 animate-pulse" />)
            ) : categories?.map((cat) => (
              <Link href={`/shop?category=${cat.name}`} key={cat.id} className="group flex flex-col items-center space-y-3">
                <div className="relative w-full aspect-square overflow-hidden border border-white/5 group-hover:border-[#01a3a4] transition-all bg-black">
                  {cat.imageUrl && (
                    <Image 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      fill 
                      sizes="150px" 
                      quality={60} 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white text-center group-hover:text-[#01a3a4] transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
