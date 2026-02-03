
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-none bg-transparent">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link href={`/products/${product.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="icon" className="rounded-full shadow-lg">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="pt-4 px-0">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-primary font-bold mt-1">${product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
