import React from 'react';
import Image from 'next/image';
import { ArrowRight, Flame, Star, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 space-y-16">
        {/* Banner Section */}
        <section className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px] border border-primary/10">
          <Carousel className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent>
              <CarouselItem>
                <div className="relative h-[500px] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600"
                    alt="Marketplace Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center px-16 space-y-8">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-background text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.3em]">Exclusive Collection</span>
                    </div>
                    <h2 className="text-6xl md:text-7xl font-headline font-bold text-white max-w-3xl leading-tight">
                      Elevate Your <span className="gold-gradient">Lifestyle</span> with Smart Choice
                    </h2>
                    <p className="text-white/70 max-w-xl text-lg font-medium leading-relaxed">Experience the pinnacle of premium shopping in Bangladesh. Quality, Authenticity, and Elegance combined.</p>
                    <div className="flex gap-6">
                      <Button className="bg-primary text-background h-16 px-12 font-bold rounded-full text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1">
                        Explore Shop <ArrowRight className="ml-2 h-6 w-6" />
                      </Button>
                      <Button variant="outline" className="h-16 px-12 font-bold rounded-full text-lg border-white/30 text-white hover:bg-white/10 hover:border-white transition-all">
                        New Arrivals
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-8 bg-white/10 border-none text-white hover:bg-white/30 h-12 w-12" />
            <CarouselNext className="right-8 bg-white/10 border-none text-white hover:bg-white/30 h-12 w-12" />
          </Carousel>
        </section>

        {/* Top Product Section (Formerly Flash Sale) */}
        <section id="top-products" className="bg-primary/5 rounded-[40px] p-10 border border-primary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-all duration-700 group-hover:bg-primary/20" />
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <h2 className="text-4xl font-bold flex items-center gap-4">
                <Flame className="h-10 w-10 text-primary fill-current animate-pulse" /> Top Product
              </h2>
              <div className="flex items-center gap-4 text-sm bg-background/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-primary/10">
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Ending In:</span>
                <div className="flex gap-3">
                  <div className="bg-primary text-background px-4 py-2 rounded-xl font-bold text-xl shadow-lg shadow-primary/20">12</div>
                  <span className="text-2xl font-bold text-primary self-center">:</span>
                  <div className="bg-primary text-background px-4 py-2 rounded-xl font-bold text-xl shadow-lg shadow-primary/20">45</div>
                  <span className="text-2xl font-bold text-primary self-center">:</span>
                  <div className="bg-primary text-background px-4 py-2 rounded-xl font-bold text-xl shadow-lg shadow-primary/20">09</div>
                </div>
              </div>
            </div>
            <Button variant="link" className="text-primary font-bold text-xl hover:translate-x-2 transition-transform">
              View All Collection <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          {/* Always showing 12 products by doubling the mock data */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {products.concat(products).slice(0, 12).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
        </section>

        {/* Top Categories */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-primary rounded-full" />
            <h2 className="text-4xl font-bold uppercase tracking-tighter">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {[
              { name: 'Smartphones', color: 'bg-blue-500/10 text-blue-500' },
              { name: 'Fashion', color: 'bg-pink-500/10 text-pink-500' },
              { name: 'Watches', color: 'bg-amber-500/10 text-amber-500' },
              { name: 'Beauty', color: 'bg-purple-500/10 text-purple-500' },
              { name: 'Laptops', color: 'bg-emerald-500/10 text-emerald-500' },
              { name: 'Footwear', color: 'bg-rose-500/10 text-rose-500' }
            ].map((cat) => (
              <div key={cat.name} className="group cursor-pointer text-center space-y-4 p-6 hover:bg-card rounded-3xl transition-all border border-transparent hover:border-primary/10 hover:shadow-xl hover:shadow-primary/5">
                <div className={`aspect-square ${cat.color} rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner relative overflow-hidden`}>
                  <div className="w-20 h-20 bg-background rounded-2xl shadow-sm flex items-center justify-center border border-primary/5">
                    <Star className="h-10 w-10 text-primary/40 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em]">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Just For You - Dynamic Grid */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-2 bg-primary rounded-full" />
              <h2 className="text-4xl font-bold uppercase tracking-tighter">Just For You</h2>
            </div>
            <LayoutGrid className="h-8 w-8 text-primary/40" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
            {products.concat(products).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
          <div className="flex justify-center pt-16">
            <Button variant="outline" size="lg" className="w-full max-w-md h-16 border-primary/30 text-primary hover:bg-primary hover:text-background rounded-full text-xl font-bold shadow-xl hover:shadow-primary/20 transition-all">
              Load More Products
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
