
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
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Sparkles, 
  Loader2, 
  MessageCircle,
  ShieldCheck,
  Lock,
  User
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
    adminUsername: '',
    adminPassword: ''
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
        adminUsername: settings.adminUsername || 'ADMIN',
        adminPassword: settings.adminPassword || '4321'
      });
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDocumentNonBlocking(settingsRef, formData, { merge: true });
    toast({
      title: "CONFIGURATION UPDATED",
      description: "SECURITY AND BRAND DETAILS HAVE BEEN SUCCESSFULLY SYNCED.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Additional Configuration</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">OTHERS MANAGEMENT</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSave} className="space-y-8">
            {/* SECURITY CONFIGURATION */}
            <Card className="bg-card border-orange-600/20 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-orange-600/5 border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> ADMIN ACCESS CONFIGURATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <User className="h-3 w-3" /> ADMIN USERNAME
                    </label>
                    <Input 
                      value={formData.adminUsername}
                      onChange={(e) => setFormData({...formData, adminUsername: e.target.value})}
                      placeholder="E.G. ADMIN"
                      className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <Lock className="h-3 w-3" /> ADMIN PASSWORD
                    </label>
                    <Input 
                      type="text"
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                      placeholder="E.G. 4321"
                      className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white"
                    />
                  </div>
                </div>
                <p className="text-[8px] text-orange-600 font-black uppercase tracking-[0.2em] italic">
                  * এই ইউজারনেম এবং পাসওয়ার্ড দিয়ে ভবিষ্যতে এডমিন প্যানেলে প্রবেশ করতে হবে।
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                  <Globe className="h-4 w-4" /> BRAND & CONTACT INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <Mail className="h-3 w-3" /> OFFICIAL EMAIL
                    </label>
                    <Input 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value.toUpperCase()})}
                      placeholder="INFO@SSSMARTHAAT.COM"
                      className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <Phone className="h-3 w-3" /> HELPLINE NUMBER
                    </label>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+880 1XXX XXXXXX"
                      className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> CORPORATE ADDRESS
                  </label>
                  <Input 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value.toUpperCase()})}
                    placeholder="BANANI, DHAKA, BANGLADESH"
                    className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                    <Sparkles className="h-3 w-3" /> COMPANY BENGALI PROFILE
                  </label>
                  <Textarea 
                    value={formData.descriptionBengali}
                    onChange={(e) => setFormData({...formData, descriptionBengali: e.target.value})}
                    placeholder="এসএস স্মার্ট হাট — বাংলাদেশের প্রিমিয়াম ফ্যাশন এবং লাইফস্টাইল মার্কেটপ্লেস..."
                    className="bg-black/50 border-white/10 rounded-none text-sm min-h-[150px] leading-relaxed"
                  />
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">SOCIAL MEDIA CHANNELS</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Facebook className="h-3 w-3" /> FACEBOOK</label>
                      <Input value={formData.facebookUrl} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} className="bg-black/50 border-white/10 rounded-none text-[10px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Instagram className="h-3 w-3" /> INSTAGRAM</label>
                      <Input value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} className="bg-black/50 border-white/10 rounded-none text-[10px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><MessageCircle className="h-3 w-3" /> WHATSAPP</label>
                      <Input value={formData.whatsappUrl} onChange={(e) => setFormData({...formData, whatsappUrl: e.target.value})} placeholder="HTTPS://WA.ME/8801XXXXXXXXX" className="bg-black/50 border-white/10 rounded-none text-[10px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Youtube className="h-3 w-3" /> YOUTUBE</label>
                      <Input value={formData.youtubeUrl} onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})} className="bg-black/50 border-white/10 rounded-none text-[10px]" />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-16 font-black uppercase tracking-[0.2em] rounded-none shadow-2xl shadow-orange-600/10 text-xs mt-6">
                  <Save className="mr-3 h-5 w-5" /> SAVE ALL CHANGES
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
