
"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImageIcon } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Image from 'next/image';

/**
 * CategoriesPage - Fetches and displays categories directly from Firestore.
 * Updated to ensure images fill the container perfectly.
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
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">SHOP BY CATEGORY</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 bg-white/[0.02]">
            <ImageIcon className="h-10 w-10 text-white/10 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No categories found. Add some from Admin Panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                href={`/shop?category=${category.name}`} 
                key={category.id}
                className="group relative h-80 border border-white/10 overflow-hidden hover:border-orange-600/50 transition-all bg-card"
              >
                {category.imageUrl && (
                  <Image 
                    src={category.imageUrl} 
                    alt={category.name} 
                    fill 
                    className="object-cover transition-all duration-700 scale-100 group-hover:scale-110"
                  />
                )}
                {/* Clean gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity group-hover:opacity-70" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center space-y-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-white drop-shadow-2xl">{category.name}</h2>
                  <div className="h-1 w-0 bg-orange-600 mx-auto group-hover:w-20 transition-all duration-500" />
                  <p className="text-[10px] font-black text-white/90 uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all duration-500">EXPLORE COLLECTION</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
