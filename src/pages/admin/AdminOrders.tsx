import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { formatPrice, formatDate } from '@/lib/utils'
import { Search, Eye, CheckCircle, XCircle, Truck } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import toast from 'react-hot-toast'
import { OrderWithItems, OrderItem } from '@/types'

export default function AdminOrders() {
    const [orders, setOrders] = useState<OrderWithItems[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (*)
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])
        } catch (error) {
            console.error('Error fetching orders:', error)
            toast.error('Error al cargar pedidos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await (supabase
                .from('orders') as any)
                .update({ status: newStatus })
                .eq('id', orderId)

            if (error) throw error

            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as OrderWithItems['status'] } : o))
            toast.success(`Estado actualizado a ${newStatus}`)
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus as OrderWithItems['status'] })
            }
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Error al actualizar estado')
        }
    }

    const filteredOrders = orders.filter(order =>
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendiente': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            case 'confirmado': return 'bg-blue-100 text-blue-800 border border-blue-200'
            case 'enviado': return 'bg-purple-100 text-purple-800 border border-purple-200'
            case 'entregado': return 'bg-green-100 text-green-800 border border-green-200'
            case 'cancelado': return 'bg-red-100 text-red-800 border border-red-200'
            default: return 'bg-gray-100 text-gray-800 border border-gray-200'
        }
    }

    const openOrderDetails = (order: OrderWithItems) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={60} /></div>

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Pedidos</h1>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        placeholder="Buscar por cliente o ID..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    #{order.id.slice(0, 8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                                    <div className="text-sm text-gray-500">{order.customer_email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(order.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatPrice(order.total)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)} capitalize`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openOrderDetails(order)} className="text-[#D4A59A] hover:text-[#C49585]">
                                        <Eye className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Detalles del Pedido #${selectedOrder?.id.slice(0, 8)}`}
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Cliente</p>
                                <p className="font-medium">{selectedOrder.customer_name}</p>
                                <p className="text-gray-500">{selectedOrder.customer_email}</p>
                                <p className="text-gray-500">{selectedOrder.customer_phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Dirección de Envío</p>
                                <p className="font-medium">{selectedOrder.customer_address}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Método de Pago</p>
                                <p className="font-medium capitalize">{selectedOrder.payment_method}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Fecha</p>
                                <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-medium mb-3">Productos</h4>
                            <ul className="divide-y divide-gray-100">
                                {selectedOrder.order_items.map((item: OrderItem) => (
                                    <li key={item.id} className="py-2 flex justify-between text-sm">
                                        <div>
                                            <span className="font-medium">{item.product_name}</span>
                                            <span className="text-gray-500 ml-2">({item.size}) x {item.quantity}</span>
                                        </div>
                                        <span>{formatPrice(item.product_price * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between mt-4 font-bold text-lg">
                                <span>Total</span>
                                <span>{formatPrice(selectedOrder.total)}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-medium mb-3">Actualizar Estado</h4>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    variant={selectedOrder.status === 'pendiente' ? 'default' : 'outline'}
                                    onClick={() => handleStatusChange(selectedOrder.id, 'pendiente')}
                                >
                                    Pendiente
                                </Button>
                                <Button
                                    size="sm"
                                    variant={selectedOrder.status === 'confirmado' ? 'default' : 'outline'}
                                    onClick={() => handleStatusChange(selectedOrder.id, 'confirmado')}
                                >
                                    Confirmar
                                </Button>
                                <Button
                                    size="sm"
                                    variant={selectedOrder.status === 'enviado' ? 'default' : 'outline'}
                                    onClick={() => handleStatusChange(selectedOrder.id, 'enviado')}
                                >
                                    Enviado
                                </Button>
                                <Button
                                    size="sm"
                                    variant={selectedOrder.status === 'entregado' ? 'default' : 'outline'}
                                    onClick={() => handleStatusChange(selectedOrder.id, 'entregado')}
                                >
                                    Entregado
                                </Button>
                                <Button
                                    size="sm"
                                    variant={selectedOrder.status === 'cancelado' ? 'default' : 'outline'}
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => handleStatusChange(selectedOrder.id, 'cancelado')}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
