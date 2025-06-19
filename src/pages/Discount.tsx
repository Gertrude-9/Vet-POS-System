import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Trash2, Tag, Percent, DollarSign, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { format } from "date-fns";

type Discount = {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  applicableTo: "all" | "specific";
  products?: string[];
  startDate: Date;
  endDate: Date;
  status: "active" | "inactive" | "expired";
};

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

const mockProducts: Product[] = [
  { id: "1", name: "Antibiotic X", price: 24.99, category: "Antibiotics" },
  { id: "2", name: "Pain Reliever Y", price: 15.50, category: "Analgesics" },
  { id: "3", name: "Flea Treatment", price: 32.75, category: "Parasite Control" },
  { id: "4", name: "Vitamin Supplement", price: 18.20, category: "Supplements" },
];

const mockDiscounts: Discount[] = [
  {
    id: "1",
    name: "Summer Sale",
    type: "percentage",
    value: 15,
    applicableTo: "all",
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-08-31"),
    status: "active",
  },
  {
    id: "2",
    name: "Flea Treatment Special",
    type: "fixed",
    value: 5,
    applicableTo: "specific",
    products: ["3"],
    startDate: new Date("2023-05-01"),
    endDate: new Date("2023-05-31"),
    status: "expired",
  },
];

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [activeTab, setActiveTab] = useState("discounts");
  const [isAddingDiscount, setIsAddingDiscount] = useState(false);
  const [newDiscount, setNewDiscount] = useState<Omit<Discount, "id" | "status">>({
    name: "",
    type: "percentage",
    value: 0,
    applicableTo: "all",
    products: [],
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const addDiscount = () => {
    const status = new Date() > newDiscount.endDate ? "expired" : 
                  new Date() >= newDiscount.startDate ? "active" : "inactive";
    
    const newId = (discounts.length + 1).toString();
    setDiscounts([
      ...discounts,
      {
        id: newId,
        ...newDiscount,
        products: newDiscount.applicableTo === "specific" ? selectedProducts : undefined,
        status,
      },
    ]);
    setNewDiscount({
      name: "",
      type: "percentage",
      value: 0,
      applicableTo: "all",
      products: [],
      startDate: new Date(),
      endDate: new Date(),
    });
    setSelectedProducts([]);
    setIsAddingDiscount(false);
  };

  const removeDiscount = (id: string) => {
    setDiscounts(discounts.filter((discount) => discount.id !== id));
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getStatus = (startDate: Date, endDate: Date) => {
    const today = new Date();
    if (today > endDate) return "expired";
    if (today >= startDate) return "active";
    return "inactive";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        
        <Button onClick={() => setIsAddingDiscount(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Discount
        </Button>
      </div>

      {/* Add Discount Modal */}
      {isAddingDiscount && (
        <Card className="fixed inset-0 flex items-center justify-center z-50 bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Create New Discount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Discount Name*</Label>
              <Input
                value={newDiscount.name}
                onChange={(e) => setNewDiscount({ ...newDiscount, name: e.target.value })}
                placeholder="e.g., Summer Sale"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type*</Label>
                <Select
                  value={newDiscount.type}
                  onValueChange={(value) =>
                    setNewDiscount({ ...newDiscount, type: value as "percentage" | "fixed" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" /> Percentage
                      </div>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Fixed Amount
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  {newDiscount.type === "percentage" ? "Percentage*" : "Amount*"}
                </Label>
                <Input
                  type="number"
                  min="0"
                  step={newDiscount.type === "percentage" ? "1" : "0.01"}
                  value={newDiscount.value}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder={
                    newDiscount.type === "percentage" ? "0%" : "0.00"
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applicable To*</Label>
              <Select
                value={newDiscount.applicableTo}
                onValueChange={(value) =>
                  setNewDiscount({
                    ...newDiscount,
                    applicableTo: value as "all" | "specific",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select applicability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="specific">Specific Products</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newDiscount.applicableTo === "specific" && (
              <div className="space-y-2">
                <Label>Select Products*</Label>
                <div className="grid grid-cols-2 gap-2">
                  {mockProducts.map((product) => (
                    <Button
                      key={product.id}
                      variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleProductSelection(product.id)}
                    >
                      {product.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newDiscount.startDate
                        ? format(newDiscount.startDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComp
                      mode="single"
                      selected={newDiscount.startDate}
                      onSelect={(date) =>
                        date && setNewDiscount({ ...newDiscount, startDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newDiscount.endDate
                        ? format(newDiscount.endDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComp
                      mode="single"
                      selected={newDiscount.endDate}
                      onSelect={(date) =>
                        date && setNewDiscount({ ...newDiscount, endDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddingDiscount(false)}>
              Cancel
            </Button>
            <Button onClick={addDiscount}>Create Discount</Button>
          </CardFooter>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="discounts">
            <Tag className="mr-2 h-4 w-4" />
            Discounts
          </TabsTrigger>
          <TabsTrigger value="promotions">
            <Percent className="mr-2 h-4 w-4" />
            Promotions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discounts">
          <Card>
            <CardHeader>
              <CardTitle>Active Discounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Applicable To</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.length > 0 ? (
                    discounts.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell className="font-medium">{discount.name}</TableCell>
                        <TableCell>
                          {discount.type === "percentage" ? "Percentage" : "Fixed Amount"}
                        </TableCell>
                        <TableCell>
                          {discount.type === "percentage"
                            ? `${discount.value}%`
                            : `$${discount.value.toFixed(2)}`}
                        </TableCell>
                        <TableCell>
                          {discount.applicableTo === "all"
                            ? "All Products"
                            : `${discount.products?.length || 0} Products`}
                        </TableCell>
                        <TableCell>
                          {format(discount.startDate, "MMM d")} - {format(discount.endDate, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              discount.status === "active"
                                ? "default"
                                : discount.status === "expired"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {discount.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDiscount(discount.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No discounts created yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle>Product Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Regular Price</TableHead>
                    <TableHead>Current Discount</TableHead>
                    <TableHead>Promo Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProducts.map((product) => {
                    const productDiscounts = discounts.filter(
                      (d) =>
                        d.applicableTo === "all" ||
                        d.products?.includes(product.id)
                    );
                    const activeDiscount = productDiscounts.find(
                      (d) => d.status === "active"
                    );
                    const promoPrice = activeDiscount
                      ? activeDiscount.type === "percentage"
                        ? product.price * (1 - activeDiscount.value / 100)
                        : product.price - activeDiscount.value
                      : product.price;

                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {activeDiscount ? (
                            <>
                              {activeDiscount.name} (
                              {activeDiscount.type === "percentage"
                                ? `${activeDiscount.value}%`
                                : `$${activeDiscount.value.toFixed(2)}`}
                              )
                            </>
                          ) : (
                            "None"
                          )}
                        </TableCell>
                        <TableCell>
                          {activeDiscount ? (
                            <span className="font-bold text-green-600">
                              ${promoPrice.toFixed(2)}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              activeDiscount ? "default" : "outline"
                            }
                          >
                            {activeDiscount ? "On Sale" : "Regular Price"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setNewDiscount({
                                name: `${product.name} Special`,
                                type: "percentage",
                                value: 10,
                                applicableTo: "specific",
                                products: [product.id],
                                startDate: new Date(),
                                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                              });
                              setSelectedProducts([product.id]);
                              setIsAddingDiscount(true);
                            }}
                          >
                            <Tag className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscountManagement;