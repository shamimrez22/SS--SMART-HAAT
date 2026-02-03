import React from 'react';
import Image from 'next/image';
import { ArrowRight, Zap, Star, ShieldCheck, Truck, RotateCcw, LayoutGrid, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { StyleAssistant } from '@/components/StyleAssistant';

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
                      অভিজাত ফ্যাশন ও আধুনিক <span className="gold-gradient">লাইফস্টাইল</span>
                    </h2>
                    <p className="text-white/70 max-w-lg text-lg">বাংলাদেশের সবচেয়ে প্রিমিয়াম অনলাইন শপিং অভিজ্ঞতা। এখন আরও স্মার্ট, আরও আধুনিক।</p>
                    <div className="flex gap-4">
                      <Button className="bg-primary text-background h-14 px-10 font-bold rounded-full text-lg hover:shadow-lg hover:shadow-primary/30 transition-all">
                        শপ করুন <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button variant="outline" className="h-14 px-10 font-bold rounded-full text-lg border-white/30 text-white hover:bg-white/10">
                        কালেকশন দেখুন
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
              <p className="font-bold text-sm">১০০% অথেন্টিক</p>
              <p className="text-xs text-muted-foreground">নিশ্চিত গুণগত মান</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-primary/10 shadow-sm hover:border-primary/30 transition-colors">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">ফাস্ট ডেলিভারি</p>
              <p className="text-xs text-muted-foreground">সারা বাংলাদেশে দ্রুত সেবা</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-primary/10 shadow-sm hover:border-primary/30 transition-colors">
            <div className="p-3 bg-primary/10 rounded-xl">
              <RotateCcw className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">সহজ রিটার্ন</p>
              <p className="text-xs text-muted-foreground">৭ দিনের গ্যারান্টি</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-primary/10 shadow-sm hover:border-primary/30 transition-colors">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">সেরা দাম</p>
              <p className="text-xs text-muted-foreground">ভ্যালু ফর মানি</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Areas */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* Flash Sale Section */}
            <section id="flash-sale" className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Zap className="h-8 w-8 text-primary fill-current" /> ফ্ল্যাশ সেল
                  </h2>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground font-medium uppercase tracking-widest">সময় বাকি:</span>
                    <div className="flex gap-2">
                      <div className="bg-primary text-background px-3 py-1.5 rounded-lg font-bold text-lg">১২</div>
                      <span className="text-2xl font-bold text-primary">:</span>
                      <div className="bg-primary text-background px-3 py-1.5 rounded-lg font-bold text-lg">৪৫</div>
                      <span className="text-2xl font-bold text-primary">:</span>
                      <div className="bg-primary text-background px-3 py-1.5 rounded-lg font-bold text-lg">০৯</div>
                    </div>
                  </div>
                </div>
                <Button variant="link" className="text-primary font-bold text-lg">সবগুলো দেখুন <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Top Categories */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <LayoutGrid className="h-7 w-7 text-primary" />
                <h2 className="text-3xl font-bold">টপ ক্যাটাগরি</h2>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {[
                  { name: 'স্মার্টফোন', color: 'bg-blue-500/10 text-blue-500' },
                  { name: 'ফ্যাশন', color: 'bg-pink-500/10 text-pink-500' },
                  { name: 'ঘড়ি', color: 'bg-amber-500/10 text-amber-500' },
                  { name: 'বিউটি', color: 'bg-purple-500/10 text-purple-500' },
                  { name: 'ল্যাপটপ', color: 'bg-emerald-500/10 text-emerald-500' },
                  { name: 'জুতা', color: 'bg-rose-500/10 text-rose-500' }
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
                <h2 className="text-3xl font-bold">আপনার জন্য বিশেষ</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="flex justify-center pt-12">
                <Button variant="outline" size="lg" className="w-full max-w-sm h-14 border-primary text-primary hover:bg-primary hover:text-background rounded-full text-lg font-bold shadow-lg hover:shadow-primary/20 transition-all">
                  আরও পণ্য দেখুন
                </Button>
              </div>
            </section>
          </div>

          {/* Right Sidebar - AI Stylist */}
          <aside className="lg:col-span-3 sticky top-24 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-primary/20 shadow-xl">
              <StyleAssistant />
            </div>
            
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
              <h4 className="text-xl font-bold leading-tight">মেম্বারশিপ সুবিধা পান!</h4>
              <p className="text-sm text-muted-foreground">আমাদের লয়্যালটি প্রোগ্রামে যোগ দিয়ে পান বিশেষ ছাড় এবং দ্রুত ডেলিভারি সুবিধা।</p>
              <Button className="w-full bg-primary text-background font-bold h-12 rounded-xl">এখনই যোগ দিন</Button>
            </div>
          </aside>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
