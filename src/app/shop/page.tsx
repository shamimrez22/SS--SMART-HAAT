
"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Loader2, Plus, SearchX, Filter } from 'lucide-react';

function ShopContent() {
  const db = useFirestore();
  const searchParams = useSearchParams();
  const [fetchLimit, setFetchLimit] = useState(24);
  
  const search = searchParams.get('search')?.toUpperCase() || '';
  const categoryParam = searchParams.get('category')?.toUpperCase() || '';

  const productsRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(fetchLimit));
  }, [db, fetchLimit]);
  
  const { data: rawProducts, isLoading } = useCollection(productsRef);

  const filteredProducts = useMemo(() => {
    if (!rawProducts) return [];
    return rawProducts.filter(p => {
      const matchSearch = !search || p.name.toUpperCase().includes(search) || p.description?.toUpperCase().includes(search);
      const matchCategory = !categoryParam || p.category === categoryParam;
      return matchSearch && matchCategory;
    });
  }, [rawProducts, search, categoryParam]);

  const handleLoadMore = () => {
    setFetchLimit(prev => prev + 24);
  };

  return (
    <main className="flex-grow container mx-auto px-4 md:px-10 pt-4 md:pt-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-8 w-2 bg-[#01a3a4]" />
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
            {categoryParam ? `${categoryParam} COLLECTION` : 'PREMIUM ARCHIVE'}
          </h1>
        </div>
        
        {(search || categoryParam) && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-none">
            <Filter className="h-3 w-3 text-[#01a3a4]" />
            <p className="text-[10px] font-black text-white uppercase tracking-widest">
              {search ? `SEARCH: "${search}"` : ''} {search && categoryParam ? '|' : ''} {categoryParam ? `CATEGORY: ${categoryParam}` : ''}
            </p>
            <button 
              onClick={() => window.location.href = '/shop'}
              className="ml-2 text-[10px] font-black text-[#01a3a4] hover:text-white transition-colors"
            >
              [CLEAR]
            </button>
          </div>
        )}
      </div>

      {isLoading && !rawProducts ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01a3a4]">Syncing Archive...</p>
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
              {filteredProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-40 border border-dashed border-white/5 bg-white/[0.01] space-y-6">
              <SearchX className="h-16 w-16 text-white/5 mx-auto" />
              <div className="space-y-2">
                <p className="text-[12px] font-black text-white/40 uppercase tracking-[0.5em]">No items discovered matching your query.</p>
                <p className="text-[9px] font-bold text-[#01a3a4] uppercase tracking-widest">Try adjusting your keywords or category filters.</p>
              </div>
              <button 
                onClick={() => window.location.href = '/shop'}
                className="bg-white/5 border border-white/10 text-white px-8 h-12 text-[10px] font-black uppercase tracking-widest hover:bg-[#01a3a4] hover:text-black transition-all"
              >
                BACK TO ALL PRODUCTS
              </button>
            </div>
          )}

          {!isLoading && rawProducts && rawProducts.length >= fetchLimit && (
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="h-px w-full bg-white/5" />
              <button 
                onClick={handleLoadMore}
                disabled={isLoading}
                className="bg-[#01a3a4] hover:bg-white hover:text-black text-white px-16 h-16 font-black uppercase tracking-[0.4em] text-[11px] flex items-center gap-3 transition-all shadow-2xl shadow-[#01a3a4]/10 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} 
                LOAD MORE ARCHIVE
              </button>
            </div>
          )}
        </>
      )}

      <CategoriesGrid />
    </main>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <MainHeader />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
        </div>
      }>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}
