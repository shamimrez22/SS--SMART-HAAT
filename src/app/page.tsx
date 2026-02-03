import React from 'react';
import Image from 'next/image';
import { ArrowRight, Zap, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 space-y-12">
        {/* Banner Carousel */}
        <section className="relative rounded-xl overflow-hidden shadow-lg h-[400px]">
          <Carousel className="w-full h-full">
            <CarouselContent>
              <CarouselItem>
                <div className="relative h-[400px] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600"
                    alt="Marketplace Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-12 space-y-4">
                    <span className="text-primary font-bold uppercase tracking-widest text-sm">Mega Sale Event</span>
                    <h2 className="text-5xl font-headline font-bold text-white max-w-xl">Upgrade Your Lifestyle With Smart Choices</h2>
                    <Button className="w-fit bg-primary text-background h-12 px-8 font-bold">Shop Now</Button>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative h-[400px] w-full bg-secondary flex items-center justify-center">
                   <h2 className="text-4xl font-headline">New Arrivals Weekly</h2>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>

        {/* Feature Icons */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <p className="font-bold text-sm">100% Authentic</p>
              <p className="text-xs text-muted-foreground">Guarantee products</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
            <Truck className="h-8 w-8 text-primary" />
            <div>
              <p className="font-bold text-sm">Fast Delivery</p>
              <p className="text-xs text-muted-foreground">Dhaka & beyond</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
            <RotateCcw className="h-8 w-8 text-primary" />
            <div>
              <p className="font-bold text-sm">Easy Return</p>
              <p className="text-xs text-muted-foreground">7 days policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
            <Star className="h-8 w-8 text-primary" />
            <div>
              <p className="font-bold text-sm">Best Prices</p>
              <p className="text-xs text-muted-foreground">Value for money</p>
            </div>
          </div>
        </section>

        {/* Flash Sale Section */}
        <section id="flash-sale" className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary fill-current" /> Flash Sale
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Ending in:</span>
                <div className="flex gap-1">
                  <span className="bg-primary text-background px-2 py-1 rounded font-bold">12</span>
                  <span>:</span>
                  <span className="bg-primary text-background px-2 py-1 rounded font-bold">45</span>
                  <span>:</span>
                  <span className="bg-primary text-background px-2 py-1 rounded font-bold">09</span>
                </div>
              </div>
            </div>
            <Button variant="link" className="text-primary font-bold">Shop More</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {['Electronics', 'Fashion', 'Health', 'Home', 'Groceries', 'Beauty'].map((cat) => (
              <div key={cat} className="group cursor-pointer text-center space-y-2">
                <div className="aspect-square bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm" />
                </div>
                <p className="text-sm font-medium">{cat}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Just For You */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Just For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center pt-8">
            <Button variant="outline" size="lg" className="w-full max-w-xs h-12 border-primary text-primary hover:bg-primary hover:text-background">
              Load More
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}