export interface Product {
  id: string;
  name: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  price: number;
  quantity: number;
  reorderPoint: number;
}

export interface Sale {
  id: string;
  date: string;
  total: number;
  items: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  animalType: string;
  purchaseHistory: Sale[];
}
