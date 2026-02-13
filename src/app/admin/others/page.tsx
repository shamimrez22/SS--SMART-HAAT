"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Save, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Loader2,
  Share2,
  Contact2,
  Truck,
  MessageSquare,
  Zap,
  QrCode,
  Sparkles,
  LayoutDashboard,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function AdminOthers() {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    descriptionBengali: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    whatsappUrl: '',
    qrCodeLink: '',
    deliveryChargeInside: '',
    deliveryChargeOutside: '',
    showVideoInAppBar: false,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        descriptionBengali: settings.descriptionBengali || '',
        facebookUrl: settings.facebookUrl || '',
        instagramUrl: settings.instagramUrl || '',
        twitterUrl: settings.twitterUrl || '',
        youtubeUrl: settings.youtubeUrl || '',
        whatsappUrl: settings.whatsappUrl || '',
        qrCodeLink: settings.qrCodeLink || 'https://sssmarthaat.com',
        deliveryChargeInside: settings.deliveryChargeInside?.toString() || '60',
        deliveryChargeOutside: settings.deliveryChargeOutside?.toString() || '120',
        showVideoInAppBar: settings.showVideoInAppBar || false,
      });
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsRef) return;

    setDocumentNonBlocking(settingsRef, {
      ...formData,
      deliveryChargeInside: parseFloat(formData.deliveryChargeInside || '0'),
      deliveryChargeOutside: parseFloat(formData.deliveryChargeOutside || '0')
    }, { merge: true });
    
    toast({
      title: "SETTINGS SYNCED",
      description: "ALL CONFIGURATIONS ARE NOW LIVE.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-foreground p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-foreground opacity-60 uppercase tracking-[0.3em]">Global Configuration</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">OTHERS MANAGEMENT</h1>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                  <Zap className="h-4 w-4" /> TOP FOLD MEDIA CONTROL
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="p-6 bg-white/[0.03] border border-white/10 space-y-6">
                  <div className="flex items-center gap-4">
                    <Checkbox 
                      id="video-toggle"
                      checked={formData.showVideoInAppBar} 
                      onCheckedChange={(val) => setFormData({...formData, showVideoInAppBar: !!val})} 
                      className="h-6 w-6 border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <div className="space-y-1">
                      <label htmlFor="video-toggle" className="text-[11px] font-black text-white uppercase flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4 text-orange-500" /> টিক দিন: ফ্ল্যাশ বার চলবে (OFF রাখলে QR শো করবে)
                      </label>
                      <p className="text-[8px] text-orange-500 uppercase font-bold tracking-widest">
                        {formData.showVideoInAppBar ? "ANIMATED FLASH BAR ACTIVE" : "QR CODE MODE ACTIVE"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-orange-500/5 border border-orange-500/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-orange-500 animate-pulse" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">NEW: PERFORMANCE UPDATE</p>
                  </div>
                  <p className="text-[9px] text-white/60 uppercase leading-relaxed font-bold">
                    সরাসরি ভিডিওর পরিবর্তে এখন ফ্ল্যাশ অফারের ইমেজগুলো এনিমেশনের মাধ্যমে সচল থাকবে। এতে আপনার ওয়েবসাইট অনেক বেশি ফাস্ট থাকবে।
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2">
                    <QrCode className="h-3 w-3" /> QR CODE REDIRECT LINK
                  </label>
                  <Input 
                    value={formData.qrCodeLink}
                    onChange={(e) => setFormData({...formData, qrCodeLink: e.target.value})}
                    placeholder="https://sssmarthaat.com"
                    className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-[#01a3a4]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                  <Contact2 className="h-4 w-4" /> CONTACT & IDENTITY
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2 p-4 bg-green-600/5 border border-green-600/20">
                  <label className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5" /> CHAT LIVE (WHATSAPP)
                  </label>
                  <Input 
                    required
                    value={formData.whatsappUrl}
                    onChange={(e) => setFormData({...formData, whatsappUrl: e.target.value})}
                    placeholder="E.G. 017XXXXXXXX"
                    className="bg-black border-green-600/30 rounded-none h-12 text-sm font-black text-white focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2"><Mail className="h-3 w-3" /> EMAIL ADDRESS</label>
                  <Input 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value.toUpperCase()})}
                    className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-[#01a3a4]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2"><Phone className="h-3 w-3" /> PHONE NUMBER</label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-[#01a3a4]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                  <Truck className="h-4 w-4" /> DELIVERY CHARGES (BDT)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-orange-500 uppercase">INSIDE DHAKA</label>
                    <Input 
                      type="number"
                      value={formData.deliveryChargeInside}
                      onChange={(e) => setFormData({...formData, deliveryChargeInside: e.target.value})}
                      className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-[#01a3a4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-orange-500 uppercase">OUTSIDE DHAKA</label>
                    <Input 
                      type="number"
                      value={formData.deliveryChargeOutside}
                      onChange={(e) => setFormData({...formData, deliveryChargeOutside: e.target.value})}
                      className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-[#01a3a4]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> SOCIAL MEDIA CHANNELS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><Facebook className="h-3 w-3 text-blue-500" /> FACEBOOK URL</label>
                    <Input value={formData.facebookUrl} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} className="bg-black border-white/20 h-11 text-[10px] font-bold text-white focus:border-[#01a3a4]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><Instagram className="h-3 w-3 text-pink-500" /> INSTAGRAM URL</label>
                    <Input value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} className="bg-black border-white/20 h-11 text-[10px] font-bold text-white focus:border-[#01a3a4]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="button" onClick={() => window.location.reload()} variant="outline" className="flex-1 border-white/20 text-foreground h-20 font-black uppercase rounded-none text-[10px] hover:bg-white/5">CANCEL</Button>
              <Button type="submit" className="flex-[2] bg-[#01a3a4] hover:bg-white hover:text-black text-white h-20 font-black uppercase tracking-[0.3em] rounded-none shadow-2xl text-xs border-none transition-all">
                <Save className="mr-3 h-5 w-5" /> SYNC ALL SITE SETTINGS
              </Button>
            </div>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
}
