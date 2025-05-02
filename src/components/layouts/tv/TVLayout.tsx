import { useState, useEffect } from 'react';
import { Totem } from '@/types';
import { EventColor } from '@/types/schedule';

interface Slide {
  id: string;
  titulo: string;
  horarioInicio: string;
  conteudo: string;
  cor?: EventColor;
  destaque?: boolean;
}

const eventColors = {
  purple: {
    bg: 'bg-purple-500',
    border: 'border-purple-500'
  },
  green: {
    bg: 'bg-green-500',
    border: 'border-green-500'
  },
  cyan: {
    bg: 'bg-cyan-500',
    border: 'border-cyan-500'
  },
  pink: {
    bg: 'bg-pink-500',
    border: 'border-pink-500'
  },
  orange: {
    bg: 'bg-orange-500',
    border: 'border-orange-500'
  }
} as const;

interface TVLayoutProps {
  totem: {
    nome: string;
    cronograma: Slide[];
  } | null;
  currentTime: Date | null;
  isEventoAtual: (horarioInicio: string) => boolean;
}

export function TVLayout({ totem, currentTime: initialTime, isEventoAtual }: TVLayoutProps) {
  const [localTime, setLocalTime] = useState<Date | null>(initialTime);

  // Atualizar o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isPast = (horarioInicio: string) => {
    const [hora, minuto] = horarioInicio.split(':').map(Number);
    const eventoTime = new Date();
    const now = new Date();
    eventoTime.setHours(hora, minuto, 0);
    return eventoTime < now;
  };

  // Função para encontrar o evento mais recente
  const findMostRecentEvent = (cronograma: Slide[]) => {
    const now = new Date();
    let mostRecentEvent = -1;
    let smallestDiff = Infinity;

    cronograma.forEach((evento, index) => {
      const [hora, minuto] = evento.horarioInicio.split(':').map(Number);
      const eventoTime = new Date();
      eventoTime.setHours(hora, minuto, 0, 0);

      const diffMinutes = Math.floor((now.getTime() - eventoTime.getTime()) / (1000 * 60));
      
      if (diffMinutes >= 0 && diffMinutes < smallestDiff) {
        smallestDiff = diffMinutes;
        mostRecentEvent = index;
      }
    });

    return mostRecentEvent;
  };

  // Função para converter horário em minutos, considerando horários após meia-noite
  const convertToMinutes = (hora: number, minuto: number) => {
    if (hora >= 0 && hora <= 3) {
      return ((hora + 24) * 60) + minuto;
    }
    return (hora * 60) + minuto;
  };

  // Função para ordenar eventos por horário
  const sortedCronograma = totem?.cronograma.sort((a, b) => {
    const [horaA, minA] = a.horarioInicio.split(':').map(Number);
    const [horaB, minB] = b.horarioInicio.split(':').map(Number);
    
    return convertToMinutes(horaA, minA) - convertToMinutes(horaB, minB);
  });

  // Encontra o evento mais recente
  const currentEventIndex = sortedCronograma ? 
    findMostRecentEvent(sortedCronograma) : -1;

  // Encontrar evento atual com destaque ativo
  const alertEvent = sortedCronograma?.find(slide => 
    slide.destaque && isEventoAtual(slide.horarioInicio)
  );

  // Função para filtrar e ordenar os eventos que queremos mostrar
  const getFilteredEvents = (cronograma: Slide[], currentIndex: number) => {
    if (!cronograma?.length) return [];

    const currentEventPosition = Math.min(
      cronograma.slice(0, currentIndex).length,
      3
    );

    const start = Math.max(0, currentIndex - 3);
    const eventsBeforeCurrent = cronograma.slice(start, currentIndex);
    const currentEvent = cronograma[currentIndex];
    const eventsAfterCurrent = cronograma.slice(currentIndex + 1, currentIndex + 6);

    return [
      ...eventsBeforeCurrent,
      currentEvent,
      ...eventsAfterCurrent
    ].filter(Boolean);
  };

  if (alertEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {totem?.nome}
            </h1>
            {localTime && (
              <p className="text-5xl font-bold text-blue-300">
                {localTime.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCronograma && currentEventIndex !== -1 && getFilteredEvents(sortedCronograma, currentEventIndex).map((slide, index, array) => {
              const currentEventPosition = Math.min(
                sortedCronograma.slice(0, currentEventIndex).length,
                3
              );
              const isAtual = index === currentEventPosition;
              const isPassado = index < currentEventPosition;
              const corBase = eventColors[slide.cor || 'purple']?.bg || 'bg-purple-500';

              return (
                <div
                  key={slide.id}
                  className={`
                    backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-2xl
                    transition-all duration-300 ease-in-out
                    ${isAtual ? 'ring-2 ring-blue-500 scale-105' : ''}
                    ${isPassado ? 'opacity-30' : ''}
                  `}
                >
                  <h2 className="text-2xl font-bold mb-4 text-blue-300">
                    {slide.titulo}
                  </h2>
                  <p className="text-xl mb-4 text-blue-200 flex items-center gap-2">
                    {slide.horarioInicio}
                  </p>
                  <p className="text-gray-300 text-lg">
                    {slide.conteudo}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {totem?.nome}
          </h1>
          {localTime && (
            <p className="text-5xl font-bold text-blue-300">
              {localTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {totem?.cronograma.map((slide: Slide) => (
            <div
              key={slide.id}
              className={`
                backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-2xl
                transition-all duration-300 ease-in-out
                ${isEventoAtual(slide.horarioInicio) ? 'ring-2 ring-blue-500 scale-105' : ''}
              `}
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-300">
                {slide.titulo}
              </h2>
              <p className="text-xl mb-4 text-blue-200 flex items-center gap-2">
                {slide.horarioInicio}
              </p>
              <p className="text-gray-300 text-lg">
                {slide.conteudo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 