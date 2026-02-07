
"use client";

import React, { useState, useEffect } from 'react';
import { MainHeader } from '@/components/MainHeader';
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
  Smartphone,
  Zap,
  Eye,
  EyeOff,
  Palette,
  Type,
  Globe,
  Radio,
  Github,
  BookOpen
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

  const [adminData, setAdminData] = useState({ adminUsername: '', adminPassword: '' });
  const [statusData, setStatusData] = useState({
    liveLocation: '',
    liveStatusLabel: '',
    liveStatus: '',
    statusColor: '#ffffff',
    verificationPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);

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
    toast({ title: "SECURITY UPDATED" });
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsRef) return;
    if (statusData.verificationPassword !== adminData.adminPassword) {
      toast({ variant: "destructive", title: "INVALID PASSWORD" });
      return;
    }
    setDocumentNonBlocking(settingsRef, {
      liveLocation: statusData.liveLocation,
      liveStatusLabel: statusData.liveStatusLabel,
      liveStatus: statusData.liveStatus,
      statusColor: statusData.statusColor
    }, { merge: true });
    toast({ title: "BROADCAST UPDATED" });
    setStatusData(prev => ({ ...prev, verificationPassword: '' }));
  };

  if (isLoading || !db) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <MainHeader />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/admin"><Button variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10"><ArrowLeft className="h-6 w-6 text-[#01a3a4]" /></Button></Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">Security & Operations</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SYSTEM SETTINGS</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8 lg:col-span-1">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6"><CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> ADMIN AUTH</CardTitle></CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSaveAdmin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><User className="h-3 w-3 text-[#01a3a4]" /> USERNAME</label>
                      <Input value={adminData.adminUsername} onChange={(e) => setAdminData({...adminData, adminUsername: e.target.value})} className="bg-black border-white/10 rounded-none h-12 text-sm text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Lock className="h-3 w-3 text-[#01a3a4]" /> PASSWORD</label>
                      <div className="relative">
                        <Input value={adminData.adminPassword} onChange={(e) => setAdminData({...adminData, adminPassword: e.target.value})} type={showPassword ? "text" : "password"} className="bg-black border-white/10 rounded-none h-12 text-sm text-white pr-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#01a3a4] text-white h-12 font-black uppercase rounded-none text-[9px]">UPDATE SECURITY</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6"><CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2"><Zap className="h-4 w-4" /> BROADCAST</CardTitle></CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSaveStatus} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase"><Type className="h-3 w-3" /> LABEL</label>
                      <Input value={statusData.liveStatusLabel} onChange={(e) => setStatusData({...statusData, liveStatusLabel: e.target.value})} className="bg-black border-white/10 rounded-none h-12 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase"><Globe className="h-3 w-3" /> MESSAGE</label>
                      <Input value={statusData.liveStatus} onChange={(e) => setStatusData({...statusData, liveStatus: e.target.value})} className="bg-black border-white/10 rounded-none h-12 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase"><Palette className="h-3 w-3" /> COLOR</label>
                      <div className="flex gap-3">
                        <Input type="color" value={statusData.statusColor} onChange={(e) => setStatusData({...statusData, statusColor: e.target.value})} className="w-12 h-12 p-1 bg-black border-white/10 cursor-pointer" />
                        <Input value={statusData.statusColor} onChange={(e) => setStatusData({...statusData, statusColor: e.target.value})} className="bg-black border-white/10 h-12 text-xs text-white font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <label className="text-[9px] font-black text-orange-500 uppercase"><Lock className="h-3 w-3" /> VERIFY TO PUSH</label>
                      <Input type="password" value={statusData.verificationPassword} onChange={(e) => setStatusData({...statusData, verificationPassword: e.target.value})} className="bg-black border-orange-500/20 rounded-none h-12 text-xs text-white" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 text-white h-12 font-black uppercase rounded-none text-[9px]">BROADCAST LIVE</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6"><CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2"><Smartphone className="h-4 w-4" /> MOBILE LIVE DISPLAY PREVIEW</CardTitle></CardHeader>
              <CardContent className="p-10 flex flex-col items-center justify-center bg-[#050505]">
                <div className="w-full max-w-[300px] aspect-[9/16] bg-black border-[10px] border-[#1a1a1a] rounded-[35px] relative overflow-hidden flex flex-col shadow-2xl scale-100">
                  {/* Simulator Screen */}
                  <div className="h-8 bg-black flex items-end px-6 pb-1.5 justify-between border-b border-white/5 shrink-0">
                    <div className="text-[7px] text-white font-bold">12:00</div>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-[#01a3a4] rounded-full" />
                    </div>
                  </div>
                  <div className="h-10 bg-[#01a3a4] flex items-center px-4 justify-between shrink-0">
                    <div className="w-6 h-6 bg-black flex items-center justify-center text-[#01a3a4] text-[8px] font-black shadow-lg">SS</div>
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-none border border-white/20" />
                       <div className="w-3 h-3 rounded-none border border-white/20" />
                    </div>
                  </div>
                  <div className="bg-black border-b border-[#01a3a4]/20 h-8 flex items-center overflow-hidden whitespace-nowrap relative w-full shrink-0">
                    <div className="flex items-center gap-4 w-full px-2">
                      <div className="flex items-center gap-2 text-[7px] font-black text-[#01a3a4] uppercase shrink-0">
                        <Radio className="h-2 w-2 animate-pulse" /> {statusData.liveStatusLabel}
                      </div>
                      <p style={{ color: statusData.statusColor }} className="text-[7px] font-black uppercase flex items-center gap-2 shrink-0 truncate">
                        {statusData.liveStatus}
                      </p>
                    </div>
                  </div>
                  <div className="flex-grow bg-[#0a0a0a] p-4 space-y-4 overflow-hidden">
                    <div className="w-full aspect-[16/9] bg-white/5 rounded-none border border-white/5 flex items-center justify-center">
                       <span className="text-[6px] text-white/20 font-black uppercase tracking-widest italic">MAIN SLIDER BANNER</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map(i => (
                        <div key={i} className="aspect-square bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center p-2 space-y-2">
                           <div className="w-full h-2/3 bg-white/5" />
                           <div className="w-3/4 h-1 bg-[#01a3a4]/20" />
                           <div className="w-1/2 h-1 bg-white/10" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6"><CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2"><BookOpen className="h-4 w-4" /> ওয়েবসাইট পাবলিশ গাইড (বিস্তারিত)</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#01a3a4]"><Github className="h-5 w-5" /><h3 className="text-lg font-black uppercase">ধাপ ১: কোড সিঙ্ক (GitHub Push)</h3></div>
                  <p className="text-[11px] text-white/60 uppercase font-bold leading-relaxed">
                    আপনার লোকাল কম্পিউটারে করা কোড পরিবর্তনগুলো স্থায়ীভাবে সেভ করতে গিটহাবে 'Push' করুন। এটি আপনার সমস্ত ফাইল ক্লাউড স্টোরেজে ব্যাকআপ হিসেবে রাখে এবং ওয়েবসাইট আপডেটের জন্য মূল ভিত্তি হিসেবে কাজ করে।
                  </p>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-[#01a3a4]"><Globe className="h-5 w-5" /><h3 className="text-lg font-black uppercase">ধাপ ২: হোস্টিং কানেকশন (Vercel/Firebase)</h3></div>
                  <p className="text-[11px] text-white/60 uppercase font-bold leading-relaxed">
                    আপনার গিটহাব রিপোজিটরিটি Vercel অথবা Firebase App Hosting-এর সাথে কানেক্ট করুন। এটি একবার সেটআপ করে রাখলেই হবে। হোস্টিং সার্ভিসটি আপনার গিটহাবের ফাইলের দিকে নজর রাখবে।
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-orange-500"><Zap className="h-5 w-5" /><h3 className="text-lg font-black uppercase">ধাপ ৩: অটো-লাইভ আপডেট (Continuous Deploy)</h3></div>
                  <p className="text-[11px] text-white/60 uppercase font-bold leading-relaxed">
                    একবার ডেপ্লয়মেন্ট সেটআপ হয়ে গেলে, আপনি যখনই কোড পরিবর্তন করে গিটহাবে পুশ করবেন, হোস্টিং সার্ভিসটি সেটি সাথে সাথে শনাক্ত করবে এবং কয়েক সেকেন্ডের মধ্যেই ওয়েবসাইটটি অটোমেটিক লাইভ আপডেট করে দেবে। আলাদা করে কোনো ফাইল আপলোড করার প্রয়োজন পড়বে না।
                  </p>
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
