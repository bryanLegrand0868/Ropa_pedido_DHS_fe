export * from './supabase'
import { Order, OrderItem } from './supabase'

export interface OrderWithItems extends Order {
    order_items: OrderItem[]
}
