import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Order, CartItem } from '@/types'
import toast from 'react-hot-toast'

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchMyOrders = useCallback(async (userId: string) => {
        try {
            setLoading(true)
            setError(null)
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (
            *,
            product_name,
            product_price,
            size,
            quantity
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])
        } catch (err: any) {
            console.error('Error fetching orders:', err)
            setError(err.message)
            toast.error('Error al cargar pedidos')
        } finally {
            setLoading(false)
        }
    }, [])

    const createOrder = async (
        userId: string,
        cartItems: CartItem[],
        shippingData: any,
        paymentMethod: 'efectivo' | 'transferencia',
        total: number
    ) => {
        try {
            setLoading(true)

            // 1. Create Order
            const { data: order, error: orderError } = await (supabase
                .from('orders') as any)
                .insert([{
                    user_id: userId,
                    status: 'pendiente',
                    payment_method: paymentMethod,
                    total: total,
                    customer_name: shippingData.name,
                    customer_email: shippingData.email,
                    customer_phone: shippingData.phone,
                    customer_address: shippingData.address
                }])
                .select()
                .single()

            if (orderError) throw orderError

            // 2. Create Order Items
            const orderItems = cartItems.map(item => ({
                order_id: order.id,
                product_id: item.productId,
                product_name: item.name,
                product_price: item.price,
                size: item.size,
                quantity: item.quantity
            }))

            const { error: itemsError } = await (supabase
                .from('order_items') as any)
                .insert(orderItems)

            if (itemsError) {
                // Ideally we should rollback the order here, but Supabase doesn't support transactions in client-side JS easily without RPC.
                // For now, we'll just log it. In a real app, use an RPC function for atomic transactions.
                console.error('Error creating order items:', itemsError)
                throw itemsError
            }

            toast.success('¡Pedido confirmado!')
            return order
        } catch (err: any) {
            console.error('Error creating order:', err)
            toast.error('Error al procesar el pedido')
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        orders,
        loading,
        error,
        fetchMyOrders,
        createOrder
    }
}
