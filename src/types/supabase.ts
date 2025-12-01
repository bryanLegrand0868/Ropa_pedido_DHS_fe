export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string | null
                    phone: string | null
                    address: string | null
                    role: 'admin' | 'customer'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    name?: string | null
                    phone?: string | null
                    address?: string | null
                    role?: 'admin' | 'customer'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    phone?: string | null
                    address?: string | null
                    role?: 'admin' | 'customer'
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    price: number
                    category: string
                    image_url: string | null
                    available_sizes: string[] | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    price: number
                    category: string
                    image_url?: string | null
                    available_sizes?: string[] | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    price?: number
                    category?: string
                    image_url?: string | null
                    available_sizes?: string[] | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    status: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado'
                    payment_method: 'efectivo' | 'transferencia'
                    total: number
                    customer_name: string
                    customer_email: string
                    customer_phone: string
                    customer_address: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    status?: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado'
                    payment_method: 'efectivo' | 'transferencia'
                    total: number
                    customer_name: string
                    customer_email: string
                    customer_phone: string
                    customer_address: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    status?: 'pendiente' | 'confirmado' | 'entregado'
                    payment_method?: 'efectivo' | 'transferencia'
                    total?: number
                    customer_name?: string
                    customer_email?: string
                    customer_phone?: string
                    customer_address?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string
                    product_name: string
                    product_price: number
                    size: string
                    quantity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id: string
                    product_name: string
                    product_price: number
                    size: string
                    quantity: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string
                    product_name?: string
                    product_price?: number
                    size?: string
                    quantity?: number
                    created_at?: string
                }
            }
        }
        Functions: {
            get_user_role: {
                Args: {
                    user_id: string
                }
                Returns: 'admin' | 'customer'
            }
        }
    }
}

export type Product = Database['public']['Tables']['products']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

export interface CartItem {
    productId: string
    name: string
    price: number
    size: string
    quantity: number
    image_url: string
}
