
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Package, Upload, X, Loader2, Edit2, Save, AlertTriangle, Ruler, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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

interface SizeEntry {
  size: string;
  quantity: number;
}

export default function AdminProducts() {
  const db = useFirestore();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('0');
  const [category, setCategory] = useState('');
  const [manualStockQuantity, setManualStockQuantity] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showInSlider, setShowInSlider] = useState(false);
  const [showInFlashOffer, setShowInFlashOffer] = useState(false);
  
  // Validation state
  const [showValidation, setShowValidation] = useState(false);
  
  // Advanced Size Management
  const [sizeEntries, setSizeEntries] = useState<SizeEntry[]>([]);
  
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc')), [db]);
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  
  const { data: products, isLoading: productsLoading } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);

  // Auto-calculate total stock if sizes are present
  const calculatedTotalStock = sizeEntries.length > 0 
    ? sizeEntries.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
    : parseInt(manualStockQuantity) || 0;

  // Auto-calculate discount
  useEffect(() => {
    if (editingId) return;
    const p = parseFloat(price);
    const op = parseFloat(originalPrice);
    if (p && op && op > p) {
      const disc = ((op - p) / op) * 100;
      setDiscountPercentage(Math.round(disc).toString());
    } else {
      setDiscountPercentage('0');
    }
  }, [price, originalPrice, editingId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "IMAGE TOO LARGE",
          description: "MAXIMUM IMAGE SIZE IS 1MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSizeEntry = () => {
    setSizeEntries([...sizeEntries, { size: '', quantity: 1 }]);
  };

  const removeSizeEntry = (index: number) => {
    const newEntries = sizeEntries.filter((_, i) => i !== index);
    setSizeEntries(newEntries);
  };

  const updateSizeEntry = (index: number, field: keyof SizeEntry, value: string | number) => {
    const newEntries = [...sizeEntries];
    if (field === 'quantity') {
      newEntries[index][field] = parseInt(value.toString()) || 0;
    } else {
      newEntries[index][field] = value.toString().toUpperCase();
    }
    setSizeEntries(newEntries);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check missing fields
    const isNameMissing = !name;
    const isPriceMissing = !price;
    const isCategoryMissing = !category;
    const isImageMissing = !imagePreview;
    const isStockMissing = sizeEntries.length === 0 && !manualStockQuantity;

    if (isNameMissing || isPriceMissing || isCategoryMissing || isImageMissing || isStockMissing) {
      setShowValidation(true);
      toast({
        variant: "destructive",
        title: "MISSING INFORMATION",
        description: "PLEASE FILL ALL RED HIGHLIGHTED FIELDS BEFORE SAVING.",
      });
      return;
    }

    const finalStock = sizeEntries.length > 0 
      ? sizeEntries.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
      : parseInt(manualStockQuantity) || 0;

    const productData = {
      name: name.toUpperCase(),
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || parseFloat(price),
      discountPercentage: parseInt(discountPercentage) || 0,
      category: category.toUpperCase(),
      sizes: sizeEntries.length > 0 ? sizeEntries.map(s => s.size) : [],
      sizeInventory: sizeEntries,
      stockQuantity: finalStock,
      imageUrl: imagePreview,
      showInSlider,
      showInFlashOffer,
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(db, 'products', editingId), productData);
      toast({
        title: "RECORD UPDATED",
        description: "PRODUCT INFORMATION HAS BEEN SUCCESSFULLY SYNCED.",
      });
      setEditingId(null);
    } else {
      addDocumentNonBlocking(collection(db, 'products'), {
        ...productData,
        createdAt: new Date().toISOString()
      });
      toast({
        title: "PRODUCT REGISTERED",
        description: "NEW ITEM HAS BEEN ADDED TO THE INVENTORY ARCHIVE.",
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setDiscountPercentage('0');
    setCategory('');
    setManualStockQuantity('');
    setSizeEntries([]);
    setImagePreview(null);
    setShowInSlider(false);
    setShowInFlashOffer(false);
    setShowValidation(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price.toString());
    setOriginalPrice(product.originalPrice?.toString() || product.price.toString());
    setDiscountPercentage(product.discountPercentage?.toString() || '0');
    setCategory(product.category);
    setSizeEntries(product.sizeInventory || []);
    if (!product.sizeInventory || product.sizeInventory.length === 0) {
      setManualStockQuantity(product.stockQuantity?.toString() || '');
    } else {
      setManualStockQuantity('');
    }
    setImagePreview(product.imageUrl);
    setShowInSlider(!!product.showInSlider);
    setShowInFlashOffer(!!product.showInFlashOffer);
    setShowValidation(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const handleFinalDelete = () => {
    if (deleteId) {
      deleteDocumentNonBlocking(doc(db, 'products', deleteId));
      toast({
        variant: "destructive",
        title: "PRODUCT REMOVED",
        description: "RECORD HAS BEEN PERMANENTLY DELETED FROM ARCHIVE.",
      });
      setDeleteId(null);
      setIsAlertOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Inventory Management</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
              {editingId ? 'EDITING PRODUCT' : 'PRODUCT CONTROL'}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* PRODUCT FORM */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-4 h-fit sticky top-24 max-h-[85vh] overflow-y-auto shadow-2xl">
            <CardHeader className="border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> {editingId ? 'UPDATE RECORD' : 'REGISTER NEW ITEM'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className={cn("text-[10px] font-black uppercase", showValidation && !name ? "text-red-500" : "text-muted-foreground")}>
                    Product Identity *
                  </label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="E.G. PREMIUM POLO SHIRT" 
                    className={cn(
                      "bg-black/50 border-white/10 rounded-none h-12 text-xs uppercase font-bold",
                      showValidation && !name && "border-red-600 focus-visible:ring-red-600"
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Description</label>
                  <Textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="ENTER SPECIFICATIONS..." 
                    className="bg-black/50 border-white/10 rounded-none text-xs min-h-[100px] leading-relaxed" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">MSRP (৳)</label>
                    <Input 
                      type="number" 
                      value={originalPrice} 
                      onChange={(e) => setOriginalPrice(e.target.value)} 
                      placeholder="0.00" 
                      className="bg-black/50 border-white/10 rounded-none h-12 text-xs" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={cn("text-[10px] font-black uppercase", showValidation && !price ? "text-red-500" : "text-muted-foreground")}>
                      Sales Price (৳) *
                    </label>
                    <Input 
                      type="number" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      placeholder="0.00" 
                      className={cn(
                        "bg-black/50 border-white/10 rounded-none h-12 text-xs text-orange-600 font-black",
                        showValidation && !price && "border-red-600 focus-visible:ring-red-600"
                      )}
                    />
                  </div>
                </div>

                {/* SIZE & INVENTORY SYSTEM */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black text-white uppercase flex items-center gap-2">
                      <Ruler className="h-3 w-3 text-orange-600" /> SIZE SPECIFIC STOCK
                    </label>
                    <Button 
                      type="button" 
                      onClick={addSizeEntry} 
                      variant="outline" 
                      className="h-8 rounded-none border-orange-600/30 text-orange-600 hover:bg-orange-600 hover:text-white text-[9px] font-black uppercase tracking-widest"
                    >
                      + ADD SIZE
                    </Button>
                  </div>

                  {sizeEntries.map((entry, index) => (
                    <div key={index} className="flex gap-2 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex-1 space-y-1">
                         <label className="text-[8px] font-black text-muted-foreground uppercase">SIZE NAME</label>
                         <Input 
                            value={entry.size} 
                            onChange={(e) => updateSizeEntry(index, 'size', e.target.value)}
                            placeholder="E.G. XL"
                            className="bg-black/50 border-white/10 rounded-none h-10 text-[10px] font-black"
                         />
                      </div>
                      <div className="w-24 space-y-1">
                         <label className="text-[8px] font-black text-muted-foreground uppercase">QTY (PCS)</label>
                         <Input 
                            type="number"
                            value={entry.quantity} 
                            onChange={(e) => updateSizeEntry(index, 'quantity', e.target.value)}
                            placeholder="1"
                            className="bg-black/50 border-white/10 rounded-none h-10 text-[10px] font-black text-orange-600"
                         />
                      </div>
                      <Button type="button" onClick={() => removeSizeEntry(index)} variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-600/5">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {sizeEntries.length === 0 && (
                    <div className="space-y-2 p-4 bg-white/[0.02] border border-dashed border-white/10">
                      <label className={cn("text-[10px] font-black uppercase", showValidation && !manualStockQuantity ? "text-red-500" : "text-muted-foreground")}>
                        Manual Total Stock *
                      </label>
                      <Input 
                        type="number" 
                        value={manualStockQuantity} 
                        onChange={(e) => setManualStockQuantity(e.target.value)} 
                        placeholder="TOTAL UNITS" 
                        className={cn(
                          "bg-black/50 border-white/10 rounded-none h-12 text-xs font-black",
                          showValidation && sizeEntries.length === 0 && !manualStockQuantity && "border-red-600 focus-visible:ring-red-600"
                        )}
                      />
                      <p className="text-[8px] text-orange-600/70 italic uppercase tracking-wider font-bold">
                        * Use this if product has no specific sizes.
                      </p>
                    </div>
                  )}

                  {sizeEntries.length > 0 && (
                    <div className="p-4 bg-orange-600/10 border border-orange-600/20">
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] text-center">
                        TOTAL CALCULATED STOCK: {calculatedTotalStock} PCS
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={cn("text-[10px] font-black uppercase", showValidation && !category ? "text-red-500" : "text-muted-foreground")}>
                    Classification *
                  </label>
                  <Select value={category} onValueChange={(val) => setCategory(val)}>
                    <SelectTrigger className={cn(
                      "bg-black/50 border-white/10 rounded-none text-[10px] h-12 uppercase font-black",
                      showValidation && !category && "border-red-600 ring-red-600"
                    )}>
                      <SelectValue placeholder="SELECT CATEGORY" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 rounded-none">
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name} className="uppercase text-[10px] font-black focus:bg-orange-600 focus:text-white py-3">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 mt-4">
                  <div className="flex items-center space-x-3 p-3 bg-white/[0.02] border border-white/5">
                    <Checkbox 
                      id="slider" 
                      checked={showInSlider} 
                      onCheckedChange={(checked) => setShowInSlider(!!checked)} 
                      className="border-white/20 data-[state=checked]:bg-orange-600" 
                    />
                    <Label htmlFor="slider" className="text-[9px] font-black uppercase text-white cursor-pointer tracking-widest leading-none">Slider</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/[0.02] border border-white/5">
                    <Checkbox 
                      id="flash" 
                      checked={showInFlashOffer} 
                      onCheckedChange={(checked) => setShowInFlashOffer(!!checked)} 
                      className="border-white/20 data-[state=checked]:bg-orange-600" 
                    />
                    <Label htmlFor="flash" className="text-[9px] font-black uppercase text-white cursor-pointer tracking-widest leading-none">Flash Offer</Label>
                  </div>
                </div>
                <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] italic">
                   * Checked products appear in the designated bar AND main list.
                </p>
                
                <div className="space-y-2">
                  <label className={cn("text-[10px] font-black uppercase", showValidation && !imagePreview ? "text-red-500" : "text-muted-foreground")}>
                    Product Visualization *
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className={cn(
                      "border-2 border-dashed p-6 text-center cursor-pointer transition-all bg-black/30 flex flex-col items-center justify-center min-h-[200px] relative group overflow-hidden",
                      showValidation && !imagePreview ? "border-red-600" : "border-white/10 hover:border-orange-600"
                    )}
                  >
                    {imagePreview ? (
                      <div className="relative w-full aspect-square animate-in zoom-in duration-300">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }} className="absolute top-2 right-2 bg-red-600 p-2 text-white z-10 shadow-xl"><X className="h-5 w-5" /></button>
                      </div>
                    ) : (
                      <div className="space-y-3 group-hover:scale-110 transition-transform">
                        <Upload className={cn("h-10 w-10 mx-auto", showValidation && !imagePreview ? "text-red-500" : "text-orange-600 opacity-50")} />
                        <p className={cn("text-[10px] font-black uppercase tracking-widest", showValidation && !imagePreview ? "text-red-500" : "text-white")}>
                          UPLOAD MASTER IMAGE
                        </p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {editingId && (
                    <Button type="button" onClick={resetForm} variant="outline" className="flex-1 border-white/10 rounded-none uppercase text-[10px] font-black h-14 hover:bg-white/5">
                      DISCARD
                    </Button>
                  )}
                  <Button type="submit" className="flex-grow bg-orange-600 hover:bg-orange-700 text-white font-black rounded-none uppercase text-[10px] h-14 tracking-[0.2em] shadow-2xl shadow-orange-600/10">
                    {editingId ? <><Save className="mr-2 h-4 w-4" /> UPDATE RECORD</> : <><Plus className="mr-2 h-4 w-4" /> SAVE PRODUCT</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* PRODUCT LIST (LIST VIEW) */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-8 shadow-2xl overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">INVENTORY ARCHIVE ({products?.length || 0})</CardTitle>
              <Badge className="bg-orange-600 text-white font-black text-[9px] rounded-none px-4 py-1">REAL-TIME SYNCED</Badge>
            </CardHeader>
            <CardContent className="p-6">
              {productsLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
                  <p className="text-[10px] font-black uppercase text-orange-600 animate-pulse tracking-widest">Accessing Database...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {products?.map((p) => (
                    <div key={p.id} className={`flex items-center gap-4 p-4 bg-white/5 border transition-all group ${editingId === p.id ? 'border-orange-600 bg-orange-600/5' : 'border-white/5 hover:border-white/20'}`}>
                      {/* Image Thumbnail */}
                      <div className="relative w-20 h-20 shrink-0 bg-black overflow-hidden border border-white/10">
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover opacity-80 group-hover:opacity-100" />
                      </div>
                      
                      {/* Product Basic Info */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[8px] font-black text-orange-600 tracking-widest uppercase">{p.category}</p>
                          {p.showInSlider && <Badge className="bg-blue-600 text-white rounded-none text-[6px] font-black uppercase h-3 px-1">SLIDER</Badge>}
                          {p.showInFlashOffer && <Badge className="bg-red-600 text-white rounded-none text-[6px] font-black uppercase h-3 px-1">FLASH</Badge>}
                        </div>
                        <h3 className="text-[12px] font-black text-white uppercase truncate tracking-tighter">{p.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                           <p className="text-sm font-black text-white tracking-tighter">৳{p.price.toLocaleString()}</p>
                           <Badge className={`rounded-none text-[7px] font-black uppercase h-4 px-2 border-none ${p.stockQuantity > 0 ? 'bg-green-600/20 text-green-500 border border-green-500/30' : 'bg-red-600/20 text-red-500 border border-red-500/30'}`}>
                              {p.stockQuantity > 0 ? `STOCK: ${p.stockQuantity}` : 'OUT OF STOCK'}
                           </Badge>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 shrink-0">
                        <Button onClick={() => handleEdit(p)} variant="outline" size="icon" className="h-10 w-10 border-white/10 text-white hover:bg-orange-600 hover:text-white hover:border-orange-600 rounded-none transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => confirmDelete(p.id)} variant="outline" size="icon" className="h-10 w-10 border-white/10 text-muted-foreground hover:bg-red-600 hover:text-white hover:border-red-600 rounded-none transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {products?.length === 0 && (
                    <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No products in archive.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* PROFESSIONAL DELETE ALERT */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black border-orange-600/30 rounded-none p-10 max-w-md">
          <AlertDialogHeader className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-red-600/10 flex items-center justify-center border border-red-600/20 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">DELETE PRODUCT?</AlertDialogTitle>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">Irreversible System Action</p>
              </div>
            </div>
            <AlertDialogDescription className="text-[11px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
              THIS ACTION WILL PERMANENTLY REMOVE THIS RECORD FROM THE INVENTORY ARCHIVE. IT CANNOT BE RECOVERED.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 gap-3">
            <AlertDialogCancel className="flex-1 rounded-none border-white/10 text-white font-black uppercase text-[10px] h-14 hover:bg-white/5">CANCEL</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] rounded-none h-14 shadow-2xl shadow-red-600/20">CONFIRM DELETE</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
}

