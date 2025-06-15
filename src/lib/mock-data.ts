import { Product, Sale, Customer } from '../lib/types';

export const products: Product[] = [
  { id: 'PROD001', name: 'CaninePlus Multivitamins', category: 'Vitamins', batchNumber: 'B0123', expiryDate: '2026-12-31', price: 25.99, quantity: 150, reorderPoint: 20 },
  { id: 'PROD002', name: 'FleaAway Spot-On for Dogs', category: 'Parasiticides', batchNumber: 'B0124', expiryDate: '2025-08-15', price: 45.50, quantity: 80, reorderPoint: 15 },
  { id: 'PROD003', name: 'KittenGrow Milk Replacer', category: 'Nutrition', batchNumber: 'B0125', expiryDate: '2025-05-20', price: 15.75, quantity: 45, reorderPoint: 10 },
  { id: 'PROD004', name: 'Equine JointFlex Supplement', category: 'Supplements', batchNumber: 'B0126', expiryDate: '2026-02-10', price: 75.00, quantity: 30, reorderPoint: 5 },
  { id: 'PROD005', name: 'Avian Antibiotic', category: 'Antibiotics', batchNumber: 'B0127', expiryDate: '2024-11-30', price: 32.20, quantity: 18, reorderPoint: 10 },
  { id: 'PROD006', name: 'Cattle De-wormer', category: 'Parasiticides', batchNumber: 'B0128', expiryDate: '2027-01-01', price: 120.00, quantity: 50, reorderPoint: 10 },
];

export const sales: Sale[] = [
  { id: 'SALE001', date: '2025-06-14', total: 71.49, items: 2 },
  { id: 'SALE002', date: '2025-06-14', total: 15.75, items: 1 },
  { id: 'SALE003', date: '2025-06-13', total: 120.00, items: 1 },
  { id: 'SALE004', date: '2025-06-13', total: 91.00, items: 2 },
  { id: 'SALE005', date: '2025-06-12', total: 25.99, items: 1 },
];

export const customers: Customer[] = [
  { id: 'CUST001', name: 'John Doe', phone: '555-1234', animalType: 'Dog', purchaseHistory: [sales[0]] },
  { id: 'CUST002', name: 'Jane Smith', phone: '555-5678', animalType: 'Cat', purchaseHistory: [sales[1]] },
];

export const salesByDay = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];