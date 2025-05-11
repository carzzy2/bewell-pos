
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { toast } from '@/components/ui/sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyDiscount: (productId: string, discountType: "none" | "flat" | "percentage", discountValue: number) => void;
  toggleBackorder: (productId: string, backorder: boolean) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  vat: number;
  total: number;
  applyInvoiceDiscount: (discountType: "none" | "flat" | "percentage", discountValue: number) => void;
  invoiceDiscountType: "none" | "flat" | "percentage";
  invoiceDiscountValue: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [invoiceDiscountType, setInvoiceDiscountType] = useState<"none" | "flat" | "percentage">("none");
  const [invoiceDiscountValue, setInvoiceDiscountValue] = useState(0);

  // Calculate totals with 2 decimal places precision
  const calculateItemPrice = (item: CartItem) => {
    let price = item.price * item.quantity;
    if (item.discountType === "flat") {
      price = Math.max(0, price - item.discountValue);
    } else if (item.discountType === "percentage") {
      price = price * (1 - item.discountValue / 100);
    }
    return Number(price.toFixed(2));
  };

  const subtotal = Number(
    items
      .reduce((sum, item) => sum + calculateItemPrice(item), 0)
      .toFixed(2)
  );

  const vat = Number((subtotal * 0.07).toFixed(2));
  const total = Number((subtotal + vat).toFixed(2));

  const calculateFinalTotal = () => {
    let finalTotal = total;
    if (invoiceDiscountType === "flat") {
      finalTotal = Math.max(0, finalTotal - invoiceDiscountValue);
    } else if (invoiceDiscountType === "percentage") {
      finalTotal = finalTotal * (1 - invoiceDiscountValue / 100);
    }
    return Number(finalTotal.toFixed(2));
  };

  const finalTotal = calculateFinalTotal();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const addToCart = (product: Product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.productId);
      
      if (existingItem) {
        if (product.stock <= 0 && !existingItem.backorder) {
          toast.error('Product is out of stock. You can add it as backordered.');
          return prevItems;
        }
        if (!existingItem.backorder && existingItem.quantity + 1 > product.stock) {
          toast.error(`Only ${product.stock} items available in stock.`);
          return prevItems;
        }
        return prevItems.map(item =>
          item.productId === product.productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        if (product.stock <= 0) {
          toast.error('Product is out of stock. Adding as backordered item.');
          return [...prevItems, { 
            ...product, 
            quantity: 1, 
            discountType: "none", 
            discountValue: 0,
            backorder: true 
          }];
        }

        return [...prevItems, { 
          ...product, 
          quantity: 1, 
          discountType: "none", 
          discountValue: 0,
          backorder: false 
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => prevItems.map(item => {
      if (item.productId === productId) {
        // Find the product to check stock
        const product = item;
        
        // If not backordered and new quantity exceeds stock
        if (!item.backorder && product.stock < quantity) {
          toast.error(`Only ${product.stock} items available in stock.`);
          return item;
        }
        
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const applyDiscount = (productId: string, discountType: "none" | "flat" | "percentage", discountValue: number) => {
    setItems(prevItems => prevItems.map(item => 
      item.productId === productId 
        ? { ...item, discountType, discountValue } 
        : item
    ));
  };

  const toggleBackorder = (productId: string, backorder: boolean) => {
    setItems(prevItems => prevItems.map(item => 
      item.productId === productId 
        ? { ...item, backorder } 
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    setInvoiceDiscountType("none");
    setInvoiceDiscountValue(0);
  };

  const applyInvoiceDiscount = (discountType: "none" | "flat" | "percentage", discountValue: number) => {
    setInvoiceDiscountType(discountType);
    setInvoiceDiscountValue(discountValue);
  };

  // Load cart from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorage.getItem('pos_cart');
    const savedDiscount = localStorage.getItem('pos_invoice_discount');
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage');
      }
    }
    
    if (savedDiscount) {
      try {
        const discount = JSON.parse(savedDiscount);
        setInvoiceDiscountType(discount.type);
        setInvoiceDiscountValue(discount.value);
      } catch (e) {
        console.error('Failed to parse invoice discount from localStorage');
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('pos_cart', JSON.stringify(items));
    localStorage.setItem('pos_invoice_discount', JSON.stringify({
      type: invoiceDiscountType,
      value: invoiceDiscountValue
    }));
  }, [items, invoiceDiscountType, invoiceDiscountValue]);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyDiscount,
      toggleBackorder,
      clearCart,
      totalItems,
      subtotal,
      vat,
      total,
      applyInvoiceDiscount,
      invoiceDiscountType,
      invoiceDiscountValue,
      finalTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
