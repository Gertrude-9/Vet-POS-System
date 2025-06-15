import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Search, User, Phone, PawPrint, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  animals: {
    type: string;
    name?: string;
    breed?: string;
  }[];
  registrationDate: string;
  lastPurchaseDate?: string;
};

type Purchase = {
  id: string;
  customerId: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: string;
};

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    email: "john@example.com",
    animals: [
      { type: "Dog", name: "Max", breed: "Golden Retriever" },
      { type: "Cat", name: "Whiskers", breed: "Siamese" },
    ],
    registrationDate: "2023-01-15",
    lastPurchaseDate: "2023-05-20",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    animals: [
      { type: "Dog", name: "Buddy", breed: "Labrador" },
    ],
    registrationDate: "2023-03-10",
    lastPurchaseDate: "2023-05-18",
  },
];

const mockPurchases: Purchase[] = [
  {
    id: "101",
    customerId: "1",
    date: "2023-05-20",
    items: [
      { productId: "1", productName: "Antibiotic X", quantity: 1, price: 24.99 },
      { productId: "3", productName: "Flea Treatment", quantity: 2, price: 32.75 },
    ],
    total: 90.49,
    paymentMethod: "card",
  },
  {
    id: "102",
    customerId: "1",
    date: "2023-04-15",
    items: [
      { productId: "2", productName: "Pain Reliever Y", quantity: 1, price: 15.50 },
    ],
    total: 15.50,
    paymentMethod: "cash",
  },
  {
    id: "103",
    customerId: "2",
    date: "2023-05-18",
    items: [
      { productId: "4", productName: "Vitamin Supplement", quantity: 3, price: 18.20 },
    ],
    total: 54.60,
    paymentMethod: "mobile-money",
  },
];

const animalTypes = ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Small Mammal", "Other"];

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id" | "registrationDate" | "lastPurchaseDate">>({
    name: "",
    phone: "",
    animals: [],
  });
  const [newAnimal, setNewAnimal] = useState<{ type: string; name?: string; breed?: string }>({
    type: "",
    name: "",
    breed: "",
  });

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.animals.some(animal => 
      animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddCustomer = () => {
    const newCustomerWithId: Customer = {
      ...newCustomer,
      id: (customers.length + 1).toString(),
      registrationDate: new Date().toISOString().split('T')[0],
    };
    setCustomers([...customers, newCustomerWithId]);
    setNewCustomer({
      name: "",
      phone: "",
      animals: [],
    });
    setIsAddingCustomer(false);
  };

  const handleAddAnimal = () => {
    if (newAnimal.type) {
      setNewCustomer({
        ...newCustomer,
        animals: [...newCustomer.animals, newAnimal],
      });
      setNewAnimal({
        type: "",
        name: "",
        breed: "",
      });
    }
  };

  const getCustomerPurchases = (customerId: string) => {
    return purchases.filter(purchase => purchase.customerId === customerId);
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
          </TabsList>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Customers</CardTitle>
                <Button onClick={() => setIsAddingCustomer(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isAddingCustomer && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>New Customer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input
                        id="email"
                        value={newCustomer.email || ''}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="border-t pt-4">
                      <Label>Animals</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="animal-type">Type</Label>
                          <Select
                            value={newAnimal.type}
                            onValueChange={(value) => setNewAnimal({...newAnimal, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {animalTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="animal-name">Name (optional)</Label>
                          <Input
                            id="animal-name"
                            value={newAnimal.name || ''}
                            onChange={(e) => setNewAnimal({...newAnimal, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="animal-breed">Breed (optional)</Label>
                          <Input
                            id="animal-breed"
                            value={newAnimal.breed || ''}
                            onChange={(e) => setNewAnimal({...newAnimal, breed: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button 
                        className="mt-4" 
                        variant="outline"
                        onClick={handleAddAnimal}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Animal
                      </Button>
                    </div>

                    {newCustomer.animals.length > 0 && (
                      <div className="mt-4">
                        <Label>Added Animals</Label>
                        <div className="mt-2 space-y-2">
                          {newCustomer.animals.map((animal, index) => (
                            <Badge key={index} variant="secondary" className="mr-2">
                              <PawPrint className="mr-1 h-3 w-3" />
                              {animal.type}{animal.name ? ` (${animal.name})` : ''}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingCustomer(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCustomer}>
                      Save Customer
                    </Button>
                  </CardFooter>
                </Card>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Animals</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Last Purchase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="font-medium">{customer.name}</div>
                        {customer.email && (
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4" />
                          {customer.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {customer.animals.map((animal, index) => (
                            <Badge key={index} variant="outline">
                              <PawPrint className="mr-1 h-3 w-3" />
                              {animal.type}{animal.name ? ` (${animal.name})` : ''}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {customer.registrationDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.lastPurchaseDate || 'No purchases'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => {
                    const customer = customers.find(c => c.id === purchase.customerId);
                    return (
                      <TableRow key={purchase.id}>
                        <TableCell>{purchase.date}</TableCell>
                        <TableCell>
                          {customer ? customer.name : 'Unknown Customer'}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {purchase.items.map((item, index) => (
                              <div key={index}>
                                {item.productName} × {item.quantity} (${item.price.toFixed(2)} each)
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>${purchase.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {purchase.paymentMethod === 'card' && 'Credit Card'}
                            {purchase.paymentMethod === 'cash' && 'Cash'}
                            {purchase.paymentMethod === 'mobile-money' && 'Mobile Money'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )})}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerManagement;