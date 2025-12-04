import { Link } from 'react-router-dom'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
    product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link to={`/product/${product.id}`} className="group block">
            <div className="cursor-pointer relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg hover:shadow-lg transition-shadow duration-300" style={{ width: '286px' }}>
                {/* Product Image Container: 286x381px with rounded corners and overflow hidden */}
                <div className="relative overflow-hidden rounded-md m-2.5" style={{ width: '261px', height: '381px' }}>
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                            style={{
                                transition: 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)',
                                transform: 'scale(1)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                            }}
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400">
                            Sin imagen
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-1">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                    <p className="text-xl font-bold text-[#D4A59A]">
                        {formatPrice(product.price)}
                    </p>
                </div>
            </div>
        </Link>
    )
}