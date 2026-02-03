
"use client";

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';

/**
 * AdminCategories Component - Manages product categories.
 * Features: Direct image upload (converted to base64 for storage), add, and delete.
 */
export default function AdminCategories() {
  const db = useFirestore();
  const [name, setName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reference to categories collection in Firestore
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories, isLoading } = useCollection(categoriesRef);

  // Handle image file selection and conversion to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size check for prototype (preventing massive base64 strings)
      if (file.size > 1024 * 1024) {
        alert("IMAGE IS TOO LARGE. PLEASE UPLOAD A SMALLER IMAGE (UNDER 1MB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add category to Firestore
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imagePreview) return;

    addDocumentNonBlocking(categoriesRef, {
      name: name.toUpperCase(),
      imageUrl: imagePreview
    });

    // Reset form
    setName('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Delete category from Firestore
  const handleDeleteCategory = (id: string) => {
    if (confirm("ARE YOU SURE YOU WANT TO DELETE THIS CATEGORY?")) {
      const docRef = doc(db, 'categories', id);
      deleteDocumentNonBlocking(docRef);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2">
            <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">MANAGE CATEGORIES</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ADD CATEGORY FORM */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">ADD NEW CATEGORY</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Category Name</label>
                  <Input 
                    placeholder="E.G. FASHION" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/50 border-white/10 rounded-none text-xs uppercase"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Category Image</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 p-4 text-center cursor-pointer hover:border-orange-600/50 transition-all bg-black/30 flex flex-col items-center justify-center min-h-[200px] relative group"
                  >
                    {imagePreview ? (
                      <div className="relative w-full aspect-square">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover opacity-90" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[8px] font-black text-white">CHANGE IMAGE</p>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="absolute -top-2 -right-2 bg-orange-600 p-1.5 text-white hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center mx-auto">
                          <Upload className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-white uppercase">UPLOAD IMAGE</p>
                          <p className="text-[8px] font-black text-muted-foreground uppercase">DRAG & DROP OR CLICK</p>
                        </div>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                </div>

                <Button type="submit" disabled={!name || !imagePreview} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-none uppercase text-[10px] h-12 shadow-lg shadow-orange-600/10 disabled:opacity-50">
                  <Plus className="mr-2 h-4 w-4" /> SAVE CATEGORY
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* CATEGORIES LIST */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">EXISTING CATEGORIES</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="h-8 w-8 border-2 border-orange-600 border-t-transparent animate-spin mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground animate-pulse">Synchronizing Database...</p>
                </div>
              ) : !categories || categories.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/5 bg-white/[0.02]">
                  <ImageIcon className="h-10 w-10 text-white/10 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No categories found in system.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 group hover:border-orange-600/30 transition-all relative">
                      <div className="relative w-20 h-20 shrink-0 bg-black overflow-hidden border border-white/10">
                        <Image 
                          src={cat.imageUrl} 
                          alt={cat.name} 
                          fill 
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-tighter">{cat.name}</h3>
                        <p className="text-[8px] text-muted-foreground uppercase mt-2 font-mono">UID: {cat.id.slice(0, 12)}</p>
                      </div>
                      <Button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-none h-10 w-10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
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
