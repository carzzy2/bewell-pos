
export interface Product {
  no: number;
  productId: string;
  productName: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  discountType: "none" | "flat" | "percentage";
  discountValue: number;
  backorder: boolean;
}

export interface ApiResponse {
  success: boolean;
  totalProduct: number;
  productList: Product[];
}
