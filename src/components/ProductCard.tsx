
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
 * ProductCard Component - Professional layout with tiny Taka symbol and clear stock status.
 */
export const ProductCard = memo(({ product }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <>
      <Card className={`group overflow-hidden bg-black border-none transition-all duration-300 rounded-none flex flex-col h-full relative ${isOutOfStock ? 'opacity-70' : ''}`}>
        
        {/* IMAGE CONTAINER */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#111]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
            loading="lazy"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>
        
        {/* CONTENT AREA */}
        <CardContent className="p-3 md:p-4 flex flex-col flex-grow space-y-3 md:space-y-4 bg-black">
          {/* TITLE */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-black text-[10px] md:text-[12px] leading-tight text-white uppercase tracking-tighter truncate">
              {product.name}
            </h3>
          </Link>
          
          {/* PRICE AND DISCOUNT ROW */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="font-black text-lg md:text-2xl text-orange-600 tracking-tighter leading-none flex items-baseline">
                {/* TINY TAKA SYMBOL - REDUCED BOLDNESS AS REQUESTED */}
                <span className="text-[8px] md:text-[10px] font-normal mr-0.5 align-baseline">৳</span>
                {product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-white/40 line-through text-[8px] md:text-[10px] font-bold mt-1 flex items-baseline">
                  <span className="text-[6px] md:text-[7px] font-normal mr-0.5">৳</span>{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {product.discountPercentage > 0 && (
              <div className="px-1.5 py-0.5 md:px-2 md:py-1 border border-orange-600/40">
                <span className="text-[8px] md:text-[10px] font-black text-orange-600 leading-none">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* STOCK STATUS - PLACED DIRECTLY ABOVE ORDER BUTTON */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/[0.03]">
            <div className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-green-600'} animate-pulse`} />
            <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'SOLD OUT' : 'AVAILABLE IN STOCK'}
            </span>
          </div>
          
          {/* ACTION BUTTON */}
          <Button 
            disabled={isOutOfStock}
            onClick={(e) => {
              e.preventDefault();
              setIsOrderOpen(true);
            }}
            className={`w-full ${isOutOfStock ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-white hover:text-black'} transition-all duration-500 font-black text-[9px] md:text-[11px] h-10 md:h-12 rounded-none uppercase px-2 flex items-center justify-center gap-2 md:gap-3 group/btn shadow-xl shadow-orange-600/5`}
          >
            <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" /> 
            <span className="tracking-widest">{isOutOfStock ? 'ARCHIVE ONLY' : 'ORDER NOW'}</span>
          </Button>
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
