import { useState, useEffect } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { formatPrice } from '@/lib/utils'
import { Plus, Edit, Trash2, Search, Image as ImageIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Product } from '@/types'

interface ProductForm {
    name: string
    description: string
    price: number
    category: string
    available_sizes: string
    image: FileList
}

export default function AdminProducts() {
    const { products, loading, createProduct, updateProduct, deleteProduct, fetchProducts } = useProducts()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const { register, handleSubmit, reset, setValue } = useForm<ProductForm>()

    useEffect(() => {
        fetchProducts(false)
    }, [fetchProducts])

    const filteredProducts = products.filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const onSubmit = async (data: ProductForm) => {
        try {
            const productData = {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                category: data.category,
                available_sizes: data.available_sizes.split(',').map(s => s.trim()),
                is_active: true
            }

            const imageFile = data.image?.[0]

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData, imageFile)
            } else {
                await createProduct(productData, imageFile)
            }

            setIsModalOpen(false)
            reset()
            setEditingProduct(null)
        } catch (error) {
            console.error(error)
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setValue('name', product.name)
        setValue('description', product.description || '')
        setValue('price', product.price)
        setValue('category', product.category)
        setValue('available_sizes', product.available_sizes?.join(', ') || '')
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            await deleteProduct(id)
        }
    }

    const openNewModal = () => {
        setEditingProduct(null)
        reset()
        setIsModalOpen(true)
    }

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={60} /></div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
                <Button onClick={openNewModal} className="bg-[#D4A59A] hover:bg-[#C49585] text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Producto
                </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        placeholder="Buscar productos..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredProducts.map((product: any) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square relative bg-gray-100">
                            {product.image_url ? (
                                <img
                                    className="w-full h-full object-cover"
                                    src={product.image_url}
                                    alt={product.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="h-12 w-12 text-gray-300" />
                                </div>
                            )}
                        </div>

                        <div className="p-3">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>

                            <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-[#D4A59A]">{formatPrice(product.price)}</span>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>

                            <div className="mb-2 text-xs text-gray-500">
                                <p className="truncate">Cat: <span className="font-medium text-gray-700">{product.category}</span></p>
                                <p className="truncate">Tallas: <span className="font-medium text-gray-700">{product.available_sizes?.join(', ')}</span></p>
                            </div>

                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-[#D4A59A] text-white text-xs rounded-lg hover:bg-[#C49585] transition-colors"
                                >
                                    <Edit className="h-3 w-3" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white border border-red-500 text-red-500 text-xs rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <Input {...register('name', { required: true })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                            rows={3}
                            {...register('description')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio</label>
                            <Input type="number" step="0.01" {...register('price', { required: true })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categoría</label>
                            <Input {...register('category', { required: true })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tallas (separadas por coma)</label>
                        <Input {...register('available_sizes', { required: true })} placeholder="S, M, L, XL" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20"
                            {...register('image')}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="mr-2">
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingProduct ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
