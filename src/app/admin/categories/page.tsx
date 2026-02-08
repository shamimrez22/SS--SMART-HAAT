
"use client";

import React, { useState, useRef } from 'react';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Upload, X, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, limit } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
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

export default function AdminCategories() {
  const db = useFirestore();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoriesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'categories'), limit(50));
  }, [db]);
  const { data: categories, isLoading } = useCollection(categoriesRef);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressedDataUrl = await compressImage(file);
        setImagePreview(compressedDataUrl);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "ERROR",
          description: "FAILED TO PROCESS CATEGORY IMAGE.",
        });
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imagePreview || !db) return;
    addDocumentNonBlocking(collection(db, 'categories'), {
      name: name.toUpperCase(),
      imageUrl: imagePreview,
      createdAt: new Date().toISOString()
    });
    toast({
      title: "CATEGORY ADDED",
      description: "NEW CATEGORY HAS BEEN SUCCESSFULLY CREATED.",
    });
    setName('');
    setImagePreview(null);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const handleFinalDelete = () => {
    if (deleteId && db) {
      deleteDocumentNonBlocking(doc(db, 'categories', deleteId));
      toast({
        variant: "destructive",
        title: "CATEGORY DELETED",
        description: "THE CATEGORY HAS BEEN PERMANENTLY REMOVED.",
      });
      setDeleteId(null);
      setIsAlertOpen(false);
    }
  };

  if (!db) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 border border-white/10 h-12 w-12"><Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">MANAGE CATEGORIES</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-card border-white/5 rounded-none lg:col-span-1 h-fit shadow-2xl">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">ADD NEW CATEGORY</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Name</label>
                  <Input placeholder="E.G. FASHION" value={name} onChange={(e) => setName(e.target.value)} className="bg-black/50 border-white/10 rounded-none text-xs uppercase h-12" />
                </div>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 p-4 text-center cursor-pointer hover:border-orange-600 bg-black/30 min-h-[200px] flex flex-col items-center justify-center relative group">
                  {isProcessingImage ? (
                    <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
                  ) : imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <Upload className="h-6 w-6 text-orange-600 opacity-50 group-hover:scale-110 transition-transform" />
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                <Button type="submit" disabled={!name || !imagePreview || isProcessingImage} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-none uppercase text-[10px] h-14 shadow-xl">SAVE CATEGORY</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5 rounded-none lg:col-span-2 shadow-2xl">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">EXISTING CATEGORIES</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories?.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 group hover:border-orange-600/30 transition-all">
                    <div className="relative w-16 h-16 shrink-0 bg-black overflow-hidden border border-white/10">
                      <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover opacity-80 group-hover:opacity-100" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-[11px] font-black text-white uppercase tracking-tighter">{cat.name}</h3>
                    </div>
                    <Button onClick={() => confirmDelete(cat.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black border-orange-600/30 rounded-none p-8 max-w-md relative fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <button 
            onClick={() => setIsAlertOpen(false)}
            className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-600/10 flex items-center justify-center border border-red-600/20"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
              <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">DELETE CATEGORY?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
              THIS WILL PERMANENTLY REMOVE THIS CATEGORY.
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
