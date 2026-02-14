"use client";

import React, { useState, useRef } from 'react';
import { MainHeader } from '@/components/MainHeader';
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
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy, limit } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/lib/image-compression';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FeaturedManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [type, setType] = useState<'SLIDER' | 'FLASH'>('SLIDER');
  const [title, setTitle] = useState('');
  const [showOnLeft, setShowOnLeft] = useState(true);
  const [showOnRight, setShowOnRight] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bannersRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'featured_banners'), orderBy('createdAt', 'desc'), limit(30));
  }, [db]);
  const { data: banners, isLoading } = useCollection(bannersRef);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressedDataUrl = await compressImage(file, 1200, 600);
        setImagePreview(compressedDataUrl);
      } catch (err) {
        toast({ variant: "destructive", title: "ERROR", description: "FAILED TO PROCESS BANNER IMAGE." });
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    addDocumentNonBlocking(collection(db!, 'featured_banners'), {
      type,
      title: title.toUpperCase() || 'UNTITLED BANNER',
      imageUrl: imagePreview,
      showOnLeft: type === 'FLASH' ? showOnLeft : true,
      showOnRight: type === 'FLASH' ? showOnRight : true,
      createdAt: new Date().toISOString()
    });

    toast({ title: "BANNER ADDED", description: "THE NEW CONTENT IS NOW LIVE." });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setShowOnLeft(true);
    setShowOnRight(true);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const handleFinalDelete = () => {
    if (deleteId && db) {
      deleteDocumentNonBlocking(doc(db, 'featured_banners', deleteId));
      toast({ variant: "destructive", title: "CONTENT REMOVED", description: "THE BANNER HAS BEEN PERMANENTLY DELETED." });
      setDeleteId(null);
      setIsAlertOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-2 md:px-12 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
            <Link href="/admin"><ArrowLeft className="h-6 w-6 text-orange-500" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Display Management</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">FEATURED CONTENT</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="bg-card border-white/5 rounded-none lg:col-span-4 h-fit shadow-2xl">
            <CardHeader className="border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                <Plus className="h-4 w-4" /> UPLOAD NEW BANNER
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveBanner} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase">DISPLAY ZONE</label>
                  <Select value={type} onValueChange={(val: any) => setType(val)}>
                    <SelectTrigger className="bg-black border-white/20 rounded-none text-[10px] h-12 uppercase font-black text-white focus:border-orange-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 rounded-none">
                      <SelectItem value="SLIDER" className="uppercase text-[10px] font-black py-3">MAIN SLIDER BAR</SelectItem>
                      <SelectItem value="FLASH" className="uppercase text-[10px] font-black py-3">FLASH OFFER BAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {type === 'FLASH' && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="left-tik" 
                        checked={showOnLeft} 
                        onCheckedChange={(val) => setShowOnLeft(!!val)} 
                        className="border-orange-500 data-[state=checked]:bg-orange-500"
                      />
                      <label htmlFor="left-tik" className="text-[9px] font-black text-white uppercase cursor-pointer">LEFT SIDE</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="right-tik" 
                        checked={showOnRight} 
                        onCheckedChange={(val) => setShowOnRight(!!val)} 
                        className="border-orange-500 data-[state=checked]:bg-orange-500"
                      />
                      <label htmlFor="right-tik" className="text-[9px] font-black text-white uppercase cursor-pointer">RIGHT SIDE</label>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase">BANNER LABEL</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.G. SUMMER COLLECTION" className="bg-black border-white/20 rounded-none h-12 text-xs uppercase font-bold text-white focus:border-orange-500" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase">VISUALIZATION</label>
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-orange-500/20 p-6 text-center cursor-pointer transition-all bg-black/30 flex flex-col items-center justify-center min-h-[200px] relative group overflow-hidden">
                    {isProcessingImage ? (
                      <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                    ) : imagePreview ? (
                      <div className="relative w-full aspect-video">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }} className="absolute top-2 right-2 bg-red-600 p-2 text-white z-10"><X className="h-5 w-5" /></button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-10 w-10 mx-auto text-orange-500 opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">UPLOAD IMAGE</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" onClick={resetForm} variant="outline" className="flex-1 border-white/20 text-white font-black rounded-none uppercase text-[10px] h-14 hover:bg-white/5">
                    CANCEL
                  </Button>
                  <Button type="submit" disabled={!imagePreview || isProcessingImage} className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white font-black rounded-none uppercase text-[10px] h-14 shadow-2xl">
                    ADD TO DISPLAY
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5 rounded-none lg:col-span-8 shadow-2xl overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">ACTIVE CONTENT ({banners?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners?.map((b) => (
                  <div key={b.id} className="relative aspect-video bg-black border border-white/10 group overflow-hidden">
                    <Image src={b.imageUrl} alt={b.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-orange-500 text-white text-[8px] font-black rounded-none px-3 py-1">{b.type}</Badge>
                      {b.type === 'FLASH' && (
                        <>
                          {b.showOnLeft !== false && <Badge className="bg-white/10 text-white text-[8px] font-black rounded-none px-2 py-1">LEFT</Badge>}
                          {b.showOnRight !== false && <Badge className="bg-white/10 text-white text-[8px] font-black rounded-none px-2 py-1">RIGHT</Badge>}
                        </>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <p className="text-[10px] font-black text-white uppercase truncate max-w-[70%]">{b.title}</p>
                      <Button onClick={() => confirmDelete(b.id)} size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black border-orange-500/30 rounded-none p-8 max-w-md fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-600/10 flex items-center justify-center border border-red-600/20"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
              <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">REMOVE THIS CONTENT?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
              THIS ACTION WILL PERMANENTLY REMOVE THE FEATURED BANNER FROM YOUR SYSTEM.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-2 sm:gap-0">
            <AlertDialogCancel className="flex-1 rounded-none border-white/10 text-white font-black uppercase text-[10px] h-12 hover:bg-white/5">CANCEL</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] rounded-none h-12 shadow-xl shadow-red-600/10">CONFIRM DELETE</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
