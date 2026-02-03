
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
 * ProductCard Component - Optimized with React.memo and next/image sizing.
 */
export const ProductCard = memo(({ product }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <>
      <Card className={`group overflow-hidden bg-card border-white/5 hover:border-orange-600/50 transition-all duration-500 rounded-none flex flex-col h-full shadow-2xl relative ${isOutOfStock ? 'opacity-70' : ''}`}>
        {/* Category Tag */}
        <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-0.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-[7px] font-black text-white uppercase tracking-widest leading-none">{product.category}</span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge className={`rounded-none text-[7px] font-black uppercase px-2 py-0.5 border-none shadow-lg ${isOutOfStock ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
            {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
          </Badge>
        </div>

        <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-white/5">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
            loading="lazy"
            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        
        <CardContent className="p-4 flex flex-col flex-grow space-y-4 relative bg-card">
          <div className="space-y-1">
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="font-black text-[11px] line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors h-9 text-white uppercase tracking-tighter">
                {product.name}
              </h3>
            </Link>
          </div>
          
          <div className="pt-3 border-t border-white/10 space-y-4 mt-auto">
            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="font-black text-base text-orange-600 tracking-tighter leading-none">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-muted-foreground line-through text-[9px] font-bold mt-1">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              {product.discountPercentage > 0 && (
                <div className="px-1.5 py-0.5 border border-orange-600/20">
                  <span className="text-[10px] font-black text-orange-600 uppercase leading-none">
                    -{product.discountPercentage}%
                  </span>
                </div>
              )}
            </div>
            
            <Button 
              disabled={isOutOfStock}
              onClick={() => setIsOrderOpen(true)}
              className={`w-full ${isOutOfStock ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-white hover:text-black'} transition-all duration-300 font-black text-[10px] h-10 rounded-none uppercase px-2 flex items-center justify-center gap-2 group/btn border border-transparent active:scale-95`}
            >
              <ShoppingCart className="h-4 w-4 transition-transform group-hover/btn:scale-110" /> 
              <span>{isOutOfStock ? 'SOLD OUT' : 'ORDER NOW'}</span>
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
