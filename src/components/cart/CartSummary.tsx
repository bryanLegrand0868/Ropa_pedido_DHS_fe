import { useCartStore } from '@/stores/useCartStore'
import { Button } from '@/components/common/Button'
import { formatPrice } from '@/lib/utils'
import { Link } from 'react-router-dom'

export const CartSummary = () => {
    const { getTotal } = useCartStore()
    const total = getTotal()

    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen del Pedido</h2>

            <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                    <div className="py-4 flex items-center justify-between">
                        <dt className="text-gray-600">Subtotal</dt>
                        <dd className="font-medium text-gray-900">{formatPrice(total)}</dd>
                    </div>
                    <div className="py-4 flex items-center justify-between">
                        <dt className="text-gray-600">Envío</dt>
                        <dd className="font-medium text-gray-900">Por calcular</dd>
                    </div>
                    <div className="py-4 flex items-center justify-between border-t border-gray-200">
                        <dt className="text-base font-medium text-gray-900">Total</dt>
                        <dd className="text-base font-bold text-gray-900">{formatPrice(total)}</dd>
                    </div>
                </dl>
            </div>

            <div className="mt-6">
                <Button className="w-full" size="lg" asChild>
                    <Link to="/checkout">Proceder al Pago</Link>
                </Button>
            </div>
        </div>
    )
}
