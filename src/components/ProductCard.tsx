"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden bg-card border-white/5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-2xl">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-white/5">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute top-3 left-3 bg-primary text-background text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Premium
        </div>
      </Link>
      
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors h-10 text-foreground">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex text-primary">
              <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold">(4.9/5)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <p className="font-bold text-lg text-primary tracking-tight">${product.price.toFixed(2)}</p>
          <Button size="icon" className="h-9 w-9 bg-primary/10 text-primary hover:bg-primary hover:text-background rounded-full transition-all">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}