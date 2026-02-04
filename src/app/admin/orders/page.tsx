
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Loader2, 
  Phone, 
  MapPin, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Truck,
  FileText,
  DollarSign,
  AlertTriangle,
  Calendar,
  Ruler,
  Hash
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Badge } from '@/components/ui/badge';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export default function AdminOrders() {
  const db = useFirestore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [alertConfig, setAlertConfig] = useState<{title: string, desc: string, action: () => void} | null>(null);

  const ordersRef = useMemoFirebase(() => query(collection(db, 'orders'), orderBy('createdAt', 'desc')), [db]);
  const { data: orders, isLoading } = useCollection(ordersRef);

  const handleOpenConfirm = (order: any) => {
    setSelectedOrder(order);
    setDeliveryCharge('');
    setIsConfirmOpen(true);
  };

  const handleFinalizeConfirmation = () => {
    if (!selectedOrder || !deliveryCharge) return;
    
    updateDocumentNonBlocking(doc(db, 'orders', selectedOrder.id), { 
      status: 'CONFIRMED',
      deliveryCharge: parseFloat(deliveryCharge)
    });
    
    setIsConfirmOpen(false);
    setSelectedOrder(null);
  };

  const triggerAlert = (title: string, desc: string, action: () => void) => {
    setAlertConfig({ title, desc, action });
    setIsAlertOpen(true);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (newStatus === 'CANCELLED') {
      triggerAlert(
        "ARE YOU SURE YOU WANT TO CANCEL THIS ORDER?",
        "THIS ACTION CANNOT BE UNDONE. THE CLIENT WILL BE NOTIFIED OF THE CANCELLATION.",
        () => updateDocumentNonBlocking(doc(db, 'orders', id), { status: 'CANCELLED' })
      );
    } else {
      updateDocumentNonBlocking(doc(db, 'orders', id), { status: newStatus });
    }
  };

  const handleDeleteOrder = (id: string) => {
    triggerAlert(
      "PERMANENTLY DELETE THIS ORDER RECORD?",
      "THIS WILL REMOVE ALL DATA ASSOCIATED WITH THIS ORDER FROM THE PERMANENT DATABASE.",
      () => deleteDocumentNonBlocking(doc(db, 'orders', id))
    );
  };

  const generateInvoice = (order: any) => {
    const doc = new jsPDF();
    const dCharge = order.deliveryCharge || 0;
    const subtotal = order.productPrice * (order.quantity || 1);
    const total = subtotal + dCharge;
    const primaryColor = [1, 163, 164]; // #01a3a4
    
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("SS SMART HAAT", 15, 25);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("PREMIUM MARKETPLACE | DHAKA, BANGLADESH", 15, 31);
    
    doc.setDrawColor(240, 240, 240);
    doc.line(15, 38, 195, 38);

    doc.setFontSize(16);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 15, 50);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE NO:", 140, 47);
    doc.setFont("helvetica", "normal");
    doc.text(`#${order.id.slice(0, 10).toUpperCase()}`, 165, 47);
    
    doc.setFont("helvetica", "bold");
    doc.text("DATE:", 140, 53);
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date(order.createdAt).toLocaleDateString()}`, 165, 53);

    doc.setFillColor(250, 250, 250);
    doc.rect(15, 65, 180, 45, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 20, 75);
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "bold");
    doc.text("NAME:", 20, 83);
    doc.setFont("helvetica", "normal");
    doc.text(order.customerName.toUpperCase(), 45, 83);
    
    doc.setFont("helvetica", "bold");
    doc.text("PHONE:", 20, 89);
    doc.setFont("helvetica", "normal");
    doc.text(order.customerPhone, 45, 89);
    
    doc.setFont("helvetica", "bold");
    doc.text("ADDRESS:", 20, 95);
    doc.setFont("helvetica", "normal");
    const splitAddress = doc.splitTextToSize(order.customerAddress.toUpperCase(), 130);
    doc.text(splitAddress, 45, 95);

    const itemDesc = order.selectedSize ? `${order.productName.toUpperCase()} (SIZE: ${order.selectedSize})` : order.productName.toUpperCase();

    autoTable(doc, {
      startY: 120,
      head: [['ITEM DESCRIPTION', 'UNIT PRICE', 'QTY', 'TOTAL']],
      body: [
        [
          { content: itemDesc, styles: { fontStyle: 'bold' } }, 
          `BDT ${order.productPrice.toLocaleString()}`, 
          (order.quantity || 1).toString().padStart(2, '0'), 
          `BDT ${subtotal.toLocaleString()}`
        ]
      ],
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: primaryColor, 
        fontSize: 9, 
        fontStyle: 'bold',
        lineWidth: 0.1,
        lineColor: [240, 240, 240]
      },
      styles: { 
        fontSize: 9, 
        cellPadding: 6, 
        textColor: [60, 60, 60],
        valign: 'middle',
        lineWidth: 0,
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'right' }
      },
      alternateRowStyles: { fillColor: [252, 252, 252] },
      margin: { left: 15, right: 15 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("SUBTOTAL", 140, finalY);
    doc.text(`BDT ${subtotal.toLocaleString()}`, 195, finalY, { align: 'right' });
    
    doc.text("DELIVERY CHARGE", 140, finalY + 7);
    doc.text(`+ BDT ${dCharge.toLocaleString()}`, 195, finalY + 7, { align: 'right' });
    
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(140, finalY + 11, 195, finalY + 11);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("GRAND TOTAL", 140, finalY + 20);
    doc.text(`BDT ${total.toLocaleString()}`, 195, finalY + 20, { align: 'right' });

    doc.setFillColor(240, 240, 240);
    doc.rect(15, finalY + 12, 40, 10, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("PAYMENT METHOD:", 15, finalY + 10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("CASH ON DELIVERY", 20, finalY + 18.5);

    doc.setDrawColor(240, 240, 240);
    doc.line(15, 275, 195, 275);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text("THANK YOU FOR CHOOSING SS SMART HAAT. YOUR SATISFACTION IS OUR PRIORITY.", 15, 282);
    doc.text("GENERATED BY SS SMART HAAT ENTERPRISE SYSTEM", 135, 282);

    doc.save(`INVOICE_${order.customerName.replace(/\s+/g, '_')}_${order.id.slice(0, 5)}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12">
              <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
            </Button>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">Business Operations</p>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white">ORDER INTELLIGENCE</h1>
            </div>
          </div>
          <Badge className="bg-white/5 border-white/10 text-white font-black text-[12px] uppercase rounded-none px-6 py-3 h-14">
            {orders?.length || 0} RECORDS IN SYSTEM
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
            <p className="text-[10px] font-black uppercase text-[#01a3a4] animate-pulse tracking-[0.3em]">Syncing Order Records...</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-white/10 bg-white/[0.02]">
            <ShoppingBag className="h-16 w-16 text-white/5 mx-auto mb-6" />
            <p className="text-sm font-black uppercase text-muted-foreground tracking-[0.5em]">No orders archived in system.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-[#01a3a4] mb-4">
              <div className="col-span-2">Customer</div>
              <div className="col-span-2">Contact & Address</div>
              <div className="col-span-3">Product Info & Qty</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-4 text-right">Actions</div>
            </div>

            {orders.map((order) => (
              <div key={order.id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-6 bg-card border border-white/5 hover:border-[#01a3a4]/30 transition-all group items-center">
                <div className="col-span-2 space-y-1">
                  <p className="text-[9px] font-black text-[#01a3a4] uppercase tracking-widest">Client Name</p>
                  <p className="text-[14px] font-black text-white uppercase truncate">{order.customerName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Calendar className="h-2.5 w-2.5 text-white/30" />
                    <span className="text-[8px] font-mono text-white/40 uppercase">
                      {new Date(order.createdAt).toLocaleDateString()} @ {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 space-y-3">
                   <div className="flex items-center gap-2">
                     <Phone className="h-3 w-3 text-[#01a3a4]" />
                     <p className="text-[11px] font-mono text-white/70">{order.customerPhone}</p>
                   </div>
                   <div className="flex items-start gap-2">
                     <MapPin className="h-3 w-3 text-[#01a3a4] mt-0.5 shrink-0" />
                     <p className="text-[10px] text-white/60 uppercase leading-tight line-clamp-2">{order.customerAddress}</p>
                   </div>
                </div>

                <div className="col-span-3 space-y-2 border-l border-white/5 pl-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-tighter line-clamp-1">{order.productName}</h3>
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 border border-white/5">
                      <Hash className="h-3 w-3 text-[#01a3a4]" />
                      <span className="text-[10px] font-black text-white">{order.quantity || 1} PCS</span>
                    </div>
                    {order.selectedSize && (
                      <div className="flex items-center gap-1 bg-white/5 px-2 py-1 border border-white/5">
                        <Ruler className="h-3 w-3 text-[#01a3a4]" />
                        <span className="text-[10px] font-black text-white">{order.selectedSize}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-black text-white tracking-tighter">৳{(order.productPrice * (order.quantity || 1)).toLocaleString()}</p>
                    {order.deliveryCharge && (
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">+ ৳{order.deliveryCharge} DELIVERY</p>
                    )}
                  </div>
                </div>

                <div className="col-span-1 flex justify-center">
                  <Badge className={`rounded-none text-[8px] font-black uppercase px-2 py-1 ${
                    order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 
                    order.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' :
                    order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                    'bg-green-500/20 text-green-500 border-green-500/30'
                  } border`}>
                    {order.status}
                  </Badge>
                </div>

                <div className="col-span-4 flex flex-wrap justify-end gap-2">
                  {order.status === 'PENDING' && (
                    <Button 
                      onClick={() => handleOpenConfirm(order)}
                      className="bg-[#01a3a4] hover:bg-[#01a3a4]/90 text-white font-black text-[9px] uppercase rounded-none h-10 px-4"
                    >
                      <CheckCircle className="mr-2 h-3.5 w-3.5" /> CONFIRM
                    </Button>
                  )}
                  
                  {order.status === 'CONFIRMED' && (
                    <Button 
                      onClick={() => {
                        triggerAlert(
                          "MARK AS DELIVERED?",
                          "THIS ORDER WILL BE ARCHIVED AS COMPLETED. MAKE SURE THE CUSTOMER HAS RECEIVED THE PRODUCT.",
                          () => handleUpdateStatus(order.id, 'DELIVERED')
                        );
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-black text-[9px] uppercase rounded-none h-10 px-4"
                    >
                      <ShoppingBag className="mr-2 h-3.5 w-3.5" /> DELIVER
                    </Button>
                  )}

                  <Button 
                    variant="outline"
                    onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                    className="border-white/10 text-white hover:bg-red-600/10 hover:text-red-500 font-black text-[9px] uppercase rounded-none h-10 px-4"
                  >
                    <XCircle className="mr-2 h-3.5 w-3.5" /> CANCEL
                  </Button>

                  <Button 
                    variant="secondary"
                    onClick={() => generateInvoice(order)}
                    className="bg-white/5 hover:bg-white/10 text-white font-black text-[9px] uppercase rounded-none h-10 px-4 border border-white/10"
                  >
                    <FileText className="mr-2 h-3.5 w-3.5 text-[#01a3a4]" /> INVOICE
                  </Button>

                  <Button 
                    variant="ghost"
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-none h-10 w-10 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-black border-[#01a3a4]/30 rounded-none max-w-md p-8">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#01a3a4]/10 flex items-center justify-center border border-[#01a3a4]/20">
                <Truck className="h-6 w-6 text-[#01a3a4]" />
              </div>
              <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">ORDER CONFIRMATION</DialogTitle>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
              ENTER THE DELIVERY CHARGE TO FINALIZE THIS ORDER. THE CHARGE WILL BE ADDED TO THE TOTAL INVOICE.
            </p>
          </DialogHeader>

          <div className="py-8 space-y-6">
            <div className="p-4 bg-white/5 border border-white/5 space-y-2">
              <p className="text-[9px] font-black text-[#01a3a4] uppercase tracking-widest">Ordering Product</p>
              <p className="text-sm font-black text-white uppercase">{selectedOrder?.productName}</p>
              <div className="flex items-center gap-4">
                <p className="text-xl font-black text-white">৳{(selectedOrder?.productPrice * (selectedOrder?.quantity || 1)).toLocaleString()}</p>
                <Badge className="bg-white/10 text-white text-[9px] font-black rounded-none border-none uppercase px-2">{selectedOrder?.quantity || 1} PCS</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                <DollarSign className="h-3 w-3" /> DELIVERY CHARGE (BDT)
              </label>
              <Input 
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                placeholder="E.G. 60 OR 120"
                className="bg-white/5 border-white/20 rounded-none h-14 text-lg font-black text-white focus:ring-[#01a3a4]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="flex-1 rounded-none uppercase text-[10px] font-black border-white/10 hover:bg-white/5 h-14"
            >
              CANCEL
            </Button>
            <Button 
              disabled={!deliveryCharge}
              onClick={handleFinalizeConfirmation}
              className="flex-1 bg-[#01a3a4] hover:bg-[#01a3a4]/90 text-white font-black uppercase text-[10px] rounded-none h-14 shadow-xl shadow-[#01a3a4]/10"
            >
              FINALIZE CONFIRMATION
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black border-[#01a3a4]/30 rounded-none p-8 max-w-md">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-600/10 flex items-center justify-center border border-red-600/20">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">
                {alertConfig?.title}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
              {alertConfig?.desc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-2 sm:gap-0">
            <AlertDialogCancel className="flex-1 rounded-none border-white/10 text-white font-black uppercase text-[10px] h-12 hover:bg-white/5">
              BACK TO PANEL
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => alertConfig?.action()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] rounded-none h-12 shadow-xl shadow-red-600/10"
            >
              CONFIRM ACTION
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
}
