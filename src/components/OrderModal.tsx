
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
import { ShoppingBag, CheckCircle2, Loader2, Phone, MapPin, User, Ruler } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: ''
  });

  useEffect(() => {
    if (product?.sizes?.length > 0 && !formData.selectedSize) {
      setFormData(prev => ({ ...prev, selectedSize: product.sizes[0] }));
    }
  }, [product, isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'SUCCESS') {
      timer = setTimeout(() => {
        handleClose();
      }, 5000);
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
    }, 1000);
  };

  return (
    <>
      <Dialog open={isOpen && step === 'FORM'} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent className="max-w-4xl p-0 bg-black border-white/10 rounded-none overflow-hidden gap-0">
          <div className="flex flex-col md:flex-row h-full max-h-[95vh]">
            
            {/* PRODUCT PREVIEW - HIDDEN ON MOBILE AS PER USER REQUEST */}
            <div className="hidden md:block relative w-5/12 aspect-[4/5] bg-black border-r border-white/5">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover"
                sizes="40vw"
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

            {/* FORM AREA - FULL WIDTH ON MOBILE */}
            <div className="w-full md:w-7/12 p-6 md:p-12 space-y-6 md:space-y-10 bg-black overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-6 md:h-8 w-1.5 bg-[#01a3a4]" />
                  <DialogTitle className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">COMPLETE ORDER</DialogTitle>
                </div>
                <DialogDescription className="text-[10px] md:text-[11px] text-white/60 uppercase font-black tracking-widest">
                  PROVIDE YOUR DETAILS FOR ELITE DELIVERY
                </DialogDescription>
                {/* Mobile Price Display since Image is hidden */}
                <div className="md:hidden pt-2 flex items-center justify-between border-t border-white/5">
                   <p className="text-[10px] font-black text-white/40 uppercase">{product.name}</p>
                   <div className="text-lg font-black text-[#01a3a4] flex items-baseline">
                      <span className="text-[0.45em] font-normal mr-0.5 translate-y-[-0.1em]">৳</span>
                      {product.price.toLocaleString()}
                   </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {product?.sizes && product.sizes.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-white/60 uppercase flex items-center gap-2">
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
                    <label className="text-[9px] md:text-[10px] font-black text-white/60 uppercase flex items-center gap-2">
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
                    <label className="text-[9px] md:text-[10px] font-black text-white/60 uppercase flex items-center gap-2">
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
                    <label className="text-[9px] md:text-[10px] font-black text-white/60 uppercase flex items-center gap-2">
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
                  className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white h-14 font-black uppercase tracking-widest rounded-none shadow-xl shadow-[#01a3a4]/10 text-[11px] md:text-[12px] transition-all"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><ShoppingBag className="mr-3 h-5 w-5" /> CONFIRM ORDER</>}
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen && step === 'SUCCESS'} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent className="max-w-md bg-black border-[#01a3a4]/30 rounded-none p-10 text-center space-y-6">
          <div className="w-16 h-16 bg-[#01a3a4]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#01a3a4]/20">
            <CheckCircle2 className="h-8 w-8 text-[#01a3a4]" />
          </div>
          <div className="space-y-4">
            <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">
              অর্ডার সফলভাবে সম্পন্ন হয়েছে
            </DialogTitle>
            <DialogDescription className="text-[13px] font-bold text-[#01a3a4] uppercase tracking-widest italic leading-relaxed">
              আমাদের প্রতিনিধি শীঘ্রই আপনাকে ফোন করে অর্ডারটি নিশ্চিত করবেন। ধন্যবাদ!
            </DialogDescription>
          </div>
          <Button onClick={handleClose} className="w-full bg-[#01a3a4] text-white font-black uppercase h-12 rounded-none">ঠিক আছে</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
