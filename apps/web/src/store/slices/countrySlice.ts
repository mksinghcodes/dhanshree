import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SupportedCountry = 'NP' | 'IN' | 'AE';

export interface CountryInfo {
  code: SupportedCountry;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  taxRateLabel: string;
  taxPercent: number;
}

interface CountryState {
  currentCountry: SupportedCountry;
  availableCountries: Record<SupportedCountry, CountryInfo>;
  isSelectorOpen: boolean;
}

const initialState: CountryState = {
  currentCountry: 'NP',
  availableCountries: {
    NP: {
      code: 'NP',
      name: 'Nepal',
      flag: '🇳🇵',
      currency: 'NPR',
      currencySymbol: 'रू',
      taxRateLabel: '13% VAT',
      taxPercent: 13,
    },
    IN: {
      code: 'IN',
      name: 'India',
      flag: '🇮🇳',
      currency: 'INR',
      currencySymbol: '₹',
      taxRateLabel: '18% GST (CGST/SGST)',
      taxPercent: 18,
    },
    AE: {
      code: 'AE',
      name: 'UAE (Dubai)',
      flag: '🇦🇪',
      currency: 'AED',
      currencySymbol: 'AED',
      taxRateLabel: '5% Standard VAT',
      taxPercent: 5,
    },
  },
  isSelectorOpen: false,
};

export const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setCountry: (state, action: PayloadAction<SupportedCountry>) => {
      state.currentCountry = action.payload;
      state.isSelectorOpen = false;
    },
    toggleCountrySelector: (state) => {
      state.isSelectorOpen = !state.isSelectorOpen;
    },
    setCountrySelectorOpen: (state, action: PayloadAction<boolean>) => {
      state.isSelectorOpen = action.payload;
    },
  },
});

export const { setCountry, toggleCountrySelector, setCountrySelectorOpen } = countrySlice.actions;

export default countrySlice.reducer;
