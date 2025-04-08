export const ROUTES = {
  LOGIN: '/login',
  PAINEL: '/painel',
  TOTEM: (id: string) => `/totem/${id}`,
  TOTEM_ADMIN: (id: string) => `/painel/totem/${id}`,
} as const;

export const FIREBASE_COLLECTIONS = {
  TOTENS: 'totens',
} as const;

export const TOTEM_TYPES = {
  TV: 'tv',
  VERTICAL: 'vertical',
} as const; 