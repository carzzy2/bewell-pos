
import React from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addToCart } = useCart();
  
  const isInCart = items.some(item => item.productId === product.productId);
  
  const handleAddToCart = () => {
    addToCart(product);
    // toast.success('Product added to cart');
  };

  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="object-cover w-full h-full"
          onError={(e) => {
            // Fallback for broken images
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge className="bg-pos-error text-white text-lg px-3 py-1.5">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Badge variant="outline" className="mb-2 text-xs">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Badge>
          
          <div className="mb-1 text-xs text-gray-500">{product.productId}</div>
          
          <h3 className="font-semibold text-lg mb-2 truncate-2-lines">
            {product.productName}
          </h3>
          
          <div className="text-xl font-bold text-pos-primary mb-4">
            {formatPrice(product.price)}
          </div>
        </div>
        
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isInCart}
          variant={isInCart ? "outline" : "default"}
        >
          {isInCart ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Added
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
