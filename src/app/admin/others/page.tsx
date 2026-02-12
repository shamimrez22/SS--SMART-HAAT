
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
  Video,
  Upload,
  X,
  Zap,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { optimizeVideo } from '@/lib/video-utils';

export default function AdminOthers() {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);

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
    appBarVideoUrl: ''
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
        appBarVideoUrl: settings.appBarVideoUrl || ''
      });
    }
  }, [settings]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingVideo(true);
    toast({
      title: "SUPER-FAST OPTIMIZATION",
      description: "SYSTEM IS CONVERTING VIDEO FOR 100% SPEED...",
    });

    try {
      const optimizedBase64 = await optimizeVideo(file);
      setFormData(prev => ({ ...prev, appBarVideoUrl: optimizedBase64 }));
      toast({
        title: "VIDEO READY",
        description: "VIDEO IS NOW COMPRESSED AND READY FOR LIVE DISPLAY.",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "PROCESS FAILED",
        description: "COULD NOT OPTIMIZE THIS VIDEO FORMAT.",
      });
    } finally {
      setIsProcessingVideo(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsRef) return;

    setDocumentNonBlocking(settingsRef, {
      ...formData,
      deliveryChargeInside: parseFloat(formData.deliveryChargeInside || '0'),
      deliveryChargeOutside: parseFloat(formData.deliveryChargeOutside || '0')
    }, { merge: true });
    
    toast({
      title: "CONFIGURATION SYNCED",
      description: "SITE DETAILS AND MEDIA SETTINGS HAVE BEEN UPDATED.",
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
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#01a3a4]" /> TOP FOLD MEDIA CONTROL
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                
                {/* CLEAR TICKMARK FOR QR VS VIDEO */}
                <div className="p-6 bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center gap-4">
                    <Checkbox 
                      id="video-toggle"
                      checked={formData.showVideoInAppBar} 
                      onCheckedChange={(val) => setFormData({...formData, showVideoInAppBar: !!val})} 
                      className="h-6 w-6 border-white/20 data-[state=checked]:bg-[#01a3a4] data-[state=checked]:border-[#01a3a4]"
                    />
                    <div className="space-y-1">
                      <label htmlFor="video-toggle" className="text-[11px] font-black text-foreground uppercase flex items-center gap-2 cursor-pointer">
                        <QrCode className="h-4 w-4 text-[#01a3a4]" /> টিক দিন: ভিডিও চলবে (OFF রাখলে QR শো করবে)
                      </label>
                      <p className="text-[8px] text-foreground/40 uppercase font-bold tracking-widest">
                        {formData.showVideoInAppBar ? "VIDEO MODE ACTIVE" : "QR CODE MODE ACTIVE"}
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-white/5 w-full" />
                  <p className="text-[9px] font-bold text-[#01a3a4] uppercase tracking-tighter leading-relaxed">
                    টিক মার্ক দিলে ভিডিও চলবে, টিক মার্ক না দিলে QR CODE এবং APP ডাউনলোড অপশন শো করবে।
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                    <Upload className="h-3 w-3" /> DIRECT VIDEO UPLOAD (100% FAST)
                  </label>
                  
                  {formData.appBarVideoUrl ? (
                    <div className="relative aspect-[9/16] w-full max-w-[250px] mx-auto bg-black border border-white/10 overflow-hidden group shadow-2xl">
                      <video 
                        key={formData.appBarVideoUrl}
                        src={formData.appBarVideoUrl} 
                        className="w-full h-full object-cover opacity-60"
                        autoPlay 
                        muted 
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          className="rounded-none h-10 px-6 font-black uppercase text-[10px]"
                          onClick={() => setFormData({...formData, appBarVideoUrl: ''})}
                        >
                          <X className="mr-2 h-4 w-4" /> REMOVE VIDEO
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">MOBILE PREVIEW SIZE</p>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => !isProcessingVideo && fileInputRef.current?.click()}
                      className={`border-2 border-dashed border-white/10 p-10 text-center cursor-pointer hover:border-primary/50 transition-all bg-black/30 flex flex-col items-center justify-center min-h-[300px] w-full max-w-[250px] mx-auto aspect-[9/16] ${isProcessingVideo ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {isProcessingVideo ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-10 w-10 text-primary animate-spin" />
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">REDUCING SIZE...</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Video className="h-8 w-8 mx-auto text-primary/40" />
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">SELECT MOBILE VIDEO</p>
                        </div>
                      )}
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleVideoUpload} 
                    accept="video/*" 
                    className="hidden" 
                  />
                  <div className="flex items-start gap-2 p-3 bg-green-600/5 border border-green-600/20">
                    <Zap className="h-4 w-4 text-green-500 shrink-0 animate-pulse" />
                    <p className="text-[8px] font-black text-green-500 uppercase leading-relaxed tracking-wider">
                      SYSTEM IS CONFIGURED FOR 100% SPEED. ALL VIDEOS ARE COMPRESSED TO ENSURE INSTANT LOADING.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-2">
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
                    className="bg-black border-green-600/30 rounded-none h-12 text-sm font-black text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><Mail className="h-3 w-3" /> EMAIL ADDRESS</label>
                  <Input 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value.toUpperCase()})}
                    className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><Phone className="h-3 w-3" /> PHONE NUMBER</label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-foreground"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4" /> DELIVERY CHARGES (BDT)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground uppercase">INSIDE DHAKA</label>
                    <Input 
                      type="number"
                      value={formData.deliveryChargeInside}
                      onChange={(e) => setFormData({...formData, deliveryChargeInside: e.target.value})}
                      className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground uppercase">OUTSIDE DHAKA</label>
                    <Input 
                      type="number"
                      value={formData.deliveryChargeOutside}
                      onChange={(e) => setFormData({...formData, deliveryChargeOutside: e.target.value})}
                      className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-foreground"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> SOCIAL MEDIA CHANNELS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Facebook className="h-3 w-3 text-blue-500" /> FACEBOOK URL</label>
                    <Input value={formData.facebookUrl} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} className="bg-black border-white/10 h-11 text-[10px] font-bold text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Instagram className="h-3 w-3 text-pink-500" /> INSTAGRAM URL</label>
                    <Input value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} className="bg-black border-white/10 h-11 text-[10px] font-bold text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-primary hover:bg-white hover:text-black text-primary-foreground h-20 font-black uppercase tracking-[0.3em] rounded-none shadow-2xl text-xs border-none transition-all">
              <Save className="mr-3 h-5 w-5" /> SYNC ALL SITE SETTINGS
            </Button>
          </div>

        </form>
      </main>
      
      <Footer />
    </div>
  );
}
