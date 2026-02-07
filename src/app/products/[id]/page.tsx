"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Heart, Share2, Loader2, Package, Ruler, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, limit } from 'firebase/firestore';
import { OrderModal } from '@/components/OrderModal';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  
  const productRef = useMemoFirebase(() => doc(db, 'products', id as string), [db, id]);
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
  
  const { data: product, isLoading } = useDoc(productRef);
  const { data: settings } = useDoc(settingsRef);

  // Fetch more products for the bottom section
  const moreProductsRef = useMemoFirebase(() => {
    return query(collection(db, 'products'), limit(16));
  }, [db]);
  const { data: moreProducts } = useCollection(moreProductsRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <MainHeader />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">ACCESSING ARCHIVE...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <MainHeader />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md p-8 border border-white/5 bg-white/[0.02]">
            <Package className="h-16 w-16 text-[#01a3a4]/30 mx-auto" />
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">PRODUCT NOT DISCOVERED</h1>
            <p className="text-[10px] text-white/60 uppercase tracking-widest leading-relaxed">
              THE ITEM YOU ARE SEARCHING FOR IS NOT REGISTERED IN OUR CURRENT ARCHIVE.
            </p>
            <Button className="rounded-none bg-[#01a3a4] uppercase w-full h-14 font-black" onClick={() => router.push('/')}>RETURN TO SHOP</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = (product.stockQuantity || 0) <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <MainHeader />
      <main className="flex-grow py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-12 rounded-none uppercase text-white hover:bg-white/5 border border-white/10 h-10 px-6 font-black text-[10px] tracking-widest" onClick={() => router.back()}>
            <ArrowLeft className="mr-3 h-4 w-4 text-[#01a3a4]" /> BACK TO ARCHIVE
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
            <div className="relative aspect-square rounded-none overflow-hidden border border-white/5 shadow-2xl group bg-black">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw" 
                priority={true}
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-10">
                  <p className="text-3xl font-black text-white border-4 border-white px-10 py-5 uppercase tracking-[0.5em] animate-pulse">ARCHIVE ONLY</p>
                </div>
              )}
            </div>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge className="rounded-none uppercase tracking-[0.3em] text-[10px] bg-[#01a3a4] text-white font-black border-none px-4 py-1.5">{product.category}</Badge>
                  
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 border border-white/10">
                    <MapPin className="h-3 w-3 text-[#01a3a4]" />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">SHIPPED FROM: {settings?.liveLocation || 'BANANI, DHAKA'}</span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black font-headline text-white leading-none uppercase tracking-tighter">{product.name}</h1>
                
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-6">
                    <div className="text-4xl md:text-5xl font-black text-[#01a3a4] uppercase tracking-tighter flex items-baseline">
                      <span className="text-[14px] font-normal mr-2 translate-y-[-12px] text-white/50">৳</span>
                      {product.price.toLocaleString()}
                    </div>
                  </div>
                  {product.originalPrice > product.price && (
                    <p className="text-[18px] md:text-[22px] text-white/40 line-through font-bold flex items-baseline">
                      <span className="text-[0.4em] font-normal mr-1 translate-y-[-1px]">৳</span>{product.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4 p-6 bg-white/[0.02] border border-white/5">
                  <p className="text-[11px] font-black text-[#01a3a4] uppercase tracking-[0.3em] flex items-center gap-3">
                    <Ruler className="h-4 w-4" /> AVAILABLE SPECIFICATIONS
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size: string, i: number) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="px-5 py-3 bg-white/5 border border-white/10 text-xs font-black text-white uppercase min-w-[60px] text-center">
                          {size}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-white/70 uppercase leading-relaxed text-sm tracking-wide border-l-2 border-[#01a3a4] pl-6 italic bg-[#01a3a4]/5 p-6 font-medium">
                {product.description}
              </div>
              
              <div className="space-y-8 pt-4">
                <div className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-none animate-pulse ${isOutOfStock ? 'bg-red-600' : 'bg-green-600'}`} />
                  <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                    {isOutOfStock ? 'OUT OF STOCK' : `IN STOCK - READY TO SHIP`}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    disabled={isOutOfStock}
                    onClick={() => setIsOrderOpen(true)}
                    className={`flex-grow h-14 rounded-none text-[14px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 ${isOutOfStock ? 'bg-white/5 text-white/20 border border-white/10' : 'bg-[#01a3a4] hover:bg-white hover:text-black text-white shadow-[#01a3a4]/20'}`}
                  >
                    <ShoppingCart className="h-5 w-5" /> {isOutOfStock ? 'SOLD OUT' : 'অর্ডার করুন'}
                  </button>
                  <div className="flex gap-3">
                    <Button size="icon" variant="outline" className="h-14 w-14 rounded-none border-white/10 text-white hover:bg-[#01a3a4] hover:border-[#01a3a4] transition-all duration-500"><Heart className="h-5 w-5" /></Button>
                    <Button size="icon" variant="outline" className="h-14 w-14 rounded-none border-white/10 text-white hover:bg-[#01a3a4] hover:border-[#01a3a4] transition-all duration-500"><Share2 className="h-5 w-5" /></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MORE PRODUCTS SECTION */}
          <section className="pt-20 border-t border-white/5">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1.5 bg-[#01a3a4]" />
                <h2 className="text-3xl font-black uppercase text-white tracking-tighter">MORE PRODUCTS</h2>
              </div>
              <Button onClick={() => router.push('/shop')} variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01a3a4] hover:bg-[#01a3a4]/10">
                EXPLORE ALL ARCHIVE
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {moreProducts?.filter(p => p.id !== id).slice(0, 16).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <OrderModal 
        product={product} 
        isOpen={isOrderOpen} 
        onClose={() => setIsOrderOpen(false)} 
      />
      
      <Footer />
    </div>
  );
}