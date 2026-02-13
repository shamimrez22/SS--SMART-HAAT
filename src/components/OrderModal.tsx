"use client";

import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
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
  MessageCircle,
  Loader2
} from 'lucide-react';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { createOrderAndNotify } from '@/app/actions/order-actions';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: '',
    quantity: 1
  });

  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (step === 'SUCCESS') {
      const timer = setTimeout(() => onClose(), 5000);
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
        setIsSubmitting(false);
      }, 300);
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || isSubmitting) return;

    setIsSubmitting(true);

    const orderData = {
      customerName: formData.name.toUpperCase(),
      customerPhone: formData.phone,
      customerAddress: formData.address.toUpperCase(),
      selectedSize: formData.selectedSize || 'N/A',
      quantity: formData.quantity,
      productId: product.id || 'N/A',
      productName: product.name || product.title || 'UNKNOWN PRODUCT',
      productPrice: product.price || 0,
      productImageUrl: product.imageUrl || '',
      status: 'PENDING'
    };

    try {
      const result = await createOrderAndNotify(orderData);
      if (result.success) {
        setStep('SUCCESS');
      } else {
        alert("FAILED TO PLACE ORDER. PLEASE TRY AGAIN.");
      }
    } catch (err) {
      alert("SYSTEM ERROR. PLEASE TRY AGAIN.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppChat = () => {
    if (!product) return;
    const rawNumber = settings?.whatsappUrl || settings?.phone || '01700000000';
    let cleanPhone = rawNumber.replace(/[^0-9]/g, "");
    
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      cleanPhone = '88' + cleanPhone;
    }
    
    const pName = product.name || product.title || 'Product';
    const pPrice = product.price || 0;
    const message = `Hello SS SMART HAAT, I want to inquire about: ${pName} (Price: ৳${pPrice})`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && !isSubmitting && onClose()}>
      <DialogContent className={cn(
        "p-0 bg-white border-none rounded-none overflow-hidden gap-0 shadow-2xl fixed z-[150] outline-none",
        "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        step === 'SUCCESS' ? "max-w-[400px] w-[90vw]" : isMobile ? "w-full h-[100dvh]" : "max-w-[750px] w-[95vw] max-h-[90vh]"
      )}>
        {!isSubmitting && (
          <button 
            onClick={onClose}
            className="absolute right-3 top-3 z-[200] p-1.5 bg-black text-white hover:bg-primary transition-all border border-white/10 shadow-xl"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex flex-col h-full overflow-hidden">
          {step === 'FORM' ? (
            <div className="flex flex-col md:flex-row h-full">
              {!isMobile && (
                <div className="md:w-[280px] bg-gray-50 border-r border-gray-100 p-6 flex flex-col shrink-0 overflow-y-auto no-scrollbar">
                  <div className="relative w-full aspect-square border-2 border-white mb-4 bg-white shadow-md overflow-hidden">
                    <Image 
                      src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'} 
                      alt={product.name || product.title || 'Product'} 
                      fill 
                      className="object-contain" 
                      priority 
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-[12px] font-black text-black uppercase tracking-tighter leading-tight line-clamp-2">{product.name || product.title}</h3>
                    <p className="text-primary font-black text-lg">৳{(product.price || 0).toLocaleString()}</p>
                    <div className="p-3 bg-white border border-gray-100 space-y-2">
                       <p className="text-[9px] font-black text-black uppercase flex items-center gap-1.5">
                         <Truck className="h-3 w-3 text-primary" /> DELIVERY INFO
                       </p>
                       <p className="text-[9px] font-bold text-gray-500">ঢাকার ভিতরে: ৳{settings?.deliveryChargeInside || '60'}</p>
                       <p className="text-[9px] font-bold text-gray-500">ঢাকার বাইরে: ৳{settings?.deliveryChargeOutside || '120'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-grow flex flex-col h-full bg-white relative">
                <div className="p-6 pb-2 shrink-0">
                  <div className="space-y-1">
                    <DialogTitle className="text-xl font-black text-black uppercase tracking-tighter font-headline">ORDER NOW</DialogTitle>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">PREMIUM SECURE CHECKOUT</p>
                  </div>

                  {isMobile && (
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-100 flex items-center justify-between rounded-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-primary" />
                        <span className="text-[9px] font-black uppercase text-black">DELIVERY:</span>
                      </div>
                      <div className="flex gap-4">
                        <p className="text-[9px] font-bold text-gray-600">ঢাকা: ৳{settings?.deliveryChargeInside || '60'}</p>
                        <p className="text-[9px] font-bold text-gray-600">বাইরে: ৳{settings?.deliveryChargeOutside || '120'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* FORM SCROLL AREA */}
                <div className="flex-grow overflow-y-auto p-6 pt-2 no-scrollbar">
                  <form onSubmit={handleSubmit} className="space-y-5 pb-32">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Ruler className="h-3 w-3 text-primary" /> SIZE</label>
                        <div className="flex flex-wrap gap-1.5">
                          {product?.sizes?.length > 0 ? product.sizes.map((size: string) => (
                            <button key={size} type="button" disabled={isSubmitting} onClick={() => setFormData({...formData, selectedSize: size})} className={cn("px-3 py-1.5 border text-[9px] font-black uppercase transition-all", formData.selectedSize === size ? 'bg-primary border-primary text-white' : 'bg-gray-50 border-gray-100 text-gray-400')}>{size}</button>
                          )) : <span className="text-[9px] font-black text-gray-400 uppercase italic">Standard</span>}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Hash className="h-3 w-3 text-primary" /> QTY</label>
                        <input type="number" min="1" required disabled={isSubmitting} value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} className="w-full bg-gray-50 border border-gray-100 h-10 px-3 text-[11px] font-black focus:outline-none focus:border-primary text-black" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><User className="h-3 w-3 text-primary" /> NAME</label>
                        <input required disabled={isSubmitting} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="ENTER YOUR NAME" className="w-full bg-gray-50 border border-gray-100 h-10 px-4 text-[11px] font-black uppercase focus:outline-none focus:border-primary text-black" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Phone className="h-3 w-3 text-primary" /> PHONE</label>
                        <input required disabled={isSubmitting} type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="01XXXXXXXXX" className="w-full bg-gray-50 border border-gray-100 h-10 px-4 text-[11px] font-black focus:outline-none focus:border-primary text-black" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin className="h-3 w-3 text-primary" /> ADDRESS</label>
                        <textarea required disabled={isSubmitting} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="HOUSE, ROAD, AREA, CITY" className="w-full bg-gray-50 border border-gray-100 p-3 text-[11px] font-black uppercase min-h-[80px] focus:outline-none focus:border-primary text-black shadow-sm no-scrollbar" />
                      </div>
                    </div>

                    {/* STICKY-LIKE BUTTONS AT THE END OF FORM */}
                    <div className="flex flex-col gap-3 pt-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        style={{ backgroundColor: 'var(--button-bg)' }}
                        className="w-full hover:bg-black text-white h-14 font-black uppercase tracking-widest rounded-none shadow-lg text-[12px] border-none"
                      >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'অর্ডার নিশ্চিত করুন'}
                      </Button>
                      <button 
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleWhatsAppChat}
                        className="w-full flex items-center justify-center gap-2 h-12 bg-white border border-green-500 text-green-600 font-black text-[10px] uppercase tracking-widest hover:bg-green-50 transition-all"
                      >
                        <MessageCircle className="h-4 w-4" /> CHAT WITH ADMIN
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full p-10 text-center space-y-8 flex flex-col justify-center bg-white items-center min-h-[400px]">
              <div className="relative">
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto border-[4px] border-primary shadow-2xl animate-in zoom-in-50 duration-700">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
                <PartyPopper className="absolute -top-6 -right-6 h-12 w-12 text-primary animate-bounce" />
              </div>
              <div className="space-y-5">
                <DialogTitle className="text-5xl font-black text-black uppercase tracking-tighter leading-none font-headline">THANK YOU</DialogTitle>
                <div className="h-1 w-16 bg-primary mx-auto" />
                <p className="text-[16px] font-bold text-black leading-relaxed px-6">
                  আমাদের এক জন প্রতিনিধি যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করবে
                </p>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">SS SMART HAAT</p>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">PREMIUM MARKET PLACE</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

OrderModal.displayName = 'OrderModal';
