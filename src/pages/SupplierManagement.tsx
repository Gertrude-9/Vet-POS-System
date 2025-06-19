import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Search, FileText, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    lastDeliveryDate: "2023-05-15",
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
    productsSupplied: [],
    status: "active",
  });

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
        <Card className="fixed inset-0 flex items-center justify-center z-50 bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Add New Supplier</CardTitle>
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
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers or orders..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Products Supplied</TableHead>
                    <TableHead>Last Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>
                          <div>{supplier.contactPerson}</div>
                          <div className="text-sm text-muted-foreground">{supplier.email}</div>
                          <div className="text-sm text-muted-foreground">{supplier.phone}</div>
                        </TableCell>
                        <TableCell>
                          {supplier.productsSupplied.join(", ")}
                        </TableCell>
                        <TableCell>
                          {supplier.lastDeliveryDate || "No deliveries yet"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                            {supplier.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No suppliers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
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
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{supplier?.name || "Unknown Supplier"}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            {order.items.map(item => (
                              <div key={item.productId}>
                                {item.productName} (x{item.quantity})
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>{order.expectedDeliveryDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "default"
                                  : order.status === "partially-delivered"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {order.status}
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
                              <SelectTrigger className="w-32">
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
                        No purchase orders found
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
      <Card>
        <CardHeader>
          <CardTitle>Supplier Reports</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="text-sm font-medium">Total Active Suppliers</div>
            <div className="text-2xl font-bold">
              {suppliers.filter(s => s.status === "active").length}
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm font-medium">Pending Deliveries</div>
            <div className="text-2xl font-bold">
              {purchaseOrders.filter(o => o.status !== "delivered").length}
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm font-medium">Top Supplier</div>
            <div className="text-2xl font-bold">
              {suppliers[0]?.name || "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">
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