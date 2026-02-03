
"use client";

import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { products } from '@/lib/products';
import { Badge } from '@/components/ui/badge';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Product Not Found</h1>
            <Button onClick={() => router.push('/')}>Return to Shop</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-8" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collection
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card shadow-sm border">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-card cursor-pointer hover:border-primary transition-colors">
                    <Image
                      src={product.imageUrl}
                      alt={`${product.name} view ${i}`}
                      fill
                      className="object-cover opacity-60 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Info Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="uppercase tracking-widest">{product.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold font-headline">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex text-primary">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
                  </div>
                  <span className="text-sm text-muted-foreground">(24 Reviews)</span>
                </div>
                <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              </div>
              
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed">{product.description}</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider">Product Highlights</h4>
                <ul className="grid grid-cols-2 gap-y-2 text-sm">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="flex-grow h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary/90">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="h-14 w-14 rounded-full">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-14 w-14 rounded-full">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="pt-8 border-t">
                <div className="flex items-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Truck className="h-5 w-5" />
                    </div>
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span>2 Year Warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
