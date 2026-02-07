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
  Truck
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

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className={cn(
        "p-0 bg-white border-none rounded-none overflow-hidden gap-0 shadow-2xl transition-all duration-300 fixed z-[150] outline-none",
        "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        step === 'SUCCESS' ? "max-w-[350px] w-[90vw]" : isMobile ? "w-full h-full" : "max-w-[1300px] w-[95vw]"
      )}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-[200] p-2 bg-black text-white hover:bg-[#01a3a4] transition-all border border-white/10 shadow-2xl"
        >
          <X className="h-8 w-8" />
        </button>

        <div className="flex flex-col h-full max-h-[95vh] relative no-scrollbar">
          {step === 'FORM' ? (
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              
              {!isMobile && (
                <div className="md:w-[480px] bg-gray-100 border-r border-gray-200 p-12 flex flex-col shrink-0 overflow-y-auto no-scrollbar">
                  <div className="relative w-full aspect-square border-8 border-white mb-10 bg-white shadow-2xl overflow-hidden group">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-[3000ms] group-hover:scale-110" 
                      priority 
                    />
                  </div>
                  <div className="w-full space-y-8">
                    <div className="space-y-3">
                      <h3 className="text-3xl font-black text-black uppercase tracking-tighter leading-tight font-headline">{product.name}</h3>
                      <div className="text-[#01a3a4] font-black text-5xl flex items-baseline">
                        <span className="text-[18px] font-normal mr-1 translate-y-[-10px] text-gray-400">৳</span>
                        {product.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-8 bg-white border border-gray-200 shadow-xl space-y-5">
                       <div className="flex items-center gap-3 text-[#01a3a4] mb-1">
                         <Truck className="h-7 w-7" />
                         <span className="text-[12px] font-black uppercase tracking-[0.3em]">ডেলিভারি চার্জ</span>
                       </div>
                       <p className="text-[14px] font-black text-black uppercase">ঢাকার ভিতরে: <span className="text-[#01a3a4]">৳{settings?.deliveryChargeInside || '60'}</span></p>
                       <p className="text-[14px] font-black text-black uppercase">ঢাকার বাহিরে: <span className="text-[#01a3a4]">৳{settings?.deliveryChargeOutside || '120'}</span></p>
                    </div>
                  </div>
                </div>
              )}

              <div className={cn(
                "flex-grow p-8 md:p-20 pt-28 md:pt-32 space-y-10 md:space-y-14 bg-white overflow-y-auto relative no-scrollbar",
                !isMobile && "md:w-[450px]"
              )}>
                <div className="space-y-4">
                  <div className="flex items-center gap-5">
                    <div className="h-12 md:h-16 w-3 md:w-4 bg-[#01a3a4]" />
                    <DialogTitle className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none font-headline">ORDER CONFIRM</DialogTitle>
                  </div>
                  <DialogDescription className="text-[12px] md:text-[14px] font-black text-gray-400 uppercase tracking-[0.4em] pl-8">SECURE PURCHASE ARCHIVE</DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12 pt-6">
                  <div className="grid grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-4">
                      <label className="text-[12px] md:text-[13px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-4"><Ruler className="h-6 w-6 text-[#01a3a4]" /> SELECT SIZE</label>
                      <div className="flex flex-wrap gap-3">
                        {product?.sizes?.length > 0 ? product.sizes.map((size: string) => (
                          <button key={size} type="button" onClick={() => setFormData({...formData, selectedSize: size})} className={cn("px-6 py-3 border-2 text-[13px] font-black uppercase transition-all min-w-[70px]", formData.selectedSize === size ? 'bg-[#01a3a4] border-[#01a3a4] text-white shadow-2xl' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-[#01a3a4]')}>{size}</button>
                        )) : <span className="text-[12px] font-black text-gray-400 uppercase italic">Standard Size</span>}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[12px] md:text-[13px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-4"><Hash className="h-6 w-6 text-[#01a3a4]" /> QUANTITY</label>
                      <input type="number" min="1" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} className="w-full bg-gray-50 border-2 border-gray-200 rounded-none h-16 px-6 text-[18px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] text-black" />
                    </div>
                  </div>

                  <div className="space-y-8 md:space-y-10">
                    <div className="space-y-4">
                      <label className="text-[12px] md:text-[13px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-4"><User className="h-6 w-6 text-[#01a3a4]" /> FULL NAME</label>
                      <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="ENTER YOUR NAME" className="w-full bg-gray-50 border-2 border-gray-200 rounded-none h-20 px-8 text-[16px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] text-black shadow-lg" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[12px] md:text-[13px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-4"><Phone className="h-6 w-6 text-[#01a3a4]" /> PHONE NUMBER</label>
                      <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="01XXXXXXXXX" className="w-full bg-gray-50 border-2 border-gray-200 rounded-none h-20 px-8 text-[16px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] text-black shadow-lg" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[12px] md:text-[13px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-4"><MapPin className="h-6 w-6 text-[#01a3a4]" /> DELIVERY ADDRESS</label>
                      <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="HOUSE, ROAD, AREA, CITY" className="w-full bg-gray-50 border-2 border-gray-200 rounded-none p-8 text-[16px] font-black uppercase tracking-widest min-h-[150px] focus:outline-none focus:border-[#01a3a4] text-black shadow-lg no-scrollbar" />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-[#01a3a4] hover:bg-black text-white h-24 md:h-28 font-black uppercase tracking-[0.8em] rounded-none shadow-2xl text-[20px] md:text-[22px] border-none transition-all active:scale-95 mt-10">অর্ডার নিশ্চিত করুন</Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="w-full p-20 text-center space-y-12 flex flex-col justify-center bg-white items-center min-h-[600px]">
              <div className="relative">
                <div className="w-32 h-32 bg-[#01a3a4]/5 rounded-full flex items-center justify-center mx-auto mb-10 border-[8px] border-[#01a3a4] shadow-2xl animate-in zoom-in-50 duration-700"><CheckCircle2 className="h-16 w-16 text-[#01a3a4]" /></div>
                <PartyPopper className="absolute -top-8 -right-10 h-16 w-16 text-[#01a3a4] animate-bounce" />
              </div>
              <div className="space-y-10">
                <DialogTitle className="text-5xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none font-headline animate-in slide-in-from-bottom-2 duration-1000">THANK YOU</DialogTitle>
                <div className="h-2 w-32 bg-[#01a3a4] mx-auto rounded-full" />
                <p className="text-[18px] md:text-[22px] font-black text-[#01a3a4] uppercase tracking-[0.8em]">অর্ডার সফল হয়েছে</p>
                <div className="py-4 px-12"><p className="text-[20px] md:text-[24px] font-bold text-black font-headline leading-relaxed">যত দ্রুত সম্ভব আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবে</p></div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

OrderModal.displayName = 'OrderModal';