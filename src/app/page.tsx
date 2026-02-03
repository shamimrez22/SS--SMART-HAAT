import React from 'react';
import Image from 'next/image';
import { ArrowRight, Zap, Star, ShieldCheck, Truck, RotateCcw, LayoutGrid, Flame } from 'lucide-react';
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
        <section className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px]">
          <Carousel className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent>
              <CarouselItem>
                <div className="relative h-[450px] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600"
                    alt="Marketplace Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12 space-y-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-background text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Limited Edition</span>
                    </div>
                    <h2 className="text-6xl font-headline font-bold text-white max-w-2xl leading-tight">
                      Exquisite Fashion & Modern <span className="gold-gradient">Lifestyle</span>
                    </h2>
                    <p className="text-white/70 max-w-lg text-lg">The most premium online shopping experience in Bangladesh. Now smarter, now modern.</p>
                    <div className="flex gap-4">
                      <Button className="bg-primary text-background h-14 px-10 font-bold rounded-full text-lg hover:shadow-lg hover:shadow-primary/30 transition-all">
                        Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button variant="outline" className="h-14 px-10 font-bold rounded-full text-lg border-white/30 text-white hover:bg-white/10">
                        View Collection
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-6 bg-white/10 border-none text-white hover:bg-white/20" />
            <CarouselNext className="right-6 bg-white/10 border-none text-white hover:bg-white/20" />
          </Carousel>
        </section>

        {/* Features Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-primary/10 shadow-sm hover:border-primary/30 transition-colors">
            <div className="p-3 bg-primary/10 rounded-xl">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">100% Authentic</p>
              <p className="text-xs text-muted-foreground">Guaranteed Quality</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-primary/10 shadow-sm hover:border-primary/30 transition-colors">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">Fast Delivery</p>
              <p className="text-xs text-muted-foreground">Nationwide Service</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-primary/10 shadow-sm hover:border-primary/30 transition-colors">
            <div className="p-3 bg-primary/10 rounded-xl">
              <RotateCcw className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">Easy Returns</p>
              <p className="text-xs text-muted-foreground">7 Days Guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-primary/10 shadow-sm hover:border-primary/30 transition-colors">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">Best Price</p>
              <p className="text-xs text-muted-foreground">Value for Money</p>
            </div>
          </div>
        </section>

        <div className="space-y-12">
          {/* Flash Sale Section */}
          <section id="flash-sale" className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Zap className="h-8 w-8 text-primary fill-current" /> Flash Sale
                </h2>
                <div className="flex items-center gap-3 text-sm hidden md:flex">
                  <span className="text-muted-foreground font-medium uppercase tracking-widest">Time Left:</span>
                  <div className="flex gap-2">
                    <div className="bg-primary text-background px-3 py-1.5 rounded-lg font-bold text-lg">12</div>
                    <span className="text-2xl font-bold text-primary">:</span>
                    <div className="bg-primary text-background px-3 py-1.5 rounded-lg font-bold text-lg">45</div>
                    <span className="text-2xl font-bold text-primary">:</span>
                    <div className="bg-primary text-background px-3 py-1.5 rounded-lg font-bold text-lg">09</div>
                  </div>
                </div>
              </div>
              <Button variant="link" className="text-primary font-bold text-lg">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Top Categories */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <LayoutGrid className="h-7 w-7 text-primary" />
              <h2 className="text-3xl font-bold">Top Categories</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {[
                { name: 'Smartphones', color: 'bg-blue-500/10 text-blue-500' },
                { name: 'Fashion', color: 'bg-pink-500/10 text-pink-500' },
                { name: 'Watches', color: 'bg-amber-500/10 text-amber-500' },
                { name: 'Beauty', color: 'bg-purple-500/10 text-purple-500' },
                { name: 'Laptops', color: 'bg-emerald-500/10 text-emerald-500' },
                { name: 'Footwear', color: 'bg-rose-500/10 text-rose-500' }
              ].map((cat) => (
                <div key={cat.name} className="group cursor-pointer text-center space-y-3 p-4 hover:bg-card rounded-2xl transition-all border border-transparent hover:border-primary/10">
                  <div className={`aspect-square ${cat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                      <Star className="h-8 w-8 text-primary/40" />
                    </div>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-tighter">{cat.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Just For You */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Flame className="h-7 w-7 text-primary" />
              <h2 className="text-3xl font-bold">Just For You</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {products.concat(products).map((product, idx) => (
                <ProductCard key={`${product.id}-${idx}`} product={product} />
              ))}
            </div>
            <div className="flex justify-center pt-12">
              <Button variant="outline" size="lg" className="w-full max-w-sm h-14 border-primary text-primary hover:bg-primary hover:text-background rounded-full text-lg font-bold shadow-lg hover:shadow-primary/20 transition-all">
                Load More Products
              </Button>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
