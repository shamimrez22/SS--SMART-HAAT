
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, ShieldCheck, Loader2, Package } from 'lucide-react';
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
          <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
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
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-black text-white uppercase">PRODUCT NOT FOUND</h1>
            <Button className="rounded-none bg-orange-600 uppercase" onClick={() => router.push('/')}>RETURN TO SHOP</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-8 rounded-none uppercase text-white hover:bg-white/5" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> BACK TO COLLECTION
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="relative aspect-square rounded-none overflow-hidden bg-card border border-white/5 shadow-2xl">
              <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" priority className="object-cover" />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <p className="text-2xl font-black text-white border-2 border-white px-8 py-4 uppercase tracking-[0.5em]">SOLD OUT</p>
                </div>
              )}
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="rounded-none uppercase tracking-widest text-[10px] bg-orange-600/10 text-orange-600 border-none">{product.category}</Badge>
                  <Badge className={`rounded-none text-[9px] h-6 font-black uppercase ${isOutOfStock ? 'bg-red-600' : 'bg-green-600'}`}>
                    {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-black font-headline text-white leading-tight uppercase tracking-tighter">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-black text-orange-600 uppercase tracking-tighter">৳{product.price.toLocaleString()}</p>
                  {product.originalPrice > product.price && (
                    <p className="text-lg text-muted-foreground line-through font-bold">৳{product.originalPrice.toLocaleString()}</p>
                  )}
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Available Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <span key={size} className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-black text-white uppercase">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-muted-foreground uppercase leading-relaxed text-sm tracking-tight">{product.description}</div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  disabled={isOutOfStock}
                  onClick={() => setIsOrderOpen(true)}
                  size="lg" 
                  className={`flex-grow h-14 rounded-none text-sm font-black uppercase tracking-widest shadow-xl ${isOutOfStock ? 'bg-white/5 text-white/20' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/10'}`}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> {isOutOfStock ? 'CURRENTLY UNAVAILABLE' : 'ORDER NOW'}
                </Button>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="h-14 w-14 rounded-none border-white/10 text-white hover:bg-white/5"><Heart className="h-5 w-5" /></Button>
                  <Button size="icon" variant="outline" className="h-14 w-14 rounded-none border-white/10 text-white hover:bg-white/5"><Share2 className="h-5 w-5" /></Button>
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5"><Truck className="h-4 w-4 text-orange-600" /><span>FAST DELIVERY</span></div>
                  <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5"><Package className="h-4 w-4 text-orange-600" /><span>STOCK: {product.stockQuantity}</span></div>
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
