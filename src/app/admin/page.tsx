
"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LayoutDashboard, ShoppingBag, Package, Settings, Link as LinkIcon, Sparkles, ShieldCheck, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StyleAssistant } from '@/components/StyleAssistant';

export default function AdminPanel() {
  const adminOptions = [
    { title: "DASHBOARD", icon: LayoutDashboard },
    { title: "ORDER", icon: ShoppingBag },
    { title: "PRODUCT", icon: Package },
    { title: "CATEGORY", icon: Layers },
    { title: "SETTING", icon: Settings },
    { title: "OTHER LINK", icon: LinkIcon }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* HEADER SECTION */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex gap-2">
            <div className="p-4 bg-orange-600/10 border border-orange-600/20">
              <ShieldCheck className="h-8 w-8 text-orange-600" />
            </div>
            <div className="p-4 bg-orange-600/10 border border-orange-600/20">
              <ShieldCheck className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-headline font-black uppercase tracking-tighter text-white">ADMIN CONSOLE</h1>
            <p className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.4em] mt-1">MANAGEMENT & AI INSIGHTS</p>
          </div>
        </div>

        {/* PRIMARY OPTIONS GRID - UPDATED TO 6 COLS ON LARGE SCREENS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          {adminOptions.map((option, i) => (
            <Card key={i} className="bg-card border-white/5 rounded-none hover:border-orange-600/50 transition-all group cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-white group-hover:text-orange-600 transition-colors">
                  {option.title}
                </CardTitle>
                <option.icon className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="h-1 bg-white/5 w-full mb-4 overflow-hidden">
                  <div className="h-full bg-orange-600 w-0 group-hover:w-full transition-all duration-500" />
                </div>
                <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">ACCESS MANAGEMENT</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* AI Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <Sparkles className="h-5 w-5 text-orange-600" />
              <ShieldCheck className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">AI STYLE CONSULTANT</h2>
            </div>
            <div className="border border-white/5 bg-card">
              <StyleAssistant />
            </div>
          </div>

          {/* Quick Stats/Info */}
          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">SYSTEM STATUS</h2>
            <Card className="rounded-none border-white/5 bg-orange-600/5 p-8 space-y-6">
               <div className="space-y-2">
                 <h3 className="text-md font-black uppercase tracking-widest text-white">ADMINISTRATIVE ACCESS</h3>
                 <p className="text-[9px] text-muted-foreground leading-relaxed uppercase">ALL SYSTEMS ARE OPERATIONAL. INVENTORY AND ORDER SYNCHRONIZATION IS ACTIVE FOR ALL PREMIUM OUTLETS.</p>
               </div>
               
               <div className="space-y-4">
                 <div className="flex justify-between items-center py-2 border-b border-white/5">
                   <span className="text-[10px] font-black text-white">SERVER LOAD</span>
                   <span className="text-[10px] font-black text-orange-600">MINIMAL</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-white/5">
                   <span className="text-[10px] font-black text-white">DB CONNECTION</span>
                   <span className="text-[10px] font-black text-orange-600">SECURE</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-white/5">
                   <span className="text-[10px] font-black text-white">AI AGENT</span>
                   <span className="text-[10px] font-black text-orange-600">ONLINE</span>
                 </div>
               </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
