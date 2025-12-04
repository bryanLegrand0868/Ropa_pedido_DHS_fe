import { CartItem as CartItemType } from '@/types'
import { useCartStore } from '@/stores/useCartStore'
import { Button } from '@/components/common/Button'
import { formatPrice } from '@/lib/utils'
import { Trash2, Plus, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CartItemProps {
    item: CartItemType
}

export const CartItem = ({ item }: CartItemProps) => {
    const { updateQuantity, removeItem } = useCartStore()

    return (
        <div className="flex py-6 border-b border-gray-200 last:border-0">
            {/* Image: 80x120px */}
            <div className="w-20 h-[120px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                        Sin imagen
                    </div>
                )}
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                            <Link to={`/product/${item.productId}`}>{item.name}</Link>
                        </h3>
                        <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Talla: {item.size}</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                    {/* Quantity Selector: 102x32px */}
                    <div className="flex items-center border rounded-md" style={{ width: '102px', height: '32px' }}>
                        <button
                            className="flex items-center justify-center w-8 h-full hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="flex-1 text-center font-medium text-sm">{item.quantity}</span>
                        <button
                            className="flex items-center justify-center w-8 h-full hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.productId, item.size)}
                    >
                        <Trash2 size={16} className="mr-1" />
                        Eliminar
                    </Button>
                </div>
            </div>
        </div>
    )
}
