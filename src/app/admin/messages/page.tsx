
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  User, 
  Clock, 
  Search,
  Loader2,
  CheckCircle2,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Badge } from '@/components/ui/badge';

export default function AdminMessages() {
  const db = useFirestore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Get all unique chats (grouped by orderId, which could be temp IDs)
  const allMessagesQuery = useMemoFirebase(() => query(collection(db, 'messages'), orderBy('createdAt', 'desc')), [db]);
  const { data: allMessages, isLoading } = useCollection(allMessagesQuery);

  // Filter unique chats
  const uniqueChats = React.useMemo(() => {
    if (!allMessages) return [];
    const seen = new Set();
    return allMessages.filter(msg => {
      const duplicate = seen.has(msg.orderId);
      seen.add(msg.orderId);
      return !duplicate;
    });
  }, [allMessages]);

  // Selected chat messages
  const chatQuery = useMemoFirebase(() => {
    if (!selectedOrderId) return null;
    return query(
      collection(db, 'messages'),
      where('orderId', '==', selectedOrderId),
      orderBy('createdAt', 'asc')
    );
  }, [db, selectedOrderId]);

  const { data: activeChat } = useCollection(chatQuery);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedOrderId) return;

    addDocumentNonBlocking(collection(db, 'messages'), {
      orderId: selectedOrderId,
      text: replyText,
      sender: 'ADMIN',
      createdAt: new Date().toISOString()
    });

    setReplyText('');
  };

  const selectedChatInfo = uniqueChats.find(c => c.orderId === selectedOrderId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">Customer Engagement</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">MESSAGE CENTER</h1>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[700px]">
          {/* CHAT LIST */}
          <Card className="col-span-4 bg-card border-white/5 rounded-none overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
               <div className="relative">
                 <Input placeholder="SEARCH CHATS..." className="bg-black/50 border-white/10 rounded-none h-12 pl-10 text-[10px] font-black uppercase" />
                 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
               </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="h-8 w-8 text-[#01a3a4] animate-spin" />
                  <p className="text-[8px] font-black text-[#01a3a4] uppercase tracking-widest">Syncing Messages...</p>
                </div>
              ) : uniqueChats.length === 0 ? (
                <div className="text-center py-20">
                  <MessageSquare className="h-10 w-10 text-white/10 mx-auto mb-4" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No messages found.</p>
                </div>
              ) : uniqueChats.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedOrderId(chat.orderId)}
                  className={`p-6 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.03] group ${selectedOrderId === chat.orderId ? 'bg-[#01a3a4]/10 border-l-4 border-l-[#01a3a4]' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{chat.customerName || 'GUEST'}</h3>
                    <span className="text-[8px] font-mono text-white/40">{new Date(chat.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-white/60 line-clamp-1 italic">"{chat.text}"</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className="bg-white/5 border-white/10 text-[7px] font-black h-4 px-1 rounded-none uppercase">ID: {chat.orderId.slice(0, 8)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ACTIVE CHAT WINDOW */}
          <Card className="col-span-8 bg-card border-white/5 rounded-none flex flex-col overflow-hidden shadow-2xl">
            {selectedOrderId ? (
              <>
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-[#01a3a4]/10 flex items-center justify-center border border-[#01a3a4]/20">
                      <User className="h-6 w-6 text-[#01a3a4]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white uppercase tracking-tighter">{selectedChatInfo?.customerName || 'GUEST CUSTOMER'}</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-[#01a3a4] uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> ACTIVE SESSION
                        </span>
                        <span className="text-[9px] font-mono text-white/40">ID: #{selectedOrderId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-10 space-y-8 bg-black/20">
                  {activeChat?.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] space-y-2`}>
                        <div className={`p-5 text-[12px] font-medium leading-relaxed shadow-xl ${
                          msg.sender === 'ADMIN' 
                            ? 'bg-[#01a3a4] text-white rounded-l-3xl rounded-tr-3xl' 
                            : 'bg-white/5 border border-white/10 text-white rounded-r-3xl rounded-tl-3xl'
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-2 px-2 ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                          <Clock className="h-2.5 w-2.5 text-white/30" />
                          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendReply} className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4">
                  <Input 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="TYPE YOUR RESPONSE..." 
                    className="flex-grow bg-black/50 border-white/10 h-16 rounded-none text-[11px] font-black uppercase px-6 tracking-widest focus:ring-[#01a3a4]"
                  />
                  <Button type="submit" className="h-16 w-24 bg-[#01a3a4] hover:bg-[#01a3a4]/90 rounded-none shadow-2xl shadow-[#01a3a4]/10">
                    <Send className="h-6 w-6 text-white" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center space-y-6">
                <div className="w-24 h-24 bg-white/5 flex items-center justify-center border border-white/10 rounded-full">
                  <MessageSquare className="h-10 w-10 text-white/20" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">SELECT A CONVERSATION</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mt-2">Pick a chat from the sidebar to start engaging.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
