"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StyleAssistant } from '@/components/StyleAssistant';
import { LayoutDashboard, Users, ShoppingBag, BarChart3, Settings, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPanel() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
            <LayoutDashboard className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-headline font-bold uppercase tracking-tight">Admin Control Panel</h1>
            <p className="text-muted-foreground text-sm font-medium">Manage your boutique marketplace and AI insights.</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-card border border-primary/10 p-1.5 h-auto rounded-2xl flex flex-wrap gap-2">
            <TabsTrigger value="overview" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-background font-bold text-xs uppercase tracking-widest">
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-background font-bold text-xs uppercase tracking-widest">
              Products
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-background font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> AI Style Assistant
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-background font-bold text-xs uppercase tracking-widest">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Sales", value: "$24,560", icon: BarChart3, color: "text-blue-500" },
                { title: "New Orders", value: "48", icon: ShoppingBag, color: "text-emerald-500" },
                { title: "Active Users", value: "1,240", icon: Users, color: "text-amber-500" },
                { title: "Inventory", value: "854 Items", icon: Settings, color: "text-rose-500" }
              ].map((stat, i) => (
                <Card key={i} className="bg-card border-primary/10 hover:border-primary/30 transition-all rounded-3xl overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.title}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold font-headline">{stat.value}</div>
                    <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">+12% from last month</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-assistant" className="animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-card border-primary/10 shadow-2xl rounded-[40px] overflow-hidden">
                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Sparkles className="h-7 w-7 text-primary" /> AI Couture Intelligence
                  </CardTitle>
                  <p className="text-sm text-muted-foreground italic">Powered by Gemini - Specialized for Dhaka's elite fashion scene.</p>
                </CardHeader>
                <CardContent className="p-0">
                  <StyleAssistant />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
