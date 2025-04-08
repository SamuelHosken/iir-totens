'use client';

import { useState, useEffect, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import { TVLayout } from '@/components/layouts/tv/TVLayout';
import { VerticalLayout } from '@/components/layouts/vertical/VerticalLayout';

interface Slide {
  id: string;
  titulo: string;
  horarioInicio: string;
  conteudo: string;
}

interface Totem {
  id: string;
  nome: string;
  tipo: 'tv' | 'vertical';
  cronograma: Slide[];
}

const ordenarPorHorario = (cronograma: Slide[]) => {
  return [...cronograma].sort((a, b) => {
    const [horaA, minA] = a.horarioInicio.split(':').map(Number);
    const [horaB, minB] = b.horarioInicio.split(':').map(Number);
    const minutosA = horaA * 60 + minA;
    const minutosB = horaB * 60 + minB;
    return minutosA - minutosB;
  });
};

export default function VisualizarTotem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [totem, setTotem] = useState<Totem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchTotem();
  }, []);

  const fetchTotem = async () => {
    try {
      const totemDoc = await getDoc(doc(db, 'totens', id));
      if (totemDoc.exists()) {
        const data = totemDoc.data();
        const cronogramaOrdenado = ordenarPorHorario(data.cronograma || []);
        
        setTotem({
          id: totemDoc.id,
          nome: data.nome,
          tipo: data.tipo,
          cronograma: cronogramaOrdenado
        });
      }
    } catch (error) {
      console.error('Erro ao buscar totem:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEventoAtual = (horarioInicio: string) => {
    const [hora, minuto] = horarioInicio.split(':').map(Number);
    const eventoTime = new Date();
    eventoTime.setHours(hora, minuto, 0);
    
    const now = currentTime;
    return eventoTime.getHours() === now?.getHours() && 
           eventoTime.getMinutes() === now?.getMinutes();
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const layoutProps = {
    totem,
    currentTime,
    isEventoAtual
  };

  return totem?.tipo === 'tv' ? (
    <TVLayout {...layoutProps} />
  ) : (
    <VerticalLayout {...layoutProps} />
  );
} 