import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, Package } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AccountPage() {
    const navigate = useNavigate()
    const { user, profile, checkAuth, signOut } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    })

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                address: profile.address || ''
            })
        }
    }, [profile])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)
        setError('')

        try {
            const { error } = await (supabase
                .from('profiles') as any)
                .update({
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error

            await checkAuth()
            toast.success('Perfil actualizado correctamente')
        } catch (err: any) {
            setError(err.message || 'Error al actualizar perfil')
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    if (!profile) return <div className="flex justify-center py-20"><LoadingSpinner /></div>

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#D4A59A] flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#6B5B52]">Mi Perfil</h1>
                                <p className="text-sm text-[#A08679]">{user?.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleSignOut}
                            className="border-[#E8DED5] text-[#D4A59A] hover:bg-[#F5EDE7]"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Cerrar Sesión
                        </Button>
                    </div>

                    <Link to="/my-orders">
                        <Button
                            variant="outline"
                            className="w-full border-[#E8DED5] text-[#6B5B52] hover:bg-[#F5EDE7]"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            Ver Mis Pedidos
                        </Button>
                    </Link>
                </div>

                {/* Profile Form */}
                <div className="bg-white border border-[#E8DED5] rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-[#6B5B52] mb-6">Información Personal</h2>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <ErrorMessage message={error} />

                        <div>
                            <label className="block text-sm font-medium text-[#6B5B52] mb-2">
                                Nombre Completo
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="border-[#E8DED5]"
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#6B5B52] mb-2">
                                Teléfono
                            </label>
                            <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="border-[#E8DED5]"
                                placeholder="+502 1234-5678"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#6B5B52] mb-2">
                                Dirección de Envío
                            </label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="border-[#E8DED5]"
                                placeholder="Tu dirección completa"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-[#D4A59A] hover:bg-[#C49588] text-white"
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
