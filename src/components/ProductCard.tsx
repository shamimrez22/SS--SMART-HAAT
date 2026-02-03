
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
 * ProductCard Component - Replicated exactly from user screenshot.
 */
export const ProductCard = memo(({ product }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <>
      <Card className={`group overflow-hidden bg-black border-none transition-all duration-300 rounded-none flex flex-col h-full relative ${isOutOfStock ? 'opacity-70' : ''}`}>
        
        {/* IMAGE CONTAINER */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#1a1a1a]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* CONTENT AREA */}
        <CardContent className="p-4 flex flex-col flex-grow space-y-4 bg-black">
          {/* TITLE */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-black text-[12px] leading-tight text-white uppercase tracking-tighter truncate">
              {product.name}
            </h3>
          </Link>
          
          {/* PRICE AND DISCOUNT ROW */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="font-black text-2xl text-orange-600 tracking-tighter leading-none flex items-baseline">
                <span className="text-[10px] font-bold mr-0.5">৳</span>
                {product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-white/60 line-through text-[10px] font-bold mt-1 flex items-baseline">
                  <span className="text-[7px] mr-0.5">৳</span>{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {product.discountPercentage > 0 && (
              <div className="px-2 py-1 border border-orange-600/40">
                <span className="text-[10px] font-black text-orange-600 leading-none">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* STOCK STATUS */}
          <div className="flex items-center gap-2 pt-1">
            <div className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-green-600'}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
            </span>
          </div>
          
          {/* ACTION BUTTON */}
          <Button 
            disabled={isOutOfStock}
            onClick={(e) => {
              e.preventDefault();
              setIsOrderOpen(true);
            }}
            className={`w-full ${isOutOfStock ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'} transition-all duration-300 font-black text-[11px] h-12 rounded-none uppercase px-2 flex items-center justify-center gap-3 group/btn shadow-xl`}
          >
            <ShoppingCart className="h-4 w-4" /> 
            <span className="tracking-widest">{isOutOfStock ? 'SOLD OUT' : 'ORDER NOW'}</span>
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
