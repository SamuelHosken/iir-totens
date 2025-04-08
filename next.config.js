/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compilação de pacotes MUI e Emotion
  transpilePackages: [
    '@mui/material',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled'
  ],

  // Modo estrito do React para identificar problemas
  reactStrictMode: true,

  // Otimização de minificação
  swcMinify: true,

  // Configuração de imagens
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google Auth avatars
      'firebasestorage.googleapis.com' // Firebase Storage (se precisar)
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configurações do ESLint
  eslint: {
    ignoreDuringBuilds: true, // Temporário: remover após corrigir todos os erros
    dirs: ['src'] // Diretórios para verificar
  },

  // Configurações de compilação
  compiler: {
    // Remover console.logs em produção
    removeConsole: process.env.NODE_ENV === 'production',
    // Suporte a emotion
    emotion: true
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Redirecionamentos
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true
      }
    ];
  },

  // Configurações de ambiente
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV || 'development'
  },

  // Configurações de webpack (se necessário)
  webpack: (config, { isServer }) => {
    // Suas configurações personalizadas do webpack aqui
    return config;
  },

  // Configurações de otimização
  experimental: {
    optimizeCss: true, // Otimização de CSS
    scrollRestoration: true // Restauração de scroll
  }
};

module.exports = nextConfig; 