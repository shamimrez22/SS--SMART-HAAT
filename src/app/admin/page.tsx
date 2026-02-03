
"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LayoutDashboard, Users, ShoppingBag, BarChart3, Settings, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StyleAssistant } from '@/components/StyleAssistant';

export default function AdminPanel() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-6 mb-12">
          <div className="p-4 bg-orange-600/10 border border-orange-600/20">
            <LayoutDashboard className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-4xl font-headline font-black uppercase tracking-tighter text-white">ADMIN CONSOLE</h1>
            <p className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.4em] mt-1">MANAGEMENT & AI INSIGHTS</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "TOTAL REVENUE", value: "৳1,245,600", icon: BarChart3, color: "text-orange-600" },
            { title: "BOUTIQUE ORDERS", value: "89", icon: ShoppingBag, color: "text-orange-600" },
            { title: "ELITE CLIENTS", value: "3,120", icon: Users, color: "text-orange-600" },
            { title: "CURATED STOCK", value: "1,250", icon: Settings, color: "text-orange-600" }
          ].map((stat, i) => (
            <Card key={i} className="bg-card border-white/5 rounded-none hover:border-orange-600/30 transition-all group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <p className="text-[7px] text-orange-600 font-black mt-2 uppercase tracking-widest">+15.2% INCREASE TODAY</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* AI Section for Admin */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <Sparkles className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">AI STYLE CONSULTANT</h2>
            </div>
            <div className="border border-white/5 bg-card">
              <StyleAssistant />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">QUICK ACTIONS</h2>
            <Card className="rounded-none border-white/5 bg-orange-600/5 p-8 text-center space-y-6">
               <h3 className="text-md font-black uppercase tracking-widest text-white">STORE MANAGEMENT</h3>
               <p className="text-[9px] text-muted-foreground leading-relaxed uppercase">INVENTORY MANAGEMENT, ORDER PROCESSING AND CLIENT TRACKING FEATURES ARE EXCLUSIVE TO ADMINISTRATIVE ACCOUNTS.</p>
               <div className="flex flex-col gap-4">
                 <div className="p-3 bg-black border border-white/10 text-[8px] font-black uppercase tracking-widest hover:border-orange-600 transition-colors cursor-pointer text-white">UPDATE INVENTORY</div>
                 <div className="p-3 bg-black border border-white/10 text-[8px] font-black uppercase tracking-widest hover:border-orange-600 transition-colors cursor-pointer text-white">REVIEW ORDERS</div>
               </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
