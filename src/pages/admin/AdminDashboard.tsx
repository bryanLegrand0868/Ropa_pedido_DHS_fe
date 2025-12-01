import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { formatPrice } from '@/lib/utils'
import {
    TrendingUp,
    Users,
    ShoppingBag,
    Package
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0
    })
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)

                // Parallel fetching
                const [
                    ordersResponse,
                    productsResponse,
                    customersResponse
                ] = await Promise.all([
                    supabase.from('orders').select('total, created_at', { count: 'exact' }),
                    supabase.from('products').select('id', { count: 'exact', head: true }),
                    supabase.from('profiles').select('id', { count: 'exact', head: true })
                ])

                const ordersData = ordersResponse.data
                const ordersCount = ordersResponse.count
                const productsCount = productsResponse.count
                const customersCount = customersResponse.count

                const totalRevenue = (ordersData as any[])?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

                // Fetch recent orders
                const { data: recent } = await supabase
                    .from('orders')
                    .select('*, profiles(name)')
                    .order('created_at', { ascending: false })
                    .limit(5)

                setStats({
                    totalRevenue,
                    totalOrders: ordersCount || 0,
                    totalProducts: productsCount || 0,
                    totalCustomers: customersCount || 0
                })
                setRecentOrders(recent || [])

            } catch (error) {
                console.error('Error fetching admin stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={60} /></div>

    const statCards = [
        { title: 'Ingresos Totales', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Pedidos Totales', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Productos Activos', value: stats.totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'Clientes', value: stats.totalCustomers, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    ]

    // Mock data for chart
    const data = [
        { name: 'Lun', ventas: 4000 },
        { name: 'Mar', ventas: 3000 },
        { name: 'Mie', ventas: 2000 },
        { name: 'Jue', ventas: 2780 },
        { name: 'Vie', ventas: 1890 },
        { name: 'Sab', ventas: 2390 },
        { name: 'Dom', ventas: 3490 },
    ]

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Ventas de la Semana</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="ventas" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Pedidos Recientes</h2>
                    <div className="flow-root">
                        <ul className="-my-5 divide-y divide-gray-200">
                            {recentOrders.map((order) => (
                                <li key={order.id} className="py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {order.customer_name || 'Cliente'}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                            {formatPrice(order.total)}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
