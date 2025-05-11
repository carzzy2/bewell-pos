
import React from 'react';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart as CartIcon } from 'lucide-react';

interface ShoppingCartProps {
  onClose?: () => void;
  className?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ onClose, className }) => {
  const { items } = useCart();
  
  // Separate regular items and backordered items
  const regularItems = items.filter(item => !item.backorder);
  const backorderedItems = items.filter(item => item.backorder);

  return (
    <div className={`flex flex-col h-full ${className || ''}`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <CartIcon className="mr-2" /> Shopping Cart
          </h2>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Continue Shopping
            </Button>
          )}
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <CartIcon className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-500">Your cart is empty</h3>
          <p className="text-gray-400 mt-2 text-center">
            Add some products to your cart to see them here
          </p>
          {onClose && (
            <Button className="mt-6" onClick={onClose}>
              Continue Shopping
            </Button>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="divide-y">
            {regularItems.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>
          
          {backorderedItems.length > 0 && (
            <>
              <div className="p-4 bg-amber-50">
                <h3 className="font-semibold">Backordered Items</h3>
                <p className="text-sm text-gray-600">
                  These items will be delivered when they become available
                </p>
              </div>
              <div className="divide-y">
                {backorderedItems.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      
      {items.length > 0 && (
        <div className="p-4 border-t mt-auto">
          <CartSummary />
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
