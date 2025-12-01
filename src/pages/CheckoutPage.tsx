import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useOrders } from '@/hooks/useOrders'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, CreditCard, Banknote } from 'lucide-react'

export default function CheckoutPage() {
    const navigate = useNavigate()
    const { items, getTotal, clearCart } = useCartStore()
    const { user, profile } = useAuthStore()
    const { createOrder, loading } = useOrders()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })

    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo')
    const [error, setError] = useState('')

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart')
        }
    }, [items, navigate])

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: user?.email || '',
                phone: profile.phone || '',
                address: profile.address || ''
            })
        }
    }, [profile, user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setError('')

        try {
            await createOrder(
                user.id,
                items,
                formData,
                paymentMethod,
                getTotal()
            )

            clearCart()
            navigate('/my-orders')
        } catch (err: any) {
            setError(err.message || 'Error al procesar el pedido')
        }
    }

    const total = getTotal()

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/cart')} className="mb-8 pl-0">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al carrito
                </Button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Finalizar Compra</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Datos de Envío</h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <ErrorMessage message={error} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <Input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <Input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Exacta</label>
                                    <Input
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Método de Pago</h2>
                            <div className="space-y-3">
                                <div
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'efectivo' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                                    onClick={() => setPaymentMethod('efectivo')}
                                >
                                    <Banknote className={`mr-3 ${paymentMethod === 'efectivo' ? 'text-primary' : 'text-gray-400'}`} />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">Efectivo contra entrega</p>
                                        <p className="text-sm text-gray-500">Paga al recibir tu pedido</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border ${paymentMethod === 'efectivo' ? 'border-primary bg-primary' : 'border-gray-300'}`} />
                                </div>

                                <div
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'transferencia' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                                    onClick={() => setPaymentMethod('transferencia')}
                                >
                                    <CreditCard className={`mr-3 ${paymentMethod === 'transferencia' ? 'text-primary' : 'text-gray-400'}`} />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">Transferencia Bancaria</p>
                                        <p className="text-sm text-gray-500">Te enviaremos los datos por WhatsApp</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border ${paymentMethod === 'transferencia' ? 'border-primary bg-primary' : 'border-gray-300'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen del Pedido</h2>
                            <div className="flow-root mb-6">
                                <ul className="-my-4 divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <li key={`${item.productId}-${item.size}`} className="py-4 flex">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                {item.image_url && (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                )}
                                            </div>
                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>{item.name}</h3>
                                                        <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.size} x {item.quantity}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Total</p>
                                    <p>{formatPrice(total)}</p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full mt-6"
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : 'Confirmar Pedido'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
