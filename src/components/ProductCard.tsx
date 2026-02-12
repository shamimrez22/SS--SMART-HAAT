
"use client";

import React, { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderModal } from '@/components/OrderModal';

interface ProductCardProps {
  product: any;
  index?: number;
}

/**
 * ProductCard - Highly visual, square-edged luxury card.
 * Performance: Memoized to prevent unnecessary re-renders.
 */
export const ProductCard = memo(({ product, index = 0 }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = (product.stockQuantity || 0) <= 0;
  
  // High-performance image loading: first 8 products are priority
  const isPriority = index < 8;

  const price = product.price || 0;
  const originalPrice = product.originalPrice || price;

  return (
    <>
      <Card className="group bg-black border border-white/20 rounded-none flex flex-col h-full overflow-hidden gpu-accelerated transition-all duration-500 hover:border-primary hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] relative">
        <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-black block flex items-center justify-center">
          <Image
            src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'}
            alt={product.name || 'Product'}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
            priority={isPriority}
            className="object-fill transition-transform duration-[2s] group-hover:scale-110"
            loading={isPriority ? "eager" : "lazy"}
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <span className="text-white text-[9px] font-black border-2 border-white/20 px-4 py-2 uppercase tracking-[0.3em] bg-black/40 backdrop-blur-md">ARCHIVE ONLY</span>
            </div>
          )}
        </Link>
        
        <CardContent className="p-3 md:p-4 flex flex-col flex-grow bg-black space-y-3">
          <div className="space-y-1">
            <h3 className="font-black text-[10px] md:text-[11px] text-foreground uppercase truncate tracking-[0.15em] transition-colors">
              {product.name || 'Premium Item'}
            </h3>
            <div className="flex items-center gap-2">
              <div className={`h-1 w-1 rounded-none ${isOutOfStock ? 'bg-red-600' : 'bg-primary'} animate-pulse`} />
              <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${isOutOfStock ? 'text-red-600' : 'text-foreground opacity-80'}`}>
                {isOutOfStock ? 'SOLD OUT' : 'READY TO SHIP'}
              </span>
            </div>
          </div>
          
          <div className="mt-auto pt-2">
            <div className="h-[44px] flex flex-col justify-start mb-3 relative">
              <div className="flex items-baseline gap-1 text-foreground">
                <span className="text-[10px] font-normal text-primary">৳</span>
                <span className="font-black text-[18px] md:text-[20px] tracking-tighter leading-none">
                  {(price || 0).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1 h-[18px]">
                {originalPrice > price ? (
                  <>
                    <p className="text-[10px] text-foreground line-through font-bold tracking-tight opacity-100">
                      ৳{(originalPrice || 0).toLocaleString()}
                    </p>
                    <div className="bg-primary/10 border border-primary/30 px-1.5 py-0.5 ml-auto">
                      <span className="text-[8px] font-black text-primary tracking-widest uppercase">
                        -{Math.round(((originalPrice - price) / (originalPrice || 1)) * 100)}%
                      </span>
                    </div>
                  </>
                ) : <div className="h-[18px]" />}
              </div>
            </div>

            <Button 
              disabled={isOutOfStock}
              onClick={(e) => { e.preventDefault(); setIsOrderOpen(true); }}
              style={{ backgroundColor: !isOutOfStock ? 'var(--button-bg)' : undefined }}
              className={`w-full ${isOutOfStock ? 'bg-white/5 text-foreground/20 border border-white/5' : 'hover:bg-white hover:text-black'} text-white font-black text-[9px] h-10 rounded-none uppercase flex items-center justify-center gap-2 transition-all duration-500 active:scale-95 border-none shadow-lg tracking-[0.2em]`}
            >
              {isOutOfStock ? 'SOLD OUT' : 'অর্ডার করুন'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <OrderModal product={product} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </>
  );
});

ProductCard.displayName = 'ProductCard';
