
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Lock, 
  Save, 
  Loader2,
  Terminal,
  ExternalLink,
  Github,
  ShieldAlert,
  MapPin,
  Smartphone,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AdminSettings() {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const [adminData, setAdminData] = useState({
    adminUsername: '',
    adminPassword: ''
  });

  const [locationData, setLocationData] = useState({
    liveLocation: '',
    liveStatus: '',
    verificationPassword: ''
  });

  useEffect(() => {
    if (settings) {
      setAdminData({
        adminUsername: settings.adminUsername || 'ADMIN',
        adminPassword: settings.adminPassword || '4321'
      });
      setLocationData(prev => ({
        ...prev,
        liveLocation: settings.liveLocation || 'BANANI, DHAKA',
        liveStatus: settings.liveStatus || 'OPEN & READY TO SHIP'
      }));
    }
  }, [settings]);

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setDocumentNonBlocking(settingsRef, adminData, { merge: true });
    toast({
      title: "SECURITY UPDATED",
      description: "ADMIN CREDENTIALS HAVE BEEN SUCCESSFULLY CHANGED.",
    });
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (locationData.verificationPassword !== adminData.adminPassword) {
      toast({
        variant: "destructive",
        title: "ACCESS DENIED",
        description: "INVALID PASSWORD. CANNOT UPDATE LOCATION.",
      });
      return;
    }

    setDocumentNonBlocking(settingsRef, {
      liveLocation: locationData.liveLocation.toUpperCase(),
      liveStatus: locationData.liveStatus.toUpperCase()
    }, { merge: true });

    toast({
      title: "LOCATION UPDATED",
      description: "STORE STATUS HAS BEEN BROADCAST TO CUSTOMERS.",
    });
    
    setLocationData(prev => ({ ...prev, verificationPassword: '' }));
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : 'https://sssmarthaat.com')}`;

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
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">Security & Operations</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SYSTEM SETTINGS</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="space-y-8 lg:col-span-1">
            {/* ADMIN AUTH */}
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> ADMIN AUTHENTICATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSaveAdmin} className="space-y-6">
                  <div className="p-3 bg-orange-500/5 border border-orange-500/20 mb-4 flex items-start gap-3">
                    <ShieldAlert className="h-4 w-4 text-orange-500 shrink-0" />
                    <p className="text-[8px] font-black text-orange-500 uppercase leading-relaxed tracking-widest">
                      CAUTION: CREDENTIALS CHANGE WILL REQUIRE RE-LOGIN.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><User className="h-3 w-3" /> USERNAME</label>
                      <Input 
                        value={adminData.adminUsername}
                        onChange={(e) => setAdminData({...adminData, adminUsername: e.target.value})}
                        className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Lock className="h-3 w-3" /> ACCESS PASSWORD</label>
                      <Input 
                        value={adminData.adminPassword}
                        onChange={(e) => setAdminData({...adminData, adminPassword: e.target.value})}
                        type="text"
                        className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-white"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white h-12 font-black uppercase tracking-widest rounded-none text-[9px]">
                    UPDATE SECURITY
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* LOCATION & STATUS */}
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> LOCATION & LIVE STATUS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSaveLocation} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase">CURRENT LOCATION</label>
                      <Input 
                        value={locationData.liveLocation}
                        onChange={(e) => setLocationData({...locationData, liveLocation: e.target.value})}
                        className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-white"
                        placeholder="E.G. BANANI, DHAKA"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase">LIVE STATUS MESSAGE</label>
                      <Input 
                        value={locationData.liveStatus}
                        onChange={(e) => setLocationData({...locationData, liveStatus: e.target.value})}
                        className="bg-black border-white/10 rounded-none h-12 text-xs font-black text-white"
                        placeholder="E.G. OPEN & READY TO SHIP"
                      />
                    </div>
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><Lock className="h-3 w-3" /> VERIFY PASSWORD TO UPDATE</label>
                      <Input 
                        type="password"
                        value={locationData.verificationPassword}
                        onChange={(e) => setLocationData({...locationData, verificationPassword: e.target.value})}
                        className="bg-black border-orange-500/20 rounded-none h-12 text-xs font-black text-white"
                        placeholder="••••"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 font-black uppercase tracking-widest rounded-none text-[9px]">
                    BROADCAST UPDATE
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 lg:col-span-2">
            {/* MOBILE PREVIEW SECTION */}
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> MOBILE PREVIEW & SYNC
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="bg-white p-4 border-4 border-[#01a3a4] shadow-2xl shrink-0">
                    <Image src={qrCodeUrl} alt="Mobile QR" width={200} height={200} className="w-40 h-40 md:w-48 md:h-48" />
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">কিভাবে মোবাইলে চেক করবেন?</h3>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                        ১. আপনার স্মার্টফোনের ক্যামেরা বা কিউআর কোড স্ক্যানার ওপেন করুন।<br/>
                        ২. পাশের কোডটি স্ক্যান করুন।<br/>
                        ৩. সরাসরি আপনার মোবাইলে ওয়েবসাইটের লাইভ রেসপন্সিভ ভিউ দেখতে পাবেন।
                      </p>
                    </div>
                    <div className="p-4 bg-[#01a3a4]/5 border border-[#01a3a4]/20">
                      <p className="text-[9px] font-black text-[#01a3a4] uppercase tracking-widest leading-relaxed">
                        সিস্টেমটি অটোমেটিক্যালি মোবাইল স্ক্রিনের জন্য অপ্টিমাইজড। স্লাইডার, প্রোডাক্ট কার্ড এবং মেনু অটো-অ্যাডজাস্ট হয়ে যাবে।
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Terminal className="h-4 w-4" /> ডেপ্লয়মেন্ট গাইড (স্টেপ-বাই-স্টেপ)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5">
                    <div className="h-6 w-6 rounded-full bg-[#01a3a4] text-white flex items-center justify-center text-[10px] font-black shrink-0">১</div>
                    <p className="text-[10px] font-black text-white uppercase leading-relaxed">গিটহাবে (GitHub) আপনার সব পরিবর্তন সেভ বা 'Commit' করুন।</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5">
                    <div className="h-6 w-6 rounded-full bg-[#01a3a4] text-white flex items-center justify-center text-[10px] font-black shrink-0">২</div>
                    <p className="text-[10px] font-black text-white uppercase leading-relaxed">'Main' ব্রাঞ্চে কোড পুশ (Push) করুন।</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5">
                    <div className="h-6 w-6 rounded-full bg-[#01a3a4] text-white flex items-center justify-center text-[10px] font-black shrink-0">৩</div>
                    <p className="text-[10px] font-black text-white uppercase leading-relaxed">Vercel বা Firebase ড্যাশবোর্ডে গিয়ে বিল্ড প্রসেস চেক করুন।</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-[#01a3a4]/10 border border-[#01a3a4]/20">
                    <div className="h-6 w-6 rounded-full bg-[#01a3a4] text-white flex items-center justify-center text-[10px] font-black shrink-0">৪</div>
                    <p className="text-[10px] font-black text-[#01a3a4] uppercase leading-relaxed">বিল্ড শেষ হলে আপনার সাইট অটোমেটিক আপডেট হয়ে যাবে।</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4 border-t border-white/5">
                  <Button asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white hover:text-black h-12 font-black uppercase tracking-widest text-[9px] rounded-none">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> ওপেন গিটহাব (GITHUB)
                    </a>
                  </Button>
                  <Button asChild className="w-full bg-[#01a3a4] text-white hover:bg-white hover:text-black h-12 font-black uppercase tracking-widest text-[9px] rounded-none border-none">
                    <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> ওপেন কন্ট্রোল প্যানেল
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
