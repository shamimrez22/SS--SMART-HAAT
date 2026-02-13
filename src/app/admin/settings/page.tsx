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
  Eye,
  EyeOff,
  BookOpen,
  Github,
  Globe,
  Zap
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (settings) {
      setAdminData({
        adminUsername: settings.adminUsername || 'ADMIN',
        adminPassword: settings.adminPassword || '4321'
      });
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
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">Access Control</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">ADMIN SECURITY</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> AUTHENTICATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSaveAdmin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><User className="h-3 w-3 text-[#01a3a4]" /> USERNAME</label>
                      <Input value={adminData.adminUsername} onChange={(e) => setAdminData({...adminData, adminUsername: e.target.value})} className="bg-black border-white/20 rounded-none h-12 text-sm text-white focus:border-[#01a3a4]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2"><Lock className="h-3 w-3 text-[#01a3a4]" /> PASSWORD</label>
                      <div className="relative">
                        <Input value={adminData.adminPassword} onChange={(e) => setAdminData({...adminData, adminPassword: e.target.value})} type={showPassword ? "text" : "password"} className="bg-black border-white/20 rounded-none h-12 text-sm text-white pr-10 focus:border-[#01a3a4]" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#01a3a4] text-white h-14 font-black uppercase rounded-none text-[10px] tracking-widest">UPDATE ACCESS KEY</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> পাবলিশ গাইড (বিস্তারিত)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#01a3a4]">
                    <Github className="h-5 w-5" />
                    <h3 className="text-lg font-black uppercase">ধাপ ১: কোড সিঙ্ক (GitHub Push)</h3>
                  </div>
                  <p className="text-[11px] text-white/60 uppercase font-bold leading-relaxed">
                    আপনার লোকাল কম্পিউটারে করা কোড পরিবর্তনগুলো স্থায়ীভাবে সেভ করতে গিটহাবে 'Push' করুন।
                  </p>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 text-[#01a3a4]">
                    <Globe className="h-5 w-5" />
                    <h3 className="text-lg font-black uppercase">ধাপ ২: হোস্টিং কানেকশন (Vercel/Firebase)</h3>
                  </div>
                  <p className="text-[11px] text-white/60 uppercase font-bold leading-relaxed">
                    আপনার গিটহাব রিপোজিটরিটি Vercel অথবা Firebase App Hosting-এর সাথে কানেক্ট করুন।
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 text-orange-500">
                    <Zap className="h-5 w-5" />
                    <h3 className="text-lg font-black uppercase">ধাপ ৩: অটো-লাইভ আপডেট (Continuous Deploy)</h3>
                  </div>
                  <p className="text-[11px] text-white/60 uppercase font-bold leading-relaxed">
                    একবার ডেপ্লয়মেন্ট সেটআপ হয়ে গেলে, আপনি যখনই কোড পরিবর্তন করে গিটহাবে পুশ করবেন, ওয়েবসাইটটি অটোমেটিক লাইভ আপডেট হয়ে যাবে।
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
