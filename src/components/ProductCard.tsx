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
    <Card className="group overflow-hidden bg-card border hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 bg-primary text-background text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          Sale
        </div>
      </Link>
      
      <CardContent className="p-3 space-y-2">
        <div className="space-y-1">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors h-10">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-500">
              <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="text-[10px] text-muted-foreground">(45)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg text-primary">${product.price.toFixed(2)}</p>
          <Button size="icon" className="h-8 w-8 bg-primary/10 text-primary hover:bg-primary hover:text-background rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}