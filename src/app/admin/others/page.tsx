
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Youtube, 
  Sparkles, 
  Loader2,
  Share2,
  Contact2,
  Twitter,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function AdminOthers() {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
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
    qrCodeLink: ''
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
        qrCodeLink: settings.qrCodeLink || 'https://sssmarthaat.com'
      });
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDocumentNonBlocking(settingsRef, formData, { merge: true });
    toast({
      title: "CONFIGURATION SYNCED",
      description: "SITE DETAILS HAVE BEEN SUCCESSFULLY UPDATED.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6 text-[#01a3a4]" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">Global Configuration</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">OTHERS MANAGEMENT</h1>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Contact2 className="h-4 w-4" /> CONTACT & IDENTITY
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><Mail className="h-3 w-3" /> EMAIL ADDRESS</label>
                  <Input 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value.toUpperCase()})}
                    placeholder="INFO@EXAMPLE.COM"
                    className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><Phone className="h-3 w-3" /> PHONE NUMBER</label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+880 1XXX XXXXXX"
                    className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><MapPin className="h-3 w-3" /> CORPORATE ADDRESS</label>
                  <Input 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value.toUpperCase()})}
                    placeholder="BANANI, DHAKA"
                    className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> BENGALI BRAND PROFILE
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <Textarea 
                  value={formData.descriptionBengali}
                  onChange={(e) => setFormData({...formData, descriptionBengali: e.target.value})}
                  placeholder="এসএস স্মার্ট হাট — বাংলাদেশের প্রিমিয়াম ফ্যাশন এবং লাইফস্টাইল..."
                  className="bg-black border-white/10 rounded-none text-sm min-h-[180px] leading-relaxed font-bold italic"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> SOCIAL MEDIA CHANNELS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Facebook className="h-3 w-3 text-blue-500" /> FACEBOOK URL</label>
                    <Input value={formData.facebookUrl} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} className="bg-black border-white/10 h-11 text-[10px] font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Instagram className="h-3 w-3 text-pink-500" /> INSTAGRAM URL</label>
                    <Input value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} className="bg-black border-white/10 h-11 text-[10px] font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><MessageCircle className="h-3 w-3 text-green-500" /> WHATSAPP URL</label>
                    <Input value={formData.whatsappUrl} onChange={(e) => setFormData({...formData, whatsappUrl: e.target.value})} placeholder="HTTPS://WA.ME/..." className="bg-black border-white/10 h-11 text-[10px] font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Youtube className="h-3 w-3 text-red-500" /> YOUTUBE URL</label>
                    <Input value={formData.youtubeUrl} onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})} className="bg-black border-white/10 h-11 text-[10px] font-bold" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                  <QrCode className="h-4 w-4" /> APP & QR CONFIG
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2">QR CODE REDIRECT URL (FOR HOME SIDEBAR)</label>
                  <Input 
                    value={formData.qrCodeLink} 
                    onChange={(e) => setFormData({...formData, qrCodeLink: e.target.value})} 
                    placeholder="HTTPS://EXAMPLE.COM/DOWNLOAD" 
                    className="bg-black border-white/10 h-11 text-[10px] font-bold text-orange-500" 
                  />
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-2">THIS LINK WILL BE ENCODED INTO THE SIDEBAR QR CODE.</p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white h-20 font-black uppercase tracking-[0.3em] rounded-none shadow-2xl text-xs border-none">
              <Save className="mr-3 h-5 w-5" /> SYNC ALL SITE SETTINGS
            </Button>
          </div>

        </form>
      </main>
      
      <Footer />
    </div>
  );
}
