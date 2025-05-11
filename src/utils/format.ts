
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatDiscount = (type: string, value: number): string => {
  if (type === 'flat') {
    return formatPrice(value);
  } else if (type === 'percentage') {
    return `${value}%`;
  }
  return '';
};

export const calculateDiscountedPrice = (
  price: number, 
  quantity: number, 
  discountType: "none" | "flat" | "percentage", 
  discountValue: number
): number => {
  const totalPrice = price * quantity;
  
  if (discountType === "flat") {
    return Math.max(0, totalPrice - discountValue);
  } else if (discountType === "percentage") {
    return totalPrice * (1 - discountValue / 100);
  }
  
  return totalPrice;
};
