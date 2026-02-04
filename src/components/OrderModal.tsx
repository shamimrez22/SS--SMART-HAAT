
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ShoppingBag, CheckCircle2, Loader2, Phone, MapPin, User, Ruler, Sparkles, PartyPopper } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface OrderModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const db = useFirestore();
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [loading, setLoading] = useState(false);
  const [isActualMobile, setIsActualMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: ''
  });

  useEffect(() => {
    // Detect actual mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android|iphone|ipad|ipod/i.test(userAgent.toLowerCase())) {
      setIsActualMobile(true);
    }

    if (product?.sizes?.length > 0 && !formData.selectedSize) {
      setFormData(prev => ({ ...prev, selectedSize: product.sizes[0] }));
    }
  }, [product, isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'SUCCESS') {
      timer = setTimeout(() => {
        handleClose();
      }, 10000); 
    }
    return () => clearTimeout(timer);
  }, [step]);

  const handleClose = () => {
    setStep('FORM');
    setFormData({ name: '', phone: '', address: '', selectedSize: '' });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    setLoading(true);

    const orderData = {
      customerName: formData.name.toUpperCase(),
      customerPhone: formData.phone,
      customerAddress: formData.address.toUpperCase(),
      selectedSize: formData.selectedSize,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db, 'orders'), orderData);
    
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 1200);
  };

  return (
    <>
      <Dialog open={isOpen && step === 'FORM'} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent className="max-w-4xl p-0 bg-black border-white/10 rounded-none overflow-hidden gap-0">
          <div className="flex flex-row h-full max-h-[95vh]">
            
            {/* PRODUCT PREVIEW - STRICTLY HIDDEN ON MOBILE AS REQUESTED */}
            {!isActualMobile && (
              <div className="relative w-5/12 aspect-[4/5] bg-black border-r border-white/5">
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                  sizes="400px"
                  quality={75}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 space-y-2">
                  <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">Selected Item</p>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">{product.name}</h2>
                  <div className="text-3xl font-black text-white flex items-baseline">
                    <span className="text-[0.45em] font-normal mr-1 translate-y-[-0.1em]">৳</span>
                    {product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* FORM AREA */}
            <div className={`${isActualMobile ? 'w-full' : 'w-7/12'} p-12 space-y-10 bg-black overflow-y-auto`}>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1.5 bg-[#01a3a4]" />
                  <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter leading-none">COMPLETE ORDER</DialogTitle>
                </div>
                <DialogDescription className="text-[11px] text-white/60 uppercase font-black tracking-widest">
                  PROVIDE YOUR DETAILS FOR ELITE DELIVERY
                </DialogDescription>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {product?.sizes && product.sizes.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/60 uppercase flex items-center gap-2">
                      <Ruler className="h-3 w-3" /> SELECT SIZE
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size: string) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData({...formData, selectedSize: size})}
                          className={`px-4 py-2 border text-[10px] font-black uppercase transition-all ${
                            formData.selectedSize === size 
                              ? 'bg-[#01a3a4] border-[#01a3a4] text-white' 
                              : 'bg-white/5 border-white/10 text-white hover:border-[#01a3a4]/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase flex items-center gap-2">
                      <User className="h-3 w-3" /> FULL NAME
                    </label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="ENTER NAME"
                      className="w-full bg-white/5 border border-white/10 rounded-none h-12 px-4 text-[11px] uppercase focus:outline-none focus:border-[#01a3a4] text-white placeholder:text-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase flex items-center gap-2">
                      <Phone className="h-3 w-3" /> CONTACT NUMBER
                    </label>
                    <input 
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-white/5 border border-white/10 rounded-none h-12 px-4 text-[11px] uppercase focus:outline-none focus:border-[#01a3a4] text-white placeholder:text-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> DELIVERY ADDRESS
                    </label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="STREET, AREA, CITY..."
                      className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-[11px] uppercase min-h-[100px] focus:outline-none focus:border-[#01a3a4] text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <Button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white h-14 font-black uppercase tracking-widest rounded-none shadow-xl shadow-[#01a3a4]/10 text-[12px] transition-all"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><ShoppingBag className="mr-3 h-5 w-5" /> CONFIRM ORDER</>}
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen && step === 'SUCCESS'} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent className="max-w-2xl bg-black border-[5px] border-[#01a3a4] rounded-none p-0 overflow-hidden shadow-[0_0_80px_rgba(1,163,164,0.4)] relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#01a3a4] via-white to-[#01a3a4]" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#01a3a4] via-white to-[#01a3a4]" />
          
          <div className="relative p-12 text-center space-y-10">
            <div className="relative">
              <div className="w-32 h-32 bg-[#01a3a4]/10 rounded-full flex items-center justify-center mx-auto mb-8 border-[3px] border-[#01a3a4] shadow-[0_0_40px_rgba(1,163,164,0.5)] animate-pulse">
                <CheckCircle2 className="h-16 w-16 text-[#01a3a4]" />
              </div>
              <PartyPopper className="absolute -top-4 right-1/4 h-10 w-10 text-[#01a3a4] animate-bounce" />
              <Sparkles className="absolute bottom-0 left-1/4 h-8 w-8 text-[#01a3a4] animate-spin-slow" />
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[12px] font-black text-[#01a3a4] uppercase tracking-[0.6em] animate-pulse">System Confirmed</p>
                <DialogTitle className="text-4xl font-black text-white uppercase tracking-tighter leading-none font-headline">
                  THANK YOU FOR YOUR ORDER
                </DialogTitle>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="h-1 w-24 bg-gradient-to-r from-transparent to-[#01a3a4]" />
                <Sparkles className="h-6 w-6 text-[#01a3a4]" />
                <div className="h-1 w-24 bg-gradient-to-l from-transparent to-[#01a3a4]" />
              </div>

              <DialogDescription className="text-[20px] font-bold text-white leading-relaxed max-w-lg mx-auto border-y border-white/10 py-8 px-4 italic">
                আমাদের একজন প্রতিনিধি যত দ্রুত সম্ভব আপনার সঙ্গে যোগাযোগ করবে।
              </DialogDescription>
              
              <p className="text-[12px] font-black text-[#01a3a4] uppercase tracking-[0.4em] opacity-80">
                STAY CONNECTED WITH SS SMART HAAT • DHAKA, BANGLADESH
              </p>
            </div>

            <Button 
              onClick={handleClose} 
              className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white font-black uppercase h-20 rounded-none text-[16px] tracking-[0.4em] transition-all shadow-[0_15px_40px_rgba(1,163,164,0.3)] border-b-4 border-black/20"
            >
              ঠিক আছে
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
