
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { Tag, Percent } from 'lucide-react';

const CartSummary: React.FC = () => {
  const { 
    subtotal, 
    vat, 
    total,
    finalTotal,
    invoiceDiscountType,
    invoiceDiscountValue,
    applyInvoiceDiscount,
    clearCart
  } = useCart();
  
  const [discountValue, setDiscountValue] = useState<number>(invoiceDiscountValue);
  
  const handleDiscountTypeChange = (type: "none" | "flat" | "percentage") => {
    applyInvoiceDiscount(type, discountValue);
  };

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDiscountValue(isNaN(value) ? 0 : value);
    applyInvoiceDiscount(invoiceDiscountType, isNaN(value) ? 0 : value);
  };

  const handleCheckout = () => {
    toast.success('Order completed successfully!');
    clearCart();
  };

  const discount = total - finalTotal;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">VAT (7%):</span>
          <span className="font-medium">{formatPrice(vat)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Total (incl. VAT):</span>
          <span className="font-bold">{formatPrice(total)}</span>
        </div>
        
        <Separator />
        
        {/* Invoice Discount */}
        <div className="pt-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-medium">Invoice Discount:</Label>
              <Select
                value={invoiceDiscountType} 
                onValueChange={(value: "none" | "flat" | "percentage") => handleDiscountTypeChange(value)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="flat">฿ THB</SelectItem>
                  <SelectItem value="percentage">%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {invoiceDiscountType !== "none" && (
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <Input
                    type="number"
                    value={discountValue}
                    onChange={handleDiscountValueChange}
                    min={0}
                    max={invoiceDiscountType === "percentage" ? 100 : undefined}
                    className="pr-9 w-full"
                    placeholder={invoiceDiscountType === "flat" ? "Amount" : "Percent"}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {invoiceDiscountType === "flat" ? 
                      <Tag size={16} className="text-gray-500" /> : 
                      <Percent size={16} className="text-gray-500" />
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}
        
        <Separator />
        
        <div className="flex justify-between text-xl">
          <span className="font-bold">Final Total:</span>
          <span className="font-bold text-pos-primary">{formatPrice(finalTotal)}</span>
        </div>
        
        <Button 
          className="w-full mt-4"
          onClick={handleCheckout}
        >
          Complete Order
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
