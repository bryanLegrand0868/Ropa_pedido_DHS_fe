import { useState } from 'react';
import { CartItem } from './ClientView';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Minus, Plus, X } from 'lucide-react';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartProps {
  items: CartItem[];
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  onCheckout: (name: string, email: string, phone: string) => void;
}

export function Cart({ items, updateQuantity, removeFromCart, onCheckout }: CartProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    onCheckout(customerName, customerEmail, customerPhone);
    toast.success('¡Pedido realizado con éxito!');
    setShowCheckout(false);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-[#A08679]">
        <p>Tu carrito está vacío</p>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setShowCheckout(false)}
          className="mb-4 text-[#D4A59A]"
        >
          ← Volver al carrito
        </Button>
        
        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[#6B5B52]">Nombre completo</Label>
            <Input
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border-[#E8DED5]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-[#6B5B52]">Email</Label>
            <Input
              id="email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="border-[#E8DED5]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-[#6B5B52]">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="border-[#E8DED5]"
              required
            />
          </div>

          <Separator className="bg-[#E8DED5]" />

          <div className="flex justify-between text-[#6B5B52]">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Button type="submit" className="w-full bg-[#D4A59A] hover:bg-[#C49588]">
            Confirmar Pedido
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.size}`} className="flex gap-4 p-3 bg-[#FAF8F6] rounded-lg">
            <ImageWithFallback
              src={item.product.image}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="text-[#6B5B52]">{item.product.name}</h4>
              <p className="text-sm text-[#A08679]">Talla: {item.size}</p>
              <p className="text-[#D4A59A]">${item.product.price.toFixed(2)}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-[#E8DED5]"
                  onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm text-[#6B5B52] w-8 text-center">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-[#E8DED5]"
                  onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="text-[#A08679] hover:text-[#6B5B52]"
              onClick={() => removeFromCart(item.product.id, item.size)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator className="bg-[#E8DED5] mb-4" />

      <div className="space-y-4">
        <div className="flex justify-between text-[#6B5B52]">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        <Button
          onClick={() => setShowCheckout(true)}
          className="w-full bg-[#D4A59A] hover:bg-[#C49588]"
        >
          Proceder al Pago
        </Button>
      </div>
    </div>
  );
}
