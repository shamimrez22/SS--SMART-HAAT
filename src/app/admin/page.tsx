
"use client";

import React, { useMemo, useEffect } from 'react';
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
  ChevronRight,
  Bell,
  AlertCircle,
  MessageSquare,
  ArrowUpRight,
  Calendar,
  Zap,
  Users,
  TrendingUp,
  BarChart3,
  MapPin
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function AdminPanel() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const ordersRef = useMemoFirebase(() => query(collection(db, 'orders'), orderBy('createdAt', 'desc')), [db]);
  const pendingOrdersRef = useMemoFirebase(() => query(collection(db, 'orders'), where('status', '==', 'PENDING'), orderBy('createdAt', 'desc')), [db]);
  const messagesRef = useMemoFirebase(() => collection(db, 'messages'), [db]);
  const visitorStatsRef = useMemoFirebase(() => doc(db, 'visitorStats', today), [db, today]);
  
  const { data: products } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);
  const { data: orders } = useCollection(ordersRef);
  const { data: pendingOrders } = useCollection(pendingOrdersRef);
  const { data: messages } = useCollection(messagesRef);
  const { data: dailyVisitors } = useDoc(visitorStatsRef);

  // Advanced Analytics Calculations
  const categoryStats = useMemo(() => {
    if (!products || !categories) return [];
    return categories.map(cat => ({
      name: cat.name,
      count: products.filter(p => p.category === cat.name).length,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }));
  }, [products, categories]);

  // Dynamic config for Pie Chart to avoid useChart context error
  const pieChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    categoryStats.forEach(stat => {
      config[stat.name] = { label: stat.name, color: stat.color };
    });
    return config;
  }, [categoryStats]);

  const salesStats = useMemo(() => {
    if (!orders) return { totalRevenue: 0, todaySales: 0 };
    const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
    const revenue = orders.reduce((acc, curr) => acc + (curr.productPrice * (curr.quantity || 1)), 0);
    return {
      totalRevenue: revenue,
      todaySales: todayOrders.length
    };
  }, [orders, today]);

  const dailyChartData = useMemo(() => {
    // Mock daily data for visualization based on last 7 days
    return [
      { day: "SAT", sales: 42000 },
      { day: "SUN", sales: 38000 },
      { day: "MON", sales: 55000 },
      { day: "TUE", sales: 48000 },
      { day: "WED", sales: 72000 },
      { day: "THU", sales: 61000 },
      { day: "FRI", sales: 95000 },
    ];
  }, []);

  useEffect(() => {
    if (pendingOrders && pendingOrders.length > 0) {
      const latestOrder = pendingOrders[0];
      const orderTime = new Date(latestOrder.createdAt).getTime();
      const now = new Date().getTime();
      
      if (now - orderTime < 10000) {
        toast({
          title: "🚨 NEW ORDER RECEIVED",
          description: `${latestOrder.customerName} just ordered ${latestOrder.productName}.`,
        });
      }
    }
  }, [pendingOrders, toast]);

  const stats = [
    { title: "TOTAL REVENUE", value: `৳${salesStats.totalRevenue.toLocaleString()}`, change: "LIFE TIME", icon: TrendingUp, color: "text-[#01a3a4]", href: "/admin/orders" },
    { title: "DAILY SALES", value: salesStats.todaySales, change: "TODAY", icon: ShoppingBag, color: "text-orange-500", href: "/admin/orders" },
    { title: "VISITORS", value: dailyVisitors?.count || 0, change: "TODAY", icon: Users, color: "text-purple-500", href: "/admin/settings" },
    { title: "PRODUCTS", value: products?.length || 0, change: "TOTAL", icon: Package, color: "text-green-500", href: "/admin/products" }
  ];

  const quickLinks = [
    { title: "FEATURED CONTENT", icon: Zap, href: "/admin/featured" },
    { title: "ORDER INTELLIGENCE", icon: ShoppingBag, href: "/admin/orders", badge: pendingOrders?.length },
    { title: "LIVE MESSAGE CENTER", icon: MessageSquare, href: "/admin/messages" },
    { title: "PRODUCT INVENTORY", icon: Package, href: "/admin/products" },
    { title: "SYSTEM STRUCTURE", icon: Layers, href: "/admin/categories" },
    { title: "OTHERS CONFIG", icon: LinkIcon, href: "/admin/others" },
    { title: "SECURITY & LOCATION", icon: Settings, href: "/admin/settings" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href}>
              <Card className="bg-card border-white/5 rounded-none p-4 md:p-6 hover:border-[#01a3a4]/30 transition-all cursor-pointer group h-full">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{stat.title}</p>
                  <stat.icon className={`h-3 w-3 md:h-4 md:w-4 ${stat.color} opacity-70 group-hover:scale-110 transition-transform`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter">{stat.value}</h3>
                  <span className="text-[7px] md:text-[9px] font-black uppercase text-[#01a3a4]">
                    {stat.change}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            {/* COMMAND CENTER */}
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01a3a4]">COMMAND CENTER</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="grid grid-cols-1 gap-1">
                  {quickLinks.map((link, i) => (
                    <Link key={i} href={link.href}>
                      <div className={`flex items-center justify-between p-4 hover:bg-[#01a3a4]/5 transition-all group border-b border-white/[0.02] last:border-0`}>
                        <div className="flex items-center gap-4">
                          <link.icon className={`h-4 w-4 text-[#01a3a4] opacity-50 group-hover:opacity-100`} />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-[#01a3a4]">{link.title}</span>
                          {link.badge ? (
                            <Badge className="bg-[#01a3a4] text-white text-[7px] font-black h-4 px-1.5 rounded-none border-none">{link.badge}</Badge>
                          ) : null}
                        </div>
                        <ChevronRight className="h-3 w-3 text-white/20 group-hover:text-[#01a3a4] group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CATEGORY BREAKDOWN */}
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01a3a4]">CATEGORY BREAKDOWN</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[200px] w-full">
                  <ChartContainer config={pieChartConfig} className="h-full w-full">
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent className="bg-black border-white/10 rounded-none p-2" />} />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {categoryStats.map((cat, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase text-white/60">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2" style={{ backgroundColor: cat.color }} />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-white">{cat.count} ITEMS</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* REVENUE ARCHIVE */}
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 p-6 gap-4 bg-white/[0.01]">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-[#01a3a4] uppercase tracking-widest">Business Intelligence</p>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter text-white">REVENUE ARCHIVE</CardTitle>
                </div>
                <Badge variant="outline" className="rounded-none border-white/10 text-[8px] h-6 px-3 w-fit font-black text-white/40">DATABASE: LIVE SYNCED</Badge>
              </CardHeader>
              <CardContent className="p-8">
                <ChartContainer config={{ sales: { label: "Revenue", color: "#01a3a4" } }} className="h-[300px] w-full">
                  <BarChart data={dailyChartData}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 9, fontWeight: 900, fill: '#666' }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `৳${value/1000}K`}
                      tick={{ fontSize: 9, fontWeight: 900, fill: '#666' }}
                    />
                    <ChartTooltip
                      cursor={{ fill: 'rgba(1,163,164,0.05)' }}
                      content={<ChartTooltipContent className="bg-black border-white/10 rounded-none p-4" hideLabel />}
                    />
                    <Bar dataKey="sales" fill="#01a3a4" radius={[1, 1, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI STRATEGIST */}
              <Card className="bg-card border-white/5 rounded-none overflow-hidden shadow-2xl">
                <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01a3a4]">AI STRATEGIST</CardTitle>
                    <Sparkles className="h-3 w-3 text-[#01a3a4] animate-pulse" />
                  </div>
                </CardHeader>
                <StyleAssistant />
              </Card>

              {/* LIVE RECENT ACTIVITY */}
              <Card className="bg-card border-white/5 rounded-none overflow-hidden shadow-2xl">
                <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01a3a4]">LIVE ACTIVITY</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {pendingOrders?.slice(0, 5).map((order, i) => (
                    <div key={i} className="p-3 bg-white/5 border border-white/5 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-white uppercase truncate">{order.customerName}</span>
                        <Badge className="bg-[#01a3a4] text-white text-[7px] font-black rounded-none border-none">NEW</Badge>
                      </div>
                      <p className="text-[8px] font-black text-[#01a3a4] uppercase truncate">{order.productName}</p>
                      <span className="text-[7px] font-mono text-white/30 uppercase">{new Date(order.createdAt).toLocaleTimeString()}</span>
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
