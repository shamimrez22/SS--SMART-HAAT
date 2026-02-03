
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
  ArrowUpRight
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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

// Simulated sales data
const chartData = [
  { day: "SAT", sales: 400 },
  { day: "SUN", sales: 300 },
  { day: "MON", sales: 200 },
  { day: "TUE", sales: 500 },
  { day: "WED", sales: 180 },
  { day: "THU", sales: 350 },
  { day: "FRI", sales: 600 },
];

const chartConfig = {
  sales: {
    label: "Sales (৳)",
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
    { title: "TOTAL PRODUCTS", value: products?.length || 0, change: "+12%", icon: Package, color: "text-orange-600" },
    { title: "CATEGORIES", value: categories?.length || 0, change: "Stable", icon: Layers, color: "text-blue-500" },
    { title: "TOTAL SALES", value: "৳84,200", change: "+24%", icon: CreditCard, color: "text-green-500" },
    { title: "ACTIVE USERS", value: "1.2K", change: "+5%", icon: Users, color: "text-purple-500" }
  ];

  const quickLinks = [
    { title: "ORDERS", icon: ShoppingBag, href: "/admin/orders", sub: "Customer requests" },
    { title: "INVENTORY", icon: Package, href: "/admin/products", sub: "Stock control" },
    { title: "CATEGORIES", icon: Layers, href: "/admin/categories", sub: "Structure" },
    { title: "OTHERS", icon: LinkIcon, href: "/admin/others", sub: "System tools" },
    { title: "SETTINGS", icon: Settings, href: "/admin/settings", sub: "Config" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-orange-600" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">Executive Console v2.5</p>
            </div>
            <h1 className="text-5xl font-headline font-black uppercase tracking-tighter text-white">DASHBOARD</h1>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4">
            <Activity className="h-5 w-5 text-orange-600 animate-pulse" />
            <div>
              <p className="text-[8px] font-black text-muted-foreground uppercase">System Status</p>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Operational</p>
            </div>
          </div>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-card border-white/5 rounded-none hover:border-orange-600/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black text-orange-600 bg-orange-600/10 px-1.5 py-0.5">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* LEFT COLUMN: AI & OTHERS (4 COLS) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                <Sparkles className="h-4 w-4 text-orange-600" />
                <h2 className="text-xs font-black uppercase tracking-widest text-white">AI STYLE ASSISTANT</h2>
              </div>
              <div className="border border-white/5 bg-card">
                <StyleAssistant />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-white">QUICK ACTIONS</h2>
              <div className="grid grid-cols-1 gap-3">
                {quickLinks.map((link, i) => (
                  <Link key={i} href={link.href}>
                    <div className="bg-card border border-white/5 p-4 hover:border-orange-600/50 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <link.icon className="h-4 w-4 text-orange-600" />
                        <div>
                          <h3 className="text-[10px] font-black text-white uppercase tracking-tighter">{link.title}</h3>
                          <p className="text-[7px] text-muted-foreground uppercase font-bold">{link.sub}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ANALYTICS (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="bg-card border-white/5 rounded-none overflow-hidden h-full">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                <div className="space-y-1">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">Sales Intelligence</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase">Weekly transaction performance (৳)</CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-8">
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                  <AreaChart
                    data={chartData}
                    margin={{ left: 12, right: 12 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#666' }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Area
                      dataKey="sales"
                      type="monotone"
                      fill="var(--color-sales)"
                      fillOpacity={0.1}
                      stroke="var(--color-sales)"
                      strokeWidth={4}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">LIVE ACTIVITY</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { time: "2M AGO", user: "GUEST_482", action: "Viewed Premium Saree", type: "BROWSING" },
                { time: "15M AGO", user: "Z_RAHMAN", action: "Added item to cart", type: "CART" },
                { time: "1H AGO", user: "SYSTEM", action: "Daily Backup Completed", type: "LOG" },
                { time: "3H AGO", user: "ADMIN", action: "Updated Inventory", type: "UPDATE" }
              ].map((log, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5">
                   <div className="flex-shrink-0 w-1 bg-orange-600/30" />
                   <div>
                     <p className="text-[8px] font-black text-orange-600 uppercase tracking-widest">{log.type}</p>
                     <p className="text-[10px] text-white font-bold mt-1 uppercase">{log.action}</p>
                     <p className="text-[7px] text-muted-foreground mt-1 uppercase">{log.time}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
