
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCart } from '@/context/CartContext';
import { getFilteredProducts, getCategories } from '@/services/api';
import { Product } from '@/types';
import ProductGrid from '@/components/ProductGrid';
import ProductSearch from '@/components/ProductSearch';
import Pagination from '@/components/Pagination';
import ShoppingCart from '@/components/ShoppingCart';
import { Button } from '@/components/ui/button';
import { ShoppingCart as CartIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const { totalItems } = useCart();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const productsPerPage = isMobile ? 4 : 6;

  // Load products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await getFilteredProducts(
        searchQuery,
        selectedCategory,
        currentPage,
        productsPerPage
      );
      setProducts(result.products);
      setTotalProducts(result.totalProducts);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadCategories();
  }, []);
  
  // Load products when dependencies change
  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory, currentPage, productsPerPage]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-pos-primary">Bewell POS</h1>
          </div>
          
          {isMobile && (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button className="relative md:hidden">
                  <CartIcon className="mr-2 h-5 w-5" />
                  Cart
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-pos-error">{totalItems}</Badge>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[85vh] rounded-t-xl">
                <div className="h-full">
                  <ShoppingCart 
                    onClose={() => setIsDrawerOpen(false)}
                    className="h-full" 
                  />
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <main className="flex-1 container mx-auto p-4 md:pr-0">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Products</h2>
            <ProductSearch 
              onSearch={handleSearch}
              onCategoryFilter={handleCategoryFilter}
              categories={categories}
            />
            
            <div className="text-sm text-gray-500 mb-4">
              {loading ? 'Loading products...' : `Showing ${products.length} of ${totalProducts} products`}
            </div>
            
            <ProductGrid products={products} loading={loading} />
            
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange}
            />
          </div>
        </main>

        {/* Desktop Shopping Cart */}
        <div className="hidden md:block w-full md:max-w-md border-l border-gray-200 h-[calc(100vh-64px)] sticky top-16">
          <ShoppingCart className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default Index;
