import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, Calculator, User, Receipt, AlertCircle, Printer, Mail } from 'lucide-react';
// import { Button } from 'react-day-picker'; // Remove this line

// If you have a custom Button component, import it here instead:
// import { Button } from '../components/ui/button';

// Sample vet drug data - in real app this would come from API
const sampleDrugs = [
  { id: 1, name: 'Amoxicillin 500mg', category: 'Antibiotic', price: 25.50, stock: 100, prescriptionRequired: true, unit: 'tablets' },
  { id: 2, name: 'Ivermectin Injectable', category: 'Antiparasitic', price: 45.00, stock: 25, prescriptionRequired: true, unit: 'vials' },
  { id: 3, name: 'Dexamethasone', category: 'Anti-inflammatory', price: 18.75, stock: 50, prescriptionRequired: true, unit: 'vials' },
  { id: 4, name: 'Vitamin B Complex', category: 'Supplement', price: 12.00, stock: 75, prescriptionRequired: false, unit: 'bottles' },
  { id: 5, name: 'Surgical Gloves', category: 'Supplies', price: 8.50, stock: 200, prescriptionRequired: false, unit: 'boxes' },
  { id: 6, name: 'Gentamicin Eye Drops', category: 'Antibiotic', price: 22.30, stock: 30, prescriptionRequired: true, unit: 'bottles' },
  { id: 7, name: 'Thermometer Digital', category: 'Equipment', price: 35.00, stock: 15, prescriptionRequired: false, unit: 'pieces' },
  { id: 8, name: 'Calcium Gluconate', category: 'Supplement', price: 15.80, stock: 40, prescriptionRequired: false, unit: 'vials' }
];

const Transaction = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDrugs, setFilteredDrugs] = useState(sampleDrugs);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    vetLicense: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const filtered = sampleDrugs.filter(drug =>
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDrugs(filtered);
  }, [searchTerm]);

  const addToCart = (drug) => {
    const existingItem = cart.find(item => item.id === drug.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === drug.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...drug, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * discount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateChange = () => {
    const paid = parseFloat(amountPaid) || 0;
    return Math.max(0, paid - calculateTotal());
  };

  const processTransaction = () => {
    if (!customer.name || cart.length === 0) {
      alert('Please add customer information and items to cart');
      return;
    }

    if (paymentMethod === 'cash' && parseFloat(amountPaid) < calculateTotal()) {
      alert('Insufficient payment amount');
      return;
    }

    // Check for prescription requirements
    const prescriptionItems = cart.filter(item => item.prescriptionRequired);
    if (prescriptionItems.length > 0 && !customer.vetLicense) {
      alert('Veterinary license required for prescription items');
      return;
    }

    // Generate transaction ID
    const newTransactionId = 'TXN' + Date.now().toString().slice(-8);
    setTransactionId(newTransactionId);
    setShowReceipt(true);
  };

  const resetTransaction = () => {
    setCart([]);
    setCustomer({ name: '', phone: '', email: '', vetLicense: '' });
    setAmountPaid('');
    setDiscount(0);
    setShowReceipt(false);
    setTransactionId('');
  };

  if (showReceipt) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">VetCare Pharmacy</h2>
            <p className="text-sm text-gray-600">Professional Veterinary Supplies</p>
            <p className="text-sm text-gray-600">Transaction: {transactionId}</p>
            <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
            <p className="text-sm">{customer.name}</p>
            <p className="text-sm">{customer.phone}</p>
            {customer.vetLicense && <p className="text-sm">Vet License: {customer.vetLicense}</p>}
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Items</h3>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span>Discount ({discount}%):</span>
                <span>-${calculateDiscount().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Payment ({paymentMethod}):</span>
              <span>${parseFloat(amountPaid || "0").toFixed(2)}</span>
            </div>
            {paymentMethod === 'cash' && (
              <div className="flex justify-between text-sm">
                <span>Change:</span>
                <span>${calculateChange().toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-4">Thank you for your business!</p>
            <button
              onClick={resetTransaction}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              New Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Product Search & Selection */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Search className="w-6 h-6 text-gray-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Product Search</h2>
          </div>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search drugs by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredDrugs.map(drug => (
              <div key={drug.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{drug.name}</h3>
                  {drug.prescriptionRequired && (
                    <span title="Prescription Required">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">Category: {drug.category}</p>
                <p className="text-sm text-gray-600 mb-1">Stock: {drug.stock} {drug.unit}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-green-600">${drug.price}</span>
                  <button
                    onClick={() => addToCart(drug)}
                    disabled={drug.stock === 0}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-3 py-1 rounded-lg flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart & Checkout */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <ShoppingCart className="w-6 h-6 text-gray-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Cart ({cart.length})</h2>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="font-semibold text-gray-700">Customer Info</h3>
            </div>
            <input
              type="text"
              placeholder="Customer Name*"
              value={customer.name}
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={(e) => setCustomer({...customer, phone: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
            />
            <input
              type="text"
              placeholder="Veterinary License (for Rx items)"
              value={customer.vetLicense}
              onChange={(e) => setCustomer({...customer, vetLicense: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Cart Items */}
          <div className="mb-6 max-h-64 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Cart is empty</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">${item.price} each</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-6 h-6 rounded flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="mx-2 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-6 h-6 rounded flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing */}
          {cart.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Calculator className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="font-semibold text-gray-700">Pricing</h3>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%):</span>
                    <span>-${calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment */}
          {cart.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Payment</h3>
              
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-3 text-sm"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile">Mobile Money</option>
              </select>

              {paymentMethod === 'cash' && (
                <div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount Paid"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
                  />
                  {amountPaid && (
                    <div className="text-sm">
                      <span className="text-gray-600">Change: </span>
                      <span className="font-bold">${calculateChange().toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Process Transaction */}
          <button
            onClick={processTransaction}
            disabled={cart.length === 0}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold flex items-center justify-center mb-2"
          >
            <Receipt className="w-5 h-5 mr-2" />
            Process Transaction
          </button>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="w-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 py-2 rounded-lg flex items-center justify-center"
              onClick={() => window.print()}
              disabled={cart.length === 0}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </button>
            <button
              type="button"
              className="w-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 py-2 rounded-lg flex items-center justify-center"
              onClick={() => alert('Email functionality not implemented')}
              disabled={cart.length === 0}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Receipt
            </button>
          </div>
          <button
            type="button"
            className="w-full bg-transparent hover:bg-gray-100 text-gray-700 py-2 rounded-lg mt-2"
            onClick={() => setCart([])}
            disabled={cart.length === 0}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transaction;