export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64 string
  timestamp: number;
}

export interface MarketItem {
  crop: string;
  price: number; // in Rupees
  demand: number;
  supply: number;
}

export interface District {
  id: string;
  name: string;
}

export enum DashboardFeature {
  WEATHER = 'WEATHER',
  FINANCE = 'FINANCE',
  CROP_MANAGER = 'CROP_MANAGER',
  SCHEMES = 'SCHEMES',
  COMMUNITY = 'COMMUNITY',
  FARM_KART = 'FARM_KART',
  PROFILE = 'PROFILE'
}

export interface User {
  name: string;
  phoneNumber: string;
}

export type Language = 'en' | 'hi' | 'or';