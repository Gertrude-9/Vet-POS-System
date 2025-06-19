import React, { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Package, PlusCircle, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Product = {
  id: number;
  name: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  price: number;
  quantity: number;
  reorderPoint: number;
};

const categories = [
  "Antibiotics",
  "Vaccines",
  "Pain Relievers",
  "Antiparasitics",
  "Supplements",
  "Other"
];

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Amoxicillin",
    category: "Antibiotics",
    batchNumber: "AMX-2023-001",
    expiryDate: "2024-12-31",
    price: 24.99,
    quantity: 45,
    reorderPoint: 20
  },
  {
    id: 2,
    name: "Rabies Vaccine",
    category: "Vaccines",
    batchNumber: "RAB-2023-005",
    expiryDate: "2024-06-15",
    price: 35.50,
    quantity: 12,
    reorderPoint: 10
  }
];

const isNearExpiry = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffInDays = (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return diffInDays <= 30;
};

const InventoryPage = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sellQty, setSellQty] = useState<{ [key: number]: number }>({});
  const [restockQty, setRestockQty] = useState<{ [key: number]: number }>({});
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    batchNumber: "",
    expiryDate: "",
    price: 0,
    quantity: 0,
    reorderPoint: 0,
  });
  const [activeTab, setActiveTab] = useState<"inventory" | "addProduct">("inventory");

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.batchNumber || !newProduct.expiryDate) {
      return;
    }

    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const product: Product = { id, ...newProduct };
    setProducts([...products, product]);
    setNewProduct({
      name: "",
      category: "",
      batchNumber: "",
      expiryDate: "",
      price: 0,
      quantity: 0,
      reorderPoint: 0,
    });
    setActiveTab("inventory");
  };

  const handleSell = (id: number) => {
    const qty = sellQty[id] || 0;
    if (qty <= 0) return;

    const updated = products.map((p) =>
      p.id === id ? { ...p, quantity: Math.max(0, p.quantity - qty) } : p
    );
    setProducts(updated);
    setSellQty({ ...sellQty, [id]: 0 });
  };

  const handleRestock = (id: number) => {
    const qty = restockQty[id] || 0;
    if (qty <= 0) return;

    const updated = products.map((p) =>
      p.id === id ? { ...p, quantity: p.quantity + qty } : p
    );
    setProducts(updated);
    setRestockQty({ ...restockQty, [id]: 0 });
  };

  const getStatusBadge = (product: Product) => {
    const today = new Date();
    const expiry = new Date(product.expiryDate);
    
    if (expiry < today) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (isNearExpiry(product.expiryDate)) {
      return <Badge variant="outline">Expiring Soon</Badge>;
    }
    
    if (product.quantity <= product.reorderPoint) {
      return <Badge variant="outline">Low Stock</Badge>;
    }
    
    return <Badge variant="default">In Stock</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
       
        {/* Removed erroneous conditional rendering block */}
      </div>

      <div className="flex space-x-4 border-b">
        <Button
          variant={activeTab === "inventory" ? "default" : "ghost"}
          onClick={() => setActiveTab("inventory")}
        >
          <Package className="mr-2 h-4 w-4" />
          Inventory
        </Button>
        <Button
          variant={activeTab === "addProduct" ? "default" : "ghost"}
          onClick={() => setActiveTab("addProduct")}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {activeTab === "addProduct" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Enter details for the new veterinary drug</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab("inventory")}
              >
                Back to Inventory
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Product Name*</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Category*</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Batch Number*</Label>
                <Input
                  value={newProduct.batchNumber}
                  onChange={(e) => setNewProduct({ ...newProduct, batchNumber: e.target.value })}
                  placeholder="Enter batch number"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Expiry Date*</Label>
                <Input
                  type="date"
                  value={newProduct.expiryDate}
                  onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Price*</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Initial Quantity*</Label>
                <Input
                  type="number"
                  min="0"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Reorder Point*</Label>
                <Input
                  type="number"
                  min="0"
                  value={newProduct.reorderPoint}
                  onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setActiveTab("inventory")}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                Add Product
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "inventory" && (
        <Card>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className={product.quantity <= product.reorderPoint ? "bg-yellow-50" : ""}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.batchNumber}</TableCell>
                    <TableCell>{format(new Date(product.expiryDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {product.quantity}
                        <span className="text-xs text-muted-foreground ml-1">
                          (reorder at {product.reorderPoint})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="1"
                            max={product.quantity}
                            value={sellQty[product.id] || ""}
                            onChange={(e) =>
                              setSellQty({ ...sellQty, [product.id]: parseInt(e.target.value) || 0 })
                            }
                            className="w-20"
                            placeholder="Qty"
                          />
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleSell(product.id)}
                            disabled={!sellQty[product.id] || sellQty[product.id] <= 0}
                          >
                            <ArrowDownCircle className="mr-1 h-4 w-4" />
                            Sell
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={restockQty[product.id] || ""}
                            onChange={(e) =>
                              setRestockQty({ ...restockQty, [product.id]: parseInt(e.target.value) || 0 })
                            }
                            className="w-20"
                            placeholder="Qty"
                          />
                          <Button 
                            size="sm" 
                            variant="default" 
                            onClick={() => handleRestock(product.id)}
                            disabled={!restockQty[product.id] || restockQty[product.id] <= 0}
                          >
                            <ArrowUpCircle className="mr-1 h-4 w-4" />
                            Restock
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center space-y-2">
                        <Package className="h-10 w-10" />
                        <p>No products in inventory</p>
                        <Button 
                          variant="ghost" 
                          onClick={() => setActiveTab("addProduct")}
                          className="mt-2"
                        >
                          Add your first product
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryPage;