
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
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
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
  
  const [chatSessionId] = useState(() => 'chat_' + Math.random().toString(36).substring(2, 11));
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: '',
    quantity: 1
  });

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
        "p-0 bg-white border-none rounded-none overflow-hidden gap-0 shadow-2xl transition-all duration-300 gpu-accelerated fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]",
        step === 'SUCCESS' ? "max-w-[350px]" : isMobile ? "w-full h-full" : "max-w-[950px] w-[95vw]"
      )}>
        {/* GLOBAL CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-[60] p-2 text-gray-400 hover:text-black hover:bg-gray-100 transition-all rounded-full"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col h-full max-h-[90vh]">
          {step === 'FORM' ? (
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              
              {/* DESKTOP LEFT: PRODUCT INFO */}
              {!isMobile && (
                <div className="md:w-[280px] bg-gray-50 border-r border-gray-100 p-6 flex flex-col shrink-0 overflow-y-auto no-scrollbar">
                  <div className="relative w-full aspect-square border border-gray-200 mb-6 bg-white shadow-sm overflow-hidden">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
                  </div>
                  <div className="w-full space-y-4">
                    <h3 className="text-sm font-black text-black uppercase tracking-tighter leading-tight font-headline">{product.name}</h3>
                    <div className="text-[#01a3a4] font-black text-2xl flex items-baseline">
                      <span className="text-[12px] font-normal mr-1 translate-y-[-4px] text-gray-400">৳</span>
                      {product.price.toLocaleString()}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{product.category}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MIDDLE: ORDER FORM */}
              <div className={cn(
                "flex-grow p-6 md:p-8 space-y-6 bg-white overflow-y-auto relative no-scrollbar",
                !isMobile && "md:w-[350px]"
              )}>
                {/* SMALL PRODUCT IMAGE IN CORNER (FOR MOBILE OR COMPACT) */}
                <div className="absolute top-4 right-12 w-14 h-14 border border-gray-100 shadow-sm z-10 bg-white overflow-hidden">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="56px" priority />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-1.5 bg-[#01a3a4]" />
                    <DialogTitle className="text-2xl font-black text-black uppercase tracking-tighter leading-none font-headline">ORDER CONFIRM</DialogTitle>
                  </div>
                  <DialogDescription className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Fill the details below to secure your purchase.
                  </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Ruler className="h-3.5 w-3.5 text-[#01a3a4]" /> SELECT SIZE
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product?.sizes?.length > 0 ? product.sizes.map((size: string) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setFormData({...formData, selectedSize: size})}
                            className={cn(
                              "px-3 py-1.5 border text-[10px] font-black uppercase transition-all",
                              formData.selectedSize === size 
                                ? 'bg-[#01a3a4] border-[#01a3a4] text-white shadow-lg' 
                                : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-[#01a3a4] hover:text-[#01a3a4]'
                            )}
                          >
                            {size}
                          </button>
                        )) : (
                          <span className="text-[9px] font-black text-gray-400 uppercase italic">Standard Size</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5 text-[#01a3a4]" /> QUANTITY
                      </label>
                      <input 
                        type="number"
                        min="1"
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-none h-10 px-4 text-[12px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[#01a3a4]" /> YOUR FULL NAME
                      </label>
                      <input 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="ENTER NAME"
                        className="w-full bg-gray-50 border border-gray-200 rounded-none h-12 px-5 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-[#01a3a4]" /> ACTIVE PHONE NUMBER
                      </label>
                      <input 
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-gray-50 border border-gray-200 rounded-none h-12 px-5 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#01a3a4]" /> DELIVERY ADDRESS
                      </label>
                      <textarea 
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="AREA, HOUSE, CITY"
                        className="w-full bg-gray-50 border border-gray-200 rounded-none p-4 text-[12px] font-black uppercase tracking-widest min-h-[80px] focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black transition-all no-scrollbar"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#01a3a4] hover:bg-black text-white h-16 font-black uppercase tracking-[0.4em] rounded-none shadow-2xl text-[14px] border-none transition-all active:scale-95"
                  >
                    অর্ডার নিশ্চিত করুন
                  </Button>
                  
                  {isMobile && (
                    <button 
                      type="button"
                      onClick={() => setStep('CHAT')}
                      className="w-full flex items-center justify-center gap-2 text-[11px] font-black text-[#01a3a4] uppercase tracking-widest py-3 hover:bg-gray-50 transition-all border border-dashed border-[#01a3a4]/20 active:scale-95"
                    >
                      <MessageCircle className="h-4 w-4" /> CHAT
                    </button>
                  )}
                </form>
              </div>

              {/* DESKTOP RIGHT: SUPPORT CHAT */}
              {!isMobile && (
                <div className="md:w-[320px] flex flex-col bg-gray-50 shrink-0 border-l border-gray-100 h-full">
                  <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      <h3 className="text-[11px] font-black text-black uppercase tracking-[0.2em]">LIVE ASSISTANT</h3>
                    </div>
                    <MessageCircle className="h-4 w-4 text-[#01a3a4]" />
                  </div>

                  <div 
                    ref={chatScrollContainerRef}
                    className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50/50 no-scrollbar"
                  >
                    {chatHistory.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <MessageCircle className="h-6 w-6 text-gray-200" />
                        </div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                          QUESTIONS? CHAT WITH US.
                        </p>
                      </div>
                    ) : chatHistory.map((msg, i) => (
                      <div key={i} className={cn("flex flex-col", msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start')}>
                        <div className={cn(
                          "max-w-[90%] p-3.5 text-[11px] font-bold leading-snug shadow-sm",
                          msg.sender === 'CUSTOMER' 
                            ? 'bg-[#01a3a4] text-white rounded-l-xl rounded-tr-xl' 
                            : 'bg-white border border-gray-200 text-black rounded-r-xl rounded-tl-xl'
                        )}>
                          {msg.text}
                        </div>
                        <span className="text-[7px] font-black text-gray-300 uppercase mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-gray-100 flex gap-3">
                    <input 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="MESSAGE..."
                      className="flex-grow bg-gray-50 border border-gray-200 h-11 px-4 text-[11px] font-black uppercase text-black focus:outline-none focus:border-[#01a3a4] transition-all"
                    />
                    <Button type="submit" size="icon" className="h-11 w-11 bg-[#01a3a4] hover:bg-black rounded-none shrink-0 border-none shadow-lg active:scale-90">
                      <Send className="h-4 w-4 text-white" />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          ) : step === 'CHAT' ? (
            <div className="flex flex-col h-full bg-white relative gpu-accelerated">
              <button onClick={() => setStep('FORM')} className="absolute left-4 top-4 z-[60] p-2 text-white hover:scale-110 transition-all active:scale-90">
                <ArrowLeft className="h-6 w-6" />
              </button>

              <div className="p-5 bg-[#01a3a4] flex flex-col items-center shadow-lg">
                <h3 className="text-white font-black text-sm uppercase tracking-[0.2em]">LIVE SUPPORT CHAT</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-white/80 uppercase">WE ARE ONLINE</span>
                </div>
              </div>

              <div 
                ref={chatScrollContainerRef}
                className="flex-grow overflow-y-auto p-6 space-y-5 bg-gray-50 no-scrollbar"
              >
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <MessageCircle className="h-12 w-12 text-gray-200 mb-4" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                      আমাদের কাস্টমার কেয়ার প্রতিনিধির সাথে কথা বলতে নিচে মেসেজ লিখুন।
                    </p>
                  </div>
                ) : chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col", msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start')}>
                    <div className={cn(
                      "max-w-[85%] p-4 text-[13px] font-bold leading-tight shadow-md",
                      msg.sender === 'CUSTOMER' 
                        ? 'bg-[#01a3a4] text-white rounded-l-2xl rounded-tr-2xl' 
                        : 'bg-white border border-gray-200 text-black rounded-r-2xl rounded-tl-2xl'
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-black text-gray-300 uppercase mt-1.5 px-2">
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-gray-100 flex gap-4">
                <input 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="আপনার মেসেজ লিখুন..."
                  className="flex-grow bg-gray-50 border border-gray-200 h-14 px-5 text-sm font-bold text-black focus:outline-none focus:border-[#01a3a4] transition-all"
                />
                <Button type="submit" size="icon" className="h-14 w-14 bg-[#01a3a4] hover:bg-black rounded-none shrink-0 border-none shadow-xl active:scale-90">
                  <Send className="h-6 w-6 text-white" />
                </Button>
              </form>
            </div>
          ) : (
            <div className="w-full p-12 text-center space-y-6 flex flex-col justify-center bg-white items-center min-h-[400px] gpu-accelerated">
              <div className="relative">
                <div className="w-20 h-20 bg-[#01a3a4]/5 rounded-full flex items-center justify-center mx-auto mb-2 border-[3px] border-[#01a3a4] shadow-2xl animate-in zoom-in-50 duration-500">
                  <CheckCircle2 className="h-10 w-10 text-[#01a3a4]" />
                </div>
                <PartyPopper className="absolute -top-2 -right-4 h-8 w-8 text-[#01a3a4] animate-bounce" />
              </div>

              <div className="space-y-4">
                <DialogTitle className="text-4xl font-black text-black uppercase tracking-tighter leading-none font-headline animate-in slide-in-from-bottom-2 duration-700">
                  THANK YOU
                </DialogTitle>
                <div className="h-1 w-12 bg-[#01a3a4] mx-auto rounded-full" />
                <p className="text-[12px] font-black text-[#01a3a4] uppercase tracking-[0.4em]">অর্ডার সফল হয়েছে</p>
                <div className="py-2 px-6">
                  <p className="text-[12px] font-bold text-black font-headline leading-relaxed">
                    যত দ্রুত সম্ভব আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবে
                  </p>
                </div>
                <div className="pt-6">
                   <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em] animate-pulse">স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে...</p>
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
