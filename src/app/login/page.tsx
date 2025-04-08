'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, Divider } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { colors } from '@/theme';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/painel');
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: '#000000',
            border: `1px solid ${colors.gray.medium}`,
            borderRadius: 2,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              width: '100%'
            }}
          >
            <Box sx={{ width: '40px', height: '40px', position: 'relative', flexShrink: 0 }}>
              <Image
                src="/IIR Brasil Logo Branca.png"
                alt="IIR Brasil Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
            <Typography 
              variant="h5" 
              component="h1"
              sx={{ 
                color: colors.white.main,
                fontWeight: 500,
                fontSize: '1.25rem'
              }}
            >
              Sistema de Totens
            </Typography>
          </Box>

          <Divider 
            sx={{ 
              borderColor: colors.gray.medium,
              width: '100%',
              my: 1
            }} 
          />

          <Typography 
            variant="body2"
            sx={{ 
              color: colors.white.secondary,
              textAlign: 'left',
              fontSize: '0.875rem',
              lineHeight: 1.5,
            }}
          >
            Faça login com sua conta Google para acessar o sistema de gerenciamento de totens da Igreja Internacional da Reconciliação - IIR.
          </Typography>

          <Button
            onClick={handleGoogleLogin}
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            fullWidth
            sx={{
              borderColor: colors.gray.medium,
              color: colors.white.main,
              py: 1.5,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mt: 1,
              '&:hover': {
                borderColor: colors.white.main,
                bgcolor: 'transparent'
              }
            }}
          >
            Entrar com Google
          </Button>

          {error && (
            <Typography 
              color="error" 
              variant="body2" 
              sx={{ 
                textAlign: 'center' 
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
} 