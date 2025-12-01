import { useCartStore } from '@/stores/useCartStore'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/common/Button'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag } from 'lucide-react'

export default function CartPage() {
    const { items, clearCart } = useCartStore()

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <ShoppingBag size={48} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-8">Parece que aún no has agregado productos.</p>
                <Button asChild>
                    <Link to="/">Ver Productos</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 font-serif">Tu Carrito</h1>
                    <Button variant="ghost" asChild>
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Seguir comprando
                        </Link>
                    </Button>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    <div className="lg:col-span-7">
                        <div className="border-t border-gray-200">
                            {items.map((item) => (
                                <CartItem
                                    key={`${item.productId}-${item.size}`}
                                    item={item}
                                />
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button
                                variant="outline"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={clearCart}
                            >
                                Vaciar Carrito
                            </Button>
                        </div>
                    </div>

                    <div className="mt-16 lg:mt-0 lg:col-span-5">
                        <CartSummary />
                    </div>
                </div>
            </div>
        </div>
    )
}
