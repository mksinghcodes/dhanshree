import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VastuVibration = 5 | 6 | 'auto';

interface VastuState {
  preferredVibration: VastuVibration;
  activePromoCode: string | null;
  discountPercentage: number;
  lastHarmonizedPrice: number | null;
  digitalRootBreakdownOpen: boolean;
}

const initialState: VastuState = {
  preferredVibration: 'auto',
  activePromoCode: 'DHAN5',
  discountPercentage: 15,
  lastHarmonizedPrice: null,
  digitalRootBreakdownOpen: false,
};

export const vastuSlice = createSlice({
  name: 'vastu',
  initialState,
  reducers: {
    setPreferredVibration: (state, action: PayloadAction<VastuVibration>) => {
      state.preferredVibration = action.payload;
    },
    applyPromoCode: (state, action: PayloadAction<string>) => {
      const code = action.payload.toUpperCase().trim();
      state.activePromoCode = code;
      if (code === 'DHAN5') {
        state.discountPercentage = 20;
      } else if (code === 'SHREE6') {
        state.discountPercentage = 25;
      } else {
        state.discountPercentage = 10;
      }
    },
    removePromoCode: (state) => {
      state.activePromoCode = null;
      state.discountPercentage = 0;
    },
    toggleVastuBreakdown: (state) => {
      state.digitalRootBreakdownOpen = !state.digitalRootBreakdownOpen;
    },
  },
});

export const {
  setPreferredVibration,
  applyPromoCode,
  removePromoCode,
  toggleVastuBreakdown,
} = vastuSlice.actions;

export default vastuSlice.reducer;
