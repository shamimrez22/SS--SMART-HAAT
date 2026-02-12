
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
  Type,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

/**
 * AdminTheme - Advanced control for visual identity.
 * Now all labels and preview text respond to Global Text Color.
 */
export default function AdminTheme() {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const [colors, setColors] = useState({
    themePrimaryColor: '#01a3a4',
    themeBackgroundColor: '#000000',
    themeButtonColor: '#01a3a4',
    themeTextColor: '#FFFFFF'
  });

  useEffect(() => {
    if (settings) {
      setColors({
        themePrimaryColor: settings.themePrimaryColor || '#01a3a4',
        themeBackgroundColor: settings.themeBackgroundColor || '#000000',
        themeButtonColor: settings.themeButtonColor || '#01a3a4',
        themeTextColor: settings.themeTextColor || '#FFFFFF'
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
      themeButtonColor: '#01a3a4',
      themeTextColor: '#FFFFFF'
    });
    toast({
      title: "PRESET LOADED",
      description: "SYSTEM DEFAULTS HAVE BEEN APPLIED TO THE BOARD.",
    });
  };

  if (isLoading || !db) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-12 w-12 text-primary animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <MainHeader />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-foreground p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-foreground opacity-60 uppercase tracking-[0.3em]">Visual Identity</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">THEME CONTROL</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CONTROL PANEL */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-2">
                  <Palette className="h-4 w-4" /> MASTER COLOR BOARD
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSave} className="space-y-8">
                  
                  <div className="space-y-6">
                    {/* PRIMARY COLOR */}
                    <div className="space-y-3 p-5 bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                      <label className="text-[10px] font-black text-foreground opacity-60 uppercase tracking-widest flex justify-between">
                        <span>Theme Primary Color</span>
                        <span className="text-primary font-mono">{colors.themePrimaryColor}</span>
                      </label>
                      <div className="flex gap-4">
                        <div 
                          className="w-14 h-14 border border-white/20 relative cursor-pointer overflow-hidden"
                          style={{ backgroundColor: colors.themePrimaryColor }}
                        >
                          <input 
                            type="color" 
                            value={colors.themePrimaryColor} 
                            onChange={(e) => setColors({...colors, themePrimaryColor: e.target.value})}
                            className="absolute inset-0 opacity-0 cursor-pointer scale-[3]"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={colors.themePrimaryColor} 
                          onChange={(e) => setColors({...colors, themePrimaryColor: e.target.value.toUpperCase()})}
                          className="flex-grow bg-black border border-white/10 h-14 px-4 text-sm font-mono text-foreground uppercase outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* BACKGROUND COLOR */}
                    <div className="space-y-3 p-5 bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                      <label className="text-[10px] font-black text-foreground opacity-60 uppercase tracking-widest flex justify-between">
                        <span>Template Background</span>
                        <span className="text-primary font-mono">{colors.themeBackgroundColor}</span>
                      </label>
                      <div className="flex gap-4">
                        <div 
                          className="w-14 h-14 border border-white/20 relative cursor-pointer overflow-hidden"
                          style={{ backgroundColor: colors.themeBackgroundColor }}
                        >
                          <input 
                            type="color" 
                            value={colors.themeBackgroundColor} 
                            onChange={(e) => setColors({...colors, themeBackgroundColor: e.target.value})}
                            className="absolute inset-0 opacity-0 cursor-pointer scale-[3]"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={colors.themeBackgroundColor} 
                          onChange={(e) => setColors({...colors, themeBackgroundColor: e.target.value.toUpperCase()})}
                          className="flex-grow bg-black border border-white/10 h-14 px-4 text-sm font-mono text-foreground uppercase outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* TEXT COLOR - GLOBAL CONTROL */}
                    <div className="space-y-3 p-5 bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                      <label className="text-[10px] font-black text-foreground opacity-60 uppercase tracking-widest flex justify-between">
                        <span>Global Text Color</span>
                        <span className="text-primary font-mono">{colors.themeTextColor}</span>
                      </label>
                      <div className="flex gap-4">
                        <div 
                          className="w-14 h-14 border border-white/20 relative cursor-pointer overflow-hidden"
                          style={{ backgroundColor: colors.themeTextColor }}
                        >
                          <input 
                            type="color" 
                            value={colors.themeTextColor} 
                            onChange={(e) => setColors({...colors, themeTextColor: e.target.value})}
                            className="absolute inset-0 opacity-0 cursor-pointer scale-[3]"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={colors.themeTextColor} 
                          onChange={(e) => setColors({...colors, themeTextColor: e.target.value.toUpperCase()})}
                          className="flex-grow bg-black border border-white/10 h-14 px-4 text-sm font-mono text-foreground uppercase outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* BUTTON COLOR */}
                    <div className="space-y-3 p-5 bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                      <label className="text-[10px] font-black text-foreground opacity-60 uppercase tracking-widest flex justify-between">
                        <span>Action Button Color</span>
                        <span className="text-primary font-mono">{colors.themeButtonColor}</span>
                      </label>
                      <div className="flex gap-4">
                        <div 
                          className="w-14 h-14 border border-white/20 relative cursor-pointer overflow-hidden"
                          style={{ backgroundColor: colors.themeButtonColor }}
                        >
                          <input 
                            type="color" 
                            value={colors.themeButtonColor} 
                            onChange={(e) => setColors({...colors, themeButtonColor: e.target.value})}
                            className="absolute inset-0 opacity-0 cursor-pointer scale-[3]"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={colors.themeButtonColor} 
                          onChange={(e) => setColors({...colors, themeButtonColor: e.target.value.toUpperCase()})}
                          className="flex-grow bg-black border border-white/10 h-14 px-4 text-sm font-mono text-foreground uppercase outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-4">
                    <Button type="submit" className="w-full bg-primary hover:bg-white hover:text-black text-primary-foreground h-16 font-black uppercase rounded-none text-xs tracking-[0.2em] shadow-2xl transition-all">
                      <Save className="mr-2 h-5 w-5" /> SYNC THEME SETTINGS
                    </Button>
                    <button 
                      type="button" 
                      onClick={resetToDefault} 
                      className="w-full text-foreground/20 hover:text-primary transition-colors py-2 font-black uppercase text-[9px] tracking-[0.3em] flex items-center justify-center gap-2"
                    >
                      <Undo2 className="h-3 w-3" /> RESET TO SYSTEM DEFAULTS
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* LIVE SIMULATOR */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden h-full">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-2">
                  <Monitor className="h-4 w-4" /> LIVE INTERACTIVE SIMULATOR
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 flex flex-col items-center justify-center bg-[#050505] min-h-[700px] relative">
                
                <div 
                  className="w-full max-w-[320px] aspect-[9/19] border-[12px] border-[#1a1a1a] rounded-[45px] relative overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-colors duration-700"
                  style={{ backgroundColor: colors.themeBackgroundColor }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-30" />
                  
                  <div className="flex-grow flex flex-col pt-8">
                    <div className="h-14 bg-black/40 border-b border-white/5 flex items-center px-6 gap-3">
                      <div className="w-6 h-6 border border-white/20 flex items-center justify-center">
                        <span style={{ color: colors.themePrimaryColor }} className="text-[10px] font-black">SS</span>
                      </div>
                      <div className="flex-grow h-2 bg-white/5 rounded-full" />
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <div style={{ color: colors.themeTextColor }} className="text-2xl font-black uppercase leading-tight">PREMIUM PRODUCT</div>
                        <div style={{ color: colors.themeTextColor }} className="text-[10px] opacity-60 uppercase font-bold">ALL TEXT CHANGES COLOR AT ONCE.</div>
                      </div>

                      <div className="aspect-square w-full border border-white/10 relative bg-black/40 flex items-center justify-center">
                         <Layers className="h-10 w-10 text-white/5" />
                         <div 
                          className="absolute bottom-2 right-2 px-3 py-1 text-[9px] font-black text-white"
                          style={{ backgroundColor: colors.themeButtonColor }}
                         >
                          -50%
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-black" style={{ color: colors.themePrimaryColor }}>৳ 2,450</div>
                        <div className="text-[12px] line-through font-bold" style={{ color: colors.themeTextColor }}>৳ 4,900</div>
                      </div>

                      <button 
                        className="w-full h-14 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-2xl transition-all"
                        style={{ backgroundColor: colors.themeButtonColor }}
                      >
                        অর্ডার করুন
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.themePrimaryColor }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.themeBackgroundColor }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.themeTextColor }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.themeButtonColor }} />
                  </div>
                  <p className="text-[10px] font-black text-foreground opacity-30 uppercase tracking-[0.5em] flex items-center gap-2">
                    <Sparkles className="h-3 w-3" /> REAL-TIME VISUALIZATION
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
