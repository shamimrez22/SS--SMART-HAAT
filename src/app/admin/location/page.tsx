
"use client";

import React, { useState, useEffect } from 'react';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MapPin, 
  Radio, 
  Lock, 
  Save, 
  Loader2, 
  Smartphone,
  Zap,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function AdminLocation() {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'site-config');
  }, [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const [formData, setFormData] = useState({
    liveLocation: '',
    liveStatusLabel: 'LIVE STATUS:',
    liveStatus: '',
    statusColor: '#01a3a4',
    verificationPassword: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        liveLocation: settings.liveLocation || 'BANANI, DHAKA',
        liveStatusLabel: settings.liveStatusLabel || 'LIVE STATUS:',
        liveStatus: settings.liveStatus || '',
        statusColor: settings.statusColor || '#01a3a4'
      }));
    }
  }, [settings]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsRef) return;

    const validPass = settings?.adminPassword || '4321';
    if (formData.verificationPassword !== validPass) {
      toast({ variant: "destructive", title: "ACCESS DENIED", description: "INVALID ADMIN PASSWORD." });
      return;
    }

    setDocumentNonBlocking(settingsRef, {
      liveLocation: formData.liveLocation.toUpperCase(),
      liveStatusLabel: formData.liveStatusLabel.toUpperCase(),
      liveStatus: formData.liveStatus.toUpperCase(),
      statusColor: formData.statusColor
    }, { merge: true });

    toast({ title: "SYSTEM UPDATED", description: "HUB LOCATION & BROADCAST ARE NOW LIVE." });
    setFormData(prev => ({ ...prev, verificationPassword: '' }));
  };

  if (isLoading || !db) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <MainHeader />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6 text-[#01a3a4]" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">Operational Hub</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">HUB & BROADCAST</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Globe className="h-4 w-4" /> MASTER HUB CONTROL
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleUpdate} className="space-y-8">
                  <div className="space-y-3 p-6 bg-[#01a3a4]/5 border border-[#01a3a4]/20 rounded-none">
                    <label className="text-[10px] font-black text-[#01a3a4] uppercase flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> HUB LOCATION (PRIMARY ADDRESS)
                    </label>
                    <input 
                      required
                      value={formData.liveLocation} 
                      onChange={(e) => setFormData({...formData, liveLocation: e.target.value})} 
                      placeholder="E.G. BANANI, DHAKA" 
                      className="w-full bg-black border-white/10 rounded-none h-14 text-sm text-white uppercase focus:ring-[#01a3a4] font-black px-4 outline-none border" 
                    />
                  </div>

                  <div className="space-y-6 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                        <Radio className="h-4 w-4 text-[#01a3a4]" /> LIVE BROADCAST MESSAGE
                      </label>
                      <input 
                        value={formData.liveStatus} 
                        onChange={(e) => setFormData({...formData, liveStatus: e.target.value})} 
                        placeholder="E.G. WINTER COLLECTION IS LIVE!" 
                        className="w-full bg-black border-white/10 rounded-none h-12 text-xs text-white uppercase px-4 outline-none border" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-muted-foreground uppercase">LABEL</label>
                        <input value={formData.liveStatusLabel} onChange={(e) => setFormData({...formData, liveStatusLabel: e.target.value})} className="w-full bg-black border-white/10 rounded-none h-12 text-xs text-white uppercase px-4 outline-none border" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-muted-foreground uppercase">COLOR</label>
                        <div className="flex gap-2">
                          <input type="color" value={formData.statusColor} onChange={(e) => setFormData({...formData, statusColor: e.target.value})} className="w-12 h-12 p-1 bg-black border-white/10 cursor-pointer" />
                          <input value={formData.statusColor} onChange={(e) => setFormData({...formData, statusColor: e.target.value})} className="flex-grow bg-black border-white/10 h-12 text-[10px] text-white font-mono uppercase px-3 border" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/5">
                    <label className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2">
                      <Lock className="h-4 w-4" /> VERIFY ADMIN PASS TO SYNC
                    </label>
                    <input 
                      required
                      type="password" 
                      value={formData.verificationPassword} 
                      onChange={(e) => setFormData({...formData, verificationPassword: e.target.value})} 
                      className="w-full bg-black border-orange-500/20 rounded-none h-14 text-sm text-white px-4 outline-none border" 
                    />
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-16 font-black uppercase rounded-none text-xs tracking-widest shadow-2xl">
                    <Save className="mr-2 h-5 w-5" /> SYNC ALL HUB DATA
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> REAL-TIME DISPLAY SIMULATOR
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 flex flex-col items-center justify-center bg-[#050505] min-h-[600px]">
                <div className="w-full max-w-[320px] aspect-[9/16] bg-black border-[12px] border-[#1a1a1a] rounded-[40px] relative overflow-hidden flex flex-col shadow-[0_0_60px_rgba(1,163,164,0.2)] ring-4 ring-[#01a3a4]/10">
                  <div className="h-12 bg-[#01a3a4] flex items-center px-4 justify-between shrink-0 z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-black flex items-center justify-center text-[#01a3a4] text-[10px] font-black shadow-lg">SS</div>
                      <span className="text-[8px] font-black text-white leading-none uppercase">SS SMART HAAT</span>
                    </div>
                  </div>
                  <div className="bg-black border-b border-white/5 h-10 flex items-center overflow-hidden whitespace-nowrap relative w-full shrink-0 z-20">
                    <div className="flex items-center gap-4 w-full px-2">
                      <div style={{ color: formData.statusColor }} className="flex items-center gap-2 text-[10px] font-black uppercase shrink-0">
                        <Radio className="h-3.5 w-3.5 animate-pulse" /> {formData.liveStatusLabel || 'LIVE STATUS:'}
                      </div>
                      <p style={{ color: formData.statusColor }} className="text-[10px] font-black uppercase flex items-center gap-2 shrink-0">
                        {formData.liveStatus || 'BROADCASTING...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex-grow bg-black relative">
                    <iframe 
                      src="/" 
                      className="absolute inset-0 w-full h-full border-none pointer-events-none"
                      title="Live Site Preview"
                    />
                    <div className="absolute inset-0 bg-transparent pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" />
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
