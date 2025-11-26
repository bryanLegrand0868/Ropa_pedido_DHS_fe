import { useState } from 'react';
import { Product, Order } from '../App';
import { ProductCard } from './ProductCard';
import { Cart } from './Cart';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface ClientViewProps {
  products: Product[];
  addOrder: (order: Order) => void;
}

export function ClientView({ products, addOrder }: ClientViewProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product, size: string) => {
    const existingItem = cart.find(item => item.product.id === product.id && item.size === size);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, size, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => !(item.product.id === productId && item.size === size)));
    } else {
      setCart(cart.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(cart.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = (customerName: string, customerEmail: string, customerPhone: string) => {
    const order: Order = {
      id: Date.now().toString(),
      items: cart,
      customerName,
      customerEmail,
      customerPhone,
      total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      date: new Date().toISOString(),
      status: 'pending'
    };

    addOrder(order);
    setCart([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-[#D4A59A] hover:bg-[#C49588] border-0' : 'border-[#E8DED5] hover:bg-[#F5EDE7]'}
            >
              {category}
            </Button>
          ))}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-[#D4A59A] text-[#D4A59A] hover:bg-[#F5EDE7] relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#D4A59A] hover:bg-[#C49588]">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg bg-white">
            <SheetHeader>
              <SheetTitle className="text-[#D4A59A]">Carrito de Compras</SheetTitle>
            </SheetHeader>
            <Cart
              items={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              onCheckout={handleCheckout}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-[#A08679]">
          No hay productos disponibles en esta categoría
        </div>
      )}
    </div>
  );
}
