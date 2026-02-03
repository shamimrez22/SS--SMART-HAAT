
import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { products } from '@/lib/products';
import { Star } from 'lucide-react';

export default function CategoriesPage() {
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-8 w-2 bg-orange-600" />
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">SHOP BY CATEGORY</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              href={`/shop?category=${category}`} 
              key={category}
              className="group relative h-48 border border-white/5 overflow-hidden flex items-center justify-center hover:border-orange-600/50 transition-all bg-card"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="relative z-10 text-center space-y-2">
                <Star className="h-6 w-6 text-orange-600 mx-auto opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <h2 className="text-xl font-black uppercase tracking-widest text-white">{category}</h2>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em]">EXPLORE COLLECTION</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
