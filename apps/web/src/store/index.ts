import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import cartReducer from './slices/cartSlice';
import countryReducer from './slices/countrySlice';
import vastuReducer from './slices/vastuSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    country: countryReducer,
    vastu: vastuReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Convenience Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalCount = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectCurrentCountry = (state: RootState) => state.country.currentCountry;
export const selectCurrentCountryInfo = (state: RootState) =>
  state.country.availableCountries[state.country.currentCountry];

export const selectVastuVibration = (state: RootState) => state.vastu.preferredVibration;
export const selectActivePromo = (state: RootState) => state.vastu.activePromoCode;
