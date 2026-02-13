"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Upload, 
  Loader2, 
  Edit2, 
  Zap, 
  LayoutDashboard,
  Ruler,
  DollarSign,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy, limit } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/lib/image-compression';
import { analyzeProductImage } from '@/ai/flows/product-analyzer-flow';
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

export default function AdminProducts() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('100');
  const [showInSlider, setShowInSlider] = useState(false);
  const [showInFlashOffer, setShowInFlashOffer] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const [sizeList, setSizeList] = useState<{size: string, qty: number}[]>([]);
  const [newSize, setNewSize] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productsRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(50));
  }, [db]);

  const categoriesRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'categories');
  }, [db]);

  const { data: products } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressed = await compressImage(file, 800, 1066); 
        setImagePreview(compressed);
        
        if (!editingId) {
          setIsAiAnalyzing(true);
          toast({ title: "AI INITIATED", description: "ANALYZING PRODUCT VISUALS..." });
          try {
            const aiData = await analyzeProductImage({ photoDataUri: compressed });
            if (aiData) {
              setName(aiData.name);
              setDescription(aiData.description);
              setCategory(aiData.category);
              toast({ title: "AI ANALYSIS COMPLETE", description: "FIELDS AUTO-FILLED SUCCESSFULLY." });
            }
          } catch (aiErr) {
            console.error("AI Error:", aiErr);
          } finally {
            setIsAiAnalyzing(false);
          }
        }
      } catch (err) {
        toast({ variant: "destructive", title: "ERROR", description: "FAILED TO PROCESS IMAGE." });
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const addSizeRow = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!newSize.trim()) return;
    const formattedSize = newSize.trim().toUpperCase();
    const exists = sizeList.find(s => s.size === formattedSize);
    if (exists) {
      toast({ variant: "destructive", title: "DUPLICATE", description: "SIZE ALREADY EXISTS." });
      return;
    }
    setSizeList(prev => [...prev, { size: formattedSize, qty: 0 }]);
    setNewSize('');
  };

  const removeSizeRow = (index: number) => {
    setSizeList(prev => prev.filter((_, i) => i !== index));
  };

  const updateSizeQty = (index: number, val: string) => {
    const newList = [...sizeList];
    newList[index].qty = parseInt(val) || 0;
    setSizeList(newList);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    if (!name || !price || !category || !imagePreview) {
      toast({ variant: "destructive", title: "MISSING DATA", description: "PLEASE FILL ALL REQUIRED FIELDS." });
      return;
    }

    const sizeStock: Record<string, number> = {};
    sizeList.forEach(s => {
      sizeStock[s.size] = s.qty;
    });

    const productData = {
      name: name.toUpperCase(),
      description: description || 'PREMIUM PRODUCT',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      category: category.toUpperCase(),
      stockQuantity: sizeList.length > 0 ? sizeList.reduce((acc, curr) => acc + curr.qty, 0) : parseInt(stockQuantity),
      sizes: sizeList.map(s => s.size),
      sizeStock: sizeList.length > 0 ? sizeStock : null,
      showInSlider,
      showInFlashOffer,
      imageUrl: imagePreview,
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(db, 'products', editingId), productData);
      toast({ title: "PRODUCT UPDATED" });
      setEditingId(null);
    } else {
      addDocumentNonBlocking(collection(db, 'products'), { ...productData, createdAt: new Date().toISOString() });
      toast({ title: "PRODUCT SAVED" });
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null); 
    setName(''); 
    setDescription('');
    setPrice(''); 
    setOriginalPrice('');
    setCategory(''); 
    setStockQuantity('100');
    setSizeList([]);
    setNewSize('');
    setShowInSlider(false);
    setShowInFlashOffer(false);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const handleFinalDelete = () => {
    if (deleteId && db) {
      deleteDocumentNonBlocking(doc(db, 'products', deleteId));
      toast({ variant: "destructive", title: "PRODUCT DELETED", description: "THE PRODUCT RECORD HAS BEEN REMOVED." });
      setDeleteId(null);
      setIsAlertOpen(false);
    }
  };

  if (!db) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background selection:bg-[#01a3a4]/30">
      <MainHeader />
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="border border-white/10 h-12 w-12 rounded-none hover:bg-white/5">
            <Link href="/admin"><ArrowLeft className="h-6 w-6 text-[#01a3a4]" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">Inventory System</p>
            <h1 className="text-4xl font-black uppercase text-white tracking-tighter">PRODUCT CONTROL</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-5 bg-card border-white/5 rounded-none shadow-2xl h-fit overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase text-orange-500 flex items-center gap-2 tracking-[0.2em]">
                {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {editingId ? 'EDIT' : 'ADD'} PRODUCT
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              
              <div 
                onClick={() => !isProcessingImage && !isAiAnalyzing && fileInputRef.current?.click()} 
                className="border-2 border-dashed border-orange-500/30 text-center cursor-pointer bg-black/50 aspect-[3/4] w-full max-w-[350px] mx-auto relative flex flex-col items-center justify-center group overflow-hidden transition-all hover:border-[#01a3a4]/50 shadow-2xl"
              >
                {isProcessingImage || isAiAnalyzing ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-orange-500 h-10 w-10" />
                    <p className="text-[9px] font-black text-orange-500 uppercase animate-pulse tracking-[0.3em]">
                      {isAiAnalyzing ? 'AI ANALYZING PRODUCT...' : 'OPTIMIZING IMAGE...'}
                    </p>
                  </div>
                ) : imagePreview ? (
                  <>
                    <Image src={imagePreview} alt="Preview" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <RefreshCw className="h-10 w-10 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-orange-500 opacity-30 group-hover:opacity-100 mx-auto transition-all" />
                    <p className="text-[10px] font-black uppercase text-white tracking-widest">UPLOAD PRODUCT IMAGE</p>
                    <p className="text-[8px] font-bold text-orange-500 uppercase tracking-widest">AI WILL AUTO-FILL DETAILS</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest">PRODUCT NAME</label>
                    {isAiAnalyzing && <Sparkles className="h-3 w-3 text-orange-500 animate-pulse" />}
                  </div>
                  <Input placeholder="E.G. PREMIUM JAMDANI" value={name} onChange={(e) => setName(e.target.value)} className="bg-black border-white/20 h-14 uppercase font-black text-xs text-white focus:border-[#01a3a4]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest">DESCRIPTION</label>
                  <Textarea placeholder="ENTER DETAILS..." value={description} onChange={(e) => setDescription(e.target.value)} className="bg-black border-white/20 min-h-[100px] text-xs font-bold uppercase text-white focus:border-[#01a3a4]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#01a3a4] uppercase flex items-center gap-1"><DollarSign className="h-3 w-3" /> SALE PRICE (৳)</label>
                  <Input placeholder="0.00" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-black border-white/20 h-12 text-xs font-black text-[#01a3a4] focus:border-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/60 uppercase">ORIGINAL PRICE (৳)</label>
                  <Input placeholder="0.00" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="bg-black border-white/20 h-12 text-xs font-bold text-white/60 focus:border-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-1"><LayoutDashboard className="h-3 w-3" /> CATEGORY</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-black border-white/20 h-12 uppercase font-black text-[10px] text-white"><SelectValue placeholder="SELECT CATEGORY" /></SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    {categories?.map((c) => <SelectItem key={c.id} value={c.name} className="uppercase font-black text-[10px]">{c.name}</SelectItem>)}
                    {category && !categories?.find(c => c.name === category) && (
                      <SelectItem value={category} className="uppercase font-black text-[10px] border-l-2 border-[#01a3a4]">{category}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 p-5 bg-white/[0.02] border border-white/10">
                <label className="text-[9px] font-black text-[#01a3a4] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Ruler className="h-4 w-4" /> SIZE-WISE INVENTORY (OPTIONAL)
                </label>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="SIZE (E.G. XL)" 
                    value={newSize} 
                    onChange={(e) => setNewSize(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSizeRow();
                      }
                    }}
                    className="bg-black border-white/20 h-10 text-[10px] uppercase font-black text-white" 
                  />
                  <Button onClick={(e) => addSizeRow(e)} type="button" className="bg-[#01a3a4] h-10 rounded-none text-[8px] font-black uppercase px-4">ADD SIZE</Button>
                </div>

                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                  {sizeList.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 bg-black/50 p-2 border border-white/10 animate-in fade-in slide-in-from-left-2">
                      <span className="text-[10px] font-black text-white w-12">{s.size}</span>
                      <Input 
                        type="number" 
                        placeholder="QTY" 
                        value={s.qty} 
                        onChange={(e) => updateSizeQty(i, e.target.value)}
                        className="h-8 bg-transparent border-white/10 text-[10px] font-black text-[#01a3a4] flex-grow" 
                      />
                      <Button onClick={() => removeSizeRow(i)} type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {sizeList.length === 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="text-[9px] font-black text-orange-500 uppercase">GENERAL STOCK QUANTITY</label>
                    <Input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="bg-black border-white/20 h-12 text-xs font-black text-white" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  <Checkbox id="slider" checked={showInSlider} onCheckedChange={(val) => setShowInSlider(!!val)} className="border-orange-500 data-[state=checked]:bg-orange-500" />
                  <label htmlFor="slider" className="text-[9px] font-black text-white uppercase cursor-pointer flex items-center gap-1">SLIDER BAR</label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="flash" checked={showInFlashOffer} onCheckedChange={(val) => setShowInFlashOffer(!!val)} className="border-orange-500 data-[state=checked]:bg-orange-500" />
                  <label htmlFor="flash" className="text-[9px] font-black text-white uppercase cursor-pointer flex items-center gap-1">FLASH OFFER</label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={resetForm} type="button" variant="outline" className="flex-1 border-white/20 text-white font-black h-14 rounded-none uppercase text-[10px] hover:bg-white/5">
                  <X className="mr-2 h-4 w-4" /> CANCEL
                </Button>
                <Button onClick={handleSaveProduct} className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white font-black h-14 rounded-none uppercase tracking-widest text-[10px] shadow-2xl">
                  {editingId ? 'UPDATE RECORD' : 'SAVE TO SYSTEM'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7 bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase text-[#01a3a4] tracking-[0.2em]">ACTIVE ARCHIVE ({products?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[1200px] overflow-y-auto">
                {products?.map((p) => (
                  <div key={p.id} className="flex items-center gap-6 p-5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all group">
                    <div className="relative h-20 w-16 bg-black border border-white/10 shrink-0 overflow-hidden">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[12px] font-black text-white uppercase truncate">{p.name}</h3>
                        {p.showInSlider && <LayoutDashboard className="h-3 w-3 text-[#01a3a4]" />}
                        {p.showInFlashOffer && <Zap className="h-3 w-3 text-orange-500" />}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
                        <span className="text-[#01a3a4] font-black text-[13px]">৳{p.price}</span>
                        {p.originalPrice > p.price && <span className="text-white/20 line-through text-[10px]">৳{p.originalPrice}</span>}
                        <span className="text-[8px] font-black text-white/40 uppercase bg-white/5 px-2 py-0.5">{p.category}</span>
                        <span className="text-[8px] font-black text-green-500/70 uppercase">STOCK: {p.stockQuantity}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button onClick={() => { 
                        setEditingId(p.id); 
                        setName(p.name); 
                        setDescription(p.description || '');
                        setPrice(p.price.toString()); 
                        setOriginalPrice(p.originalPrice?.toString() || '');
                        setCategory(p.category); 
                        setStockQuantity(p.stockQuantity?.toString() || '100');
                        setShowInSlider(!!p.showInSlider);
                        setShowInFlashOffer(!!p.showInFlashOffer);
                        setImagePreview(p.imageUrl);
                        if (p.sizeStock) {
                          setSizeList(Object.entries(p.sizeStock).map(([size, qty]) => ({ size, qty: qty as number })));
                        } else {
                          setSizeList([]);
                        }
                      }} size="icon" variant="ghost" className="h-10 w-10 text-white/40 hover:text-[#01a3a4] hover:bg-[#01a3a4]/10">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => confirmDelete(p.id)} size="icon" variant="ghost" className="h-10 w-10 text-white/40 hover:text-red-500 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black border-[#01a3a4]/30 rounded-none p-8 max-w-md fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] shadow-2xl">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-600/10 flex items-center justify-center border border-red-600/20"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
              <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">DELETE PRODUCT?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
              THIS WILL PERMANENTLY REMOVE THIS PRODUCT FROM YOUR INVENTORY ARCHIVE.
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
