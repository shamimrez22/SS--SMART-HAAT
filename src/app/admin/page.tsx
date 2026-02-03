
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
  ArrowUpRight,
  ChevronRight,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StyleAssistant } from '@/components/StyleAssistant';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Simulated sales data for professional chart
const chartData = [
  { day: "SAT", sales: 42000, users: 120 },
  { day: "SUN", sales: 38000, users: 150 },
  { day: "MON", sales: 55000, users: 200 },
  { day: "TUE", sales: 48000, users: 180 },
  { day: "WED", sales: 72000, users: 310 },
  { day: "THU", sales: 61000, users: 250 },
  { day: "FRI", sales: 95000, users: 400 },
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
    { title: "NET REVENUE", value: "৳2.4M", change: "+24.5%", icon: CreditCard, color: "text-orange-600", trend: "up" },
    { title: "ACTIVE INVENTORY", value: products?.length || 0, change: "+5 New", icon: Package, color: "text-blue-500", trend: "up" },
    { title: "CONVERSION RATE", value: "12.4%", change: "-2.1%", icon: TrendingUp, color: "text-green-500", trend: "down" },
    { title: "TOTAL USERS", value: "8.2K", change: "+1.2K", icon: Users, color: "text-purple-500", trend: "up" }
  ];

  const quickLinks = [
    { title: "ORDER MANAGEMENT", icon: ShoppingBag, href: "/admin/orders", sub: "Review & Dispatch" },
    { title: "PRODUCT INVENTORY", icon: Package, href: "/admin/products", sub: "Stock & Pricing" },
    { title: "CATEGORY HIERARCHY", icon: Layers, href: "/admin/categories", sub: "Market Structure" },
    { title: "SYSTEM INTEGRATIONS", icon: LinkIcon, href: "/admin/others", sub: "External API Tools" },
    { title: "GLOBAL SETTINGS", icon: Settings, href: "/admin/settings", sub: "Console Preferences" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      
      {/* SECONDARY SUB-NAV FOR ADMIN */}
      <div className="bg-black/40 border-b border-white/5 py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="rounded-none border-orange-600/50 text-orange-600 text-[9px] px-3">ADMIN CONSOLE</Badge>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <nav className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Link href="/admin" className="text-white">Overview</Link>
              <Link href="/admin/products" className="hover:text-white transition-colors">Inventory</Link>
              <Link href="/admin/categories" className="hover:text-white transition-colors">Structure</Link>
              <Link href="/admin/analytics" className="hover:text-white transition-colors">Analytics</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              DB_CONNECTED: UTC+6
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white"><Search className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-12 bg-orange-600" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-600">Enterprise Intelligence</p>
            </div>
            <h1 className="text-6xl font-headline font-black uppercase tracking-tighter text-white leading-none">COMMAND<br/>CENTER</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-white/5 p-4 min-w-[160px]">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Assets</p>
              <p className="text-2xl font-black text-white">{products?.length || 0} ITEMS</p>
            </div>
            <div className="bg-card border border-white/5 p-4 min-w-[160px]">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Server Latency</p>
              <p className="text-2xl font-black text-white">42MS</p>
            </div>
          </div>
        </div>

        {/* KEY PERFORMANCE INDICATORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="group relative bg-card border border-white/5 p-6 transition-all hover:border-orange-600/30">
              <div className="absolute top-0 right-0 p-4">
                <stat.icon className={`h-5 w-5 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{stat.title}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white">{stat.value}</span>
                <span className={`text-[10px] font-black ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center gap-0.5`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-6 h-1 w-full bg-white/[0.03]">
                <div className={`h-full ${stat.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: i === 0 ? '75%' : i === 1 ? '45%' : i === 2 ? '15%' : '90%' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* LEFT: TOOLS & NAV (4 COLS) */}
          <div className="lg:col-span-4 space-y-8">
            {/* AI ASSISTANT SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-orange-600" />
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-white">GEN-AI ADVISOR</h2>
                </div>
                <Badge variant="outline" className="rounded-none border-white/10 text-[8px] text-muted-foreground">GPT-4o READY</Badge>
              </div>
              <div className="bg-card border border-white/5 overflow-hidden">
                <StyleAssistant />
              </div>
            </div>

            {/* QUICK ACTIONS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-orange-600" />
                <h2 className="text-[11px] font-black uppercase tracking-widest text-white">QUICK ACTIONS</h2>
              </div>
              <div className="space-y-3">
                {quickLinks.map((link, i) => (
                  <Link key={i} href={link.href}>
                    <div className="group bg-card border border-white/5 p-5 hover:bg-white/[0.02] hover:border-orange-600/50 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-black/50 border border-white/5 group-hover:border-orange-600/20 transition-all">
                          <link.icon className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xs font-black text-white uppercase tracking-tight">{link.title}</h3>
                          <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{link.sub}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: ANALYTICS (8 COLS) */}
          <div className="lg:col-span-8">
            <Card className="bg-card border-white/5 rounded-none overflow-hidden h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 p-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">Proprietary Data</p>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter text-white">REVENUE INTELLIGENCE</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-none text-[9px] font-black border-white/10 h-8">WTD</Button>
                  <Button variant="outline" size="sm" className="rounded-none text-[9px] font-black border-orange-600/50 bg-orange-600/10 text-white h-8">MTD</Button>
                  <Button variant="outline" size="sm" className="rounded-none text-[9px] font-black border-white/10 h-8">YTD</Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 flex-grow">
                <ChartContainer config={chartConfig} className="h-[450px] w-full">
                  <AreaChart
                    data={chartData}
                    margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="5 5" stroke="rgba(255,255,255,0.03)" />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={15}
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#666', letterSpacing: '0.1em' }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `৳${value/1000}K`}
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#666' }}
                    />
                    <ChartTooltip
                      cursor={{ stroke: 'rgba(255,140,0,0.2)', strokeWidth: 1 }}
                      content={<ChartTooltipContent className="bg-black border-white/10" hideLabel />}
                    />
                    <Area
                      dataKey="sales"
                      type="monotone"
                      fill="url(#fillSales)"
                      stroke="hsl(var(--primary))"
                      strokeWidth={4}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* BOTTOM SECTION: LIVE LOG & ACTIVITY */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-orange-600" /> SYSTEM ACTIVITY FEED
            </h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase">Showing 4 latest events</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { time: "09:42:15", user: "GUEST_881", action: "Viewed Luxury Saree", status: "BROWSE", color: "bg-blue-500" },
              { time: "09:38:04", user: "Z_RAHMAN", action: "Added item to wishlist", status: "WISH", color: "bg-purple-500" },
              { time: "09:20:55", user: "ADMIN_CONSOLE", action: "Updated Inventory: UID:821", status: "MOD", color: "bg-orange-600" },
              { time: "08:15:22", user: "SYSTEM_WATCH", action: "Daily Backup Initiated", status: "SYST", color: "bg-green-500" }
            ].map((log, i) => (
              <div key={i} className="bg-card border border-white/5 p-5 relative overflow-hidden group">
                <div className={`absolute top-0 left-0 h-1 w-full ${log.color} opacity-30 group-hover:opacity-100 transition-opacity`} />
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[8px] font-black text-muted-foreground font-mono">{log.time}</span>
                  <Badge className={`rounded-none ${log.color} text-white text-[7px] border-none font-black`}>{log.status}</Badge>
                </div>
                <p className="text-[11px] font-black text-white uppercase mb-2 tracking-tight">{log.action}</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">USER: {log.user}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
