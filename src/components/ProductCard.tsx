
"use client";

import React, { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderModal } from '@/components/OrderModal';

interface ProductCardProps {
  product: any;
  index?: number;
}

export const ProductCard = memo(({ product, index = 0 }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <>
      <Card className={`group overflow-hidden bg-black border-none transition-all duration-300 rounded-none flex flex-col h-full relative ${isOutOfStock ? 'opacity-70' : ''}`}>
        
        {/* IMAGE CONTAINER - 4:5 RATIO - COVER MODE - EXTREME OPTIMIZED */}
        <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden border border-white/5">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            priority={index < 6}
            loading={index < 6 ? "eager" : "lazy"}
            quality={75}
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-black text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest border border-white/20">SOLD OUT</span>
            </div>
          )}
        </Link>
        
        {/* CONTENT AREA */}
        <CardContent className="p-3 md:p-4 flex flex-col flex-grow space-y-2 bg-black">
          {/* TITLE */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-black text-[10px] md:text-[11px] leading-tight text-white uppercase tracking-tighter truncate">
              {product.name}
            </h3>
          </Link>
          
          {/* PRICE ROW - ELEGANT SIZE - ৳ SYMBOL 50% SMALLER & FONT NORMAL */}
          <div className="flex items-center justify-between">
            <span className="font-black text-sm md:text-base text-[#01a3a4] tracking-tighter leading-none flex items-baseline">
              <span className="text-[0.45em] font-normal mr-0.5 translate-y-[-0.1em]">৳</span>
              {product.price.toLocaleString()}
            </span>
            
            {product.discountPercentage > 0 && (
              <div className="px-1.5 py-0.5 border border-[#01a3a4] flex items-center justify-center">
                <span className="text-[8px] md:text-[9px] font-black text-[#01a3a4] leading-none">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* ORIGINAL PRICE - LARGE & CLEAR STRIKETHROUGH */}
          {product.originalPrice > product.price && (
            <div className="flex items-baseline">
              <span className="text-white/40 line-through text-[12px] md:text-[14px] font-bold flex items-baseline">
                <span className="text-[0.45em] font-normal mr-0.5 translate-y-[-1px]">৳</span>
                {product.originalPrice.toLocaleString()}
              </span>
            </div>
          )}

          {/* STOCK STATUS */}
          <div className="flex items-center gap-2 py-0.5">
            <div className={`h-1.5 w-1.5 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-green-600'} animate-pulse`} />
            <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'OUT OF STOCK' : 'AVAILABLE'}
            </span>
          </div>
          
          {/* ACTION BUTTON */}
          <div className="mt-auto pt-2">
            <Button 
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                setIsOrderOpen(true);
              }}
              className={`w-full ${isOutOfStock ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-[#01a3a4] text-white hover:bg-white hover:text-black'} transition-all duration-300 font-black text-[10px] md:text-[11px] h-10 md:h-11 rounded-none uppercase px-2 flex items-center justify-center gap-2 group/btn shadow-xl shadow-[#01a3a4]/10`}
            >
              <ShoppingCart className="h-3.5 w-3.5" /> 
              <span className="tracking-widest">{isOutOfStock ? 'ARCHIVE ONLY' : 'ORDER NOW'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <OrderModal 
        product={product} 
        isOpen={isOrderOpen} 
        onClose={() => setIsOrderOpen(false)} 
      />
    </>
  );
});

ProductCard.displayName = 'ProductCard';
