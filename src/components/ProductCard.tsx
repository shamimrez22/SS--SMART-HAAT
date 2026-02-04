
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
        
        {/* IMAGE CONTAINER - FULL COVERAGE */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-black">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            priority={index < 6}
            loading={index < 6 ? "eager" : "lazy"}
            quality={85}
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <span className="bg-black text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-widest border border-white/20">OUT OF ARCHIVE</span>
            </div>
          )}
        </Link>
        
        {/* CONTENT AREA */}
        <CardContent className="p-6 flex flex-col flex-grow bg-black space-y-5">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-black text-[16px] leading-tight text-white uppercase tracking-[0.1em] font-headline truncate">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            {/* MAIN PRICE - LARGE TEAL BOLD */}
            <div className="flex items-baseline text-[#01a3a4]">
              <span className="text-[10px] font-normal mr-1 translate-y-[-10px] text-white/50">৳</span>
              <span className="font-black text-[34px] tracking-tighter leading-none">
                {product.price.toLocaleString()}
              </span>
            </div>
            
            {/* DISCOUNT BOX */}
            {product.discountPercentage > 0 && (
              <div className="px-3 py-2 border border-[#01a3a4] flex items-center justify-center">
                <span className="text-[11px] font-black text-[#01a3a4] leading-none">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* OLD PRICE */}
          {product.originalPrice > product.price && (
            <div className="flex items-baseline text-white/30 -mt-3">
              <span className="text-[6px] font-normal mr-1 translate-y-[-4px]">৳</span>
              <span className="text-white/30 line-through text-[18px] font-bold">
                {product.originalPrice.toLocaleString()}
              </span>
            </div>
          )}

          {/* STOCK STATUS */}
          <div className="flex items-center gap-2.5 pt-2">
            <div className={`h-2.5 w-2.5 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-green-600 animate-pulse'}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'OUT OF STOCK' : 'AVAILABLE IN STOCK'}
            </span>
          </div>
          
          <div className="mt-auto pt-4">
            <Button 
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                setIsOrderOpen(true);
              }}
              className={`w-full ${isOutOfStock ? 'bg-white/5 text-white/10' : 'bg-[#01a3a4] text-white hover:bg-white hover:text-black'} transition-all duration-500 font-black text-[13px] h-14 rounded-none uppercase px-6 flex items-center justify-center gap-4 shadow-2xl`}
            >
              <div className="w-6 h-6 border border-white/20 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4" /> 
              </div>
              <span className="tracking-[0.1em] font-black">অর্ডার করুন</span>
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
