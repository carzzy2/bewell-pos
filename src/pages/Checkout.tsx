
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/CartItem';
import CartSummary from '@/components/CartSummary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { items } = useCart();

  const regularItems = items.filter(item => !item.backorder);
  const backorderedItems = items.filter(item => item.backorder);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-pos-primary">Checkout</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold flex items-center">
                  <ShoppingCart className="mr-2" /> Shopping Cart
                </h2>
              </div>
              
              {items.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-500">Your cart is empty</h3>
                  <p className="text-gray-400 mt-2">
                    Add some products to your cart to see them here
                  </p>
                  <Button className="mt-6" onClick={() => navigate('/')}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div>
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
            </div>
          </div>
          
          <div>
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>
              <div className="p-4">
                <CartSummary />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
