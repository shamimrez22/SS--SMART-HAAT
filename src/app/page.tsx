
import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Diamond, Crown, Zap, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { StyleAssistant } from '@/components/StyleAssistant';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section - High Fashion Asymmetric */}
        <section className="relative h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000"
              alt="Luxury Fashion Concept"
              fill
              className="object-cover opacity-40 scale-105"
              priority
              data-ai-hint="luxury fashion"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-12 bg-primary"></span>
                <span className="text-primary text-xs font-bold tracking-[0.5em] uppercase">Est. 2024 | Dhaka</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-headline leading-[0.85] gold-gradient drop-shadow-2xl">
                Couture <br /> <span className="italic font-light">Heritage</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light max-w-lg leading-relaxed">
                Experience a realm where tradition meets technology. Curated for the few, desired by the many.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="h-14 rounded-none px-10 bg-primary text-background hover:bg-primary/90 text-sm uppercase tracking-widest font-bold transition-all hover:gap-4">
                  Explore Collection <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 rounded-none px-10 border-white/20 hover:border-primary/50 text-white text-sm uppercase tracking-widest">
                  The Lookbook
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Philosophy - "Bespoke Heritage" */}
        <section className="py-24 border-y border-white/5 bg-card/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="space-y-4">
                <Diamond className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-headline">Peerless Quality</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Each thread is selected from the finest sources globally, ensuring that your investment stands the test of time.</p>
              </div>
              <div className="space-y-4">
                <MapPin className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-headline">Dhaka Roots</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Rooted in the rich textile history of Bengal, we bring a modern interpretation to classic craftsmanship.</p>
              </div>
              <div className="space-y-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-headline">Authenticated Exclusivity</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Every piece comes with a digital certificate of authenticity, guaranteeing its place in our limited collections.</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Style Assistant - High Tech Integration */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="glass-card p-1 shadow-2xl">
                <StyleAssistant />
              </div>
              <div className="space-y-8">
                <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-4">
                  GenAI Powered
                </div>
                <h2 className="text-5xl md:text-7xl font-headline leading-tight">
                  Your Private <br /><span className="text-primary italic">Atelier AI</span>
                </h2>
                <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-md">
                  Amader AI assistant apnar personal style preference analyze kore ekdom perfect outfit recommend korbe. 
                  Luxury fashion-er bishoye kono proshno thakle ekhoni korun.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <p className="text-primary font-bold">01. Bespoke</p>
                    <p className="text-xs text-muted-foreground">Tailored recommendations based on your unique silhouette.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-primary font-bold">02. Exclusive</p>
                    <p className="text-xs text-muted-foreground">Access to limited style guides and trend predictions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Catalog */}
        <section id="shop" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div className="space-y-4">
                <span className="text-primary text-xs font-bold tracking-[0.5em] uppercase">The Selection</span>
                <h2 className="text-5xl md:text-7xl font-headline">Latest Icons</h2>
              </div>
              <Button variant="link" className="text-primary uppercase tracking-widest font-bold hover:no-underline group">
                View Entire Collection <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
