import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { checkAuth } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            })

            if (error) throw error

            // Use RPC to bypass RLS policies for role check
            const { data: roleData, error: roleError } = await (supabase.rpc as any)(
                'get_user_role',
                { user_id: data.user.id }
            )

            console.log('Role check result:', { roleData, roleError, userId: data.user.id })

            await checkAuth()
            toast.success('¡Bienvenido de nuevo!')

            // Redirect based on role
            console.log('Checking redirect - roleData:', roleData, 'roleError:', roleError)
            if (!roleError && roleData === 'admin') {
                console.log('Redirecting to /admin')
                navigate('/admin', { replace: true })
            } else {
                console.log('Redirecting to:', from)
                navigate(from, { replace: true })
            }
        } catch (err: any) {
            console.error('Login error:', err)
            setError(err.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
                    <p className="text-gray-600 mt-2">Ingresa a tu cuenta para gestionar tus pedidos</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <ErrorMessage message={error} />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico
                        </label>
                        <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <Input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-gray-600">¿No tienes cuenta? </span>
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Regístrate aquí
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
