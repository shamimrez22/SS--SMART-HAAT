
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Terminal, 
  Info, 
  BookOpen,
  Github,
  Zap,
  ShieldCheck,
  User,
  Lock,
  Save,
  Loader2,
  Smartphone,
  RotateCcw,
  ExternalLink,
  Code
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

  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (settings) {
      setAdminData({
        adminUsername: settings.adminUsername || 'ADMIN',
        adminPassword: settings.adminPassword || '4321'
      });
    }
    setPreviewUrl(window.location.origin);
  }, [settings]);

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setDocumentNonBlocking(settingsRef, adminData, { merge: true });
    toast({
      title: "SECURITY CONFIGURATION UPDATED",
      description: "ADMIN ACCESS CREDENTIALS HAVE BEEN SUCCESSFULLY SYNCED.",
    });
  };

  const CodeBlock = ({ title, commands, explanation }: { title: string, commands: string[], explanation: string }) => (
    <div className="space-y-4 mb-8 p-6 border border-white/5 bg-white/[0.01]">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-4 w-1 bg-orange-600" />
        <h3 className="text-[10px] font-black text-white uppercase tracking-widest">{title}</h3>
      </div>
      <p className="text-[11px] text-white/60 uppercase font-bold leading-relaxed">{explanation}</p>
      <div className="bg-black border border-white/10 p-5 font-mono text-[10px] text-green-400 space-y-2 relative shadow-inner">
        {commands.map((cmd, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-orange-600 select-none">$</span>
            <span>{cmd}</span>
          </div>
        ))}
      </div>
    </div>
  );

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
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Operations & Security</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SYSTEM SETTINGS</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT COLUMN: SECURITY & PUBLISHING */}
          <div className="space-y-12">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> ADMIN ACCESS CONFIGURATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSaveAdmin} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                        <User className="h-3 w-3" /> ADMIN USERNAME
                      </label>
                      <Input 
                        value={adminData.adminUsername}
                        onChange={(e) => setAdminData({...adminData, adminUsername: e.target.value})}
                        className="bg-black border-white/10 rounded-none h-14 text-sm font-black text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                        <Lock className="h-3 w-3" /> ADMIN PASSWORD
                      </label>
                      <Input 
                        value={adminData.adminPassword}
                        onChange={(e) => setAdminData({...adminData, adminPassword: e.target.value})}
                        className="bg-black border-white/10 rounded-none h-14 text-sm font-black text-white"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-14 font-black uppercase tracking-widest rounded-none">
                    <Save className="mr-3 h-4 w-4" /> UPDATE CREDENTIALS
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                  <Terminal className="h-4 w-4" /> পাবলিশিং গাইড (GitHub & Vercel)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <CodeBlock 
                  title="১. গিটহাব পাবলিশ গাইড"
                  explanation="আপনার কোড আপডেট করতে নিচের কমান্ডগুলো ব্যবহার করুন। এরপর বাটন ক্লিক করে গিটহাবে গিয়ে আপডেট কোড চেক করুন।"
                  commands={[
                    'git init',
                    'git add .',
                    'git commit -m "Updated Final Build"',
                    'git push origin main'
                  ]}
                />
                <Button asChild className="w-full bg-white text-black hover:bg-white/90 h-14 font-black uppercase tracking-widest rounded-none mb-8">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-3 h-5 w-5" /> OPEN GITHUB TERMINAL
                  </a>
                </Button>

                <div className="h-px bg-white/5 mb-8" />

                <CodeBlock 
                  title="২. ভার্সেল ডিপ্লয়মেন্ট গাইড"
                  explanation="গিটহাব কানেক্ট হয়ে গেলে ভার্সেলে গিয়ে এক ক্লিকেই আপনার সাইট লাইভ করতে পারবেন। ভার্সেল আপনার গিটহাবের আপডেট কোড সরাসরি লাইভ করে দিবে।"
                  commands={[
                    'Go to Vercel Dashboard',
                    'Import from GitHub',
                    'Click Deploy',
                    'Your Site is Live!'
                  ]}
                />
                <Button asChild className="w-full bg-[#01a3a4] text-white hover:bg-[#01a3a4]/90 h-14 font-black uppercase tracking-widest rounded-none">
                  <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer">
                    <Zap className="mr-3 h-5 w-5" /> DEPLOY TO VERCEL
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: MOBILE PREVIEW */}
          <div className="space-y-6">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl h-full">
              <CardHeader className="bg-[#01a3a4]/5 border-b border-white/5 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> LIVE MOBILE PREVIEW
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-[#01a3a4] hover:bg-[#01a3a4]/10 rounded-none"
                  onClick={() => setPreviewUrl(previewUrl + '?t=' + Date.now())}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-8 flex justify-center bg-black/40">
                <div className="relative mx-auto border-[10px] border-white/10 rounded-[3rem] w-[340px] h-[650px] shadow-2xl overflow-hidden bg-black">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/10 rounded-b-2xl z-20"></div>
                  {previewUrl && (
                    <iframe 
                      src={previewUrl} 
                      className="border-none pt-2"
                      style={{
                        width: '1200px',
                        height: '2294px', // Adjusted height based on 1200px width ratio
                        transform: 'scale(0.2833)', // Scales 1200px down to fit 340px (340/1200)
                        transformOrigin: 'top left',
                      }}
                      title="Mobile Preview"
                    />
                  )}
                </div>
              </CardContent>
              <div className="p-6 bg-black border-t border-white/5 text-center">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                  আপনার মোবাইল ভিউ এখন ডেস্কটপ মুডে (Fixed 1200px) সেট করা আছে। <br/>
                  কাস্টমাররা মোবাইলেও একদম ডেস্কটপের মতো প্রিমিয়াম ফিল পাবে।
                </p>
              </div>
            </Card>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
