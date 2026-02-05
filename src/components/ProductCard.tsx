
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
      <Card className="group bg-black border-none rounded-none flex flex-col h-full overflow-hidden">
        <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-black">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 15vw"
            priority={index < 6}
            quality={50}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-[8px] font-black border border-white/20 px-2 py-1 uppercase">SOLD OUT</span>
            </div>
          )}
        </Link>
        
        <CardContent className="p-4 flex flex-col flex-grow bg-black space-y-3">
          <h3 className="font-black text-[13px] text-white uppercase truncate font-headline">{product.name}</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline text-[#01a3a4]">
              <span className="text-[7px] font-normal mr-1 translate-y-[-12px] text-white/50">৳</span>
              <span className="font-black text-[28px] tracking-tighter leading-none">
                {product.price.toLocaleString()}
              </span>
            </div>
            {product.discountPercentage > 0 && (
              <span className="text-[9px] font-black text-[#01a3a4] border border-[#01a3a4] px-1.5 py-0.5">-{product.discountPercentage}%</span>
            )}
          </div>

          <Button 
            disabled={isOutOfStock}
            onClick={(e) => { e.preventDefault(); setIsOrderOpen(true); }}
            className={`w-full ${isOutOfStock ? 'bg-white/5' : 'bg-[#01a3a4] hover:bg-white hover:text-black'} text-white font-black text-[11px] h-12 rounded-none uppercase flex items-center justify-center gap-2`}
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
