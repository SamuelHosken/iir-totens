/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compilação de pacotes MUI e Emotion
  transpilePackages: [
    '@mui/material',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled'
  ],

  // Modo estrito do React
  reactStrictMode: true,

  // Configuração de imagens
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com'
    ]
  },

  // Configurações do ESLint
  eslint: {
    ignoreDuringBuilds: true
  },

  // Configurações de compilação
  compiler: {
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
  }
};

module.exports = nextConfig; 