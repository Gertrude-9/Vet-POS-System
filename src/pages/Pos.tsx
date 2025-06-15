import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, MinusCircle, Trash2, Printer, Mail, CreditCard, Wallet, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type PaymentMethod = "cash" | "mobile-money" | "card";

const TAX_RATE = 0.1; // 10% tax

const mockProducts: Product[] = [
  { id: "1", name: "Antibiotic X", price: 24.99, quantity: 50, category: "Antibiotics" },
  { id: "2", name: "Pain Reliever Y", price: 15.50, quantity: 25, category: "Analgesics" },
  { id: "3", name: "Flea Treatment", price: 32.75, quantity: 30, category: "Parasite Control" },
  { id: "4", name: "Vitamin Supplement", price: 18.20, quantity: 40, category: "Supplements" },
];

const PosSystem = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const { toast } = useToast();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const changeDue = amountReceived - total;

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const processPayment = () => {
    if (paymentMethod !== "cash" && amountReceived < total) {
      toast({
        title: "Payment Error",
        description: "Amount received must cover the total for non-cash payments",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would connect to your payment processor API
    toast({
      title: "Payment Processed",
      description: `Successfully processed $${total.toFixed(2)} payment`,
    });

    // Generate receipt (in a real app, this would be more detailed)
    const receipt = {
      date: new Date().toLocaleString(),
      items: cart,
      subtotal,
      tax,
      total,
      paymentMethod,
      amountReceived,
      changeDue,
    };

    console.log("Receipt:", receipt);
    // Here you would implement actual printing/emailing
  };

  const printReceipt = () => {
    // In a real app, this would use a printing library or API
    console.log("Printing receipt...");
    toast({
      title: "Receipt Printed",
      description: "The receipt has been sent to the printer",
    });
  };

  const emailReceipt = () => {
    if (!customerEmail) {
      toast({
        title: "Email Required",
        description: "Please enter customer email to send receipt",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would connect to your email service
    console.log(`Emailing receipt to ${customerEmail}...`);
    toast({
      title: "Receipt Sent",
      description: `The receipt has been sent to ${customerEmail}`,
    });
  };

  const clearCart = () => {
    setCart([]);
    setAmountReceived(0);
    setCustomerEmail("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Product Selection */}
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Button
                  key={product.id}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => addToCart(product)}
                  disabled={product.quantity <= 0}
                >
                  <Package className="h-6 w-6" />
                  <span className="font-medium">{product.name}</span>
                  <Badge variant="secondary">${product.price.toFixed(2)}</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Sale */}
        <Card>
          <CardHeader>
            <CardTitle>Current Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No items in cart
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell>${item.product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.product.id, parseInt(e.target.value))
                            }
                            className="w-16 text-center"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>${(item.product.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Payment Section */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" /> Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile-money">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Mobile Money
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Card
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <Label>Amount Received</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Customer Email (for receipt)</Label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {paymentMethod === "cash" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Received:</span>
                    <span>${amountReceived.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Change Due:</span>
                    <span className={changeDue < 0 ? "text-red-500" : ""}>
                      ${Math.abs(changeDue).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full"
              size="lg"
              onClick={processPayment}
              disabled={cart.length === 0 || (paymentMethod === "cash" && amountReceived < total)}
            >
              Process Payment
            </Button>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="w-full"
                onClick={printReceipt}
                disabled={cart.length === 0}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={emailReceipt}
                disabled={cart.length === 0}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Receipt
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              Clear Cart
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PosSystem;