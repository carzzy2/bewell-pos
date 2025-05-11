
import React, { useState } from 'react';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscountedPrice } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash, Minus, Plus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { 
    updateQuantity, 
    removeFromCart, 
    applyDiscount, 
    toggleBackorder 
  } = useCart();
  
  const [discountValue, setDiscountValue] = useState<number>(item.discountValue);

  const originalPrice = item.price * item.quantity;
  const discountedPrice = calculateDiscountedPrice(
    item.price, 
    item.quantity, 
    item.discountType, 
    item.discountValue
  );
  
  const handleDiscountChange = (type: "none" | "flat" | "percentage") => {
    applyDiscount(item.productId, type, discountValue);
  };

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDiscountValue(isNaN(value) ? 0 : value);
    applyDiscount(item.productId, item.discountType, isNaN(value) ? 0 : value);
  };

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.productId, newQuantity);
  };

  return (
    <div className={`p-4 border-b ${item.backorder ? 'bg-amber-50' : ''}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Product image */}
        <div className="w-full md:w-20 h-20">
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        
        {/* Product details */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h4 className="font-medium truncate-1-line">{item.productName}</h4>
              <p className="text-sm text-gray-500">{item.productId}</p>
              
              {item.stock <= 0 && !item.backorder && (
                <p className="text-sm text-red-500">Out of stock</p>
              )}
            </div>
            <div className="mt-2 md:mt-0">
              <p className="font-bold text-pos-primary">
                {formatPrice(item.price)}
              </p>
            </div>
          </div>
          
          {/* Quantity control */}
          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <div className="flex items-center space-x-1">
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8" 
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <Input
                type="number"
                className="h-8 w-16 text-center"
                min={1}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              />
              
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8" 
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={!item.backorder && item.quantity >= item.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Discount section */}
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Label>Discount:</Label>
                <Select 
                  value={item.discountType} 
                  onValueChange={(value: "none" | "flat" | "percentage") => handleDiscountChange(value)}
                >
                  <SelectTrigger className="h-8 w-24">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="flat">฿ THB</SelectItem>
                    <SelectItem value="percentage">%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {item.discountType !== "none" && (
                <Input
                  type="number"
                  className="h-8 w-20"
                  value={discountValue}
                  onChange={handleDiscountValueChange}
                  min={0}
                  max={item.discountType === "percentage" ? 100 : undefined}
                  step={item.discountType === "percentage" ? 1 : 1}
                />
              )}
            </div>
            
            {/* Backorder switch */}
            <div className="flex items-center space-x-2">
              <Switch 
                id={`backorder-${item.productId}`}
                checked={item.backorder}
                onCheckedChange={(checked) => toggleBackorder(item.productId, checked)}
              />
              <Label htmlFor={`backorder-${item.productId}`}>Backorder</Label>
            </div>
            
            {/* Remove button */}
            <Button 
              variant="destructive" 
              size="icon"
              className="h-8 w-8 ml-auto" 
              onClick={() => removeFromCart(item.productId)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Price summary */}
          {originalPrice !== discountedPrice && (
            <div className="mt-2 text-right">
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </p>
              <p className="font-bold text-pos-primary">
                {formatPrice(discountedPrice)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
