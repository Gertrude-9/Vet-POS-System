import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Package, Truck, CheckCircle, AlertCircle, Calendar, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';

// Sample suppliers data
const suppliers = [
  { id: 1, name: "VetPharm Ltd", contact: "sales@vetpharm.com", phone: "+256-700-123456", leadTime: 7 },
  { id: 2, name: "Boehringer Ingelheim", contact: "orders@boehringer.com", phone: "+256-700-234567", leadTime: 10 },
  { id: 3, name: "Zoetis", contact: "supply@zoetis.com", phone: "+256-700-345678", leadTime: 14 },
  { id: 4, name: "Elanco", contact: "orders@elanco.com", phone: "+256-700-456789", leadTime: 12 },
  { id: 5, name: "MSD Animal Health", contact: "sales@msd.com", phone: "+256-700-567890", leadTime: 9 }
];

// Sample products data
const products = [
  {
    id: 1,
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    currentStock: 15,
    minStock: 50,
    maxStock: 200,
    unitCost: 2.50,
    supplierId: 1,
    lastOrderDate: "2025-05-15"
  },
  {
    id: 2,
    name: "Metacam 5mg/ml",
    category: "Anti-inflammatory",
    currentStock: 8,
    minStock: 20,
    maxStock: 100,
    unitCost: 15.80,
    supplierId: 2,
    lastOrderDate: "2025-04-20"
  },
  {
    id: 3,
    name: "Advocate Spot-On",
    category: "Parasiticides",
    currentStock: 25,
    minStock: 30,
    maxStock: 150,
    unitCost: 8.90,
    supplierId: 4,
    lastOrderDate: "2025-05-01"
  },
  {
    id: 4,
    name: "Rimadyl 50mg",
    category: "Anti-inflammatory",
    currentStock: 0,
    minStock: 25,
    maxStock: 120,
    unitCost: 1.20,
    supplierId: 3,
    lastOrderDate: "2025-03-15"
  },
  {
    id: 5,
    name: "Convenia 80mg",
    category: "Antibiotics",
    currentStock: 12,
    minStock: 15,
    maxStock: 80,
    unitCost: 25.00,
    supplierId: 3,
    lastOrderDate: "2025-05-10"
  }
];

// Sample restock orders
const initialOrders = [
  {
    id: 1,
    orderNumber: "PO-2025-001",
    supplierId: 1,
    status: "pending",
    orderDate: "2025-06-15",
    expectedDelivery: "2025-06-22",
    totalAmount: 1250.00,
    items: [
      { productId: 1, productName: "Amoxicillin 250mg", quantity: 100, unitCost: 2.50 }
    ]
  },
  {
    id: 2,
    orderNumber: "PO-2025-002",
    supplierId: 2,
    status: "shipped",
    orderDate: "2025-06-10",
    expectedDelivery: "2025-06-17",
    totalAmount: 790.00,
    items: [
      { productId: 2, productName: "Metacam 5mg/ml", quantity: 50, unitCost: 15.80 }
    ]
  }
];

const RestockManagement = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [restockOrders, setRestockOrders] = useState(initialOrders);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');

  // Get products that need restocking
  const getProductsNeedingRestock = () => {
    return products.filter(product => product.currentStock <= product.minStock);
  };

  // Calculate suggested order quantity
  const getSuggestedQuantity = (product) => {
    return Math.max(product.maxStock - product.currentStock, product.minStock);
  };

  // Filter products
  const getFilteredProducts = () => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // Get supplier name
  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown';
  };

  // Add product to restock cart
  const addToRestockCart = (product, quantity) => {
    const existingItem = selectedProducts.find(item => item.id === product.id);
    if (existingItem) {
      setSelectedProducts(prev => 
        prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: quantity }
            : item
        )
      );
    } else {
      setSelectedProducts(prev => [...prev, { ...product, quantity }]);
    }
  };

  // Remove from restock cart
  const removeFromRestockCart = (productId) => {
    setSelectedProducts(prev => prev.filter(item => item.id !== productId));
  };

  // Create new restock order
  const createRestockOrder = () => {
    if (selectedProducts.length === 0) return;

    const newOrder = {
      id: Date.now(),
      orderNumber: `PO-2025-${String(restockOrders.length + 1).padStart(3, '0')}`,
      supplierId: selectedProducts[0].supplierId,
      status: 'draft',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalAmount: selectedProducts.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0),
      items: selectedProducts.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitCost: item.unitCost
      }))
    };

    setRestockOrders(prev => [...prev, newOrder]);
    setSelectedProducts([]);
    setShowNewOrderModal(false);
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setRestockOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Products & Stock
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                Restock Orders
              </button>
              <button
                onClick={() => setActiveTab('cart')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'cart'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Restock Cart ({selectedProducts.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{getProductsNeedingRestock().length}</p>
                    <p className="text-sm text-gray-600">Need Restocking</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center space-x-3">
                  <Package className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                    <p className="text-sm text-gray-600">Total Products</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{selectedProducts.length}</p>
                    <p className="text-sm text-gray-600">In Cart</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center space-x-3">
                  <Truck className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{restockOrders.filter(o => o.status === 'pending' || o.status === 'shipped').length}</p>
                    <p className="text-sm text-gray-600">Active Orders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Auto-Select Low Stock
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredProducts().map((product) => {
                      const needsRestock = product.currentStock <= product.minStock;
                      const suggestedQty = getSuggestedQuantity(product);
                      const inCart = selectedProducts.find(item => item.id === product.id);
                      
                      return (
                        <tr key={product.id} className={needsRestock ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm text-gray-900">
                                {product.currentStock} / {product.minStock}
                              </div>
                              {needsRestock && (
                                <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
                              )}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${
                                  needsRestock ? 'bg-red-500' : 'bg-green-500'
                                }`}
                                style={{
                                  width: `${Math.min((product.currentStock / product.minStock) * 100, 100)}%`
                                }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getSupplierName(product.supplierId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            UGX {product.unitCost.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {suggestedQty}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {inCart ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={inCart.quantity}
                                  onChange={(e) => addToRestockCart(product, parseInt(e.target.value) || 0)}
                                  className="w-16 px-2 py-1 border rounded text-center"
                                  min="1"
                                />
                                <button
                                  onClick={() => removeFromRestockCart(product.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToRestockCart(product, suggestedQty)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Add to Cart
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {restockOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getSupplierName(order.supplierId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.orderDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.expectedDelivery}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          UGX {order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Restock Cart</h2>
                <button
                  onClick={createRestockOrder}
                  disabled={selectedProducts.length === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Create Order
                </button>
              </div>
              
              {selectedProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products in restock cart</p>
              ) : (
                <div className="space-y-4">
                  {selectedProducts.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-sm text-gray-500">Current Stock: {item.currentStock}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="text-sm text-gray-500">Quantity:</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => addToRestockCart(item, parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border rounded ml-2"
                            min="1"
                          />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Unit: UGX {item.unitCost}</p>
                          <p className="font-medium">Total: UGX {(item.quantity * item.unitCost).toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeFromRestockCart(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">Total:</span>
                      <span className="text-xl font-bold">
                        UGX {selectedProducts.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestockManagement;