
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingBag, CheckCircle2, Loader2, Phone, MapPin, User } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface OrderModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * OrderModal - A professional order popup with dual steps (Form and Success).
 * Success popup auto-closes after 3 seconds as requested.
 */
export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const db = useFirestore();
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Handle Success auto-close
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'SUCCESS') {
      timer = setTimeout(() => {
        handleClose();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const handleClose = () => {
    setStep('FORM');
    setFormData({ name: '', phone: '', address: '' });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    setLoading(true);

    const orderData = {
      customerName: formData.name,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Push to Firestore
    addDocumentNonBlocking(collection(db, 'orders'), orderData);
    
    // Simulate slight delay for professional feel
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 800);
  };

  return (
    <>
      <Dialog open={isOpen && step === 'FORM'} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent className="max-w-4xl p-0 bg-black border-white/10 rounded-none overflow-hidden gap-0">
          <div className="flex flex-col md:flex-row h-full">
            {/* LEFT SIDE: PRODUCT PREVIEW */}
            <div className="relative w-full md:w-5/12 aspect-square md:aspect-auto bg-card border-r border-white/5">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover opacity-90"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Selected Item</p>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{product.name}</h2>
                <p className="text-2xl font-black text-white">৳{product.price.toLocaleString()}</p>
              </div>
            </div>

            {/* RIGHT SIDE: ORDER FORM */}
            <div className="w-full md:w-7/12 p-8 md:p-12 space-y-8 bg-card">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 bg-orange-600" />
                  <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">COMPLETE ORDER</DialogTitle>
                </div>
                <DialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                  PROVIDE YOUR DETAILS FOR DELIVERY
                </DialogDescription>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                    <User className="h-3 w-3" /> FULL NAME
                  </label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ENTER YOUR NAME"
                    className="bg-white/5 border-white/10 rounded-none h-12 text-xs uppercase focus:ring-orange-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                    <Phone className="h-3 w-3" /> PHONE NUMBER
                  </label>
                  <Input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="01XXXXXXXXX"
                    className="bg-white/5 border-white/10 rounded-none h-12 text-xs uppercase focus:ring-orange-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> DELIVERY ADDRESS
                  </label>
                  <Textarea 
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="HOUSE NO, ROAD, AREA..."
                    className="bg-white/5 border-white/10 rounded-none text-xs uppercase min-h-[100px] focus:ring-orange-600"
                  />
                </div>

                <Button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white h-14 font-black uppercase tracking-widest rounded-none shadow-xl shadow-orange-600/10"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><ShoppingBag className="mr-2 h-5 w-5" /> CONFIRM ORDER</>}
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SUCCESS POPUP */}
      <Dialog open={isOpen && step === 'SUCCESS'} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent className="max-w-md bg-black border-orange-600/30 rounded-none p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-600/20">
            <CheckCircle2 className="h-10 w-10 text-orange-600" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">THANK YOU FOR YOUR ORDER</h2>
            <p className="text-sm font-bold text-orange-600 font-headline italic">
              আমাদের একজন প্রতিনিধি যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করবে।
            </p>
          </div>
          <div className="pt-4">
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.4em] animate-pulse">
              CLOSING IN 3 SECONDS...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
