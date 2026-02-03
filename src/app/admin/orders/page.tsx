
"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag, Loader2, Phone, MapPin, Calendar, User, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Badge } from '@/components/ui/badge';

export default function AdminOrders() {
  const db = useFirestore();
  const ordersRef = useMemoFirebase(() => query(collection(db, 'orders'), orderBy('createdAt', 'desc')), [db]);
  const { data: orders, isLoading } = useCollection(ordersRef);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateDocumentNonBlocking(doc(db, 'orders', id), { status: newStatus });
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm("ARE YOU SURE YOU WANT TO DELETE THIS ORDER?")) {
      deleteDocumentNonBlocking(doc(db, 'orders', id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2">
              <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">MANAGE ORDERS</h1>
          </div>
          <Badge className="bg-orange-600 text-white font-black text-[10px] uppercase rounded-none px-4 py-1.5">
            {orders?.length || 0} TOTAL ORDERS
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 bg-white/[0.02]">
            <ShoppingBag className="h-10 w-10 text-white/10 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No orders found in system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-card border-white/5 rounded-none overflow-hidden hover:border-orange-600/30 transition-all">
                <div className="flex flex-col lg:flex-row">
                  <div className="p-6 lg:w-1/3 bg-white/[0.02] border-b lg:border-b-0 lg:border-r border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`rounded-none text-[8px] font-black uppercase ${
                        order.status === 'PENDING' ? 'border-yellow-500 text-yellow-500' : 
                        order.status === 'CONFIRMED' ? 'border-blue-500 text-blue-500' :
                        'border-green-500 text-green-500'
                      }`}>
                        {order.status}
                      </Badge>
                      <span className="text-[8px] font-mono text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-orange-600 uppercase">Product Ordered</p>
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter">{order.productName}</h3>
                      <p className="text-sm font-black text-white">৳{order.productPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="p-6 lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase">Customer</p>
                          <p className="text-[12px] font-black text-white uppercase">{order.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase">Phone</p>
                          <p className="text-[12px] font-black text-white uppercase">{order.customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase">Address</p>
                          <p className="text-[12px] font-black text-white uppercase leading-tight">{order.customerAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button 
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] uppercase rounded-none h-9"
                      >
                        CONFIRM
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                        className="bg-green-600 hover:bg-green-700 text-white font-black text-[9px] uppercase rounded-none h-9"
                      >
                        DELIVERED
                      </Button>
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="h-9 w-9 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-none"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
