import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Search, FileText, Truck, X, Calendar, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: string[];
  lastDeliveryDate?: string;
  status: "active" | "inactive";
};

type PurchaseOrder = {
  id: string;
  supplierId: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  status: "pending" | "delivered" | "partially-delivered";
  expectedDeliveryDate: string;
};

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "VetMed Supplies Inc.",
    contactPerson: "John Smith",
    email: "john@vetmed.com",
    phone: "+1 (555) 123-4567",
    address: "123 Animal Ave, Pet City, PC 12345",
    productsSupplied: ["Antibiotic X", "Pain Reliever Y"],
    status: "active",
  },
  {
    id: "2",
    name: "Animal Health Distributors",
    contactPerson: "Sarah Johnson",
    email: "sarah@ahd.com",
    phone: "+1 (555) 987-6543",
    address: "456 Veterinary Way, Animal Town, AT 67890",
    productsSupplied: ["Flea Treatment", "Vitamin Supplement"],
    status: "active",
  },
];

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    supplierId: "1",
    date: "2023-05-10",
    items: [
      { productId: "1", productName: "Antibiotic X", quantity: 50, unitPrice: 20.0 },
      { productId: "2", productName: "Pain Reliever Y", quantity: 30, unitPrice: 12.5 },
    ],
    totalAmount: 1375.0,
    status: "delivered",
    expectedDeliveryDate: "2023-05-15",
  },
  {
    id: "PO-002",
    supplierId: "2",
    date: "2023-05-12",
    items: [
      { productId: "3", productName: "Flea Treatment", quantity: 25, unitPrice: 30.0 },
    ],
    totalAmount: 750.0,
    status: "pending",
    expectedDeliveryDate: "2023-05-20",
  },
];

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("suppliers");
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id">>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    lastDeliveryDate: "",
    productsSupplied: [],
    status: "active",
  });

  // Update last delivery dates whenever purchase orders change
  useEffect(() => {
    const updatedSuppliers = suppliers.map(supplier => {
      const supplierOrders = purchaseOrders
        .filter(order => order.supplierId === supplier.id && order.status === "delivered")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return {
        ...supplier,
        lastDeliveryDate: supplierOrders.length > 0 ? supplierOrders[0].date : undefined
      };
    });
    
    setSuppliers(updatedSuppliers);
  }, [purchaseOrders]);

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPurchaseOrders = purchaseOrders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suppliers.find((s) => s.id === order.supplierId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addSupplier = () => {
    const newId = (suppliers.length + 1).toString();
    setSuppliers([...suppliers, { id: newId, ...newSupplier }]);
    setNewSupplier({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      lastDeliveryDate: "",
      productsSupplied: [],
      status: "active",
    });
    setIsAddingSupplier(false);
  };

  const updatePurchaseOrderStatus = (orderId: string, newStatus: "pending" | "delivered" | "partially-delivered") => {
    setPurchaseOrders(purchaseOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
      case "delivered":
        return "default";
      case "inactive":
        return "secondary";
      case "partially-delivered":
        return "secondary";
      case "pending":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={() => setIsAddingSupplier(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {isAddingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Add New Supplier</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAddingSupplier(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Supplier Name*</Label>
                  <Input
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person*</Label>
                  <Input
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    placeholder="Enter contact person"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email*</Label>
                  <Input
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone*</Label>
                  <Input
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Address*</Label>
                  <Input
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                    placeholder="Enter full address"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Last Delivery</Label>
                  <Input
                    type="date"
                    value={newSupplier.lastDeliveryDate}
                    onChange={(e) => setNewSupplier({ ...newSupplier, lastDeliveryDate: e.target.value })}
                    placeholder="Select delivery date"
                  />
              </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newSupplier.status}
                    onValueChange={(value) => setNewSupplier({ ...newSupplier, status: value as "active" | "inactive" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingSupplier(false)}>
                Cancel
              </Button>
              <Button onClick={addSupplier}>Save Supplier</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers or orders..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="suppliers">
                <FileText className="mr-2 h-4 w-4" />
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="purchases">
                <Truck className="mr-2 h-4 w-4" />
                Purchase Orders
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="suppliers">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span>Supplier Directory</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead className="text-center">Last Delivery</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">
                          <div className="font-semibold">{supplier.name}</div>
                          <div className="text-sm text-muted-foreground">{supplier.address}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{supplier.contactPerson}</div>
                          <div className="text-sm text-muted-foreground">{supplier.email}</div>
                          <div className="text-sm text-muted-foreground">{supplier.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {supplier.productsSupplied.map(product => (
                              <Badge key={product} variant="outline" className="text-xs">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.lastDeliveryDate ? (
                            <div className="flex items-center justify-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(supplier.lastDeliveryDate), 'MMM dd, yyyy')}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No deliveries</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStatusBadgeVariant(supplier.status)}>
                            {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No suppliers found matching your search
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span>Purchase Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchaseOrders.length > 0 ? (
                    filteredPurchaseOrders.map((order) => {
                      const supplier = suppliers.find(s => s.id === order.supplierId);
                      return (
                        <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{supplier?.name || "Unknown Supplier"}</TableCell>
                          <TableCell>{format(new Date(order.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {order.items.map(item => (
                                <div key={item.productId} className="flex justify-between">
                                  <span>{item.productName}</span>
                                  <span className="text-muted-foreground">
                                    {item.quantity} × ${item.unitPrice.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(order.expectedDeliveryDate), 'MMM dd, yyyy')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status.split('-').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                updatePurchaseOrderStatus(
                                  order.id,
                                  value as "pending" | "delivered" | "partially-delivered"
                                )
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Update status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="partially-delivered">Partially Delivered</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No purchase orders found matching your search
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredPurchaseOrders.length} of {purchaseOrders.length} orders
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Order
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Supplier Reports Card */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Supplier Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Total Active Suppliers</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {suppliers.filter(s => s.status === "active").length}
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Pending Deliveries</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {purchaseOrders.filter(o => o.status !== "delivered").length}
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Top Supplier</span>
            </div>
            <div className="text-2xl font-bold mt-2 truncate">
              {suppliers[0]?.name || "N/A"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {purchaseOrders.filter(o => o.supplierId === suppliers[0]?.id).length} orders
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate Supplier Report
          </Button>
          <Button variant="outline">
            <Truck className="mr-2 h-4 w-4" />
            Generate Delivery Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SupplierManagement;