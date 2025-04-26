export const ROUTES = {
  LOGIN: '/login',
  PAINEL: '/painel',
  TOTEM: (id: string) => `/totem/${id}`, // Rota para visualização
  TOTEM_ADMIN: (id: string) => `/painel/totem/${id}`, // Rota para administração
} as const; 