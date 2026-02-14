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

export const ProductCard = memo(({ product, index = 0 }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = (product.stockQuantity || 0) <= 0;
  
  const isPriority = index < 6;
  const price = product.price || 0;
  const originalPrice = product.originalPrice || price;

  return (
    <>
      <Card className="group bg-white border border-white/5 rounded-none flex flex-col h-full overflow-hidden gpu-accelerated transition-all duration-500 hover:border-primary hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] relative">
        <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-white block flex items-center justify-center">
          <Image
            src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'}
            alt={product.name || 'Product'}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            priority={isPriority}
            className="object-fill transition-transform duration-[2s] group-hover:scale-110"
            loading={isPriority ? "eager" : "lazy"}
            decoding="async"
          />
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
              <span className="text-black text-[8px] font-black border border-black px-2 py-1 uppercase tracking-[0.2em] bg-white/40 backdrop-blur-md shadow-2xl">ARCHIVE ONLY</span>
            </div>
          )}
        </Link>
        
        <CardContent className="p-2 md:p-3 flex flex-col flex-grow bg-white space-y-2">
          <div className="space-y-1">
            <h3 className="font-black text-[10px] md:text-[12px] text-black uppercase truncate tracking-tighter transition-colors group-hover:text-primary">
              {product.name || 'Premium Item'}
            </h3>
            <div className="flex items-center gap-1.5">
              <div className={`h-1 w-1 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-green-500'} animate-pulse`} />
              <span className={`text-[7px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {isOutOfStock ? 'OUT OF STOCK' : `IN STOCK`}
              </span>
            </div>
          </div>
          
          <div className="mt-auto pt-1">
            <div className="flex flex-col justify-start mb-2 relative">
              <div className="flex items-baseline gap-0.5 text-black">
                <span className="text-[9px] font-black text-primary">৳</span>
                <span className="font-black text-[16px] md:text-[20px] tracking-tighter leading-none">
                  {(price || 0).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between h-[14px]">
                {originalPrice > price ? (
                  <>
                    <p className="text-[9px] text-black/60 line-through font-bold tracking-tight">
                      ৳{(originalPrice || 0).toLocaleString()}
                    </p>
                    <div className="bg-primary/10 border border-primary/20 px-1 py-0 ml-auto">
                      <span className="text-[7px] font-black text-primary tracking-tighter uppercase">
                        -{Math.round(((originalPrice - price) / (originalPrice || 1)) * 100)}%
                      </span>
                    </div>
                  </>
                ) : <div className="h-[14px]" />}
              </div>
            </div>

            <Button 
              disabled={isOutOfStock}
              onClick={(e) => { e.preventDefault(); setIsOrderOpen(true); }}
              style={{ backgroundColor: !isOutOfStock ? 'var(--button-bg)' : undefined }}
              className={`w-full ${isOutOfStock ? 'bg-white border border-black/10 text-black/30' : 'hover:opacity-90'} text-white font-black text-[8px] md:text-[9px] h-8 md:h-10 rounded-none uppercase flex items-center justify-center gap-1 transition-all duration-500 active:scale-95 border-none shadow-lg tracking-widest`}
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
