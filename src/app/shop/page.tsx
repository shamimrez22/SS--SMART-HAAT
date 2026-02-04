
"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function ShopPage() {
  const db = useFirestore();
  
  // LOGIC: Show ALL products in shop page regardless of featured status
  const productsRef = useMemoFirebase(() => query(
    collection(db, 'products'),
    orderBy('createdAt', 'desc')
  ), [db]);
  
  const { data: products, isLoading } = useCollection(productsRef);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-8 w-2 bg-orange-600" />
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">ALL PRODUCTS</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {!isLoading && products?.length === 0 && (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10 bg-white/[0.01]">
                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">No products available in archive.</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
