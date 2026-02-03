
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';

export default function AdminCategories() {
  const db = useFirestore();
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories, isLoading } = useCollection(categoriesRef);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl) return;

    addDocumentNonBlocking(categoriesRef, {
      name: name.toUpperCase(),
      imageUrl: imageUrl
    });

    setName('');
    setImageUrl('');
  };

  const handleDeleteCategory = (id: string) => {
    const docRef = doc(db, 'categories', id);
    deleteDocumentNonBlocking(docRef);
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
          <Card className="bg-card border-white/5 rounded-none lg:col-span-1">
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
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Image URL</label>
                  <div className="relative">
                    <Input 
                      placeholder="HTTPS://PICSUM.PHOTOS/..." 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-black/50 border-white/10 rounded-none text-xs pl-10"
                    />
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-none uppercase text-xs h-12">
                  <Plus className="mr-2 h-4 w-4" /> ADD CATEGORY
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
                <div className="text-center py-12 text-[10px] font-black uppercase text-muted-foreground animate-pulse">Loading Database...</div>
              ) : categories?.length === 0 ? (
                <div className="text-center py-12 text-[10px] font-black uppercase text-muted-foreground">No categories found in system.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories?.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 group hover:border-orange-600/30 transition-all">
                      <div className="relative w-16 h-16 shrink-0 bg-black overflow-hidden">
                        <Image 
                          src={cat.imageUrl} 
                          alt={cat.name} 
                          fill 
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xs font-black text-white uppercase">{cat.name}</h3>
                        <p className="text-[8px] text-muted-foreground uppercase mt-1">ID: {cat.id.slice(0, 8)}...</p>
                      </div>
                      <Button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-none h-8 w-8"
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
