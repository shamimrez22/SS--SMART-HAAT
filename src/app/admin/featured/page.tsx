
"use client";

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  Zap, 
  ImageIcon, 
  Loader2, 
  Smartphone,
  LayoutDashboard
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

export default function FeaturedManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [type, setType] = useState<'SLIDER' | 'FLASH'>('SLIDER');
  const [title, setTitle] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bannersRef = useMemoFirebase(() => query(collection(db, 'featured_banners'), orderBy('createdAt', 'desc')), [db]);
  const { data: banners, isLoading } = useCollection(bannersRef);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({ variant: "destructive", title: "IMAGE TOO LARGE", description: "MAXIMUM IMAGE SIZE IS 1MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    addDocumentNonBlocking(collection(db, 'featured_banners'), {
      type,
      title: title.toUpperCase() || 'UNTITLED BANNER',
      imageUrl: imagePreview,
      createdAt: new Date().toISOString()
    });

    toast({ title: "BANNER ADDED", description: "THE NEW CONTENT IS NOW LIVE IN THE SELECTED SECTION." });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    deleteDocumentNonBlocking(doc(db, 'featured_banners', id));
    toast({ variant: "destructive", title: "CONTENT REMOVED", description: "THE BANNER HAS BEEN PERMANENTLY DELETED." });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">Display Management</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">FEATURED CONTENT</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* BANNER ADD FORM */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-4 h-fit shadow-2xl">
            <CardHeader className="border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                <Zap className="h-4 w-4" /> UPLOAD DIRECT CONTENT
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveBanner} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Display Zone</label>
                  <Select value={type} onValueChange={(val: any) => setType(val)}>
                    <SelectTrigger className="bg-black/50 border-white/10 rounded-none text-[10px] h-12 uppercase font-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 rounded-none">
                      <SelectItem value="SLIDER" className="uppercase text-[10px] font-black focus:bg-[#01a3a4] focus:text-white py-3">MAIN SLIDER BAR</SelectItem>
                      <SelectItem value="FLASH" className="uppercase text-[10px] font-black focus:bg-[#01a3a4] focus:text-white py-3">FLASH OFFER BAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Banner Label (Internal)</label>
                  <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="E.G. SUMMER COLLECTION BANNER" 
                    className="bg-black/50 border-white/10 rounded-none h-12 text-xs uppercase font-bold"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Visualization</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="border-2 border-dashed border-white/10 p-6 text-center cursor-pointer transition-all bg-black/30 flex flex-col items-center justify-center min-h-[200px] relative group overflow-hidden"
                  >
                    {imagePreview ? (
                      <div className="relative w-full aspect-video animate-in zoom-in duration-300">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }} className="absolute top-2 right-2 bg-red-600 p-2 text-white z-10 shadow-xl"><X className="h-5 w-5" /></button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-10 w-10 mx-auto text-[#01a3a4] opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">UPLOAD IMAGE (MAX 1MB)</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold leading-relaxed mb-4">
                    * This option adds images directly to the zones without linking to a product. Perfect for branding and sales announcements.
                  </p>
                  <Button type="submit" disabled={!imagePreview} className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white font-black rounded-none uppercase text-[10px] h-14 tracking-[0.2em] shadow-2xl transition-all">
                    <Plus className="mr-2 h-4 w-4" /> ADD TO DISPLAY
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* ACTIVE BANNERS LIST */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-8 shadow-2xl overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4]">ACTIVE DIRECT CONTENT ({banners?.length || 0})</CardTitle>
              <Badge className="bg-[#01a3a4] text-white font-black text-[9px] rounded-none px-4 py-1">LIVE SYNCED</Badge>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
                  <p className="text-[10px] font-black uppercase text-[#01a3a4] animate-pulse tracking-widest">Accessing Archive...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners?.map((b) => (
                    <div key={b.id} className="relative aspect-video bg-black border border-white/5 group overflow-hidden">
                      <Image src={b.imageUrl} alt={b.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="rounded-none bg-[#01a3a4] text-white text-[8px] font-black border-none px-3 py-1 uppercase">{b.type}</Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate max-w-[70%]">{b.title}</p>
                        <Button onClick={() => handleDelete(b.id)} size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-none">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {banners?.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-white/[0.02] border border-dashed border-white/10">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No direct banners discovered.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

