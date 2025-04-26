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
  const [currentTime, setCurrentTime] = useState(new Date());

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

    // Cleanup: remove o listener quando o componente for desmontado
    return () => unsubscribe();
  }, [resolvedParams.id]);

  // Atualização do relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const isEventoAtual = (horarioInicio: string) => {
    if (!currentTime) return false;
    
    const [hora, minuto] = horarioInicio.split(':').map(Number);
    const eventoTime = new Date();
    const now = new Date();
    
    // Configura a data do evento para hoje
    eventoTime.setHours(hora, minuto, 0, 0);
    
    // Encontra a diferença em minutos
    const diffMinutes = Math.floor((now.getTime() - eventoTime.getTime()) / (1000 * 60));
    
    // Retorna true se o evento aconteceu nos últimos 30 minutos
    return diffMinutes >= 0 && diffMinutes <= 30;
  };

  // Função para encontrar o evento mais recente
  const findMostRecentEvent = (cronograma: LayoutTotem['cronograma']) => {
    const now = new Date();
    let mostRecentEvent = -1;
    let smallestDiff = Infinity;

    cronograma.forEach((evento, index) => {
      const [hora, minuto] = evento.horarioInicio.split(':').map(Number);
      const eventoTime = new Date();
      eventoTime.setHours(hora, minuto, 0, 0);

      const diffMinutes = Math.floor((now.getTime() - eventoTime.getTime()) / (1000 * 60));
      
      // Só considera eventos que já aconteceram (diff positivo)
      if (diffMinutes >= 0 && diffMinutes < smallestDiff) {
        smallestDiff = diffMinutes;
        mostRecentEvent = index;
      }
    });

    return mostRecentEvent;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  if (!totem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">
          Totem não encontrado
        </div>
      </div>
    );
  }

  const layoutTotem: LayoutTotem = {
    nome: totem.nome,
    cronograma: totem.layouts?.find(l => l.ativo)?.cronograma.map(evento => ({
      id: evento.id,
      titulo: evento.nome,
      horarioInicio: evento.horarioInicio,
      conteudo: evento.descricao,
      cor: evento.cor
    })) || []
  };

  const layoutProps = {
    totem: layoutTotem,
    currentTime,
    isEventoAtual,
    findMostRecentEvent
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