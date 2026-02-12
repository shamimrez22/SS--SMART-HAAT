
"use client";

import React, { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { 
  ShoppingBag, 
  Package, 
  Settings, 
  Link as LinkIcon, 
  Sparkles, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Users,
  Zap,
  Loader2,
  MapPin,
  Radio,
  Palette
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StyleAssistant } from '@/components/StyleAssistant';
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, orderBy } from 'firebase/firestore';
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Updated: More stylish and vibrant palette
const CHART_COLORS = ['#ff9f43', '#0abde3', '#ee5253', '#00d2d3', '#5f27cd', '#ff9ff3'];

export default function AdminPanel() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [today, setToday] = useState<string>('');
  
  useEffect(() => {
    setIsMounted(true);
    setToday(new Date().toISOString().split('T')[0]);
  }, []);
  
  const productsRef = useMemoFirebase(() => db ? collection(db, 'products') : null, [db]);
  const categoriesRef = useMemoFirebase(() => db ? collection(db, 'categories') : null, [db]);
  const ordersRef = useMemoFirebase(() => db ? query(collection(db, 'orders'), orderBy('createdAt', 'desc')) : null, [db]);
  const pendingOrdersRef = useMemoFirebase(() => db ? query(collection(db, 'orders'), where('status', '==', 'PENDING'), orderBy('createdAt', 'desc')) : null, [db]);
  const visitorStatsRef = useMemoFirebase(() => {
    if (!db || !today) return null;
    return doc(db, 'visitorStats', today);
  }, [db, today]);
  
  const { data: products } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);
  const { data: orders } = useCollection(ordersRef);
  const { data: pendingOrders } = useCollection(pendingOrdersRef);
  const { data: dailyVisitors } = useDoc(visitorStatsRef);

  const categoryStats = useMemo(() => {
    if (!products || !categories) return [];
    return categories.map((cat, i) => ({
      name: cat.name,
      count: products.filter(p => p.category === cat.name).length,
      color: CHART_COLORS[i % CHART_COLORS.length]
    }));
  }, [products, categories]);

  const pieChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    categoryStats.forEach(stat => {
      config[stat.name] = { label: stat.name, color: stat.color };
    });
    return config;
  }, [categoryStats]);

  const salesStats = useMemo(() => {
    if (!orders || !today) return { totalRevenue: 0, todaySales: 0 };
    const todayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(today));
    const revenue = orders.reduce((acc, curr) => acc + ((curr.productPrice || 0) * (curr.quantity || 1)), 0);
    return {
      totalRevenue: revenue,
      todaySales: todayOrders.length
    };
  }, [orders, today]);

  // Stylish dummy data for chart visualization
  const dailyChartData = useMemo(() => [
    { day: "SAT", sales: 42000 },
    { day: "SUN", sales: 38000 },
    { day: "MON", sales: 55000 },
    { day: "TUE", sales: 48000 },
    { day: "WED", sales: 72000 },
    { day: "THU", sales: 61000 },
    { day: "FRI", sales: 95000 },
  ], []);

  useEffect(() => {
    if (pendingOrders && pendingOrders.length > 0) {
      const latestOrder = pendingOrders[0];
      const orderTime = latestOrder.createdAt ? new Date(latestOrder.createdAt).getTime() : 0;
      const now = new Date().getTime();
      
      if (now - orderTime < 10000) { 
        toast({
          variant: "destructive",
          title: "🚨 NEW ORDER",
          description: `${latestOrder.customerName || 'GUEST'} ordered ${latestOrder.productName || 'PRODUCT'}.`,
        });
      }
    }
  }, [pendingOrders, toast]);

  const stats = [
    { title: "TOTAL REVENUE", value: `৳${salesStats.totalRevenue.toLocaleString()}`, change: "LIFE TIME", icon: TrendingUp, color: "text-white", href: "/admin/orders" },
    { title: "DAILY SALES", value: salesStats.todaySales, change: "TODAY", icon: ShoppingBag, color: "text-orange-500", href: "/admin/orders", isHighlight: true },
    { title: "VISITORS", value: dailyVisitors?.count || 0, change: "TODAY", icon: Users, color: "text-purple-500", href: "/admin/others" },
    { title: "PRODUCTS", value: products?.length || 0, change: "TOTAL", icon: Package, color: "text-green-500", href: "/admin/products" }
  ];

  const quickLinks = [
    { title: "THEME & COLORS", icon: Palette, href: "/admin/theme", isHighlight: true },
    { title: "HUB & LIVE BROADCAST", icon: Radio, href: "/admin/location" },
    { title: "FEATURED CONTENT", icon: Zap, href: "/admin/featured" },
    { title: "ORDER INTELLIGENCE", icon: ShoppingBag, href: "/admin/orders" },
    { title: "PRODUCT INVENTORY", icon: Package, href: "/admin/products" },
    { title: "SYSTEM STRUCTURE", icon: Layers, href: "/admin/categories" },
    { title: "OTHERS CONFIG", icon: LinkIcon, href: "/admin/others" },
    { title: "ADMIN SECURITY", icon: Settings, href: "/admin/settings" }
  ];

  if (!db) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-10 w-10 text-primary animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href}>
              <Card className={`bg-card border-white/5 rounded-none p-4 md:p-6 hover:border-white/30 transition-all cursor-pointer group h-full ${stat.isHighlight && stat.value > 0 ? 'border-red-600/30 bg-red-600/[0.02]' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] ${stat.isHighlight && stat.value > 0 ? 'text-red-600' : 'text-white/60'}`}>{stat.title}</p>
                  <stat.icon className={`h-3 w-3 md:h-4 md:w-4 ${stat.isHighlight && stat.value > 0 ? 'text-red-600 animate-bounce' : stat.color} opacity-70 group-hover:scale-110 transition-transform`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter">{stat.value}</h3>
                  <span className={`text-[7px] md:text-[9px] font-black uppercase ${stat.isHighlight && stat.value > 0 ? 'text-red-600' : 'text-white'}`}>
                    {stat.change}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-white">COMMAND CENTER</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="grid grid-cols-1 gap-1">
                  {quickLinks.map((link, i) => (
                    <Link key={i} href={link.href}>
                      <div className={`flex items-center justify-between p-4 hover:bg-white/5 transition-all group border-b border-white/[0.02] last:border-0 ${link.isHighlight ? 'bg-white/5' : ''}`}>
                        <div className="flex items-center gap-4">
                          <link.icon className={`h-4 w-4 ${link.isHighlight ? 'text-white' : 'text-white/50'} group-hover:opacity-100`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest group-hover:text-white ${link.isHighlight ? 'text-white' : 'text-white'}`}>{link.title}</span>
                        </div>
                        <ChevronRight className="h-3 w-3 text-white/20 group-hover:translate-x-1 transition-all group-hover:text-white" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-white">CATEGORY BREAKDOWN</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[250px] w-full flex items-center justify-center">
                  {isMounted && categoryStats.length > 0 ? (
                    <ChartContainer config={pieChartConfig} className="h-full w-full">
                      <PieChart>
                        <Pie
                          data={categoryStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="count"
                          stroke="none"
                        >
                          {categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent className="bg-black border-white/10 rounded-none p-2 text-[10px] font-black uppercase" />} />
                      </PieChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      <p className="text-[8px] text-primary uppercase font-black">Syncing Data...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 p-6 gap-4 bg-white/[0.01]">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Business Intelligence</p>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter text-white">REVENUE ARCHIVE</CardTitle>
                </div>
                <Badge variant="outline" className="rounded-none border-white/10 text-[8px] h-6 px-3 w-fit font-black text-white/40 uppercase">DATABASE: LIVE SYNCED</Badge>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[350px] w-full flex items-center justify-center">
                  {isMounted ? (
                    <ChartContainer config={{ sales: { label: "Revenue", color: "#ff9f43" } }} className="h-full w-full">
                      <BarChart data={dailyChartData}>
                        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                          dataKey="day"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `৳${value/1000}K`}
                          tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }}
                        />
                        <ChartTooltip
                          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                          content={<ChartTooltipContent className="bg-black border-white/10 rounded-none p-4 font-black uppercase" hideLabel />}
                        />
                        {/* Updated: Vibrant Orange for Revenue */}
                        <Bar dataKey="sales" fill="#ff9f43" radius={[2, 2, 0, 0]} barSize={60} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-white/5 rounded-none overflow-hidden shadow-2xl">
                <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-white">AI STRATEGIST</CardTitle>
                    <Sparkles className="h-3 w-3 text-white animate-pulse" />
                  </div>
                </CardHeader>
                <StyleAssistant />
              </Card>

              <Card className="bg-card border-white/5 rounded-none overflow-hidden shadow-2xl">
                <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-white">LIVE ACTIVITY</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {pendingOrders?.slice(0, 5).map((order, i) => (
                    <div key={i} className="p-3 bg-white/5 border border-white/5 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-white uppercase truncate">{order.customerName}</span>
                        <Badge className="bg-red-600 text-white text-[7px] font-black rounded-none border-none animate-pulse">NEW ORDER</Badge>
                      </div>
                      <p className="text-[8px] font-black text-orange-500 uppercase truncate">{order.productName}</p>
                      <span className="text-[7px] font-mono text-white/30 uppercase">{order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'RECENT'}</span>
                    </div>
                  ))}
                  {(!pendingOrders || pendingOrders.length === 0) && (
                    <div className="text-center py-10">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">NO RECENT ORDERS</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
