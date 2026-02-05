
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
  ShieldAlert,
  MapPin,
  Smartphone,
  Zap,
  Eye,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

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
            {/* MOBILE SCREEN PREVIEW SECTION */}
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> LIVE MOBILE PREVIEW (REAL-TIME)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-center gap-12">
                {/* IPHONE STYLE MOCKUP */}
                <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-[12px] border-zinc-900 shadow-2xl overflow-hidden shrink-0">
                  {/* Speaker Grill */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-30 flex items-center justify-center">
                    <div className="w-12 h-1 bg-zinc-950 rounded-full" />
                  </div>
                  
                  {/* Live Iframe Content */}
                  <div className="absolute inset-0 pt-6">
                    <iframe 
                      src="/" 
                      className="w-full h-full border-none pointer-events-auto no-scrollbar"
                      title="Live Mobile Preview"
                    />
                  </div>
                </div>

                <div className="space-y-6 max-w-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#01a3a4]">
                      <Eye className="h-5 w-5" />
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">লাইভ মোবাইল ভিউ</h3>
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                      বামের স্ক্রিনে আপনার ওয়েবসাইটটি বর্তমানে মোবাইলে যেমন দেখাবে তা সরাসরি দেখা যাচ্ছে। আপনি এখান থেকেই স্ক্রল করে চেক করতে পারেন।
                    </p>
                  </div>
                  <div className="p-4 bg-[#01a3a4]/5 border border-[#01a3a4]/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-[#01a3a4]" />
                      <p className="text-[9px] font-black text-[#01a3a4] uppercase tracking-widest">রেসপন্সিভ অপ্টিমাইজেশন</p>
                    </div>
                    <p className="text-[9px] font-black text-white/60 uppercase leading-relaxed">
                      প্রতিটি প্রোডাক্ট, স্লাইডার এবং মেনু মোবাইল ফ্রেন্ডলি কি না তা নিশ্চিত করার জন্য এই লাইভ প্রিভিউ ব্যবহার করুন।
                    </p>
                  </div>
                  <Button asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white hover:text-black h-12 font-black uppercase tracking-widest text-[9px] rounded-none">
                    <Link href="/" target="_blank" className="flex items-center justify-center gap-2">
                      ওপেন লাইভ সাইট <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
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
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
