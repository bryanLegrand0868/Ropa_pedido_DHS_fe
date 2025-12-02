import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { supabase } from '@/lib/supabase'
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    LogOut
} from 'lucide-react'
import { useEffect } from 'react'
import { cn, formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminLayout() {
    const { signOut } = useAuthStore()
    const location = useLocation()

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Productos', href: '/admin/products', icon: Package },
        { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
    ]

    useEffect(() => {
        const channel = supabase
            .channel('admin-orders')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders'
                },
                (payload) => {
                    toast.success(`Nuevo pedido recibido: ${formatPrice(payload.new.total)}`, {
                        duration: 5000,
                        icon: '🔔'
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className="min-h-screen bg-[#F5EDE7]">
            {/* Header with Navigation */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo/Title */}
                        <div className="flex-shrink-0">
                            <span className="text-xl font-bold text-gray-900">DEHESA</span>
                        </div>
                        {/* Navigation Tabs */}
                        <nav className="flex space-x-3">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200",
                                            isActive
                                                ? "bg-[#D4A59A] text-white shadow-md scale-105"
                                                : "bg-white text-gray-700 hover:bg-[#F5EDE7] hover:scale-105 border border-gray-200 hover:border-[#E8DED5] hover:shadow-sm"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-4 w-4 transition-transform",
                                            isActive && "scale-110"
                                        )} />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Logout Button */}
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    )
}
