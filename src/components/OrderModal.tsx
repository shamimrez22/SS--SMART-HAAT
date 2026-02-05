
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Loader2, 
  Phone, 
  MapPin, 
  User, 
  Ruler, 
  PartyPopper,
  Send,
  MessageCircle,
  Hash,
  ArrowLeft
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

export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
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

  const { data: rawChatHistory, isLoading: isChatLoading } = useCollection(messagesQuery);

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
        "p-0 bg-white border-none rounded-none overflow-hidden gap-0 shadow-2xl transition-all duration-300",
        step === 'SUCCESS' ? "max-w-[320px]" : isMobile ? "max-w-full h-full sm:h-auto sm:max-w-[480px]" : "max-w-[480px]"
      )}>
        <div className="flex flex-col h-full max-h-[100vh] sm:max-h-[95vh]">
          {step === 'FORM' ? (
            <>
              {/* ORDER FORM VIEW */}
              <div className="flex-grow p-6 space-y-4 bg-white overflow-y-auto relative">
                {/* SMALL PRODUCT IMAGE IN CORNER */}
                <div className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 border border-gray-100 shadow-sm z-10 bg-white">
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 bg-[#01a3a4]" />
                    <DialogTitle className="text-xl font-black text-black uppercase tracking-tighter leading-none font-headline">ORDER CONFIRM</DialogTitle>
                  </div>
                  <p className="text-[9px] font-bold text-[#01a3a4] uppercase tracking-widest truncate pr-16">{product.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Ruler className="h-3 w-3 text-[#01a3a4]" /> SIZE
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {product?.sizes?.length > 0 ? product.sizes.map((size: string) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setFormData({...formData, selectedSize: size})}
                            className={cn(
                              "px-2.5 py-1 border text-[9px] font-black uppercase transition-all",
                              formData.selectedSize === size 
                                ? 'bg-[#01a3a4] border-[#01a3a4] text-white' 
                                : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-[#01a3a4]'
                            )}
                          >
                            {size}
                          </button>
                        )) : (
                          <span className="text-[8px] font-black text-gray-400 uppercase">N/A</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Hash className="h-3 w-3 text-[#01a3a4]" /> QTY
                      </label>
                      <input 
                        type="number"
                        min="1"
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-none h-9 px-3 text-[11px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="h-3 w-3 text-[#01a3a4]" /> NAME
                      </label>
                      <input 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="FULL NAME"
                        className="w-full bg-gray-50 border border-gray-200 rounded-none h-11 px-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-[#01a3a4]" /> PHONE
                      </label>
                      <input 
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-gray-50 border border-gray-200 rounded-none h-11 px-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-[#01a3a4]" /> ADDRESS
                      </label>
                      <textarea 
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="AREA & CITY"
                        className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-[11px] font-black uppercase tracking-widest min-h-[70px] focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#01a3a4] hover:bg-black text-white h-14 font-black uppercase tracking-[0.4em] rounded-none shadow-xl text-[12px] border-none"
                  >
                    অর্ডার নিশ্চিত করুন
                  </Button>
                  
                  {isMobile && (
                    <button 
                      type="button"
                      onClick={() => setStep('CHAT')}
                      className="w-full flex items-center justify-center gap-2 text-[9px] font-black text-[#01a3a4] uppercase tracking-widest py-2 hover:bg-gray-50 transition-all"
                    >
                      <MessageCircle className="h-4 w-4" /> MESSAGE SUPPORT
                    </button>
                  )}
                </form>
              </div>

              {/* DESKTOP ONLY: INLINE CHAT (Ager moto) */}
              {!isMobile && (
                <div className="flex flex-col bg-gray-50 h-[220px] shrink-0 border-t border-gray-100">
                  <div className="p-3 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-[#01a3a4]" />
                      <h3 className="text-[9px] font-black text-black uppercase tracking-widest">SUPPORT CHAT</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-black text-gray-400 uppercase">ONLINE</span>
                    </div>
                  </div>

                  <div 
                    ref={chatScrollContainerRef}
                    className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50/50"
                  >
                    {chatHistory.length === 0 && (
                      <div className="text-center py-4 opacity-40">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                          অর্ডার নিয়ে কোনো প্রশ্ন থাকলে এখানে মেসেজ দিন।
                        </p>
                      </div>
                    )}
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={cn("flex flex-col", msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start')}>
                        <div className={cn(
                          "max-w-[80%] p-3 text-[10px] font-bold leading-tight",
                          msg.sender === 'CUSTOMER' 
                            ? 'bg-[#01a3a4] text-white rounded-l-lg rounded-tr-lg' 
                            : 'bg-white border border-gray-200 text-black rounded-r-lg rounded-tl-lg'
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="MESSAGE..."
                      className="flex-grow bg-gray-50 border border-gray-200 h-10 px-4 text-[10px] font-black uppercase text-black focus:outline-none focus:border-[#01a3a4]"
                    />
                    <Button type="submit" size="icon" className="h-10 w-10 bg-[#01a3a4] hover:bg-black rounded-none shrink-0 border-none">
                      <Send className="h-4 w-4 text-white" />
                    </Button>
                  </form>
                </div>
              )}
            </>
          ) : step === 'CHAT' ? (
            /* MOBILE SEPARATE CHAT VIEW */
            <div className="flex flex-col h-full bg-white">
              <div className="p-4 bg-[#01a3a4] flex items-center gap-4">
                <button onClick={() => setStep('FORM')} className="text-white hover:scale-110 transition-transform">
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="flex-grow">
                  <h3 className="text-white font-black text-sm uppercase tracking-tighter">SUPPORT CHAT</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-white/70 uppercase">LIVE AGENT</span>
                  </div>
                </div>
              </div>

              <div 
                ref={chatScrollContainerRef}
                className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50"
              >
                {chatHistory.length === 0 && (
                  <div className="text-center py-20 opacity-30">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-[#01a3a4]" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">কিভাবে সাহায্য করতে পারি?</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col", msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start')}>
                    <div className={cn(
                      "max-w-[85%] p-4 text-[12px] font-bold leading-tight shadow-sm",
                      msg.sender === 'CUSTOMER' 
                        ? 'bg-[#01a3a4] text-white rounded-l-xl rounded-tr-xl' 
                        : 'bg-white border border-gray-100 text-black rounded-r-xl rounded-tl-xl'
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-3">
                <input 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="আপনার মেসেজ লিখুন..."
                  className="flex-grow bg-gray-50 border border-gray-200 h-12 px-4 text-xs font-bold text-black focus:outline-none focus:border-[#01a3a4]"
                />
                <Button type="submit" size="icon" className="h-12 w-12 bg-[#01a3a4] hover:bg-black rounded-none shrink-0 border-none">
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </form>
            </div>
          ) : (
            /* SUCCESS VIEW */
            <div className="w-full p-8 text-center space-y-4 flex flex-col justify-center bg-white items-center min-h-[300px]">
              <div className="relative">
                <div className="w-16 h-16 bg-[#01a3a4]/5 rounded-full flex items-center justify-center mx-auto mb-2 border-[2px] border-[#01a3a4]">
                  <CheckCircle2 className="h-8 w-8 text-[#01a3a4]" />
                </div>
                <PartyPopper className="absolute -top-1 right-[35%] h-6 w-6 text-[#01a3a4] animate-bounce" />
              </div>

              <div className="space-y-3">
                <DialogTitle className="text-3xl font-black text-black uppercase tracking-tighter leading-none font-headline">
                  THANK YOU
                </DialogTitle>
                <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">অর্ডার সফল হয়েছে</p>
                <div className="py-2">
                  <p className="text-[12px] font-bold text-black font-headline leading-tight">
                    আমাদের প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।
                  </p>
                </div>
                <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mt-4">স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে...</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
