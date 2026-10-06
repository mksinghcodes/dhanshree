import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  digitalRoot?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastAddedItemId: string | null;
}

const initialState: CartState = {
  items: [
    {
      id: 'demo-01',
      title: 'Apple MacBook Pro M3 Max (16-inch, 36GB RAM)',
      price: 334400,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
      variant: 'Space Black',
      digitalRoot: 5,
    },
    {
      id: 'demo-02',
      title: 'Palpali Handloom Dhaka Topi & Silk Khada',
      price: 1203,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=300',
      variant: 'Handloom Cotton',
      digitalRoot: 6,
    },
  ],
  isOpen: false,
  lastAddedItemId: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      const qtyToAdd = action.payload.quantity || 1;

      if (existing) {
        existing.quantity += qtyToAdd;
      } else {
        state.items.push({
          ...action.payload,
          quantity: qtyToAdd,
        });
      }
      state.lastAddedItemId = action.payload.id;
      state.isOpen = true;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.isOpen = false;
    },
  },
});

export const { addItem, removeItem, updateQuantity, setCartOpen, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
