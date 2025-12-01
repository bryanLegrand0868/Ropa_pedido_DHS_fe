import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

interface AuthState {
    user: User | null
    profile: Profile | null
    loading: boolean
    isAuthenticated: boolean
    checkAuth: () => Promise<void>
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    loading: true,
    isAuthenticated: false,

    checkAuth: async () => {
        try {
            set({ loading: true })
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user) {
                set({ user: null, profile: null, isAuthenticated: false, loading: false })
                return
            }

            const { data: profile } = await (supabase
                .from('profiles') as any)
                .select('*')
                .eq('id', session.user.id)
                .single()

            set({
                user: session.user,
                profile,
                isAuthenticated: true,
                loading: false
            })
        } catch (error) {
            console.error('Auth check error:', error)
            set({ user: null, profile: null, isAuthenticated: false, loading: false })
        }
    },

    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, profile: null, isAuthenticated: false })
    }
}))
