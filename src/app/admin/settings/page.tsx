
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Sparkles, 
  Loader2, 
  MessageCircle,
  Github,
  CloudUpload,
  Zap,
  ExternalLink,
  Code,
  Terminal,
  ChevronRight
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

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    descriptionBengali: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    whatsappUrl: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        descriptionBengali: settings.descriptionBengali || '',
        facebookUrl: settings.facebookUrl || '',
        instagramUrl: settings.instagramUrl || '',
        twitterUrl: settings.twitterUrl || '',
        youtubeUrl: settings.youtubeUrl || '',
        whatsappUrl: settings.whatsappUrl || ''
      });
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDocumentNonBlocking(settingsRef, formData, { merge: true });
    toast({
      title: "SETTINGS UPDATED",
      description: "SITE CONFIGURATION HAS BEEN SUCCESSFULLY SAVED.",
    });
  };

  const CodeBlock = ({ commands }: { commands: string[] }) => (
    <div className="bg-black/80 border border-white/10 p-4 font-mono text-[11px] text-green-400 space-y-1 mb-4">
      {commands.map((cmd, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-orange-600">$</span>
          <span>{cmd}</span>
        </div>
      ))}
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
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Global Configuration</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SITE SETTINGS</h1>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: CONTACT & BRAND */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl">
              <CardHeader className="border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                  <Globe className="h-4 w-4" /> BRAND & CONTACT INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                    <Mail className="h-3 w-3" /> OFFICIAL EMAIL
                  </label>
                  <Input 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value.toUpperCase()})}
                    placeholder="INFO@SSSMARTHAAT.COM"
                    className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                    <Phone className="h-3 w-3" /> HELPLINE NUMBER
                  </label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+880 1XXX XXXXXX"
                    className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> CORPORATE ADDRESS
                  </label>
                  <Input 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value.toUpperCase()})}
                    placeholder="BANANI, DHAKA, BANGLADESH"
                    className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                    <Sparkles className="h-3 w-3" /> COMPANY BENGALI PROFILE
                  </label>
                  <Textarea 
                    value={formData.descriptionBengali}
                    onChange={(e) => setFormData({...formData, descriptionBengali: e.target.value})}
                    placeholder="এসএস স্মার্ট হাট — বাংলাদেশের প্রিমিয়াম ফ্যাশন এবং লাইফস্টাইল মার্কেটপ্লেস..."
                    className="bg-black/50 border-white/10 rounded-none text-sm min-h-[150px] leading-relaxed"
                  />
                </div>
              </CardContent>
            </Card>

            {/* EXPANDED PUBLISHING GUIDELINE SECTION (BENGALI) */}
            <Card className="bg-card border-orange-600/20 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-orange-600/10 border-b border-orange-600/20 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                  <Code className="h-4 w-4" /> পাবলিশিং গাইডলাইন (DETAILED PUBLISHING GUIDE)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-12">
                
                {/* GITHUB GUIDE */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-white/5 flex items-center justify-center border border-white/10"><Github className="h-4 w-4 text-white" /></div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">গিটহাব কোড পাবলিশ (GITHUB PUSH)</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] text-muted-foreground leading-relaxed uppercase">
                      আপনার প্রোজেক্টটি গিটহাবে আপলোড করতে টার্মিনালে নিচের কমান্ডগুলো একে একে লিখুন:
                    </p>
                    <CodeBlock commands={[
                      'git init',
                      'git add .',
                      'git commit -m "Initial commit of SS Smart Haat"',
                      'git branch -M main',
                      'git remote add origin https://github.com/yourusername/your-repo.git',
                      'git push -u origin main'
                    ]} />
                    <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-10 w-full md:w-fit">
                      <a href="https://github.com/new" target="_blank" rel="noopener noreferrer"><Github className="mr-2 h-3.5 w-3.5 text-orange-600" /> নতুন রিপোজিটরি তৈরি করুন</a>
                    </Button>
                  </div>
                </div>

                {/* NETLIFY GUIDE */}
                <div className="space-y-4 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-white/5 flex items-center justify-center border border-white/10"><CloudUpload className="h-4 w-4 text-white" /></div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">নেটলিফাই হোস্টিং (NETLIFY DEPLOY)</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] text-muted-foreground leading-relaxed uppercase">
                      টার্মিনাল থেকে সরাসরি ডেপ্লয় করতে নেটলিফাই সি-এল-আই (CLI) ব্যবহার করুন:
                    </p>
                    <CodeBlock commands={[
                      'npm install netlify-cli -g',
                      'netlify login',
                      'npm run build',
                      'netlify deploy --prod'
                    ]} />
                    <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-10 w-full md:w-fit">
                      <a href="https://app.netlify.com/start" target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-3.5 w-3.5 text-orange-600" /> নেটলিফায়ে ড্যাশবোর্ড</a>
                    </Button>
                  </div>
                </div>

                {/* VERCEL GUIDE */}
                <div className="space-y-4 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-white/5 flex items-center justify-center border border-white/10"><Zap className="h-4 w-4 text-white" /></div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">ভার্সেল ডেপ্লয়মেন্ট (VERCEL DEPLOY)</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] text-muted-foreground leading-relaxed uppercase">
                      নেক্সট-জেএস প্রোজেক্টের জন্য ভার্সেল সবথেকে জনপ্রিয় এবং সহজ মেথড:
                    </p>
                    <CodeBlock commands={[
                      'npm install -g vercel',
                      'vercel login',
                      'vercel --prod'
                    ]} />
                    <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-10 w-full md:w-fit">
                      <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-3.5 w-3.5 text-orange-600" /> ভার্সেল কনসোল</a>
                    </Button>
                  </div>
                </div>

                {/* FIREBASE GUIDE */}
                <div className="space-y-4 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-white/5 flex items-center justify-center border border-white/10"><Globe className="h-4 w-4 text-white" /></div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">ফায়ারবেস ম্যানুয়াল (FIREBASE CLI)</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] text-muted-foreground leading-relaxed uppercase">
                      ফায়ারবেস হোস্টিংয়ে আপনার সাইটটি লাইভ করতে নিচের কমান্ডগুলো দিন:
                    </p>
                    <CodeBlock commands={[
                      'npm install -g firebase-tools',
                      'firebase login',
                      'firebase init hosting',
                      'npm run build',
                      'firebase deploy --only hosting'
                    ]} />
                    <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-10 w-full md:w-fit">
                      <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-3.5 w-3.5 text-orange-600" /> ফায়ারবেস ড্যাশবোর্ড</a>
                    </Button>
                  </div>
                </div>

                <div className="bg-orange-600/5 border border-orange-600/20 p-6 space-y-2">
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2"><Terminal className="h-3 w-3" /> গুরুত্বপূর্ণ নোট:</p>
                  <p className="text-[11px] text-white/80 leading-relaxed uppercase">
                    টার্মিনালে কমান্ডগুলো দেওয়ার সময় নিশ্চিত হোন যে আপনি প্রোজেক্টের রুট ফোল্ডারে (ROOT FOLDER) আছেন। যেকোনো এরর আসলে আপনার ইন্টারনেট কানেকশন চেক করুন এবং পুনরায় চেষ্টা করুন।
                  </p>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: SOCIAL LINKS & SUBMIT */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl sticky top-24">
              <CardHeader className="border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">SOCIAL MEDIA CHANNELS</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><Facebook className="h-3 w-3" /> FACEBOOK URL</label>
                  <Input value={formData.facebookUrl} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} className="bg-black/50 border-white/10 rounded-none uppercase text-[10px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><Instagram className="h-3 w-3" /> INSTAGRAM URL</label>
                  <Input value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} className="bg-black/50 border-white/10 rounded-none uppercase text-[10px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><Twitter className="h-3 w-3" /> TWITTER URL</label>
                  <Input value={formData.twitterUrl} onChange={(e) => setFormData({...formData, twitterUrl: e.target.value})} className="bg-black/50 border-white/10 rounded-none uppercase text-[10px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><Youtube className="h-3 w-3" /> YOUTUBE URL</label>
                  <Input value={formData.youtubeUrl} onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})} className="bg-black/50 border-white/10 rounded-none uppercase text-[10px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><MessageCircle className="h-3 w-3" /> WHATSAPP URL</label>
                  <Input value={formData.whatsappUrl} onChange={(e) => setFormData({...formData, whatsappUrl: e.target.value})} placeholder="HTTPS://WA.ME/8801XXXXXXXXX" className="bg-black/50 border-white/10 rounded-none uppercase text-[10px]" />
                </div>

                <div className="pt-8">
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-20 font-black uppercase tracking-[0.2em] rounded-none shadow-2xl shadow-orange-600/10 text-xs">
                    <Save className="mr-3 h-5 w-5" /> PERSIST SETTINGS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
}
