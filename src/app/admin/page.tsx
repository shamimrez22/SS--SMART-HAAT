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
          <div className="p-5 bg-primary/10 rounded-2xl border border-primary/20">
            <LayoutDashboard className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-headline font-bold uppercase tracking-tight text-foreground">Admin Console</h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mt-1">Management & AI Insights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Total Revenue", value: "$124,560", icon: BarChart3, color: "text-blue-400" },
            { title: "Boutique Orders", value: "89", icon: ShoppingBag, color: "text-primary" },
            { title: "Elite Clients", value: "3,120", icon: Users, color: "text-indigo-400" },
            { title: "Curated Stock", value: "1,250", icon: Settings, color: "text-rose-400" }
          ].map((stat, i) => (
            <Card key={i} className="bg-card border-white/5 hover:border-primary/30 transition-all rounded-[2rem] overflow-hidden group shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-headline text-foreground">{stat.value}</div>
                <p className="text-[9px] text-primary font-bold mt-2 uppercase tracking-widest">+15.2% INCREASE</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* AI Section for Admin */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold uppercase tracking-tighter">AI Style Consultant</h2>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
              <StyleAssistant />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold uppercase tracking-tighter">Quick Actions</h2>
            <Card className="rounded-[2rem] border-white/5 bg-primary/5 p-8 text-center space-y-6">
               <h3 className="text-lg font-bold">Store Management</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">Inventory management, order processing and client tracking features are exclusive to administrative accounts.</p>
               <div className="grid grid-gap-4">
                 <div className="p-4 bg-background rounded-2xl border border-white/5 text-xs font-bold uppercase tracking-widest hover:border-primary transition-colors cursor-pointer">Update Inventory</div>
                 <div className="p-4 bg-background rounded-2xl border border-white/5 text-xs font-bold uppercase tracking-widest hover:border-primary transition-colors cursor-pointer mt-4">Review Orders</div>
               </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}