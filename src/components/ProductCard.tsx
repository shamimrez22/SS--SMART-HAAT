
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

/**
 * ProductCard Component - Reconstructed to match user screenshot exactly.
 */
export const ProductCard = memo(({ product }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <>
      <Card className={`group overflow-hidden bg-black border-none transition-all duration-300 rounded-none flex flex-col h-full relative ${isOutOfStock ? 'opacity-70' : ''}`}>
        
        {/* IMAGE CONTAINER - Dark background, contain to prevent cropping */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#050505] p-2">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
            loading="lazy"
            className="object-contain transition-transform duration-1000 group-hover:scale-105"
          />
        </Link>
        
        {/* CONTENT AREA - Precise stack matching the screenshot */}
        <CardContent className="p-3 md:p-4 flex flex-col flex-grow space-y-2 bg-black">
          {/* TITLE - Small, Bold, All Caps */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-black text-[10px] md:text-[11px] leading-tight text-white uppercase tracking-tighter truncate">
              {product.name}
            </h3>
          </Link>
          
          {/* PRICE ROW: Main Price on Left, Discount Box on Right */}
          <div className="flex items-center justify-between">
            <span className="font-black text-xl md:text-2xl text-orange-600 tracking-tighter leading-none flex items-baseline">
              {/* TINY SYMBOL - LIGHT WEIGHT */}
              <span className="text-[9px] md:text-[10px] font-normal mr-0.5">৳</span>
              {product.price.toLocaleString()}
            </span>
            
            {product.discountPercentage > 0 && (
              <div className="px-1.5 py-0.5 border border-orange-600/60">
                <span className="text-[8px] md:text-[9px] font-black text-orange-600 leading-none">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* ORIGINAL PRICE - Below Main Price, Strikethrough, Larger than before but muted */}
          {product.originalPrice > product.price && (
            <div className="flex items-baseline">
              <span className="text-white/40 line-through text-[12px] md:text-[14px] font-bold flex items-baseline">
                <span className="text-[8px] md:text-[9px] font-normal mr-0.5">৳</span>
                {product.originalPrice.toLocaleString()}
              </span>
            </div>
          )}

          {/* STOCK STATUS - Green Dot + Text */}
          <div className="flex items-center gap-2 py-1">
            <div className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-green-600'} animate-pulse`} />
            <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'SOLD OUT' : 'AVAILABLE IN STOCK'}
            </span>
          </div>
          
          {/* ACTION BUTTON - Full Width */}
          <div className="mt-auto pt-1">
            <Button 
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                setIsOrderOpen(true);
              }}
              className={`w-full ${isOutOfStock ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-white hover:text-black'} transition-all duration-500 font-black text-[9px] md:text-[11px] h-10 md:h-11 rounded-none uppercase px-2 flex items-center justify-center gap-2 group/btn shadow-xl shadow-orange-600/5`}
            >
              <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" /> 
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
