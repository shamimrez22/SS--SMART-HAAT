
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
  ShoppingBag, 
  CheckCircle2, 
  Loader2, 
  Phone, 
  MapPin, 
  User, 
  Ruler, 
  PartyPopper,
  Send,
  MessageCircle
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, addDoc } from 'firebase/firestore';
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
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [tempId, setTempId] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: ''
  });

  useEffect(() => {
    // Generate a temporary ID for chat if order is not placed yet
    if (!tempId) {
      setTempId('chat_' + Math.random().toString(36).substr(2, 9));
    }

    const userAgent = typeof window !== 'undefined' ? (navigator.userAgent || navigator.vendor || (window as any).opera) : '';
    if (/android|iphone|ipad|ipod/i.test(userAgent.toLowerCase())) {
      setIsActualMobile(true);
    }

    if (product?.sizes?.length > 0 && !formData.selectedSize) {
      setFormData(prev => ({ ...prev, selectedSize: product.sizes[0] }));
    }

    if (!isOpen) {
      const resetTimer = setTimeout(() => {
        setStep('FORM');
        setFormData({ name: '', phone: '', address: '', selectedSize: '' });
        setCurrentOrderId(null);
      }, 300);
      return () => clearTimeout(resetTimer);
    }
  }, [product, isOpen, tempId]);

  // Fetch messages for either currentOrderId or tempId
  const messagesQuery = useMemoFirebase(() => {
    const idToUse = currentOrderId || tempId;
    if (!idToUse) return null;
    return query(
      collection(db, 'messages'),
      where('orderId', '==', idToUse),
      orderBy('createdAt', 'asc')
    );
  }, [db, currentOrderId, tempId]);

  const { data: chatHistory } = useCollection(messagesQuery);

  // 3-second auto-close timer when reaching SUCCESS step
  useEffect(() => {
    if (step === 'SUCCESS') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

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

    const docPromise = addDoc(collection(db, 'orders'), orderData);
    docPromise.then((docRef) => {
      if (docRef) {
        setCurrentOrderId(docRef.id);
        // Link any previous temp messages to this new orderId
        // (Simplified for MVP: we just switch the active ID)
      }
    });
    
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const idToUse = currentOrderId || tempId;
    if (!chatMessage.trim() || !idToUse) return;

    addDocumentNonBlocking(collection(db, 'messages'), {
      orderId: idToUse,
      customerName: formData.name || 'GUEST',
      text: chatMessage,
      sender: 'CUSTOMER',
      createdAt: new Date().toISOString()
    });

    setChatMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-[1100px] p-0 bg-white border-none rounded-none overflow-hidden gap-0 shadow-2xl">
        <div className="flex flex-col md:flex-row h-full max-h-[95vh] min-h-[600px]">
          
          {/* LEFT SECTION: PRODUCT OR SUCCESS MSG */}
          <div className="w-full md:w-2/3 flex flex-col md:flex-row bg-white">
            {step === 'FORM' ? (
              <>
                {!isActualMobile && (
                  <div className="relative w-2/5 aspect-[4/5] bg-gray-50 border-r border-gray-100">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                      sizes="400px"
                      quality={75}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{product.name}</h2>
                      <div className="text-2xl font-black text-[#01a3a4] flex items-baseline tracking-tighter mt-1">
                        <span className="text-[0.45em] font-normal mr-1 translate-y-[-0.1em]">৳</span>
                        {product.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className={`${isActualMobile ? 'w-full' : 'w-3/5'} p-10 space-y-8 bg-white overflow-y-auto border-r border-gray-100`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1.5 bg-[#01a3a4]" />
                      <DialogTitle className="text-3xl font-black text-black uppercase tracking-tighter leading-none font-headline">CONFIRM ORDER</DialogTitle>
                    </div>
                    <DialogDescription className="text-[10px] text-[#01a3a4] uppercase font-black tracking-[0.2em]">
                      PLEASE PROVIDE YOUR ACCURATE DETAILS
                    </DialogDescription>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {product?.sizes && product.sizes.length > 0 && (
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                          <Ruler className="h-3.5 w-3.5 text-[#01a3a4]" /> SELECT SIZE
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {product.sizes.map((size: string) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setFormData({...formData, selectedSize: size})}
                              className={`px-4 py-2 border text-[10px] font-black uppercase transition-all ${
                                formData.selectedSize === size 
                                  ? 'bg-[#01a3a4] border-[#01a3a4] text-white' 
                                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-[#01a3a4]'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                          <User className="h-3 w-3 text-[#01a3a4]" /> FULL NAME
                        </label>
                        <input 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="YOUR NAME"
                          className="w-full bg-gray-50 border border-gray-200 rounded-none h-12 px-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black placeholder:text-gray-300"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                          <Phone className="h-3 w-3 text-[#01a3a4]" /> PHONE NUMBER
                        </label>
                        <input 
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="01XXXXXXXXX"
                          className="w-full bg-gray-50 border border-gray-200 rounded-none h-12 px-4 text-[11px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black placeholder:text-gray-300"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-[#01a3a4]" /> ADDRESS
                        </label>
                        <textarea 
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="HOUSE, AREA, CITY"
                          className="w-full bg-gray-50 border border-gray-200 rounded-none p-4 text-[11px] font-black uppercase tracking-widest min-h-[100px] focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    <Button 
                      disabled={loading}
                      type="submit" 
                      className="w-full bg-[#01a3a4] hover:bg-black text-white h-14 font-black uppercase tracking-[0.3em] rounded-none shadow-xl text-[12px] border-none"
                    >
                      {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "CONFIRM ORDER"}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="w-full p-16 text-center space-y-10 border-r border-gray-100 flex flex-col justify-center bg-white">
                <div className="relative">
                  <div className="w-24 h-24 bg-[#01a3a4]/5 rounded-full flex items-center justify-center mx-auto mb-6 border-[3px] border-[#01a3a4]">
                    <CheckCircle2 className="h-12 w-12 text-[#01a3a4]" />
                  </div>
                  <PartyPopper className="absolute -top-3 right-1/3 h-8 w-8 text-[#01a3a4] animate-bounce" />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.5em]">SUCCESSFUL</p>
                    <DialogTitle className="text-4xl font-black text-black uppercase tracking-tighter leading-none font-headline">
                      THANK YOU FOR YOUR ORDER
                    </DialogTitle>
                  </div>
                  
                  <p className="text-[18px] font-bold text-black italic font-headline py-8 border-y border-gray-50">
                    আমাদের একজন প্রতিনিধি যত দ্রুত সম্ভব যোগাযোগ করবে।
                  </p>

                  <Button onClick={onClose} className="w-full bg-black hover:bg-[#01a3a4] text-white font-black uppercase h-14 rounded-none text-[13px] tracking-[0.3em]">
                    DONE
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SECTION: REAL-TIME CHAT (ALWAYS VISIBLE) */}
          <div className="w-full md:w-1/3 flex flex-col bg-gray-50 min-h-[500px] md:min-h-0">
            <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#01a3a4]" />
                <h3 className="text-[10px] font-black text-black uppercase tracking-widest">LIVE SUPPORT</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-gray-400 uppercase">ONLINE</span>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {chatHistory?.length === 0 && (
                <div className="text-center py-10 opacity-40">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                    যেকোনো প্রয়োজনে আমাদের এখানে মেসেজ দিন।
                  </p>
                </div>
              )}
              {chatHistory?.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3.5 text-[10.5px] font-medium leading-relaxed ${
                    msg.sender === 'CUSTOMER' 
                      ? 'bg-[#01a3a4] text-white rounded-l-xl rounded-tr-xl shadow-md' 
                      : 'bg-white border border-gray-200 text-black rounded-r-xl rounded-tl-xl shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[7px] font-black text-gray-400 uppercase mt-1 px-1">
                    {msg.sender === 'CUSTOMER' ? 'YOU' : 'ADMIN'} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="TYPE MESSAGE..."
                className="flex-grow bg-gray-50 border border-gray-200 h-12 px-4 text-[10px] font-black uppercase focus:outline-none focus:border-[#01a3a4] transition-all"
              />
              <Button type="submit" size="icon" className="h-12 w-12 bg-[#01a3a4] hover:bg-black rounded-none">
                <Send className="h-4 w-4 text-white" />
              </Button>
            </form>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
