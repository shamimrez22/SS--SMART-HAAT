
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
  EyeOff,
  ExternalLink,
  Palette,
  Type
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'site-config');
  }, [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const [adminData, setAdminData] = useState({
    adminUsername: '',
    adminPassword: ''
  });

  const [statusData, setStatusData] = useState({
    liveLocation: '',
    liveStatus: '',
    statusColor: '#ffffff',
    verificationPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  useEffect(() => {
    if (settings) {
      setAdminData({
        adminUsername: settings.adminUsername || 'ADMIN',
        adminPassword: settings.adminPassword || '4321'
      });
      setStatusData(prev => ({
        ...prev,
        liveLocation: settings.liveLocation || 'BANANI, DHAKA',
        liveStatus: settings.liveStatus || 'OPEN & READY TO SHIP',
        statusColor: settings.statusColor || '#ffffff'
      }));
    }
  }, [settings]);

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsRef) return;
    
    setDocumentNonBlocking(settingsRef, {
      adminUsername: adminData.adminUsername,
      adminPassword: adminData.adminPassword
    }, { merge: true });

    toast({
      title: "SECURITY UPDATED",
      description: "ADMIN CREDENTIALS HAVE BEEN SUCCESSFULLY CHANGED IN SYSTEM.",
    });
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsRef) return;
    
    if (statusData.verificationPassword !== adminData.adminPassword) {
      toast({
        variant: "destructive",
        title: "ACCESS DENIED",
        description: "INVALID PASSWORD. CANNOT UPDATE BROADCAST.",
      });
      return;
    }

    setDocumentNonBlocking(settingsRef, {
      liveLocation: statusData.liveLocation.toUpperCase(),
      liveStatus: statusData.liveStatus.toUpperCase(),
      statusColor: statusData.statusColor
    }, { merge: true });

    toast({
      title: "BROADCAST UPDATED",
      description: "STORE STATUS AND COLOR HAVE BEEN BROADCAST LIVE.",
    });
    
    setStatusData(prev => ({ ...prev, verificationPassword: '' }));
  };

  if (isLoading || !db) {
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
                        className="bg-black border-white/10 rounded-none h-12 text-sm text-white"
                        autoComplete="off"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Lock className="h-3 w-3" /> ACCESS PASSWORD</label>
                      <div className="relative">
                        <Input 
                          value={adminData.adminPassword}
                          onChange={(e) => setAdminData({...adminData, adminPassword: e.target.value})}
                          type={showPassword ? "text" : "password"}
                          className="bg-black border-white/10 rounded-none h-12 text-sm text-white pr-10"
                          autoComplete="off"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white h-12 font-black uppercase tracking-widest rounded-none text-[9px]">
                    UPDATE SECURITY
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> LIVE STATUS BROADCAST
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSaveStatus} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><MapPin className="h-3 w-3" /> CURRENT HUB</label>
                      <Input 
                        value={statusData.liveLocation}
                        onChange={(e) => setStatusData({...statusData, liveLocation: e.target.value})}
                        className="bg-black border-white/10 rounded-none h-12 text-xs text-white"
                        placeholder="E.G. BANANI, DHAKA"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Type className="h-3 w-3" /> BROADCAST MESSAGE</label>
                      <Input 
                        value={statusData.liveStatus}
                        onChange={(e) => setStatusData({...statusData, liveStatus: e.target.value})}
                        className="bg-black border-white/10 rounded-none h-12 text-xs text-white"
                        placeholder="E.G. OPEN & READY TO SHIP"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Palette className="h-3 w-3" /> TEXT HEX COLOR</label>
                      <div className="flex gap-3">
                        <Input 
                          type="color"
                          value={statusData.statusColor}
                          onChange={(e) => setStatusData({...statusData, statusColor: e.target.value})}
                          className="w-12 h-12 p-1 bg-black border-white/10 rounded-none cursor-pointer shrink-0"
                        />
                        <Input 
                          value={statusData.statusColor}
                          onChange={(e) => setStatusData({...statusData, statusColor: e.target.value})}
                          className="bg-black border-white/10 rounded-none h-12 text-xs text-white font-mono"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><Lock className="h-3 w-3" /> VERIFY PASSWORD TO PUSH</label>
                      <div className="relative">
                        <Input 
                          type={showVerifyPassword ? "text" : "password"}
                          value={statusData.verificationPassword}
                          onChange={(e) => setStatusData({...statusData, verificationPassword: e.target.value})}
                          className="bg-black border-orange-500/20 rounded-none h-12 text-xs text-white pr-10"
                          placeholder="••••"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500/40 hover:text-orange-500"
                        >
                          {showVerifyPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 font-black uppercase tracking-widest rounded-none text-[9px]">
                    BROADCAST LIVE
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> STORE MANAGEMENT GUIDE
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#01a3a4]">
                      <Zap className="h-5 w-5" />
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">স্পিড অপ্টিমাইজেশন</h3>
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                      আপনার সাইট এখন আগের চেয়ে অনেক দ্রুত লোড হবে। অপ্রয়োজনীয় প্রিভিউ এবং স্ক্রিপ্ট সরিয়ে ফেলা হয়েছে।
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#01a3a4]">
                      <Terminal className="h-5 w-5" />
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">রিয়েল-টাইম নোটিফিকেশন</h3>
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                      নতুন কোনো অর্ডার আসলে এখন আপনি সাথে সাথে ন্যাপবারের ৩-ডট মেনুর ভেতর নোটিফিকেশন দেখতে পাবেন।
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#01a3a4]/5 border border-[#01a3a4]/20 space-y-4">
                  <p className="text-[11px] font-black text-white uppercase leading-relaxed italic">
                    "WE HAVE REMOVED THE HEAVY IFRAME PREVIEW TO ENSURE THE SYSTEM REMAINS LIGHTWEIGHT AND FAST. YOU CAN ALWAYS CHECK THE LIVE SITE IN A NEW TAB."
                  </p>
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
                    <p className="text-[10px] font-black text-white uppercase leading-relaxed">Vercel বা Firebase ড্যাশবোর্ড চেক করুন।</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-[#01a3a4]/10 border border-[#01a3a4]/20">
                    <div className="h-6 w-6 rounded-full bg-[#01a3a4] text-white flex items-center justify-center text-[10px] font-black shrink-0">৪</div>
                    <p className="text-[10px] font-black text-[#01a3a4] uppercase leading-relaxed">বিল্ড শেষ হলে আপনার সাইট অটোমেটিক আপডেট হয়ে যাবে।</p>
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
