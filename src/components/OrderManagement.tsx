import { Order } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface OrderManagementProps {
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export function OrderManagement({ orders, updateOrderStatus }: OrderManagementProps) {
  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      delivered: 'bg-green-100 text-green-800 border-green-300'
    };

    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      delivered: 'Entregado'
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast.success('Estado actualizado');
  };

  return (
    <div>
      <h2 className="text-[#6B5B52] mb-6">Gestión de Pedidos</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="border-[#E8DED5]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-[#6B5B52]">Pedido #{order.id}</CardTitle>
                  <p className="text-sm text-[#A08679] mt-1">
                    {new Date(order.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-[#6B5B52] mb-2">Información del Cliente</h4>
                  <div className="text-sm text-[#A08679] space-y-1">
                    <p>Nombre: {order.customerName}</p>
                    <p>Email: {order.customerEmail}</p>
                    <p>Teléfono: {order.customerPhone}</p>
                  </div>
                </div>

                <Separator className="bg-[#E8DED5]" />

                <div>
                  <h4 className="text-sm text-[#6B5B52] mb-2">Productos</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-[#A08679]">
                          {item.product.name} - Talla {item.size} x {item.quantity}
                        </span>
                        <span className="text-[#6B5B52]">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-[#E8DED5]" />

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[#6B5B52]">Total: </span>
                    <span className="text-[#D4A59A]">${order.total.toFixed(2)}</span>
                  </div>
                  
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                  >
                    <SelectTrigger className="w-[180px] border-[#E8DED5]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 text-[#A08679]">
          No hay pedidos todavía
        </div>
      )}
    </div>
  );
}
