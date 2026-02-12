
"use client";

import React, { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderModal } from '@/components/OrderModal';

interface ProductCardProps {
  product: any;
  index?: number;
}

export const ProductCard = memo(({ product, index = 0 }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = (product.stockQuantity || 0) <= 0;
  // Increase speed by prioritizing images for top items
  const isPriority = index < 10;

  const price = product.price || 0;
  const originalPrice = product.originalPrice || price;

  return (
    <>
      <Card className="group bg-black border border-white/[0.05] rounded-none flex flex-col h-full overflow-hidden gpu-accelerated transition-all duration-500 hover:border-[#01a3a4]/60 hover:shadow-[0_0_30px_rgba(1,163,164,0.15)] relative">
        <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-black block flex items-center justify-center">
          <Image
            src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'}
            alt={product.name || 'Product'}
            fill
            sizes="(max-width: 768px) 50vw, 15vw"
            priority={isPriority}
            className="object-fill transition-transform duration-[2s] group-hover:scale-110"
            loading={isPriority ? "eager" : "lazy"}
          />
          
          {/* Subtle Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

          {originalPrice > price && (
            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-[#01a3a4]/30 px-2 py-0.5 z-10">
              <span className="text-[8px] font-black text-[#01a3a4] tracking-widest uppercase">
                -{Math.round(((originalPrice - price) / (originalPrice || 1)) * 100)}%
              </span>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <span className="text-white text-[9px] font-black border-2 border-white/20 px-4 py-2 uppercase tracking-[0.3em] bg-black/40 backdrop-blur-md">ARCHIVE ONLY</span>
            </div>
          )}
        </Link>
        
        <CardContent className="p-3 md:p-4 flex flex-col flex-grow bg-black space-y-4">
          <div className="space-y-1">
            <h3 className="font-black text-[10px] md:text-[11px] text-white/80 uppercase truncate tracking-[0.15em] transition-colors group-hover:text-white">{product.name || 'Premium Item'}</h3>
            <div className="flex items-center gap-2">
              <div className={`h-1 w-1 rounded-none ${isOutOfStock ? 'bg-red-600' : 'bg-[#01a3a4]'} animate-pulse`} />
              <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${isOutOfStock ? 'text-red-600' : 'text-[#01a3a4]/60'}`}>
                {isOutOfStock ? 'SOLD OUT' : 'READY TO SHIP'}
              </span>
            </div>
          </div>
          
          <div className="space-y-1 mt-auto">
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-[10px] font-normal text-[#01a3a4]">৳</span>
              <span className="font-black text-[18px] md:text-[20px] tracking-tighter leading-none">
                {(price || 0).toLocaleString()}
              </span>
            </div>
            {originalPrice > price && (
              <p className="text-[10px] text-white/20 line-through font-bold tracking-tight">
                ৳{(originalPrice || 0).toLocaleString()}
              </p>
            )}
          </div>

          <Button 
            disabled={isOutOfStock}
            onClick={(e) => { e.preventDefault(); setIsOrderOpen(true); }}
            className={`w-full mt-2 ${isOutOfStock ? 'bg-white/5 text-white/10 border border-white/5' : 'bg-[#01a3a4] hover:bg-white hover:text-black'} text-white font-black text-[9px] h-10 rounded-none uppercase flex items-center justify-center gap-2 transition-all duration-500 active:scale-95 border-none shadow-lg tracking-[0.2em]`}
          >
            {isOutOfStock ? 'SOLD OUT' : 'অর্ডার করুন'}
          </Button>
        </CardContent>
      </Card>
      <OrderModal product={product} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </>
  );
});

ProductCard.displayName = 'ProductCard';
