
"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
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
  Send,
  MessageCircle,
  Hash,
  ArrowLeft,
  X,
  Truck
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
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
  const [step, setStep] = useState<'FORM' | 'CHAT' | 'SUCCESS'>('FORM');
  const [chatMessage, setChatMessage] = useState('');
  const [chatSessionId, setChatSessionId] = useState('');
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: '',
    quantity: 1
  });

  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (!chatSessionId) {
      setChatSessionId('chat_' + Math.random().toString(36).substring(2, 11));
    }
  }, []);

  useEffect(() => {
    if (step === 'SUCCESS') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  useEffect(() => {
    if (product?.sizes?.length > 0 && !formData.selectedSize) {
      setFormData(prev => ({ ...prev, selectedSize: product.sizes[0] }));
    }

    if (!isOpen) {
      const resetTimer = setTimeout(() => {
        setStep('FORM');
        setFormData({ name: '', phone: '', address: '', selectedSize: '', quantity: 1 });
      }, 300);
      return () => clearTimeout(resetTimer);
    }
  }, [product, isOpen]);

  const messagesQuery = useMemoFirebase(() => {
    if (!chatSessionId) return null;
    return query(
      collection(db, 'messages'),
      where('orderId', '==', chatSessionId)
    );
  }, [db, chatSessionId]);

  const { data: rawChatHistory } = useCollection(messagesQuery);

  const chatHistory = React.useMemo(() => {
    if (!rawChatHistory) return [];
    return [...rawChatHistory].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [rawChatHistory]);

  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [chatHistory, step]);

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
      chatId: chatSessionId,
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db, 'orders'), orderData);
    
    const productRef = doc(db, 'products', product.id);
    if (product.sizeStock && formData.selectedSize) {
      const currentSizeQty = product.sizeStock[formData.selectedSize] || 0;
      const newSizeStock = { 
        ...product.sizeStock, 
        [formData.selectedSize]: Math.max(0, currentSizeQty - formData.quantity) 
      };
      updateDocumentNonBlocking(productRef, {
        sizeStock: newSizeStock,
        stockQuantity: Math.max(0, (product.stockQuantity || 0) - formData.quantity)
      });
    } else {
      updateDocumentNonBlocking(productRef, {
        stockQuantity: Math.max(0, (product.stockQuantity || 0) - formData.quantity)
      });
    }

    setStep('SUCCESS');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    addDocumentNonBlocking(collection(db, 'messages'), {
      orderId: chatSessionId,
      customerName: formData.name || 'GUEST',
      text: chatMessage,
      sender: 'CUSTOMER',
      createdAt: new Date().toISOString()
    });

    setChatMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className={cn(
        "p-0 bg-white border-none rounded-none overflow-hidden gap-0 shadow-2xl transition-all duration-300 fixed z-[100] outline-none",
        "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        step === 'SUCCESS' ? "max-w-[350px] w-[90vw]" : isMobile ? "w-full h-full" : "max-w-[1200px] w-[95vw]"
      )}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-[150] p-2 bg-black text-white hover:bg-[#01a3a4] transition-all border border-white/10 shadow-xl"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col h-full max-h-[95vh] relative no-scrollbar">
          {step === 'FORM' ? (
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              
              {!isMobile && (
                <div className="md:w-[450px] bg-gray-50 border-r border-gray-100 p-10 flex flex-col shrink-0 overflow-y-auto no-scrollbar">
                  <div className="relative w-full aspect-square border-4 border-white mb-8 bg-white shadow-2xl overflow-hidden group">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                      priority 
                    />
                  </div>
                  <div className="w-full space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-black uppercase tracking-tighter leading-tight font-headline">{product.name}</h3>
                      <div className="text-[#01a3a4] font-black text-4xl flex items-baseline">
                        <span className="text-[16px] font-normal mr-1 translate-y-[-8px] text-gray-400">৳</span>
                        {product.price.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="p-6 bg-white border border-gray-100 shadow-sm space-y-4">
                       <div className="flex items-center gap-3 text-[#01a3a4] mb-1">
                         <Truck className="h-6 w-6" />
                         <span className="text-[11px] font-black uppercase tracking-[0.2em]">ডেলিভারি চার্জ</span>
                       </div>
                       <p className="text-[12px] font-black text-black uppercase">ঢাকার ভিতরে: <span className="text-[#01a3a4]">৳{settings?.deliveryChargeInside || '60'}</span></p>
                       <p className="text-[12px] font-black text-black uppercase">ঢাকার বাহিরে: <span className="text-[#01a3a4]">৳{settings?.deliveryChargeOutside || '120'}</span></p>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-4 py-1.5">{product.category}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className={cn(
                "flex-grow p-6 md:p-16 md:pt-24 space-y-8 md:space-y-12 bg-white overflow-y-auto relative no-scrollbar",
                !isMobile && "md:w-[400px]"
              )}>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="h-10 md:h-12 w-2 md:w-3 bg-[#01a3a4]" />
                    <DialogTitle className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none font-headline">ORDER CONFIRM</DialogTitle>
                  </div>
                  <DialogDescription className="text-[11px] md:text-[13px] font-black text-gray-400 uppercase tracking-[0.3em] pl-6">
                    Fill the details to secure purchase.
                  </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 pt-4">
                  <div className="grid grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-3">
                      <label className="text-[11px] md:text-[12px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                        <Ruler className="h-5 w-5 text-[#01a3a4]" /> SELECT SIZE
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {product?.sizes?.length > 0 ? product.sizes.map((size: string) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setFormData({...formData, selectedSize: size})}
                            className={cn(
                              "px-5 py-2.5 border-2 text-[12px] font-black uppercase transition-all min-w-[60px]",
                              formData.selectedSize === size 
                                ? 'bg-[#01a3a4] border-[#01a3a4] text-white shadow-2xl' 
                                : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-[#01a3a4]'
                            )}
                          >
                            {size}
                          </button>
                        )) : (
                          <span className="text-[11px] font-black text-gray-400 uppercase italic">Standard Size</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] md:text-[12px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                        <Hash className="h-5 w-5 text-[#01a3a4]" /> QUANTITY
                      </label>
                      <input 
                        type="number"
                        min="1"
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-none h-14 px-5 text-[15px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] text-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    <div className="space-y-3">
                      <label className="text-[11px] md:text-[12px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                        <User className="h-5 w-5 text-[#01a3a4]" /> FULL NAME
                      </label>
                      <input 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="NAME"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-none h-16 px-6 text-[14px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] text-black shadow-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] md:text-[12px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                        <Phone className="h-5 w-5 text-[#01a3a4]" /> PHONE NUMBER
                      </label>
                      <input 
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-none h-16 px-6 text-[14px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] text-black shadow-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] md:text-[12px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-[#01a3a4]" /> ADDRESS
                      </label>
                      <textarea 
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="AREA, HOUSE, CITY"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-none p-6 text-[14px] font-black uppercase tracking-widest min-h-[120px] focus:outline-none focus:border-[#01a3a4] text-black shadow-sm no-scrollbar"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#01a3a4] hover:bg-black text-white h-20 md:h-24 font-black uppercase tracking-[0.6em] rounded-none shadow-2xl text-[16px] md:text-[18px] border-none transition-all active:scale-95 mt-6"
                  >
                    অর্ডার নিশ্চিত করুন
                  </Button>
                </form>
              </div>

              {!isMobile && (
                <div className="md:w-[320px] flex flex-col bg-gray-50 shrink-0 border-l border-gray-100 h-full">
                  <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                      <h3 className="text-[13px] font-black text-black uppercase tracking-[0.3em]">LIVE ASSISTANT</h3>
                    </div>
                    <MessageCircle className="h-6 w-6 text-[#01a3a4]" />
                  </div>

                  <div 
                    ref={chatScrollContainerRef}
                    className="flex-grow overflow-y-auto p-8 space-y-6 bg-gray-50/50 no-scrollbar"
                  >
                    {chatHistory.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-5 opacity-40">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                          <MessageCircle className="h-10 w-10 text-gray-200" />
                        </div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                          QUESTIONS? CHAT WITH US.
                        </p>
                      </div>
                    ) : chatHistory.map((msg, i) => (
                      <div key={i} className={cn("flex flex-col", msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start')}>
                        <div className={cn(
                          "max-w-[90%] p-5 text-[13px] font-bold leading-snug shadow-lg",
                          msg.sender === 'CUSTOMER' 
                            ? 'bg-[#01a3a4] text-white rounded-l-2xl rounded-tr-2xl' 
                            : 'bg-white border border-gray-200 text-black rounded-r-2xl rounded-tl-2xl'
                        )}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] font-black text-gray-300 uppercase mt-2 px-3">
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-8 bg-white border-t border-gray-100 flex gap-4">
                    <input 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="MESSAGE..."
                      className="flex-grow bg-gray-50 border-2 border-gray-200 h-14 px-6 text-[13px] font-black uppercase text-black focus:outline-none focus:border-[#01a3a4] transition-all"
                    />
                    <Button type="submit" size="icon" className="h-14 w-14 bg-[#01a3a4] hover:bg-black rounded-none shrink-0 border-none shadow-2xl active:scale-90">
                      <Send className="h-6 w-6 text-white" />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          ) : step === 'CHAT' ? (
            <div className="flex flex-col h-full bg-white relative">
              <button onClick={() => setStep('FORM')} className="absolute left-4 top-4 z-[60] p-2 text-white hover:scale-110 transition-all active:scale-90">
                <ArrowLeft className="h-6 w-6" />
              </button>

              <div className="p-8 bg-[#01a3a4] flex flex-col items-center shadow-2xl">
                <h3 className="text-white font-black text-lg uppercase tracking-[0.3em]">LIVE SUPPORT CHAT</h3>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-2.5 w-2.5 bg-white rounded-full animate-pulse" />
                  <span className="text-[11px] font-black text-white/80 uppercase">WE ARE ONLINE</span>
                </div>
              </div>

              <div 
                ref={chatScrollContainerRef}
                className="flex-grow overflow-y-auto p-8 space-y-8 bg-gray-50 no-scrollbar"
              >
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10">
                    <MessageCircle className="h-20 w-20 text-gray-200 mb-8" />
                    <p className="text-[14px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                      আমাদের কাস্টমার কেয়ার প্রতিনিধির সাথে কথা বলতে নিচে মেসেজ লিখুন।
                    </p>
                  </div>
                ) : chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col", msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start')}>
                    <div className={cn(
                      "max-w-[85%] p-6 text-[15px] font-bold leading-tight shadow-2xl",
                      msg.sender === 'CUSTOMER' 
                        ? 'bg-[#01a3a4] text-white rounded-l-3xl rounded-tr-3xl' 
                        : 'bg-white border border-gray-200 text-black rounded-r-3xl rounded-tl-3xl'
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[11px] font-black text-gray-300 uppercase mt-3 px-4">
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-8 bg-white border-t border-gray-100 flex gap-5">
                <input 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="আপনার মেসেজ লিখুন..."
                  className="flex-grow bg-gray-50 border-2 border-gray-200 h-20 px-8 text-[16px] font-bold text-black focus:outline-none focus:border-[#01a3a4] transition-all"
                />
                <Button type="submit" size="icon" className="h-20 w-20 bg-[#01a3a4] hover:bg-black rounded-none shrink-0 border-none shadow-2xl active:scale-90">
                  <Send className="h-8 w-8 text-white" />
                </Button>
              </form>
            </div>
          ) : (
            <div className="w-full p-20 text-center space-y-10 flex flex-col justify-center bg-white items-center min-h-[500px]">
              <div className="relative">
                <div className="w-28 h-24 bg-[#01a3a4]/5 rounded-full flex items-center justify-center mx-auto mb-6 border-[6px] border-[#01a3a4] shadow-2xl animate-in zoom-in-50 duration-500">
                  <CheckCircle2 className="h-14 w-14 text-[#01a3a4]" />
                </div>
                <PartyPopper className="absolute -top-6 -right-8 h-12 w-12 text-[#01a3a4] animate-bounce" />
              </div>

              <div className="space-y-8">
                <DialogTitle className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none font-headline animate-in slide-in-from-bottom-2 duration-700">
                  THANK YOU
                </DialogTitle>
                <div className="h-2 w-20 bg-[#01a3a4] mx-auto rounded-full" />
                <p className="text-[14px] md:text-[16px] font-black text-[#01a3a4] uppercase tracking-[0.6em]">অর্ডার সফল হয়েছে</p>
                <div className="py-2 px-10">
                  <p className="text-[16px] md:text-[18px] font-bold text-black font-headline leading-relaxed">
                    যত দ্রুত সম্ভব আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবে
                  </p>
                </div>
                <div className="pt-10">
                   <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.5em] animate-pulse">স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে...</p>
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
