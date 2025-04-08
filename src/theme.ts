'use client';

import { createTheme } from '@mui/material';
import type { ThemeOptions, Theme } from '@mui/material/styles';

// Paleta de cores base
const colors = {
  // Tons de preto
  black: {
    darkest: '#000000',
    dark: '#000000',
    medium: '#000000',
    light: '#0A0A0A',
    pure: '#000000'
  },
  // Tons de cinza
  gray: {
    dark: '#0A0A0A',
    medium: '#1E1E1E',
    light: '#141414',
  },
  // Tons de branco
  white: {
    pure: '#FFFFFF',
    dim: '#F5F5F5',
    main: '#FFFFFF',
    secondary: '#B3B3B3'
  }
};

// Exportar colors para uso em outros componentes
export { colors };

// Configuração dos botões
const buttons = {
  primary: {
    background: "#FFFFFF",
    text: colors.black.pure,
    hover: {
      background: colors.white.dim,
      text: colors.white.pure,
    }
  },
  secondary: {
    background: 'transparent',
    text: colors.white.dim,
    border: colors.gray.medium,
    hover: {
      background: colors.gray.light,
      text: colors.white.pure,
      border: colors.gray.medium,
    }
  },
  danger: {
    background: '#DC3545',
    text: colors.white.pure,
    hover: {
      background: '#BD2130',
    }
  }
};

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#121212'
    },
    text: {
      primary: colors.white.pure,
      secondary: colors.gray.light,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        // Botão principal
        contained: {
          backgroundColor: buttons.primary.background,
          color: buttons.primary.text,
          '&:hover': {
            backgroundColor: buttons.primary.hover.background,
          },
        },
        // Botão secundário
        outlined: {
          backgroundColor: buttons.secondary.background,
          color: buttons.secondary.text,
          borderColor: buttons.secondary.border,
          '&:hover': {
            backgroundColor: buttons.secondary.hover.background,
            color: buttons.secondary.hover.text,
            borderColor: buttons.secondary.hover.border,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.black.medium,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.black.dark,
          color: colors.white.main,
          borderRadius: 2,
          border: `1px solid ${colors.gray.medium}`
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: colors.black.dark,
            color: colors.white.main,
            '& fieldset': {
              borderColor: colors.white.secondary,
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: colors.white.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.white.main,
              borderWidth: '1px',
            }
          },
          '& .MuiInputLabel-root': {
            color: colors.white.main,
            '&.Mui-focused': {
              color: colors.white.main,
            }
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: colors.white.main,
          '&::placeholder': {
            color: colors.white.secondary,
            opacity: 1
          }
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: colors.white.secondary,
          '&.Mui-focused': {
            color: colors.white.main
          }
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: colors.white.main
        }
      }
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: colors.white.secondary
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: colors.black.dark,
          color: colors.white.main,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.white.secondary,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.white.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.white.main,
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: colors.black.dark,
          color: colors.white.main,
          '&:hover': {
            backgroundColor: colors.gray.light,
          },
          '&.Mui-selected': {
            backgroundColor: colors.gray.medium,
            '&:hover': {
              backgroundColor: colors.gray.light,
            }
          }
        }
      }
    }
  },
};

export const theme: Theme = createTheme(themeOptions); 