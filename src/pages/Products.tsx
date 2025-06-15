import { products } from "../lib/mock-data";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { useState } from "react";
import { PlusCircle, X, CreditCard, DollarSign, Package } from 'lucide-react';

type CartItem = {
  product: typeof products[0];
  quantity: number;
};

const PosPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const addToCart = (product: typeof products[0]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4">
       <h2 className="text-3xl font-bold tracking-tight mb-4">Point of Sale</h2>
      <div className="grid md:grid-cols-3 gap-4 flex-1">
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="cursor-pointer hover:border-primary" onClick={() => addToCart(product)}>
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <Package className="h-10 w-10 mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium leading-tight">{product.name}</p>
                        <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Current Sale</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-64">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">Cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center">
                        <p className="font-semibold mr-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch space-y-4">
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
                <Button className="w-full">
                    <DollarSign className="mr-2 h-4 w-4" /> Cash
                </Button>
                <Button variant="secondary" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" /> Card
                </Button>
            </div>
            <Button size="lg" className="w-full font-bold" disabled={cart.length === 0}>
              Complete Sale
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PosPage;
