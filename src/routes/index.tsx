import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import Home from '@/pages/Home'
import ProductPage from '@/pages/ProductPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import AccountPage from '@/pages/AccountPage'
import MyOrdersPage from '@/pages/MyOrdersPage'

// Admin Components
import AdminLayout from '@/components/admin/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminOrders from '@/pages/admin/AdminOrders'

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />, // Main Layout
        children: [
            { index: true, element: <Home /> },
            { path: 'product/:id', element: <ProductPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },

            // Protected Customer Routes
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'cart', element: <CartPage /> },
                    { path: 'checkout', element: <CheckoutPage /> },
                    { path: 'account', element: <AccountPage /> },
                    { path: 'my-orders', element: <MyOrdersPage /> },
                ]
            },

            // Admin Routes
            {
                path: 'admin',
                element: <ProtectedRoute adminOnly={true} />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                            { index: true, element: <AdminDashboard /> }, // stats
                            { path: 'products', element: <AdminProducts /> },
                            { path: 'orders', element: <AdminOrders /> },
                        ]
                    }
                ]
            }
        ]
    }
])

export const AppRoutes = () => {
    return <RouterProvider router={router} />
}
