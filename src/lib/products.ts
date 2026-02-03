
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  details: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Gold Watch',
    price: 299.99,
    description: 'A timeless minimalist smart watch that blends technology with luxury.',
    category: 'Accessories',
    imageUrl: 'https://picsum.photos/seed/watch1/600/600',
    details: ['Water resistant', 'Sapphire glass', 'Premium leather strap']
  },
  {
    id: '2',
    name: 'Suede Leather Tote',
    price: 189.00,
    description: 'Sophisticated suede leather handbag for the modern professional.',
    category: 'Bags',
    imageUrl: 'https://picsum.photos/seed/bag1/600/600',
    details: ['Italian leather', 'Spacious interior', 'Gold-tone hardware']
  },
  {
    id: '3',
    name: 'Urban Prime Sneakers',
    price: 145.00,
    description: 'Sleek, comfortable, and versatile sneakers designed for city explorers.',
    category: 'Footwear',
    imageUrl: 'https://picsum.photos/seed/shoes1/600/600',
    details: ['Breathable mesh', 'Cushioned sole', 'Recycled materials']
  },
  {
    id: '4',
    name: 'Heritage Wool Coat',
    price: 450.00,
    description: 'Handcrafted wool coat in a classic beige silhouette.',
    category: 'Outerwear',
    imageUrl: 'https://picsum.photos/seed/coat1/600/600',
    details: ['100% Merino wool', 'Silk lining', 'Regular fit']
  },
  {
    id: '5',
    name: 'Obsidian Sunglasses',
    price: 120.00,
    description: 'Designer sunglasses with UV protection and a bold frame.',
    category: 'Accessories',
    imageUrl: 'https://picsum.photos/seed/glasses1/600/600',
    details: ['UV400 protection', 'Hand-polished acetate', 'Includes case']
  },
  {
    id: '6',
    name: 'Lumiere Fragrance',
    price: 85.00,
    description: 'A delicate blend of floral and woody notes for a signature scent.',
    category: 'Beauty',
    imageUrl: 'https://picsum.photos/seed/perfume1/600/600',
    details: ['50ml Spray', 'Long-lasting', 'Notes of Sandalwood and Jasmine']
  }
];
