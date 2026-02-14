"use client";

import React, { useState, useEffect } from 'react';
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
  Loader2,
  Share2,
  Contact2,
  Truck,
  MessageSquare,
  Zap,
  QrCode,
  Facebook,
  Instagram,
  Youtube,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.029c0 2.119.554 4.187 1.605 6.006L0 24l6.117-1.605a11.821 11.821 0 005.928 1.603h.005c6.635 0 12.03-5.393 12.033-12.03a11.75 11.75 0 00-3.517-8.482z"/>
  </svg>
);

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
        <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-500/30">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-2 md:px-12 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-foreground p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6 text-orange-500" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Global Configuration</p>
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
                        <Zap className="h-4 w-4 text-orange-500" /> ফ্ল্যাশ বার এনিমেশন সক্রিয় করুন
                      </label>
                      <p className="text-[8px] text-orange-500 uppercase font-bold tracking-widest">
                        {formData.showVideoInAppBar ? "ANIMATED FLASH BAR ACTIVE" : "QR CODE MODE ACTIVE"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2">
                    <QrCode className="h-3 w-3" /> QR CODE REDIRECT LINK
                  </label>
                  <Input 
                    value={formData.qrCodeLink}
                    onChange={(e) => setFormData({...formData, qrCodeLink: e.target.value})}
                    placeholder="https://sssmarthaat.com"
                    className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-orange-500"
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
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2"><Mail className="h-3 w-3" /> EMAIL ADDRESS</label>
                  <Input 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value.toUpperCase()})}
                    className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2"><Phone className="h-3 w-3" /> PHONE NUMBER</label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2"><Globe className="h-3 w-3" /> OFFICE ADDRESS</label>
                  <Input 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value.toUpperCase()})}
                    className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-orange-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> SOCIAL MEDIA CHANNELS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><Facebook className="h-3.5 w-3.5 text-blue-500" /> FACEBOOK URL</label>
                    <Input value={formData.facebookUrl} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} placeholder="https://facebook.com/..." className="bg-black border-white/20 h-11 text-[10px] font-bold text-white focus:border-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><Instagram className="h-3.5 w-3.5 text-pink-500" /> INSTAGRAM URL</label>
                    <Input value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} placeholder="https://instagram.com/..." className="bg-black border-white/20 h-11 text-[10px] font-bold text-white focus:border-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><WhatsAppIcon className="h-3.5 w-3.5 text-green-500" /> WHATSAPP NUMBER / LINK</label>
                    <Input value={formData.whatsappUrl} onChange={(e) => setFormData({...formData, whatsappUrl: e.target.value})} placeholder="017XXXXXXXX" className="bg-black border-white/20 h-11 text-[10px] font-bold text-white focus:border-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><Youtube className="h-3.5 w-3.5 text-red-500" /> YOUTUBE CHANNEL URL</label>
                    <Input value={formData.youtubeUrl} onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="https://youtube.com/..." className="bg-black border-white/20 h-11 text-[10px] font-bold text-white focus:border-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-orange-500 uppercase">OUTSIDE DHAKA</label>
                    <Input 
                      type="number"
                      value={formData.deliveryChargeOutside}
                      onChange={(e) => setFormData({...formData, deliveryChargeOutside: e.target.value})}
                      className="bg-black border-white/20 rounded-none h-12 text-xs font-black text-white focus:border-orange-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="button" onClick={() => window.location.reload()} variant="outline" className="flex-1 border-white/20 text-foreground h-20 font-black uppercase rounded-none text-[10px] hover:bg-white/5">CANCEL</Button>
              <Button type="submit" className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white h-20 font-black uppercase tracking-[0.3em] rounded-none shadow-2xl text-xs border-none transition-all">
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
