import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { useCartStore } from '@/stores/useCartStore'
import { Product } from '@/types'
import { Button } from '@/components/common/Button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { cn, formatPrice } from '@/lib/utils'
import { ArrowLeft, ChevronDown, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getProduct } = useProducts()
    const { addItem } = useCartStore()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    useEffect(() => {
        const loadProduct = async () => {
            if (!id) return
            try {
                setLoading(true)
                const data = await getProduct(id)
                setProduct(data)
            } catch (err) {
                setError('No se pudo cargar el producto')
            } finally {
                setLoading(false)
            }
        }
        loadProduct()
    }, [id, getProduct])

    const handleAddToCart = () => {
        if (!product || !selectedSize) return

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            size: selectedSize,
            quantity: 1,
            image_url: product.image_url || ''
        })

        toast.success('Producto agregado al carrito')
    }

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={60} /></div>
    if (error || !product) return <div className="flex justify-center py-20"><ErrorMessage message={error || 'Producto no encontrado'} /></div>

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 pl-0 hover:pl-2 transition-all">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al catálogo
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Sin imagen
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">
                            {product.name}
                        </h1>
                        <p className="text-sm text-gray-500 mb-6">{product.category}</p>

                        <p className="text-2xl font-semibold text-[#D4A59A] mb-8">
                            {formatPrice(product.price)}
                        </p>

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

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-6"></div>

                        {/* Accordion para Descripción/Detalles */}
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
                                <div className="pb-4 text-sm text-[#6B5B52] leading-relaxed">
                                    <p>{product.description}</p>
                                </div>
                            )}
                        </div>

                        <Button
                            size="lg"
                            className="w-full md:w-auto"
                            disabled={!selectedSize}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Agregar al Carrito
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
