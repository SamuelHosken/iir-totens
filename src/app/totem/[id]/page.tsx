'use client';

import { useState, useEffect, use } from 'react';
import { Box } from '@mui/material';
import { useTotem } from '@/hooks/useTotem';
import { TVLayout } from '@/components/layouts/tv/TVLayout';
import { VerticalLayout } from '@/components/layouts/vertical/VerticalLayout';

export default function TotemView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { totem, loading } = useTotem(id);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Atualiza o tempo a cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const isEventoAtual = (horarioInicio: string) => {
    if (!currentTime) return false;
    const [hora, minuto] = horarioInicio.split(':').map(Number);
    const eventoTime = new Date();
    eventoTime.setHours(hora, minuto, 0);
    
    return eventoTime.getHours() === currentTime.getHours() && 
           eventoTime.getMinutes() === currentTime.getMinutes();
  };

  if (loading || !totem) {
    return null;
  }

  const layoutProps = {
    totem,
    currentTime,
    isEventoAtual
  };

  return (
    <Box
      component="main"
      sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        bgcolor: '#000000'
      }}
    >
      {totem.tipo === 'tv' ? (
        <TVLayout {...layoutProps} />
      ) : (
        <VerticalLayout {...layoutProps} />
      )}
    </Box>
  );
} 