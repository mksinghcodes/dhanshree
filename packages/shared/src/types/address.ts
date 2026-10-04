import { CountryCode } from '../constants/countries.js';

export interface BaseAddress {
  id?: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  country: CountryCode;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface NepalAddress extends BaseAddress {
  country: CountryCode.NEPAL;
  province: string; // e.g., "Bagmati Province", "Gandaki Province"
  district: string; // e.g., "Kathmandu", "Lalitpur", "Kaski"
  municipality: string; // e.g., "Kathmandu Metropolitan City", "Pokhara"
  wardNumber: number; // 1-32
  toleStreet: string; // e.g., "Baneshwor, New Baneshwor Marg"
  postalCode?: string; // 5-digit postal code
  landmark?: string;
}

export interface IndiaAddress extends BaseAddress {
  country: CountryCode.INDIA;
  state: string; // e.g., "Maharashtra", "Karnataka", "Delhi"
  districtCity: string; // e.g., "Mumbai", "Bengaluru", "New Delhi"
  pinCode: string; // 6 digits, e.g. "400001"
  addressLine1: string; // Flat, House no., Building, Company, Apartment
  addressLine2?: string; // Area, Colony, Street, Sector, Village
  landmark?: string;
}

export interface UAEAddress extends BaseAddress {
  country: CountryCode.UAE;
  emirate:
    | 'DUBAI'
    | 'ABU_DHABI'
    | 'SHARJAH'
    | 'AJMAN'
    | 'RAS_AL_KHAIMAH'
    | 'FUJAIRAH'
    | 'UMM_AL_QUWAIN';
  areaNeighborhood: string; // e.g., "Downtown Dubai", "Business Bay", "Deira"
  streetName: string;
  buildingVillaName: string;
  apartmentVillaNumber: string;
  makaniNumber?: string; // 10-digit Dubai Makani Number (e.g., 30032 95320)
  poBox?: string;
  nearestLandmark?: string;
}

export type LocalizedAddress = NepalAddress | IndiaAddress | UAEAddress;
