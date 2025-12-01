import { useEffect } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { useAuthStore } from '@/stores/useAuthStore'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { formatPrice, formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { Button } from '@/components/common/Button'

export default function MyOrdersPage() {
    const { user } = useAuthStore()
    const { orders, loading, error, fetchMyOrders } = useOrders()

    useEffect(() => {
        if (user) {
            fetchMyOrders(user.id)
        }
    }, [user, fetchMyOrders])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendiente': return 'bg-yellow-100 text-yellow-800'
            case 'confirmado': return 'bg-blue-100 text-blue-800'
            case 'entregado': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={60} /></div>

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 font-serif">Mis Pedidos</h1>
                    <Button variant="outline" asChild>
                        <Link to="/">Volver a la tienda</Link>
                    </Button>
                </div>

                {error && <ErrorMessage message={error} className="mb-6" />}

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Package size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No tienes pedidos aún</h3>
                        <p className="text-gray-500 mt-2 mb-6">¡Explora nuestro catálogo y realiza tu primer pedido!</p>
                        <Button asChild>
                            <Link to="/">Ver Productos</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Pedido realizado el</p>
                                        <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total</p>
                                        <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} capitalize`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Productos</h4>
                                    <ul className="divide-y divide-gray-100">
                                        {/* We need to fetch order items properly or include them in the query. 
                        The current useOrders hook includes them. 
                        We need to cast order to any or update the type because Supabase types might be strict.
                    */}
                                        {(order as any).order_items?.map((item: any) => (
                                            <li key={item.id} className="py-4 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                                                        <p className="text-sm text-gray-500">Talla: {item.size} | Cantidad: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">{formatPrice(item.product_price * item.quantity)}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
