
"use client";

import React, { useState, useEffect } from 'react';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Palette, 
  Save, 
  Loader2, 
  Undo2, 
  Monitor, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function AdminTheme() {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const [colors, setColors] = useState({
    themePrimaryColor: '#01a3a4',
    themeBackgroundColor: '#000000',
    themeButtonColor: '#01a3a4'
  });

  useEffect(() => {
    if (settings) {
      setColors({
        themePrimaryColor: settings.themePrimaryColor || '#01a3a4',
        themeBackgroundColor: settings.themeBackgroundColor || '#000000',
        themeButtonColor: settings.themeButtonColor || '#01a3a4'
      });
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsRef) return;

    setDocumentNonBlocking(settingsRef, colors, { merge: true });
    toast({
      title: "THEME UPDATED",
      description: "SITE COLORS ARE NOW LIVE ACROSS ALL DEVICES.",
    });
  };

  const resetToDefault = () => {
    setColors({
      themePrimaryColor: '#01a3a4',
      themeBackgroundColor: '#000000',
      themeButtonColor: '#01a3a4'
    });
  };

  if (isLoading || !db) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-12 w-12 text-primary animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <MainHeader />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6 text-primary" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Visual Identity</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">THEME CONTROL</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <Palette className="h-4 w-4" /> MASTER COLOR BOARD
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSave} className="space-y-8">
                  
                  <div className="space-y-6">
                    {/* PRIMARY COLOR */}
                    <div className="space-y-3 p-4 bg-white/5 border border-white/10">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest flex justify-between">
                        <span>Theme Primary Color</span>
                        <span className="text-primary">{colors.themePrimaryColor}</span>
                      </label>
                      <div className="flex gap-4">
                        <input 
                          type="color" 
                          value={colors.themePrimaryColor} 
                          onChange={(e) => setColors({...colors, themePrimaryColor: e.target.value})}
                          className="w-12 h-12 p-1 bg-black border border-white/20 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={colors.themePrimaryColor} 
                          onChange={(e) => setColors({...colors, themePrimaryColor: e.target.value.toUpperCase()})}
                          className="flex-grow bg-black border border-white/10 h-12 px-4 text-xs font-mono text-white uppercase outline-none focus:border-primary"
                        />
                      </div>
                      <p className="text-[8px] text-white/30 uppercase">Controls links, icons, and primary accents.</p>
                    </div>

                    {/* BACKGROUND COLOR */}
                    <div className="space-y-3 p-4 bg-white/5 border border-white/10">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest flex justify-between">
                        <span>Template Background</span>
                        <span className="text-primary">{colors.themeBackgroundColor}</span>
                      </label>
                      <div className="flex gap-4">
                        <input 
                          type="color" 
                          value={colors.themeBackgroundColor} 
                          onChange={(e) => setColors({...colors, themeBackgroundColor: e.target.value})}
                          className="w-12 h-12 p-1 bg-black border border-white/20 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={colors.themeBackgroundColor} 
                          onChange={(e) => setColors({...colors, themeBackgroundColor: e.target.value.toUpperCase()})}
                          className="flex-grow bg-black border border-white/10 h-12 px-4 text-xs font-mono text-white uppercase outline-none focus:border-primary"
                        />
                      </div>
                      <p className="text-[8px] text-white/30 uppercase">Controls the overall site background color.</p>
                    </div>

                    {/* BUTTON COLOR */}
                    <div className="space-y-3 p-4 bg-white/5 border border-white/10">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest flex justify-between">
                        <span>Action Button Color</span>
                        <span className="text-primary">{colors.themeButtonColor}</span>
                      </label>
                      <div className="flex gap-4">
                        <input 
                          type="color" 
                          value={colors.themeButtonColor} 
                          onChange={(e) => setColors({...colors, themeButtonColor: e.target.value})}
                          className="w-12 h-12 p-1 bg-black border border-white/20 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={colors.themeButtonColor} 
                          onChange={(e) => setColors({...colors, themeButtonColor: e.target.value.toUpperCase()})}
                          className="flex-grow bg-black border border-white/10 h-12 px-4 text-xs font-mono text-white uppercase outline-none focus:border-primary"
                        />
                      </div>
                      <p className="text-[8px] text-white/30 uppercase">Specific color for "ORDER NOW" buttons.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full bg-primary hover:bg-white hover:text-black text-white h-16 font-black uppercase rounded-none text-xs tracking-widest shadow-2xl transition-all">
                      <Save className="mr-2 h-5 w-5" /> SYNC THEME SETTINGS
                    </Button>
                    <Button type="button" onClick={resetToDefault} variant="outline" className="w-full border-white/10 text-white/40 hover:text-white h-12 font-black uppercase rounded-none text-[9px] tracking-[0.2em]">
                      <Undo2 className="mr-2 h-3 w-3" /> RESET TO SYSTEM DEFAULTS
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden h-full">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <Monitor className="h-4 w-4" /> LIVE PREVIEW SIMULATOR
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 flex flex-col items-center justify-center bg-[#050505] min-h-[600px]">
                {/* PREVIEW FRAME */}
                <div 
                  className="w-full max-w-[300px] aspect-[9/19] border-[8px] border-[#1a1a1a] rounded-[40px] relative overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/10 transition-colors duration-500"
                  style={{ backgroundColor: colors.themeBackgroundColor }}
                >
                  {/* NOTCH */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1a1a1a] rounded-b-xl z-20" />
                  
                  {/* CONTENT PREVIEW */}
                  <div className="p-4 space-y-6 mt-8">
                    <div className="h-2 w-20 bg-white/10 rounded-full" />
                    <div className="aspect-square w-full border border-white/10 relative">
                       <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-[10px] text-white/20 font-black">IMAGE AREA</div>
                       <div 
                        className="absolute bottom-2 right-2 px-2 py-1 text-[8px] font-black text-white"
                        style={{ backgroundColor: colors.themeButtonColor }}
                       >
                        -50%
                       </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-3/4 bg-white/20" />
                      <div className="h-4 w-1/2" style={{ backgroundColor: colors.themePrimaryColor }} />
                    </div>
                    <div 
                      className="h-10 w-full flex items-center justify-center text-[9px] font-black text-white uppercase tracking-widest"
                      style={{ backgroundColor: colors.themeButtonColor }}
                    >
                      অর্ডার করুন
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full" />
                </div>
                <p className="mt-6 text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">REAL-TIME VISUALIZATION</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
