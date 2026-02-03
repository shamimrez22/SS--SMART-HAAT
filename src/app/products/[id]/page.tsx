
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, ShieldCheck, Loader2, Package, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { OrderModal } from '@/components/OrderModal';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  
  const productRef = useMemoFirebase(() => doc(db, 'products', id as string), [db, id]);
  const { data: product, isLoading } = useDoc(productRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
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
        <Navbar />
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

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-12 rounded-none uppercase text-white hover:bg-white/5 border border-white/10 h-12 px-6 font-black text-[10px] tracking-widest" onClick={() => router.back()}>
            <ArrowLeft className="mr-3 h-4 w-4 text-[#01a3a4]" /> BACK TO ARCHIVE
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="relative aspect-square rounded-none overflow-hidden bg-black border border-white/5 shadow-2xl group">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw" 
                priority 
                className="object-contain p-4 transition-transform duration-[2000ms] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
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
                </div>
                <h1 className="text-5xl md:text-7xl font-black font-headline text-white leading-none uppercase tracking-tighter">{product.name}</h1>
                <div className="flex items-center gap-6">
                  <div className="text-4xl font-black text-[#01a3a4] uppercase tracking-tighter flex items-baseline">
                    <span className="text-sm font-normal mr-1">৳</span>
                    {product.price.toLocaleString()}
                  </div>
                  {product.originalPrice > product.price && (
                    <p className="text-2xl text-white/60 line-through font-bold flex items-baseline">
                      <span className="text-[10px] font-normal mr-0.5">৳</span>{product.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {product.sizeInventory && product.sizeInventory.length > 0 && (
                <div className="space-y-4 p-6 bg-white/[0.02] border border-white/5">
                  <p className="text-[11px] font-black text-[#01a3a4] uppercase tracking-[0.3em] flex items-center gap-3">
                    <Ruler className="h-4 w-4" /> AVAILABLE SPECIFICATIONS
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.sizeInventory.map((si: any, i: number) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="px-5 py-3 bg-white/5 border border-white/10 text-xs font-black text-white uppercase min-w-[60px] text-center">
                          {si.size}
                        </span>
                        <span className="text-[8px] font-black text-[#01a3a4] uppercase mt-2">{si.quantity} PCS</span>
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
                    {isOutOfStock ? 'OUT OF STOCK - ARCHIVE ACCESS ONLY' : `IN STOCK - ${product.stockQuantity} UNITS REGISTERED`}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    disabled={isOutOfStock}
                    onClick={() => setIsOrderOpen(true)}
                    size="lg" 
                    className={`flex-grow h-16 rounded-none text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all duration-500 ${isOutOfStock ? 'bg-white/5 text-white/20 border border-white/10' : 'bg-[#01a3a4] hover:bg-white hover:text-black text-white shadow-[#01a3a4]/20'}`}
                  >
                    <ShoppingCart className="mr-3 h-5 w-5" /> {isOutOfStock ? 'SOLD OUT' : 'CONFIRM ORDER'}
                  </Button>
                  <div className="flex gap-3">
                    <Button size="icon" variant="outline" className="h-16 w-16 rounded-none border-white/10 text-white hover:bg-[#01a3a4] hover:border-[#01a3a4] transition-all duration-500"><Heart className="h-6 w-6" /></Button>
                    <Button size="icon" variant="outline" className="h-16 w-16 rounded-none border-white/10 text-white hover:bg-[#01a3a4] hover:border-[#01a3a4] transition-all duration-500"><Share2 className="h-6 w-6" /></Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-10 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-white/60">
                  <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 group hover:border-[#01a3a4]/30 transition-all">
                    <Truck className="h-5 w-5 text-[#01a3a4]" />
                    <span className="group-hover:text-white transition-colors">ELITE DELIVERY SERVICE</span>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 group hover:border-[#01a3a4]/30 transition-all">
                    <ShieldCheck className="h-5 w-5 text-[#01a3a4]" />
                    <span className="group-hover:text-white transition-colors">AUTHENTICITY GUARANTEED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
