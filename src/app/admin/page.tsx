
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
  LogIn,
  AlertCircle,
  MessageSquare,
  ArrowUpRight,
  Calendar,
  Zap,
  LayoutDashboard
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const ordersRef = useMemoFirebase(() => query(collection(db, 'orders'), orderBy('createdAt', 'desc')), [db]);
  const pendingOrdersRef = useMemoFirebase(() => query(collection(db, 'orders'), where('status', '==', 'PENDING'), orderBy('createdAt', 'desc')), [db]);
  const messagesRef = useMemoFirebase(() => collection(db, 'messages'), [db]);
  const loginStatsRef = useMemoFirebase(() => doc(db, 'loginStats', today), [db, today]);
  
  const { data: products } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);
  const { data: orders } = useCollection(ordersRef);
  const { data: pendingOrders } = useCollection(pendingOrdersRef);
  const { data: messages } = useCollection(messagesRef);
  const { data: dailyStats } = useDoc(loginStatsRef);

  useEffect(() => {
    if (pendingOrders && pendingOrders.length > 0) {
      const latestOrder = pendingOrders[0];
      const orderTime = new Date(latestOrder.createdAt).getTime();
      const now = new Date().getTime();
      
      if (now - orderTime < 10000) {
        toast({
          title: "🚨 NEW ORDER RECEIVED",
          description: `${latestOrder.customerName} just ordered ${latestOrder.productName}. Check intelligence panel.`,
        });
      }
    }
  }, [pendingOrders, toast]);

  const stats = [
    { title: "ORDERS", value: orders?.length || 0, change: pendingOrders?.length ? `${pendingOrders.length} PENDING` : "UP TO DATE", icon: ShoppingBag, color: "text-[#01a3a4]", href: "/admin/orders" },
    { title: "MESSAGES", value: messages?.length || 0, change: "LIVE CHAT", icon: MessageSquare, color: "text-orange-500", href: "/admin/messages" },
    { title: "DAILY LOGINS", value: dailyStats?.count || 0, change: "TODAY", icon: LogIn, color: "text-purple-500", href: "/admin/settings" },
    { title: "CATEGORIES", value: categories?.length || 0, change: "SYNCED", icon: Layers, color: "text-green-500", href: "/admin/categories" }
  ];

  const quickLinks = [
    { title: "FEATURED CONTENT", icon: Zap, href: "/admin/featured" },
    { title: "ORDER INTELLIGENCE", icon: ShoppingBag, href: "/admin/orders", badge: pendingOrders?.length },
    { title: "LIVE MESSAGE CENTER", icon: MessageSquare, href: "/admin/messages" },
    { title: "PRODUCT INVENTORY", icon: Package, href: "/admin/products" },
    { title: "SYSTEM STRUCTURE", icon: Layers, href: "/admin/categories" },
    { title: "OTHERS CONFIG", icon: LinkIcon, href: "/admin/others" },
    { title: "SECURITY SETTINGS", icon: Settings, href: "/admin/settings" }
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
                  <h3 className="text-xl md:text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
                  <span className={`text-[7px] md:text-[9px] font-black uppercase ${stat.change.includes('PENDING') ? 'text-[#01a3a4] animate-pulse' : 'text-green-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {pendingOrders && pendingOrders.length > 0 && (
          <div className="mb-6 p-4 bg-[#01a3a4]/10 border border-[#01a3a4]/30 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#01a3a4]" />
              <p className="text-[10px] font-black text-white uppercase tracking-widest">
                SYSTEM ALERT: {pendingOrders.length} PENDING ORDERS REQUIRE IMMEDIATE ACTION
              </p>
            </div>
            <Link href="/admin/orders" className="text-[9px] font-black text-[#01a3a4] underline uppercase flex items-center gap-1">
              VIEW ALL <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01a3a4]">COMMAND CENTER</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="grid grid-cols-1 gap-1">
                  {quickLinks.map((link, i) => (
                    <Link key={i} href={link.href}>
                      <div className={`flex items-center justify-between p-4 hover:bg-[#01a3a4]/5 transition-all group border-b border-white/[0.02] last:border-0 ${link.title === 'FEATURED CONTENT' ? 'bg-[#01a3a4]/5 border-l-2 border-l-[#01a3a4]' : ''}`}>
                        <div className="flex items-center gap-4">
                          <link.icon className={`h-4 w-4 ${link.title === 'FEATURED CONTENT' ? 'text-white' : 'text-[#01a3a4]'} opacity-50 group-hover:opacity-100`} />
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

            <Card className="bg-card border-white/5 rounded-none overflow-hidden shadow-2xl">
              <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01a3a4]">AI STRATEGIST</CardTitle>
                  <Sparkles className="h-3 w-3 text-[#01a3a4] animate-pulse" />
                </div>
              </CardHeader>
              <div className="scale-100 origin-top">
                <StyleAssistant />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="bg-card border-white/5 rounded-none h-full shadow-2xl">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 p-6 gap-4 bg-white/[0.01]">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-[#01a3a4] uppercase tracking-widest">Business Intelligence</p>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter text-white">REVENUE ARCHIVE</CardTitle>
                </div>
                <Badge variant="outline" className="rounded-none border-white/10 text-[8px] h-6 px-3 w-fit font-black text-white/40">DATABASE: LIVE SYNCED</Badge>
              </CardHeader>
              <CardContent className="p-8">
                <ChartContainer config={chartConfig} className="h-[300px] md:h-[450px] w-full">
                  <BarChart data={chartData}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
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
                    <Bar
                      dataKey="sales"
                      fill="#01a3a4"
                      radius={[1, 1, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-4 w-1 bg-[#01a3a4]" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white">SYSTEM ACTIVITY LOGS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pendingOrders?.slice(0, 4).map((order, i) => (
              <div key={i} className="bg-card border border-[#01a3a4]/10 p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-[#01a3a4]/40 transition-all shadow-xl">
                <div className="absolute top-0 right-0 p-1.5 bg-[#01a3a4]">
                  <Bell className="h-2.5 w-2.5 text-white animate-bounce" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-2.5 w-2.5 text-white/20" />
                    <span className="text-[8px] font-mono text-white/30">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <Badge className="rounded-none bg-[#01a3a4] text-white text-[7px] border-none font-black h-4 px-1.5">NEW ORDER</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-white uppercase tracking-tight line-clamp-1">{order.customerName}</p>
                  <p className="text-[9px] font-black text-[#01a3a4] uppercase tracking-widest truncate">{order.productName}</p>
                </div>
              </div>
            )) || (
              <div className="col-span-full py-16 text-center border border-dashed border-white/5 bg-white/[0.01]">
                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Waiting for incoming data packets...</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
