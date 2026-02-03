
import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://picsum.photos/seed/fashion1/1200/600"
              alt="Hero Fashion"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="max-w-2xl space-y-6 animate-in slide-in-from-left duration-700">
              <span className="inline-block px-4 py-1.5 bg-primary/90 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-full">
                New Summer Collection
              </span>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight font-headline">
                Elevate Your <br /> Everyday Style
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light max-w-lg">
                Discover a curated collection of modern essentials designed for those who appreciate the finer things in life.
              </p>
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                  Explore Gallery
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-card py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold">Free Shipping</h4>
                  <p className="text-sm text-muted-foreground">On all orders over $150</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold">Secure Payment</h4>
                  <p className="text-sm text-muted-foreground">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold">Premium Quality</h4>
                  <p className="text-sm text-muted-foreground">Curated premium brands</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section id="shop" className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Featured Collection</h2>
                <p className="text-muted-foreground">Handpicked favorites from our latest catalog.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="rounded-full">All Products</Button>
                <Button variant="outline" className="rounded-full">Accessories</Button>
                <Button variant="outline" className="rounded-full">Footwear</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Promo Section */}
        <section className="py-20 bg-primary/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://picsum.photos/seed/promo1/800/600"
                  alt="Promotional Image"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold font-headline leading-tight">Join Our Inner Circle & Save 15%</h2>
                  <p className="text-lg text-muted-foreground">
                    Get exclusive access to early product drops, member-only sales, and personal styling tips delivered to your inbox.
                  </p>
                </div>
                <div className="flex gap-4 max-w-md">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow rounded-full px-6 border-none bg-white focus:ring-2 focus:ring-primary h-12 outline-none"
                  />
                  <Button size="lg" className="rounded-full px-8">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
