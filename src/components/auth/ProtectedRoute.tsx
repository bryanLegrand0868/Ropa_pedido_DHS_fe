import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

interface ProtectedRouteProps {
    adminOnly?: boolean
}

export const ProtectedRoute = ({ adminOnly = false }: ProtectedRouteProps) => {
    const { user, profile, loading, checkAuth } = useAuthStore()
    const location = useLocation()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <LoadingSpinner size={40} />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (adminOnly && profile?.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
