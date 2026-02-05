
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Loader2, Plus } from 'lucide-react';

export default function ShopPage() {
  const db = useFirestore();
  const [fetchLimit, setFetchLimit] = useState(18); // Load optimized batch size
  
  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(fetchLimit)), [db, fetchLimit]);
  const { data: products, isLoading } = useCollection(productsRef);

  const handleLoadMore = () => {
    setFetchLimit(prev => prev + 18);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      <main className="flex-grow container mx-auto px-10 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-8 w-2 bg-[#01a3a4]" />
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">PREMIUM COLLECTION ARCHIVE</h1>
        </div>

        {isLoading && !products ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01a3a4]">Syncing Archive...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {products?.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>

            {products && products.length >= fetchLimit && (
              <div className="mt-20 flex flex-col items-center gap-6">
                <div className="h-px w-full bg-white/5" />
                <button 
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="bg-[#01a3a4] hover:bg-white hover:text-black text-white px-16 h-16 font-black uppercase tracking-[0.4em] text-[11px] flex items-center gap-3 transition-all shadow-2xl shadow-[#01a3a4]/10 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} 
                  MORE PRODUCT
                </button>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Viewing {products.length} of our total archive</p>
              </div>
            )}

            {products && products.length === 0 && (
              <div className="text-center py-40 border border-dashed border-white/5 bg-white/[0.01]">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">No products registered in this archive yet.</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
