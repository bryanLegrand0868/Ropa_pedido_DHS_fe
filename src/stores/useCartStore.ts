import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

interface CartState {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (productId: string, size: string) => void
    updateQuantity: (productId: string, size: string, quantity: number) => void
    clearCart: () => void
    getTotal: () => number
    getItemCount: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (newItem) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (item) => item.productId === newItem.productId && item.size === newItem.size
                    )

                    if (existingItemIndex > -1) {
                        const newItems = [...state.items]
                        newItems[existingItemIndex].quantity += newItem.quantity
                        return { items: newItems }
                    }

                    return { items: [...state.items, newItem] }
                })
            },

            removeItem: (productId, size) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.productId === productId && item.size === size)
                    ),
                }))
            },

            updateQuantity: (productId, size, quantity) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.productId === productId && item.size === size
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    ),
                }))
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                const { items } = get()
                return items.reduce((total, item) => total + item.price * item.quantity, 0)
            },

            getItemCount: () => {
                const { items } = get()
                return items.reduce((count, item) => count + item.quantity, 0)
            }
        }),
        {
            name: 'cart-storage',
        }
    )
)
