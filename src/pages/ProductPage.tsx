import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { useCartStore } from '@/stores/useCartStore'
import { Product } from '@/types'
import { Button } from '@/components/common/Button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getProduct } = useProducts()
    const { addItem } = useCartStore()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)

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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">{product.name}</h1>
                        <p className="text-sm text-gray-500 mb-6">{product.category}</p>

                        <p className="text-2xl font-semibold text-primary mb-8">
                            {formatPrice(product.price)}
                        </p>

                        <div className="prose prose-sm text-gray-600 mb-8">
                            <p>{product.description}</p>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Tallas Disponibles</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.available_sizes?.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`
                      w-12 h-12 rounded-full flex items-center justify-center border transition-all
                      ${selectedSize === size
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-200 hover:border-primary text-gray-900'}
                    `}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {!selectedSize && (
                                <p className="text-sm text-red-500 mt-2">Por favor selecciona una talla</p>
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
