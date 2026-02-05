
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

/**
 * ProductCard - Performance-optimized for "Instant-Ready" rendering.
 */
export const ProductCard = memo(({ product, index = 0 }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = (product.stockQuantity || 0) <= 0;

  // First 6 products are prioritized for immediate visibility
  const isPriority = index < 6;

  return (
    <>
      <Card className="group bg-black border-none rounded-none flex flex-col h-full overflow-hidden [transform:translateZ(0)]">
        <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-black block">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 15vw"
            priority={isPriority}
            loading={isPriority ? "eager" : "lazy"}
            quality={25} // Lowest quality for fastest "Ready" state
            className="object-cover" // Removed hover scale animation to prevent perceived lag
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <span className="text-white text-[8px] font-black border border-white/20 px-2 py-1 uppercase tracking-widest bg-black/40 backdrop-blur-sm">SOLD OUT</span>
            </div>
          )}
        </Link>
        
        <CardContent className="p-3 md:p-4 flex flex-col flex-grow bg-black space-y-3">
          <h3 className="font-black text-[11px] md:text-[13px] text-white uppercase truncate font-headline tracking-tight">{product.name}</h3>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline text-[#01a3a4]">
                <span className="text-[11px] font-normal mr-1 translate-y-[-4px] text-white/50">৳</span>
                <span className="font-black text-[18px] md:text-[22px] tracking-tighter leading-none">
                  {product.price.toLocaleString()}
                </span>
              </div>
              {product.originalPrice > product.price && (
                <span className="text-[8px] md:text-[9px] font-black text-[#01a3a4] border border-[#01a3a4] px-1.5 py-0.5 shrink-0">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
            {product.originalPrice > product.price && (
              <p className="text-[9px] md:text-[10px] text-white/40 line-through font-bold">
                ৳{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 py-0.5">
            <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isOutOfStock ? 'bg-red-600' : 'bg-green-600'}`} />
            <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
            </span>
          </div>

          <Button 
            disabled={isOutOfStock}
            onClick={(e) => { e.preventDefault(); setIsOrderOpen(true); }}
            className={`w-full ${isOutOfStock ? 'bg-white/5 opacity-50' : 'bg-[#01a3a4] hover:bg-white hover:text-black'} text-white font-black text-[10px] md:text-[11px] h-9 md:h-10 rounded-none uppercase flex items-center justify-center gap-2 transition-all active:scale-95`}
          >
            <ShoppingBag className="h-3.5 w-3.5" /> অর্ডার করুন
          </Button>
        </CardContent>
      </Card>
      <OrderModal product={product} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </>
  );
});

ProductCard.displayName = 'ProductCard';
