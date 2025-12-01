import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProducts = useCallback(async (activeOnly = true) => {
        try {
            setLoading(true)
            setError(null)
            let query = supabase.from('products').select('*')

            if (activeOnly) {
                query = query.eq('is_active', true)
            }

            const { data, error } = await query.order('created_at', { ascending: false })

            if (error) throw error

            setProducts(data || [])
        } catch (err: any) {
            console.error('Error fetching products:', err)
            setError(err.message || 'Error fetching products')
            toast.error('Error al cargar productos')
        } finally {
            setLoading(false)
        }
    }, [])

    const getProduct = useCallback(async (id: string) => {
        try {
            setLoading(true)
            setError(null)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            return data
        } catch (err: any) {
            console.error('Error fetching product:', err)
            setError(err.message || 'Error fetching product')
            toast.error('Error al cargar producto')
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'image_url'>, imageFile: File) => {
        try {
            let image_url = ''
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName)

                image_url = publicUrl
            }

            const { data, error } = await (supabase
                .from('products') as any)
                .insert([{ ...productData, image_url }])
                .select()
                .single()

            if (error) throw error

            setProducts(prev => [data, ...prev])
            toast.success('Producto creado exitosamente')
            return data
        } catch (err: any) {
            console.error('Error creating product:', err)
            toast.error('Error al crear producto')
            throw err
        }
    }

    const updateProduct = async (id: string, productData: Partial<Product>, imageFile?: File) => {
        try {
            let updates = { ...productData }

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName)

                updates.image_url = publicUrl
            }

            const { data, error } = await (supabase
                .from('products') as any)
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            setProducts(prev => prev.map(p => p.id === id ? data : p))
            toast.success('Producto actualizado')
            return data
        } catch (err: any) {
            console.error('Error updating product:', err)
            toast.error('Error al actualizar producto')
            throw err
        }
    }

    const deleteProduct = async (id: string) => {
        try {
            // Soft delete
            const { error } = await (supabase
                .from('products') as any)
                .update({ is_active: false })
                .eq('id', id)

            if (error) throw error

            setProducts(prev => prev.filter(p => p.id !== id)) // Or update to inactive if we show inactive
            toast.success('Producto desactivado')
        } catch (err: any) {
            console.error('Error deleting product:', err)
            toast.error('Error al eliminar producto')
            throw err
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return {
        products,
        loading,
        error,
        fetchProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct
    }
}
