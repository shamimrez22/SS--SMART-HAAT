
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { LayoutGrid, Loader2 } from 'lucide-react';

export function CategoriesGrid() {
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories, isLoading } = useCollection(categoriesRef);

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className="h-8 w-8 text-[#01a3a4] animate-spin" />
      </div>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12 md:py-20 px-4 md:px-10 border-t border-white/5">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-6 w-1.5 bg-[#01a3a4]" />
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <LayoutGrid className="h-6 w-6 text-[#01a3a4]" /> SHOP BY CATEGORIES
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/shop?category=${category.name}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative w-full aspect-square bg-black border border-white/10 overflow-hidden group-hover:border-[#01a3a4]/50 transition-all duration-500">
              <Image 
                src={category.imageUrl} 
                alt={category.name} 
                fill 
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                sizes="(max-width: 768px) 50vw, 15vw"
              />
            </div>
            <h3 className="text-[10px] md:text-[11px] font-black text-white/70 group-hover:text-[#01a3a4] uppercase tracking-widest transition-colors">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
