import { LayoutProps } from '@/types/layouts';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Slide {
  id: string;
  titulo: string;
  horarioInicio: string;
  conteudo: string;
  cor?: 'purple' | 'green' | 'cyan' | 'pink' | 'orange';
  destaque?: boolean;
}

interface Totem {
  nome: string;
  cronograma: Slide[];
}

interface VerticalLayoutProps {
  totem: Totem | null;
  currentTime: Date | null;
  isEventoAtual: (horarioInicio: string) => boolean;
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

export function VerticalLayout({ totem, currentTime: initialTime, isEventoAtual }: VerticalLayoutProps) {
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
      
      // Só considera eventos que já aconteceram (diff positivo)
      if (diffMinutes >= 0 && diffMinutes < smallestDiff) {
        smallestDiff = diffMinutes;
        mostRecentEvent = index;
      }
    });

    return mostRecentEvent;
  };

  // Função para ordenar eventos por horário
  const sortedCronograma = totem?.cronograma.sort((a, b) => {
    const [horaA, minA] = a.horarioInicio.split(':').map(Number);
    const [horaB, minB] = b.horarioInicio.split(':').map(Number);
    return (horaA * 60 + minA) - (horaB * 60 + minB);
  });

  // Encontra o evento mais recente
  const currentEventIndex = sortedCronograma ? 
    findMostRecentEvent(sortedCronograma) : -1;

  const currentEvent = sortedCronograma?.[currentEventIndex];
  const currentColor = currentEvent?.cor || 'purple';
  const borderColorClass = eventColors[currentColor]?.border || 'border-purple-500';

  // Encontrar evento atual com destaque ativo
  const alertEvent = sortedCronograma?.find(slide => 
    slide.destaque && isEventoAtual(slide.horarioInicio)
  );

  // Função para filtrar e ordenar os eventos que queremos mostrar
  const getFilteredEvents = (cronograma: Slide[], currentIndex: number) => {
    if (!cronograma?.length) return [];

    // Pegamos 4 eventos antes (incluindo o atual)
    const eventsBeforeCurrent = cronograma.slice(Math.max(0, currentIndex - 2), currentIndex + 1);
    // E 5 eventos depois
    const eventsAfterCurrent = cronograma.slice(currentIndex + 1, currentIndex + 6);

    return [
      ...eventsBeforeCurrent,
      ...eventsAfterCurrent
    ].filter(Boolean);
  };

  if (alertEvent) {
    return (
      <div className="min-h-screen w-screen bg-black flex items-center">
        <div className="h-[700px] w-[140px] relative -mt-[50px]">
          {/* Background pulsante */}
          <div className="absolute inset-0 bg-red-600 animate-alert-pulse-intense" />
          
          {/* Conteúdo com efeitos - Ajustado verticalmente */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full pl-[-30px] -translate-y-[100px] text-center">
              {/* Relógio pulsante */}
              <div className="text-5xl font-bold mb-8 text-white animate-bounce">
                {alertEvent.horarioInicio}
              </div>
              
              {/* Título com glow */}
              <div className="text-3xl font-bold mb-6 text-white animate-glow mx-auto">
                {alertEvent.titulo}
              </div>
              
              {/* Descrição com fade */}
              <div className="text-lg text-white opacity-90 animate-fade-in px-2 mx-auto">
                {alertEvent.conteudo}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-start">
      <div className="h-[1000px] w-[168px] bg-black relative text-white">
        <div className="absolute inset-0 rounded-r-[2rem] bg-black overflow-hidden">
          <div className="relative z-10 h-full flex flex-col p-2">
            {/* Logo menor */}
            <div className="flex justify-center mb-3 mt-[30px]">
              <Image
                src="/logo_001.png"
                alt="Lab Camp"
                width={60}
                height={24}
                priority
                className="h-auto"
              />
            </div>

            {/* Horário menor */}
            <div className="text-center mb-4">
              <div className="inline-block bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30">
                <div className="text-sm font-light text-green-300">
                  {localTime?.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>

            {/* Lista de Eventos com textos menores */}
            <div className="flex-1 flex flex-col gap-2 w-full">
              {sortedCronograma && currentEventIndex !== -1 && getFilteredEvents(sortedCronograma, currentEventIndex).map((slide, index, array) => {
                const isAtual = index === 2; // O terceiro item será o atual (após 2 anteriores)
                const isPassado = index < 2; // Os dois primeiros são passados
                const corBase = eventColors[slide.cor || 'purple']?.bg || 'bg-purple-500';

                return (
                  <div
                    key={slide.id}
                    className={`
                      rounded-xl p-2 transition-all duration-300
                      ${isAtual ? `${corBase} scale-105 shadow-xl` : 
                        isPassado ? `${corBase} opacity-30` : `${corBase} opacity-70`}
                    `}
                  >
                    <div className={`flex ${isAtual ? 'flex-col' : 'justify-between items-start gap-1'}`}>
                      <div className="text-left flex-1">
                        <h2 className={`font-bold ${isAtual ? 'text-base' : 'text-xs'}`}>
                          {slide.titulo}
                        </h2>
                        {isAtual && (
                          <>
                            <p className="text-sm font-semibold mt-1.5">
                              {slide.horarioInicio}
                            </p>
                            <p className="text-xs mt-2 leading-tight opacity-90">
                              {slide.conteudo}
                            </p>
                          </>
                        )}
                      </div>
                      {!isAtual && (
                        <p className="text-[10px] font-semibold">
                          {slide.horarioInicio}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 