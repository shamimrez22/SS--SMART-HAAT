
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
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <>
      <Card className="group overflow-hidden bg-black border-none rounded-none flex flex-col h-full relative">
        
        {/* IMAGE CONTAINER - EXACT MATCH TO USER REFERENCE (WHITE BG, CONTAIN) */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-white">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="300px"
            priority={index < 12}
            loading={index < 12 ? "eager" : "lazy"}
            quality={90}
            className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <span className="bg-black text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest border border-white/20">SOLD OUT</span>
            </div>
          )}
        </Link>
        
        {/* CONTENT AREA - MATCHING REFERENCE IMAGE LAYOUT */}
        <CardContent className="p-4 flex flex-col flex-grow space-y-3 bg-black">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-black text-[12px] leading-tight text-white uppercase tracking-widest truncate">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            {/* MAIN PRICE - LARGE TEAL BOLD */}
            <div className="flex items-baseline">
              <span className="text-[12px] font-normal text-[#01a3a4] mr-1">৳</span>
              <span className="font-black text-[28px] text-[#01a3a4] tracking-tighter leading-none">
                {product.price.toLocaleString()}
              </span>
            </div>
            
            {/* DISCOUNT BOX - TEAL BORDER BOX */}
            {product.discountPercentage > 0 && (
              <div className="px-2 py-1 border border-[#01a3a4] flex items-center justify-center h-6">
                <span className="text-[10px] font-black text-[#01a3a4] leading-none">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* OLD PRICE - GREY STRIKETHROUGH */}
          {product.originalPrice > product.price && (
            <div className="flex items-baseline -mt-2">
              <span className="text-[10px] font-normal text-white/40 mr-1">৳</span>
              <span className="text-white/40 line-through text-[16px] font-bold">
                {product.originalPrice.toLocaleString()}
              </span>
            </div>
          )}

          {/* STOCK STATUS INDICATOR */}
          <div className="flex items-center gap-2 py-1">
            <div className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-green-600'} animate-pulse`} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'OUT OF STOCK' : 'AVAILABLE IN STOCK'}
            </span>
          </div>
          
          <div className="mt-auto pt-2">
            <Button 
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                setIsOrderOpen(true);
              }}
              className={`w-full ${isOutOfStock ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-[#01a3a4] text-white hover:bg-white hover:text-black'} transition-all duration-300 font-black text-[11px] h-12 rounded-none uppercase px-4 flex items-center justify-center gap-2 shadow-xl`}
            >
              <ShoppingBag className="h-4 w-4" /> 
              <span className="tracking-[0.2em]">ORDER NOW</span>
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
