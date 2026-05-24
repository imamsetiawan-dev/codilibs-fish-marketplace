import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        // Ambil id yang benar — bisa _id dari MongoDB atau id dari data lama
        const productId = product._id || product.id

        const existing = get().items.find(i => {
          const itemId = i._id || i.id
          return itemId === productId
        })

        if (existing) {
          set({
            items: get().items.map(i => {
              const itemId = i._id || i.id
              return itemId === productId
                ? { ...i, qty: i.qty + 1 }
                : i
            })
          })
        } else {
          set({ items: [...get().items, { ...product, qty: 1 }] })
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(i => {
            const itemId = i._id || i.id
            return itemId !== id
          })
        })
      },

      updateQty: (id, qty) => {
        if (qty < 1) return
        set({
          items: get().items.map(i => {
            const itemId = i._id || i.id
            return itemId === id ? { ...i, qty } : i
          })
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, i) => total + i.price * i.qty, 0)
      },

      getTotalItems: () => {
        return get().items.reduce((total, i) => total + i.qty, 0)
      },
    }),
    {
      name: 'aquashop-cart',
    }
  )
)

export default useCartStore