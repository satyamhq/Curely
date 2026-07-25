'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Medicine } from '@/types/pharmacy'

interface CartItem {
  medicine: Medicine
  quantity: number
}

interface CartStore {
  items: CartItem[]
  pharmacyId: string | null
  addItem: (medicine: Medicine) => void
  removeItem: (medicineId: string) => void
  updateQuantity: (medicineId: string, quantity: number) => void
  clearCart: () => void
  total: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      pharmacyId: null,

      addItem: (medicine) => {
        const existing = get().items.find((i) => i.medicine.id === medicine.id)
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.medicine.id === medicine.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }))
        } else {
          set((state) => ({
            items: [...state.items, { medicine, quantity: 1 }],
            pharmacyId: medicine.pharmacy_id,
          }))
        }
      },

      removeItem: (medicineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.medicine.id !== medicineId),
        })),

      updateQuantity: (medicineId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.medicine.id !== medicineId)
              : state.items.map((i) =>
                  i.medicine.id === medicineId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [], pharmacyId: null }),

      total: () =>
        get().items.reduce(
          (sum, item) => sum + item.medicine.price * item.quantity,
          0
        ),
    }),
    { name: 'curely-cart' }
  )
)
