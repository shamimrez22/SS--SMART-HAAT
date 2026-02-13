
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

    const result = await createOrderAndNotify(orderData);
    if (result.success) {
      setStep('SUCCESS');
    } else {
      alert("FAILED TO PLACE ORDER. PLEASE TRY AGAIN.");
    }
    setIsSubmitting(false);
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
        step === 'SUCCESS' ? "max-w-[400px] w-[90vw]" : isMobile ? "w-full h-full" : "max-w-[700px] w-[95vw]"
      )}>
        {!isSubmitting && (
          <button 
            onClick={onClose}
            className="absolute right-3 top-3 z-[200] p-1.5 bg-black text-white hover:bg-primary transition-all border border-white/10 shadow-xl"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex flex-col h-full max-h-[90vh] no-scrollbar">
          {step === 'FORM' ? (
            <div className="flex flex-col md:flex-row h-full">
              {!isMobile && (
                <div className="md:w-[250px] bg-gray-50 border-r border-gray-100 p-4 flex flex-col shrink-0">
                  <div className="relative w-full aspect-square border-2 border-white mb-3 bg-white shadow-md overflow-hidden">
                    <Image 
                      src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'} 
                      alt={product.name || product.title || 'Product'} 
                      fill 
                      className="object-contain" 
                      priority 
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-black text-black uppercase tracking-tighter leading-tight line-clamp-2">{product.name || product.title}</h3>
                    <p className="text-primary font-black text-base">৳{(product.price || 0).toLocaleString()}</p>
                    <div className="p-2 bg-white border border-gray-100 space-y-1">
                       <p className="text-[8px] font-black text-black uppercase flex items-center gap-1">
                         <Truck className="h-2.5 w-2.5 text-primary" /> DELIVERY INFO
                       </p>
                       <p className="text-[8px] font-bold text-gray-500">ঢাকার ভিতরে: ৳{settings?.deliveryChargeInside || '60'}</p>
                       <p className="text-[8px] font-bold text-gray-500">ঢাকার বাইরে: ৳{settings?.deliveryChargeOutside || '120'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-grow p-5 md:p-6 space-y-4 bg-white overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                  <DialogTitle className="text-lg font-black text-black uppercase tracking-tighter font-headline">ORDER NOW</DialogTitle>
                  <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.3em]">PREMIUM SECURE CHECKOUT</p>
                </div>

                {isMobile && (
                  <div className="p-2.5 bg-gray-50 border border-gray-100 flex items-center justify-between rounded-sm">
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-3 w-3 text-primary" />
                      <span className="text-[8px] font-black uppercase text-black">DELIVERY:</span>
                    </div>
                    <div className="flex gap-3">
                      <p className="text-[8px] font-bold text-gray-600">ঢাকা: ৳{settings?.deliveryChargeInside || '60'}</p>
                      <p className="text-[8px] font-bold text-gray-600">বাইরে: ৳{settings?.deliveryChargeOutside || '120'}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Ruler className="h-2.5 w-2.5 text-primary" /> SIZE</label>
                      <div className="flex flex-wrap gap-1">
                        {product?.sizes?.length > 0 ? product.sizes.map((size: string) => (
                          <button key={size} type="button" disabled={isSubmitting} onClick={() => setFormData({...formData, selectedSize: size})} className={cn("px-2 py-1 border text-[8px] font-black uppercase transition-all", formData.selectedSize === size ? 'bg-primary border-primary text-white' : 'bg-gray-50 border-gray-100 text-gray-400')}>{size}</button>
                        )) : <span className="text-[8px] font-black text-gray-400 uppercase italic">Standard</span>}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Hash className="h-2.5 w-2.5 text-primary" /> QTY</label>
                      <input type="number" min="1" required disabled={isSubmitting} value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} className="w-full bg-gray-50 border border-gray-100 h-8 px-2 text-[10px] font-black focus:outline-none focus:border-primary text-black" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><User className="h-2.5 w-2.5 text-primary" /> NAME</label>
                      <input required disabled={isSubmitting} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="ENTER YOUR NAME" className="w-full bg-gray-50 border border-gray-100 h-8 px-3 text-[10px] font-black uppercase focus:outline-none focus:border-primary text-black" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Phone className="h-2.5 w-2.5 text-primary" /> PHONE</label>
                      <input required disabled={isSubmitting} type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="01XXXXXXXXX" className="w-full bg-gray-50 border border-gray-100 h-8 px-3 text-[10px] font-black focus:outline-none focus:border-primary text-black" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="h-2.5 w-2.5 text-primary" /> ADDRESS</label>
                      <textarea required disabled={isSubmitting} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="HOUSE, ROAD, AREA, CITY" className="w-full bg-gray-50 border border-gray-100 p-2 text-[10px] font-black uppercase min-h-[45px] focus:outline-none focus:border-primary text-black shadow-sm no-scrollbar" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      style={{ backgroundColor: 'var(--button-bg)' }}
                      className="w-full hover:bg-black text-white h-10 font-black uppercase tracking-widest rounded-none shadow-lg text-[11px] border-none"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'অর্ডার নিশ্চিত করুন'}
                    </Button>
                    <button 
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleWhatsAppChat}
                      className="w-full flex items-center justify-center gap-2 h-8 bg-white border border-green-500 text-green-600 font-black text-[9px] uppercase tracking-widest hover:bg-green-50 transition-all"
                    >
                      <MessageCircle className="h-3 w-3" /> CHAT WITH ADMIN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="w-full p-8 text-center space-y-6 flex flex-col justify-center bg-white items-center min-h-[350px]">
              <div className="relative">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto border-[3px] border-primary shadow-xl animate-in zoom-in-50 duration-700">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <PartyPopper className="absolute -top-4 -right-5 h-10 w-10 text-primary animate-bounce" />
              </div>
              <div className="space-y-4">
                <DialogTitle className="text-4xl font-black text-black uppercase tracking-tighter leading-none font-headline">THANK YOU</DialogTitle>
                <div className="h-px w-12 bg-primary mx-auto" />
                <p className="text-[14px] font-bold text-black leading-relaxed px-4">
                  আমাদের এক জন প্রতিনিধি যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করবে
                </p>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">SS SMART HAAT</p>
                  <p className="text-[6px] font-black text-gray-400 uppercase tracking-[0.2em]">PREMIUM MARKET PLACE</p>
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
