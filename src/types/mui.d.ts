// Material UI
declare module '@mui/material' {
  export * from '@mui/material';
  export const createTheme: any;
  export const ThemeProvider: any;
  export const CssBaseline: any;
}

declare module '@mui/icons-material' {
  export * from '@mui/icons-material';
  export const Add: any;
  export const Delete: any;
  export const Edit: any;
  export const Visibility: any;
  export const Menu: any;
}

// Emotion
declare module '@emotion/react' {
  export * from '@emotion/react';
  export const CacheProvider: any;
}

declare module '@emotion/styled' {
  export * from '@emotion/styled';
}

declare module '@emotion/cache' {
  const createCache: any;
  export default createCache;
}

// Next.js
declare module 'next/link';
declare module 'next/navigation';
declare module 'next/font/google';

declare module '@mui/material/styles' {
  interface Theme {
    // ... seus tipos personalizados aqui se necessário
  }
  interface ThemeOptions {
    // ... seus tipos personalizados aqui se necessário
  }
} 