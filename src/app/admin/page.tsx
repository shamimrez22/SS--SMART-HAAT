
"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  Link as LinkIcon, 
  Sparkles, 
  ShieldCheck, 
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
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";

// Simulated sales data for the professional chart
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
  
  // Real-time counts from Firestore
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  
  const { data: products } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);

  const stats = [
    { 
      title: "TOTAL PRODUCTS", 
      value: products?.length || 0, 
      change: "+12%", 
      icon: Package, 
      color: "text-orange-600",
      description: "Active inventory items"
    },
    { 
      title: "CATEGORIES", 
      value: categories?.length || 0, 
      change: "Stable", 
      icon: Layers, 
      color: "text-blue-500",
      description: "Departmental divisions"
    },
    { 
      title: "TOTAL SALES", 
      value: "৳84,200", 
      change: "+24%", 
      icon: CreditCard, 
      color: "text-green-500",
      description: "Monthly revenue growth"
    },
    { 
      title: "ACTIVE USERS", 
      value: "1.2K", 
      change: "+5%", 
      icon: Users, 
      color: "text-purple-500",
      description: "Registered premium members"
    }
  ];

  const quickLinks = [
    { title: "ORDERS", icon: ShoppingBag, href: "/admin/orders", sub: "Manage customer requests" },
    { title: "INVENTORY", icon: Package, href: "/admin/products", sub: "Stock & price control" },
    { title: "CATEGORIES", icon: Layers, href: "/admin/categories", sub: "Structure departments" },
    { title: "SETTINGS", icon: Settings, href: "/admin/settings", sub: "System configuration" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-orange-600" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">Executive Console v2.5</p>
            </div>
            <h1 className="text-5xl font-headline font-black uppercase tracking-tighter text-white">DASHBOARD</h1>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-none">
            <Activity className="h-5 w-5 text-orange-600 animate-pulse" />
            <div>
              <p className="text-[8px] font-black text-muted-foreground uppercase">System Status</p>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">All Nodes Operational</p>
            </div>
          </div>
        </div>

        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-card border-white/5 rounded-none hover:border-orange-600/30 transition-all group">
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
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* ANALYTICS CHART */}
          <Card className="lg:col-span-2 bg-card border-white/5 rounded-none overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
              <div className="space-y-1">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">Sales Intelligence</p>
                <CardDescription className="text-[10px] font-bold uppercase">Weekly transaction performance (৳)</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-8">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
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

          {/* QUICK LINKS GRID */}
          <div className="grid grid-cols-1 gap-4">
            {quickLinks.map((link, i) => (
              <Link key={i} href={link.href}>
                <div className="bg-card border border-white/5 p-6 hover:border-orange-600/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="p-3 bg-white/5 group-hover:bg-orange-600/10 transition-colors">
                      <link.icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tighter">{link.title}</h3>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold mt-1">{link.sub}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* AI Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <Sparkles className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">AI STYLE CONSULTANT</h2>
            </div>
            <div className="border border-white/5 bg-card">
              <StyleAssistant />
            </div>
          </div>

          {/* SYSTEM LOGS / ACTIVITY */}
          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">LIVE ACTIVITY</h2>
            <div className="space-y-4">
              {[
                { time: "2M AGO", user: "GUEST_482", action: "Viewed Premium Saree", type: "BROWSING" },
                { time: "15M AGO", user: "Z_RAHMAN", action: "Added item to cart", type: "CART" },
                { time: "1H AGO", user: "SYSTEM", action: "Daily Backup Completed", type: "LOG" },
                { time: "3H AGO", user: "ADMIN", action: "Updated Inventory: Watch Collection", type: "UPDATE" }
              ].map((log, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5">
                   <div className="flex-shrink-0 w-1 bg-orange-600/30" />
                   <div>
                     <p className="text-[8px] font-black text-orange-600 uppercase tracking-widest">{log.type}</p>
                     <p className="text-[10px] text-white font-bold mt-1 uppercase">{log.action}</p>
                     <p className="text-[7px] text-muted-foreground mt-1 uppercase">{log.user} • {log.time}</p>
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
