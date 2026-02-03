
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
}

export const ProductCard = memo(({ product }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <>
      <Card className={`group overflow-hidden bg-black border-none transition-all duration-300 rounded-none flex flex-col h-full relative ${isOutOfStock ? 'opacity-70' : ''}`}>
        
        {/* IMAGE CONTAINER - SQUARE LOCKED */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden border border-white/5 bg-black">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
            loading="lazy"
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
          
          {/* PRICE ROW */}
          <div className="flex items-center justify-between">
            <span className="font-black text-2xl md:text-3xl text-[#01a3a4] tracking-tighter leading-none flex items-baseline">
              <span className="text-[0.5em] font-normal mr-0.5 translate-y-[-0.2em]">৳</span>
              {product.price.toLocaleString()}
            </span>
            
            {product.discountPercentage > 0 && (
              <div className="px-2 py-1 border border-[#01a3a4] flex items-center justify-center min-w-[45px]">
                <span className="text-[9px] md:text-[10px] font-black text-[#01a3a4] leading-none">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* ORIGINAL PRICE - LARGE STRIKETHROUGH AS REQUESTED */}
          {product.originalPrice > product.price && (
            <div className="flex items-baseline">
              <span className="text-white/40 line-through text-[16px] font-bold flex items-baseline">
                <span className="text-[0.5em] font-normal mr-0.5 translate-y-[-1px]">৳</span>
                {product.originalPrice.toLocaleString()}
              </span>
            </div>
          )}

          {/* STOCK STATUS */}
          <div className="flex items-center gap-2 py-1">
            <div className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-green-600'} animate-pulse`} />
            <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'OUT OF STOCK' : 'AVAILABLE IN STOCK'}
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
              className={`w-full ${isOutOfStock ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-[#01a3a4] text-white hover:bg-white hover:text-black'} transition-all duration-300 font-black text-[10px] md:text-[12px] h-11 md:h-12 rounded-none uppercase px-2 flex items-center justify-center gap-2 group/btn shadow-xl shadow-[#01a3a4]/10`}
            >
              <ShoppingCart className="h-4 w-4" /> 
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
