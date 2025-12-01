import { Link } from 'react-router-dom'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/common/Button'

interface ProductCardProps {
    product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
            <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden bg-gray-100">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                        Sin imagen
                    </div>
                )}
            </Link>

            <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                    <Link to={`/product/${product.id}`}>
                        {product.name}
                    </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500 truncate">{product.category}</p>
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary">
                        {formatPrice(product.price)}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/product/${product.id}`}>Ver detalles</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
