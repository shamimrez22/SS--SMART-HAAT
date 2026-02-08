"use client";

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { LayoutGrid, X, Loader2, ChevronRight } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CategoryNavModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryNavModal({ isOpen, onClose }: CategoryNavModalProps) {
  const db = useFirestore();
  const router = useRouter();
  const categoriesRef = useMemoFirebase(() => collection(db!, 'categories'), [db]);
  const { data: categories, isLoading } = useCollection(categoriesRef);

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/shop?category=${encodeURIComponent(categoryName.toUpperCase())}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl bg-black border border-[#01a3a4]/30 rounded-none p-6 md:p-10 shadow-2xl fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[200] outline-none overflow-hidden flex flex-col">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors z-[210]"
        >
          <X className="h-6 w-6" />
        </button>

        <DialogHeader className="space-y-4 text-center mb-8">
          <div className="w-16 h-16 bg-[#01a3a4]/10 border border-[#01a3a4]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <LayoutGrid className="h-8 w-8 text-[#01a3a4]" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
              EXPLORE CATEGORIES
            </DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
              DISCOVER OUR PREMIUM COLLECTIONS
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-2 no-scrollbar min-h-[300px] max-h-[60vh]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" />
              <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">LOADING ARCHIVE...</p>
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 uppercase font-black text-[10px] tracking-widest">NO CATEGORIES FOUND</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  onClick={() => handleCategoryClick(category.name)}
                  className="group cursor-pointer flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-500"
                >
                  <div className="relative w-full aspect-square bg-white/[0.02] border border-white/10 overflow-hidden group-hover:border-[#01a3a4]/50 transition-all duration-500 shadow-xl">
                    {category.imageUrl && (
                      <Image 
                        src={category.imageUrl} 
                        alt={category.name} 
                        fill 
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        sizes="(max-width: 768px) 40vw, 15vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <ChevronRight className="h-4 w-4 text-[#01a3a4]" />
                    </div>
                  </div>
                  <h3 className="text-[9px] md:text-[11px] font-black text-white/70 group-hover:text-[#01a3a4] uppercase tracking-widest transition-colors text-center">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
          <p className="text-[8px] font-black text-[#01a3a4] uppercase tracking-[0.4em] italic">
            SS SMART HAAT • PREMIUM MARKET PLACE
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
