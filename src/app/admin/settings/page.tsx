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
  Loader2,
  ShieldAlert,
  MapPin,
  Smartphone,
  Zap,
  Eye,
  EyeOff,
  Palette,
  Type,
  Terminal,
  Github,
  Globe,
  Radio,
  X
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
    liveStatusLabel: '',
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
        liveStatusLabel: settings.liveStatusLabel || 'LIVE STATUS:',
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
      description: "ADMIN CREDENTIALS HAVE BEEN SUCCESSFULLY CHANGED.",
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
      liveLocation: statusData.liveLocation,
      liveStatusLabel: statusData.liveStatusLabel,
      liveStatus: statusData.liveStatus,
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
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30 gpu-accelerated">
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
                      CAUTION: CREDENTIALS ARE CASE-SENSITIVE.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><User className="h-3 w-3 text-[#01a3a4]" /> USERNAME</label>
                      <Input 
                        value={adminData.adminUsername}
                        onChange={(e) => setAdminData({...adminData, adminUsername: e.target.value})}
                        className="bg-black border-white/10 rounded-none h-12 text-sm text-white focus:border-[#01a3a4]"
                        autoComplete="off"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Lock className="h-3 w-3 text-[#01a3a4]" /> ACCESS PASSWORD</label>
                      <div className="relative">
                        <Input 
                          value={adminData.adminPassword}
                          onChange={(e) => setAdminData({...adminData, adminPassword: e.target.value})}
                          type={showPassword ? "text" : "password"}
                          className="bg-black border-white/10 rounded-none h-12 text-sm text-white pr-10 focus:border-[#01a3a4]"
                          autoComplete="off"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white h-12 font-black uppercase tracking-widest rounded-none text-[9px] transition-all">
                    UPDATE SECURITY
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Zap className="h-4 w-4" /> LIVE BROADCAST CONTROL
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSaveStatus} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Type className="h-3 w-3 text-[#01a3a4]" /> LIVE LABEL</label>
                      <Input 
                        value={statusData.liveStatusLabel}
                        onChange={(e) => setStatusData({...statusData, liveStatusLabel: e.target.value})}
                        className="bg-black border-white/10 rounded-none h-12 text-xs text-white focus:border-[#01a3a4]"
                        placeholder="LIVE STATUS:"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Globe className="h-3 w-3 text-[#01a3a4]" /> BROADCAST MESSAGE</label>
                      <Input 
                        value={statusData.liveStatus}
                        onChange={(e) => setStatusData({...statusData, liveStatus: e.target.value})}
                        className="bg-black border-white/10 rounded-none h-12 text-xs text-white focus:border-[#01a3a4]"
                        placeholder="OPEN & READY TO SHIP"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Palette className="h-3 w-3 text-[#01a3a4]" /> TEXT COLOR</label>
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
                          className="bg-black border-white/10 rounded-none h-12 text-xs text-white font-mono focus:border-[#01a3a4]"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><Lock className="h-3 w-3" /> VERIFY PASSWORD TO PUSH</label>
                      <Input 
                        type={showVerifyPassword ? "text" : "password"}
                        value={statusData.verificationPassword}
                        onChange={(e) => setStatusData({...statusData, verificationPassword: e.target.value})}
                        className="bg-black border-orange-500/20 rounded-none h-12 text-xs text-white focus:border-orange-500"
                        placeholder="••••"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 font-black uppercase tracking-widest rounded-none text-[9px] shadow-xl transition-all">
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
                  <Smartphone className="h-4 w-4" /> MOBILE LIVE DISPLAY PREVIEW
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 flex flex-col items-center justify-center space-y-10">
                <div className="w-full max-w-[320px] aspect-[9/16] bg-black border-[12px] border-[#1a1a1a] rounded-[40px] shadow-[0_0_50px_rgba(1,163,164,0.1)] relative overflow-hidden flex flex-col">
                  {/* Mock Phone UI */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1a] rounded-b-2xl z-50" />
                  
                  <div className="h-14 bg-black flex items-end px-6 pb-2 justify-between border-b border-white/5">
                    <div className="text-[10px] text-white font-bold uppercase">12:00</div>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 border border-white/20 rounded-full" />
                      <div className="w-3 h-3 bg-[#01a3a4] rounded-full" />
                    </div>
                  </div>

                  <div className="h-14 bg-[#01a3a4] flex items-center px-4 justify-between shadow-lg">
                    <div className="w-8 h-8 bg-black flex items-center justify-center"><span className="text-[#01a3a4] text-[10px] font-black">SS</span></div>
                    <div className="flex gap-3">
                      <div className="w-4 h-4 bg-white/20 rounded-full" />
                      <div className="w-4 h-4 bg-white/20 rounded-full" />
                    </div>
                  </div>

                  {/* LIVE BAR PREVIEW */}
                  <div className="bg-black border-b border-[#01a3a4]/20 h-8 flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full">
                    <div className="flex items-center gap-4 animate-marquee w-full px-2">
                      <div className="flex items-center gap-2 text-[8px] font-black text-[#01a3a4] uppercase tracking-widest shrink-0">
                        <Radio className="h-2.5 w-2.5 animate-pulse text-[#01a3a4]" /> {statusData.liveStatusLabel}
                      </div>
                      <p 
                        style={{ color: statusData.statusColor }}
                        className="text-[8px] font-black uppercase tracking-[0.1em] flex items-center gap-4 shrink-0"
                      >
                        {statusData.liveStatus} <span className="text-[#01a3a4]/40">||</span> 
                        <MapPin className="h-2.5 w-2.5 text-[#01a3a4]" /> {statusData.liveLocation}
                      </p>
                    </div>
                  </div>

                  <div className="flex-grow bg-[#0a0a0a] p-4 space-y-4">
                    <div className="w-full aspect-square bg-white/5 border border-white/5 animate-pulse" />
                    <div className="h-4 w-3/4 bg-white/5" />
                    <div className="h-4 w-1/2 bg-white/5" />
                  </div>
                </div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] text-center">
                  রিয়েল-টাইম মোবাইল ডিসপ্লে সিমুলেশন।
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Terminal className="h-4 w-4" /> পাবলিশ ও ডেপ্লয়মেন্ট গাইড (GitHub & Vercel)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#01a3a4]">
                      <Github className="h-5 w-5" />
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">ধাপ ১: গিটহাব (GitHub)</h3>
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                      আপনার প্রোজেক্টটি প্রথমে GitHub-এ আপলোড বা Commit করুন। এর ফলে আপনার কোডগুলো ক্লাউডে সেভ থাকবে।
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#01a3a4]">
                      <Globe className="h-5 w-5" />
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">ধাপ ২: ভারসেল (Vercel)</h3>
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                      Vercel ড্যাশবোর্ড থেকে Import Project ক্লিক করে আপনার GitHub রিপোজিটরি সিলেক্ট করুন।
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-[#01a3a4]/5 border border-[#01a3a4]/20">
                    <div className="h-6 w-6 rounded-full bg-[#01a3a4] text-white flex items-center justify-center text-[10px] font-black shrink-0">৩</div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase mb-1">এনভায়রনমেন্ট ভেরিয়েবল (Environment Variables)</p>
                      <p className="text-[9px] text-white/40 uppercase leading-relaxed">ডেপ্লয় করার সময় .env ফাইলের ভ্যালুগুলো Vercel-এর Environment Variables সেকশনে কপি করে দিবেন।</p>
                    </div>
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