'use client';

import { useState, useEffect, use } from 'react';
import { useTotem } from '@/hooks/useTotem';
import { TVLayout } from '@/components/layouts/tv/TVLayout';
import { VerticalLayout } from '@/components/layouts/vertical/VerticalLayout';
import { LoadingScreen } from '@/components/feedback/LoadingScreen';
import { Totem as TotemType } from '@/types';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface LayoutTotem {
  nome: string;
  cronograma: Array<{
    id: string;
    titulo: string;
    horarioInicio: string;
    conteudo: string;
    cor?: 'purple' | 'green' | 'cyan' | 'pink' | 'orange';
  }>;
}

export default function TotemView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [totem, setTotem] = useState<TotemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [localTime, setLocalTime] = useState(new Date());

  // Listener em tempo real para mudanças no totem
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'totens', resolvedParams.id),
      (doc) => {
        if (doc.exists()) {
          setTotem({ id: doc.id, ...doc.data() } as TotemType);
        } else {
          setTotem(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao observar totem:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [resolvedParams.id]);

  // Atualização do relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) return <LoadingScreen />;
  if (!totem) return <div>Totem não encontrado</div>;

  const activeLayout = totem.layouts?.find(l => l.ativo);
  if (!activeLayout) return <div>Layout não encontrado</div>;

  const layoutTotem = {
    nome: totem.nome,
    cronograma: activeLayout.cronograma.map(evento => ({
      id: evento.id,
      titulo: evento.nome,
      horarioInicio: evento.horarioInicio,
      conteudo: evento.descricao,
      cor: evento.cor,
      destaque: evento.destaque
    }))
  };

  const layoutProps = {
    totem: layoutTotem,
    currentTime: localTime,
    isEventoAtual: (horarioInicio: string) => {
      const [hora, minuto] = horarioInicio.split(':').map(Number);
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      return hora === currentHour && Math.abs(currentMinute - minuto) <= 2;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {totem.tipo === 'tv' ? (
        <TVLayout {...layoutProps} />
      ) : (
        <VerticalLayout {...layoutProps} />
      )}
    </div>
  );
} 