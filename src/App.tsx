import { useState } from 'react';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ClientView } from './components/ClientView';
import { AdminView } from './components/AdminView';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
}

export interface Order {
  id: string;
  items: {
    product: Product;
    size: string;
    quantity: number;
  }[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  date: string;
  status: 'pending' | 'confirmed' | 'delivered';
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Blusa de Seda',
    description: 'Elegante blusa de seda con cuello en V',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500',
    category: 'Blusas',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Vestido Midi',
    description: 'Vestido midi con corte elegante',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
    category: 'Vestidos',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '3',
    name: 'Pantalón de Lino',
    description: 'Pantalón cómodo y fresco de lino',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
    category: 'Pantalones',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '4',
    name: 'Blazer Clásico',
    description: 'Blazer ajustado perfecto para oficina',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500',
    category: 'Chaquetas',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  }
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, updatedProduct: Product) => {
    setProducts(products.map(p => p.id === id ? updatedProduct : p));
  };

  const addOrder = (order: Order) => {
    setOrders([order, ...orders]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <header className="bg-white border-b border-[#E8DED5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-[#D4A59A] tracking-wide">NENI EMPRENDEDORA</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white border border-[#E8DED5]">
            <TabsTrigger value="client" className="data-[state=active]:bg-[#D4A59A] data-[state=active]:text-white">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Tienda
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-[#D4A59A] data-[state=active]:text-white">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Administrador
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client">
            <ClientView products={products} addOrder={addOrder} />
          </TabsContent>

          <TabsContent value="admin">
            <AdminView
              products={products}
              orders={orders}
              addProduct={addProduct}
              deleteProduct={deleteProduct}
              updateProduct={updateProduct}
              updateOrderStatus={updateOrderStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
