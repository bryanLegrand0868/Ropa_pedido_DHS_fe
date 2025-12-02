import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/common/Button'
import { useCartStore } from '@/stores/useCartStore'
import toast from 'react-hot-toast'
import { ShoppingCart, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            size: selectedSize,
            quantity: 1,
            image_url: product.image_url
        })

        toast.success('Producto agregado al carrito')
        setSelectedSize('')
    }

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#F5EDE7]">
            <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#F5EDE7] to-white">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#D4A59A]">
                        Sin imagen
                    </div>
                )}
            </Link>

            <div className="p-5 space-y-4">
                {/* Title and Price */}
                <div>
                    <h3 className="text-lg font-semibold text-[#6B5B52] line-clamp-1 mb-1">
                        <Link to={`/product/${product.id}`} className="hover:text-[#D4A59A] transition-colors">
                            {product.name}
                        </Link>
                    </h3>
                    <p className="text-sm text-[#A08679] mb-2">{product.category}</p>
                    <p className="text-2xl font-bold text-[#D4A59A]">
                        {formatPrice(product.price)}
                    </p>
                </div>

                {/* Size Selector */}
                <div>
                    <p className="text-sm font-medium text-[#6B5B52] mb-3">
                        Talla: <span className="font-bold">{selectedSize || '-'}</span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {product.available_sizes?.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "min-w-[60px] px-5 py-2.5 text-sm font-semibold border transition-all duration-200",
                                    selectedSize === size
                                        ? "bg-white text-black border-black border-2"
                                        : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Separator line - se llama "Divider" o "Separator" */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Accordion para Detalles */}
                <div className="border-b border-gray-200">
                    <button
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-sm font-semibold text-[#6B5B52] uppercase tracking-wide">
                            Detalles
                        </span>
                        <ChevronDown
                            className={cn(
                                "w-5 h-5 text-gray-500 transition-transform duration-200",
                                isDetailsOpen && "rotate-180"
                            )}
                        />
                    </button>

                    {isDetailsOpen && (
                        <div className="pb-4 text-sm text-[#6B5B52] leading-relaxed space-y-2">
                            {/* Lista con bullets */}
                            <ul className="list-disc list-inside space-y-1.5 ml-2">
                                <li>{product.description}</li>
                                {/* Más items si tienes */}
                            </ul>
                        </div>
                    )}
                </div>
                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    className="w-full bg-[#D4A59A] hover:bg-[#C49585] text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="h-5 w-5" />
                    Agregar al Carrito
                </Button>
            </div>
        </div>
    )
}
