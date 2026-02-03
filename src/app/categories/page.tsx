
"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImageIcon, LayoutGrid } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Image from 'next/image';

/**
 * CategoriesPage - Daraz-style categorized grid.
 */
export default function CategoriesPage() {
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories, isLoading } = useCollection(categoriesRef);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-8 w-2 bg-orange-600" />
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
            <LayoutGrid className="h-8 w-8 text-orange-600" /> ALL CATEGORIES
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-white/5 animate-pulse border border-white/5" />
                <div className="h-2 w-3/4 bg-white/5 animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 bg-white/[0.02]">
            <ImageIcon className="h-10 w-10 text-white/10 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No categories discovered in inventory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-10">
            {categories.map((category) => (
              <Link 
                href={`/shop?category=${category.name}`} 
                key={category.id}
                className="group flex flex-col items-center space-y-3"
              >
                <div className="relative w-full aspect-square border border-white/10 overflow-hidden hover:border-orange-600/50 transition-all bg-card">
                  {category.imageUrl && (
                    <Image 
                      src={category.imageUrl} 
                      alt={category.name} 
                      fill 
                      className="object-cover transition-all duration-700 scale-100 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                
                <h2 className="text-[11px] font-black uppercase tracking-widest text-white text-center group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h2>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
