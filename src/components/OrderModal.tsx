
"use client";

import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Phone, 
  MapPin, 
  User, 
  Ruler, 
  PartyPopper,
  Hash,
  X,
  Truck,
  MessageCircle
} from 'lucide-react';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrderModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal = memo(({ product, isOpen, onClose }: OrderModalProps) => {
  const db = useFirestore();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: '',
    quantity: 1
  });

  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'site-config');
  }, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (step === 'SUCCESS') {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  useEffect(() => {
    if (product?.sizes?.length > 0 && !formData.selectedSize) {
      setFormData(prev => ({ ...prev, selectedSize: product.sizes[0] }));
    }
    if (!isOpen) {
      setTimeout(() => {
        setStep('FORM');
        setFormData({ name: '', phone: '', address: '', selectedSize: '', quantity: 1 });
      }, 300);
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    const orderData = {
      customerName: formData.name.toUpperCase(),
      customerPhone: formData.phone,
      customerAddress: formData.address.toUpperCase(),
      selectedSize: formData.selectedSize || 'N/A',
      quantity: formData.quantity,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImageUrl: product.imageUrl,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db!, 'orders'), orderData);
    setStep('SUCCESS');
  };

  const handleWhatsAppChat = () => {
    const phone = settings?.whatsappUrl || settings?.phone || '+8801700000000';
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const message = `Hello SS SMART HAAT, I want to inquire about: ${product.name} (Price: ৳${product.price})`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className={cn(
        "p-0 bg-white border-none rounded-none overflow-hidden gap-0 shadow-2xl transition-all duration-300 fixed z-[150] outline-none",
        "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        step === 'SUCCESS' ? "max-w-[350px] w-[90vw]" : isMobile ? "w-full h-full" : "max-w-[850px] w-[95vw]"
      )}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-[200] p-1.5 bg-black text-white hover:bg-[#01a3a4] transition-all border border-white/10 shadow-2xl"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col h-full max-h-[95vh] relative no-scrollbar">
          {step === 'FORM' ? (
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              
              {!isMobile && (
                <div className="md:w-[320px] bg-gray-50 border-r border-gray-100 p-8 flex flex-col shrink-0 overflow-y-auto no-scrollbar">
                  <div className="relative w-full aspect-square border-4 border-white mb-6 bg-white shadow-xl overflow-hidden group">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      priority 
                    />
                  </div>
                  <div className="w-full space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-black uppercase tracking-tighter leading-tight font-headline">{product.name}</h3>
                      <div className="text-[#01a3a4] font-black text-3xl flex items-baseline">
                        <span className="text-[14px] font-normal mr-1 translate-y-[-5px] text-gray-400">৳</span>
                        {product.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-white border border-gray-100 shadow-sm space-y-3">
                       <div className="flex items-center gap-2 text-[#01a3a4] mb-1">
                         <Truck className="h-5 w-5" />
                         <span className="text-[10px] font-black uppercase tracking-widest">ডেলিভারি চার্জ</span>
                       </div>
                       <p className="text-[12px] font-black text-black uppercase">ঢাকার ভিতরে: <span className="text-[#01a3a4]">৳{settings?.deliveryChargeInside || '60'}</span></p>
                       <p className="text-[12px] font-black text-black uppercase">ঢাকার বাহিরে: <span className="text-[#01a3a4]">৳{settings?.deliveryChargeOutside || '120'}</span></p>
                    </div>
                  </div>
                </div>
              )}

              <div className={cn(
                "flex-grow p-6 md:p-12 pt-20 md:pt-16 space-y-8 md:space-y-10 bg-white overflow-y-auto relative no-scrollbar",
                !isMobile && "md:w-[450px]"
              )}>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="h-10 md:h-12 w-2 md:w-2.5 bg-[#01a3a4]" />
                    <DialogTitle className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter leading-none font-headline">ORDER NOW</DialogTitle>
                  </div>
                  <DialogDescription className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-6">PREMIUM SECURE CHECKOUT</DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pt-2">
                  <div className="grid grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3"><Ruler className="h-5 w-5 text-[#01a3a4]" /> SIZE</label>
                      <div className="flex flex-wrap gap-2">
                        {product?.sizes?.length > 0 ? product.sizes.map((size: string) => (
                          <button key={size} type="button" onClick={() => setFormData({...formData, selectedSize: size})} className={cn("px-4 py-2 border-2 text-[11px] font-black uppercase transition-all min-w-[55px]", formData.selectedSize === size ? 'bg-[#01a3a4] border-[#01a3a4] text-white' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-[#01a3a4]')}>{size}</button>
                        )) : <span className="text-[10px] font-black text-gray-400 uppercase italic">Standard</span>}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3"><Hash className="h-5 w-5 text-[#01a3a4]" /> QTY</label>
                      <input type="number" min="1" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-none h-12 px-4 text-[16px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] text-black" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3"><User className="h-5 w-5 text-[#01a3a4]" /> FULL NAME</label>
                      <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="ENTER YOUR NAME" className="w-full bg-gray-50 border-2 border-gray-100 rounded-none h-14 px-6 text-[14px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] text-black" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3"><Phone className="h-5 w-5 text-[#01a3a4]" /> PHONE NUMBER</label>
                      <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="01XXXXXXXXX" className="w-full bg-gray-50 border-2 border-gray-100 rounded-none h-14 px-6 text-[14px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] text-black" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3"><MapPin className="h-5 w-5 text-[#01a3a4]" /> ADDRESS</label>
                      <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="HOUSE, ROAD, AREA, CITY" className="w-full bg-gray-50 border-2 border-gray-100 rounded-none p-6 text-[14px] font-black uppercase tracking-widest min-h-[100px] focus:outline-none focus:border-[#01a3a4] text-black shadow-sm no-scrollbar" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button type="submit" className="w-full bg-[#01a3a4] hover:bg-black text-white h-16 md:h-20 font-black uppercase tracking-[0.5em] rounded-none shadow-xl text-[16px] md:text-[18px] border-none transition-all active:scale-95">অর্ডার নিশ্চিত করুন</Button>
                    <button 
                      type="button"
                      onClick={handleWhatsAppChat}
                      className="w-full flex items-center justify-center gap-3 h-12 bg-white border-2 border-green-500 text-green-600 font-black text-[11px] uppercase tracking-widest hover:bg-green-50 transition-all"
                    >
                      <MessageCircle className="h-4 w-4" /> CHAT WITH ADMIN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="w-full p-12 text-center space-y-8 flex flex-col justify-center bg-white items-center min-h-[500px]">
              <div className="relative">
                <div className="w-24 h-24 bg-[#01a3a4]/5 rounded-full flex items-center justify-center mx-auto border-[6px] border-[#01a3a4] shadow-xl animate-in zoom-in-50 duration-700"><CheckCircle2 className="h-12 w-12 text-[#01a3a4]" /></div>
                <PartyPopper className="absolute -top-6 -right-8 h-12 w-12 text-[#01a3a4] animate-bounce" />
              </div>
              <div className="space-y-6">
                <DialogTitle className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none font-headline animate-in slide-in-from-bottom-2 duration-1000">THANK YOU</DialogTitle>
                <div className="h-1.5 w-24 bg-[#01a3a4] mx-auto rounded-full" />
                <p className="text-[14px] md:text-[16px] font-black text-[#01a3a4] uppercase tracking-[0.5em]">অর্ডার সফল হয়েছে</p>
                <div className="py-2 px-8"><p className="text-[16px] md:text-[18px] font-bold text-black font-headline leading-relaxed">যত দ্রুত সম্ভব আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবে</p></div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

OrderModal.displayName = 'OrderModal';
