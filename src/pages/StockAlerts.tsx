import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Package, Calendar, Search, Filter, PlusCircle, RotateCw, Pencil, Trash2 } from 'lucide-react';

// Sample product type
type Product = {
  id: string;
  name: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  stock: number;
  minStock: number;
};

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Amoxicillin',
    category: 'Antibiotic',
    batchNumber: 'A123',
    expiryDate: '2024-05-01',
    stock: 0,
    minStock: 5,
  },
  {
    id: '2',
    name: 'Ivermectin',
    category: 'Antiparasitic',
    batchNumber: 'B456',
    expiryDate: '2024-07-15',
    stock: 3,
    minStock: 5,
  },
  {
    id: '3',
    name: 'Ketoprofen',
    category: 'Analgesic',
    batchNumber: 'C789',
    expiryDate: '2024-04-01',
    stock: 10,
    minStock: 5,
  },
  {
    id: '4',
    name: 'Enrofloxacin',
    category: 'Antibiotic',
    batchNumber: 'D012',
    expiryDate: '2023-12-01',
    stock: 2,
    minStock: 5,
  },
];

const categories = Array.from(new Set(sampleProducts.map(p => p.category)));

const StockAlerts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>(sampleProducts);

  // Helper to determine alert counts
  const alertCounts = React.useMemo(() => {
    const now = new Date();
    const soon = new Date();
    soon.setDate(now.getDate() + 30);

    let expired = 0, expiringSoon = 0, lowStock = 0, outOfStock = 0;
    products.forEach(product => {
      const expiry = new Date(product.expiryDate);
      if (product.stock === 0) outOfStock++;
      else if (product.stock < product.minStock) lowStock++;
      if (expiry < now) expired++;
      else if (expiry >= now && expiry <= soon) expiringSoon++;
    });
    return { expired, expiringSoon, lowStock, outOfStock };
  }, [products]);

  // Helper to filter products by alert type
  const getFilteredProducts = (type: 'expired' | 'expiringSoon' | 'lowStock' | 'outOfStock') => {
    const now = new Date();
    const soon = new Date();
    soon.setDate(now.getDate() + 30);

    return products.filter(product => {
      const expiry = new Date(product.expiryDate);
      if (type === 'expired') return expiry < now;
      if (type === 'expiringSoon') return expiry >= now && expiry <= soon;
      if (type === 'lowStock') return product.stock > 0 && product.stock < product.minStock;
      if (type === 'outOfStock') return product.stock === 0;
      return false;
    }).filter(product => {
      // Apply search and category filters
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
       

        {/* Summary Cards - Improved Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Expired Card */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Expired</p>
                  <p className="text-2xl font-bold text-gray-800">{alertCounts.expired}</p>
                </div>
              </div>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Urgent</span>
            </div>
          </div>

          {/* Expiring Soon Card */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-800">{alertCounts.expiringSoon}</p>
                </div>
              </div>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">30 days</span>
            </div>
          </div>

          {/* Low Stock Card */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Package className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-800">{alertCounts.lowStock}</p>
                </div>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Warning</span>
            </div>
          </div>

          {/* Out of Stock Card */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Package className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                  <p className="text-2xl font-bold text-gray-800">{alertCounts.outOfStock}</p>
                </div>
              </div>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Critical</span>
            </div>
          </div>
        </div>

        {/* Filter Controls - Sticky for better UX */}
        <div className="sticky top-0 z-10 bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications by name or batch..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alert Sections */}
        <div className="space-y-6">
          {/* Expired Medications Section */}
          {alertCounts.expired > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b">
                <div className="flex items-center justify-between p-4 bg-red-50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h2 className="font-bold text-red-700">Expired Medications ({alertCounts.expired})</h2>
                  </div>
                  <span className="text-sm text-red-600">Immediate action required</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredProducts('expired').map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.batchNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.expiryDate}</div>
                          <div className="text-xs text-red-600">Expired</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Expired
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Pencil size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Expiring Soon Section */}
          {alertCounts.expiringSoon > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b">
                <div className="flex items-center justify-between p-4 bg-orange-50">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <h2 className="font-bold text-orange-700">Expiring Soon ({alertCounts.expiringSoon})</h2>
                  </div>
                  <span className="text-sm text-orange-600">Within next 30 days</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Similar table structure as expired section */}
                </table>
              </div>
            </div>
          )}

          {/* Low Stock Section */}
          {alertCounts.lowStock > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b">
                <div className="flex items-center justify-between p-4 bg-yellow-50">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-yellow-600" />
                    <h2 className="font-bold text-yellow-700">Low Stock ({alertCounts.lowStock})</h2>
                  </div>
                  <span className="text-sm text-yellow-600">Below minimum stock level</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Similar table structure as expired section */}
                </table>
              </div>
            </div>
          )}

          {/* Out of Stock Section */}
          {alertCounts.outOfStock > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b">
                <div className="flex items-center justify-between p-4 bg-red-50">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-red-600" />
                    <h2 className="font-bold text-red-700">Out of Stock ({alertCounts.outOfStock})</h2>
                  </div>
                  <span className="text-sm text-red-600">Currently unavailable</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Similar table structure as expired section */}
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {alertCounts.expired === 0 && alertCounts.expiringSoon === 0 && 
           alertCounts.lowStock === 0 && alertCounts.outOfStock === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Stock Alerts</h3>
              <p className="text-gray-500 mb-4">Your inventory levels are healthy with no critical alerts at this time.</p>
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors">
                <RotateCw size={16} />
                <span>Refresh Inventory</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockAlerts;