
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-8 w-2 bg-orange-600" />
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">ALL PRODUCTS</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Duplicating for UI fullness in shop */}
          {products.map((product) => (
            <ProductCard key={`${product.id}-copy`} product={product} />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
