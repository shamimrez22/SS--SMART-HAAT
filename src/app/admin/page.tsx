
"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  ShoppingBag, 
  Package, 
  Settings, 
  Link as LinkIcon, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Activity,
  ChevronRight,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StyleAssistant } from '@/components/StyleAssistant';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Simulated sales data for Bar Chart
const chartData = [
  { day: "SAT", sales: 42000 },
  { day: "SUN", sales: 38000 },
  { day: "MON", sales: 55000 },
  { day: "TUE", sales: 48000 },
  { day: "WED", sales: 72000 },
  { day: "THU", sales: 61000 },
  { day: "FRI", sales: 95000 },
];

const chartConfig = {
  sales: {
    label: "Revenue (৳)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AdminPanel() {
  const db = useFirestore();
  
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  
  const { data: products } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);

  const stats = [
    { title: "REVENUE", value: "৳2.4M", change: "+24%", icon: CreditCard, color: "text-orange-600" },
    { title: "PRODUCTS", value: products?.length || 0, change: "+5", icon: Package, color: "text-blue-500" },
    { title: "CATEGORIES", value: categories?.length || 0, change: "Active", icon: Layers, color: "text-green-500" },
    { title: "USERS", value: "8.2K", change: "+1.2K", icon: Users, color: "text-purple-500" }
  ];

  const quickLinks = [
    { title: "ORDERS", icon: ShoppingBag, href: "/admin/orders" },
    { title: "INVENTORY", icon: Package, href: "/admin/products" },
    { title: "STRUCTURE", icon: Layers, href: "/admin/categories" },
    { title: "OTHERS", icon: LinkIcon, href: "/admin/others" },
    { title: "SETTINGS", icon: Settings, href: "/admin/settings" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* TOP STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-card border-white/5 rounded-none p-6 hover:border-orange-600/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.title}</p>
                <stat.icon className={`h-4 w-4 ${stat.color} opacity-70`} />
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-white font-headline tracking-tighter">{stat.value}</h3>
                <span className="text-[9px] font-black text-green-500 uppercase">{stat.change}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: COMPACT QUICK LINKS & AI */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-card border-white/5 rounded-none">
              <CardHeader className="py-4 px-6 border-b border-white/5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">QUICK ACTIONS</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="grid grid-cols-1 gap-1">
                  {quickLinks.map((link, i) => (
                    <Link key={i} href={link.href}>
                      <div className="flex items-center justify-between p-3 hover:bg-white/[0.03] transition-all group">
                        <div className="flex items-center gap-3">
                          <link.icon className="h-4 w-4 text-orange-600" />
                          <span className="text-[10px] font-black text-white uppercase tracking-wider">{link.title}</span>
                        </div>
                        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-orange-600 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">AI ADVISOR</CardTitle>
                  <Sparkles className="h-3 w-3 text-orange-600" />
                </div>
              </CardHeader>
              <div className="scale-100 origin-top">
                <StyleAssistant />
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: PROFESSIONAL BAR CHART */}
          <div className="lg:col-span-8">
            <Card className="bg-card border-white/5 rounded-none h-full">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 p-6">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-orange-600 uppercase tracking-widest">Business Intelligence</p>
                  <CardTitle className="text-xl font-black uppercase tracking-tighter text-white">REVENUE OVERVIEW</CardTitle>
                </div>
                <Badge variant="outline" className="rounded-none border-white/10 text-[8px] h-6 px-3">LAST 7 DAYS</Badge>
              </CardHeader>
              <CardContent className="p-6">
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                  <BarChart data={chartData}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#666' }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `৳${value/1000}K`}
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#666' }}
                    />
                    <ChartTooltip
                      cursor={{ fill: 'rgba(255,140,0,0.05)' }}
                      content={<ChartTooltipContent className="bg-black border-white/10" hideLabel />}
                    />
                    <Bar
                      dataKey="sales"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* BOTTOM ACTIVITY FEED */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-4 w-1 bg-orange-600" />
            <h2 className="text-xs font-black uppercase tracking-widest text-white">SYSTEM LOGS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { time: "10:24", action: "NEW PRODUCT ADDED", status: "DB_SYNC", color: "bg-blue-500" },
              { time: "09:55", action: "CATEGORY UPDATED", status: "ADMIN", color: "bg-orange-600" },
              { time: "09:12", action: "VISITOR CONVERSION", status: "LIVE", color: "bg-green-500" },
              { time: "08:40", action: "BACKUP COMPLETED", status: "SYSTEM", color: "bg-purple-500" }
            ].map((log, i) => (
              <div key={i} className="bg-card border border-white/5 p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono text-muted-foreground">{log.time}</span>
                  <Badge className={`rounded-none ${log.color} text-white text-[7px] border-none font-black h-4`}>{log.status}</Badge>
                </div>
                <p className="text-[9px] font-black text-white uppercase tracking-tight">{log.action}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
