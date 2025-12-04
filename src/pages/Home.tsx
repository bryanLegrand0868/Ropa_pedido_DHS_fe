import { useState, useMemo, useEffect } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useAuthStore } from '@/stores/useAuthStore'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
    const { products, loading, error } = useProducts()
    const { user, checkAuth, signOut } = useAuthStore()
    const navigate = useNavigate()
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

    // Check auth state on mount
    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = products.map(p => p.category).filter(Boolean)
        return ['Todos', ...Array.from(new Set(cats))]
    }, [products])

    // Filter products
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'Todos') return products
        return products.filter(p => p.category === selectedCategory)
    }, [products, selectedCategory])

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white py-6 border-b border-[#E8DED5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6">
                        {/* Title */}
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-black text-[#D4A59A] tracking-widest font-serif">
                                DEHESA
                            </h1>

                            <div className="flex items-center gap-2">
                                <Link to="/cart">
                                    <Button variant="outline" className="border-[#E8DED5] text-[#D4A59A] hover:bg-[#F5EDE7]">
                                        <ShoppingCart className="w-5 h-5" />
                                    </Button>
                                </Link>

                                {user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="border-[#E8DED5] text-[#D4A59A] hover:bg-[#F5EDE7]">
                                                <User className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel className="text-[#6B5B52]">
                                                Mi Cuenta
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                <Link to="/account" className="flex items-center w-full">
                                                    <User className="w-4 h-4 mr-2" />
                                                    Mi Perfil
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                <Link to="/my-orders" className="flex items-center w-full">
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    Mis Pedidos
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Cerrar Sesión
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link to="/login">
                                        <Button variant="outline" className="border-[#E8DED5] text-[#D4A59A] hover:bg-[#F5EDE7]">
                                            Iniciar Sesión
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>


                        {/* Categories */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {categories.map(category => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                    onClick={() => setSelectedCategory(category)}
                                    className={selectedCategory === category
                                        ? 'bg-[#D4A59A] hover:bg-[#C49588] border-0 text-white'
                                        : 'border-[#E8DED5] text-[#6B5B52] hover:bg-[#F5EDE7]'}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size={60} />
                    </div>
                ) : error ? (
                    <div className="flex justify-center py-20">
                        <ErrorMessage message={error} />
                    </div>
                ) : (
                    <>
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-20 text-[#A08679]">
                                No hay productos disponibles en esta categoría.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
