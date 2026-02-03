
"use client";

import React, { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderModal } from '@/components/OrderModal';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: any;
}

/**
 * ProductCard Component - Optimized with React.memo and high-performance image handling.
 */
export const ProductCard = memo(({ product }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <>
      <Card className={`group overflow-hidden bg-card border-white/5 hover:border-orange-600/50 transition-all duration-500 rounded-none flex flex-col h-full shadow-2xl relative ${isOutOfStock ? 'opacity-70' : ''}`}>
        {/* Category Tag */}
        <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
          <span className="text-[8px] font-black text-white uppercase tracking-[0.2em] leading-none">{product.category}</span>
        </div>

        <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-black">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
            loading="lazy"
            className="object-cover transition-all duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </Link>
        
        <CardContent className="p-5 flex flex-col flex-grow space-y-4 relative bg-card border-t border-white/5">
          <div className="space-y-1">
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="font-black text-[12px] line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors h-10 text-white uppercase tracking-tighter">
                {product.name}
              </h3>
            </Link>
          </div>
          
          <div className="pt-4 space-y-4 mt-auto">
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-black text-xl text-orange-600 tracking-tighter leading-none">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-muted-foreground line-through text-[10px] font-bold">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              {product.discountPercentage > 0 && (
                <div className="px-2 py-1 bg-orange-600 text-white">
                  <span className="text-[10px] font-black uppercase leading-none tracking-widest">
                    -{product.discountPercentage}%
                  </span>
                </div>
              )}
            </div>

            {/* STOCK STATUS ABOVE BUTTON */}
            <div className="flex items-center gap-2 pt-1">
              <div className={`h-2 w-2 rounded-none ${isOutOfStock ? 'bg-red-600 animate-pulse' : 'bg-green-600'}`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK NOW'}
              </span>
            </div>
            
            <Button 
              disabled={isOutOfStock}
              onClick={() => setIsOrderOpen(true)}
              className={`w-full ${isOutOfStock ? 'bg-white/5 text-white/20 cursor-not-allowed border-white/10' : 'bg-orange-600 text-white hover:bg-white hover:text-black hover:scale-[1.02]'} transition-all duration-300 font-black text-[11px] h-12 rounded-none uppercase px-2 flex items-center justify-center gap-3 group/btn border border-transparent shadow-xl active:scale-95`}
            >
              <ShoppingCart className="h-4 w-4 transition-transform group-hover/btn:scale-125" /> 
              <span className="tracking-[0.1em]">{isOutOfStock ? 'SOLD OUT' : 'ORDER NOW'}</span>
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
