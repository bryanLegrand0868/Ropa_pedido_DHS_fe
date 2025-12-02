import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '@/types'
import { cn, formatPrice } from '@/lib/utils'
import { Button } from '@/components/common/Button'
import { useCartStore } from '@/stores/useCartStore'
import toast from 'react-hot-toast'
import { ShoppingCart, ChevronDown } from 'lucide-react'

interface ProductCardProps {
    product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const { addItem } = useCartStore()

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Por favor selecciona una talla')
            return
        }

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            size: selectedSize,
            quantity: 1,
            image_url: product.image_url || ''
        })

        toast.success('Producto agregado al carrito')
        setSelectedSize('')
    }

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
            {/* Product Image */}
            <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden bg-gray-50">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                        Sin imagen
                    </div>
                )}
            </Link>

            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                {/* Title, Category and Price */}
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1 mb-1">
                        <Link to={`/product/${product.id}`} className="hover:text-[#D4A59A] transition-colors">
                            {product.name}
                        </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{product.category}</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#D4A59A]">
                        {formatPrice(product.price)}
                    </p>
                </div>

                {/* Size Selector with Radix Toggle Group */}
                {/* Size Selector */}
                <div className="mb-8">
                    <p className="text-sm font-medium text-gray-600 mb-3">
                        TALLA: <span className="font-bold text-black">{selectedSize || 'M'}</span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {product.available_sizes?.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "min-w-[56px] h-[44px] px-4 text-sm font-medium transition-all duration-200",
                                    selectedSize === size
                                        ? "bg-white text-black border-2 border-black"
                                        : "bg-white text-gray-600 border border-gray-300 hover:border-gray-400"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    {!selectedSize && (
                        <p className="text-sm text-red-500 mt-2">Por favor selecciona una talla</p>
                    )}
                </div>

                {/* Separator */}
                <div className="border-t border-gray-200"></div>

                {/* Details Accordion */}
                <div className="border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 transition-colors rounded"
                    >
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Detalles
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {isDetailsOpen && (
                        <div className="pb-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                            <ul className="list-disc list-inside space-y-1.5 ml-2">
                                <li>{product.description}</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    className="w-full bg-[#D4A59A] hover:bg-[#C49585] text-white font-semibold py-2.5 sm:py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    Agregar al Carrito
                </Button>
            </div>
        </div>
    )
}
