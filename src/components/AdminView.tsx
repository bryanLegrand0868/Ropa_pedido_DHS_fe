import { useState } from 'react';
import { Product, Order } from '../App';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, ShoppingBag } from 'lucide-react';
import { ProductManagement } from './ProductManagement';
import { OrderManagement } from './OrderManagement';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, product: Product) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export function AdminView({
  products,
  orders,
  addProduct,
  deleteProduct,
  updateProduct,
  updateOrderStatus
}: AdminViewProps) {
  return (
    <div>
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white border border-[#E8DED5]">
          <TabsTrigger value="products" className="data-[state=active]:bg-[#D4A59A] data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-[#D4A59A] data-[state=active]:text-white">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Pedidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductManagement
            products={products}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
          />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement
            orders={orders}
            updateOrderStatus={updateOrderStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
