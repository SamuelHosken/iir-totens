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

      // Ajusta a data do evento para comparação correta
      if (now.getHours() >= 0 && now.getHours() <= 3) {
        // Se estamos entre 00h e 03h
        if (hora > 12) {
          // Eventos do dia anterior (ex: 19h, 20h, etc)
          eventoTime.setDate(eventoTime.getDate() - 1);
        }
      } else if (hora >= 0 && hora <= 3) {
        // Eventos entre 00h e 03h quando não estamos nesse período
        eventoTime.setDate(eventoTime.getDate() + 1);
      }

      const diffMinutes = Math.floor((now.getTime() - eventoTime.getTime()) / (1000 * 60));
      
      // Só considera eventos que já aconteceram (diff positivo) e pega o mais recente
      if (diffMinutes >= 0 && diffMinutes < smallestDiff) {
        smallestDiff = diffMinutes;
        mostRecentEvent = index;
      }
    });

    return mostRecentEvent;
  };

  // Função para converter horário em minutos, considerando horários após meia-noite
  const convertToMinutes = (hora: number, minuto: number) => {
    // Se o horário for entre meia-noite e 3am, adiciona 24h
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

    // Encontra o índice do evento atual na lista filtrada
    const currentEventPosition = Math.min(
      cronograma.slice(0, currentIndex).length,
      3  // máximo de 3 eventos anteriores
    );

    // Pega até 3 eventos antes do atual
    const start = Math.max(0, currentIndex - 3);
    const eventsBeforeCurrent = cronograma.slice(start, currentIndex);
    
    // Pega o evento atual
    const currentEvent = cronograma[currentIndex];
    
    // E 5 eventos depois
    const eventsAfterCurrent = cronograma.slice(currentIndex + 1, currentIndex + 6);

    return [
      ...eventsBeforeCurrent,
      currentEvent,
      ...eventsAfterCurrent
    ].filter(Boolean);
  };

  if (alertEvent) {
    return (
      <div className="min-h-screen w-screen bg-black flex items-center">
        <div className="h-[700px] w-[135px] relative -mt-[50px]">
          {/* Background pulsante */}
          <div className="absolute inset-0 bg-red-600 animate-alert-pulse-intense" />
          
          {/* Conteúdo com efeitos - Ajustado verticalmente */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full pl-[-30px] -translate-y-[100px] text-center">
              {/* Relógio pulsante */}
              <div className="text-3xl font-bold mb-4 text-white animate-bounce">
                {alertEvent.horarioInicio}
              </div>
              
              {/* Título com glow */}
       o       <div className="text-xl font-bold mb-3 text-white animate-glow mx-auto px-2">
                {alertEvent.titulo}
              </div>
              
              {/* Descrição com fade */}
              <div className="text-sm text-white opacity-90 animate-fade-in px-2 mx-auto break-words">
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
      <div className="h-[1000px] w-[135px] bg-black relative text-white">
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
                <div className="text-xs font-light text-green-300">
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
                // isAtual será true para o evento que corresponde ao currentIndex
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
                      rounded-xl p-2 transition-all duration-300
                      ${isAtual ? `${corBase} scale-105 shadow-xl` : 
                        isPassado ? `${corBase} opacity-30` : `${corBase} opacity-70`}
                    `}
                  >
                    <div className={`flex ${isAtual ? 'flex-col' : 'justify-between items-start gap-1'}`}>
                      <div className="text-left flex-1">
                        <h2 className={`font-bold ${isAtual ? 'text-[10px]' : 'text-[8px]'} break-words`}>
                          {slide.titulo}
                        </h2>
                        {isAtual && (
                          <>
                            <p className="text-[9px] font-semibold mt-1">
                              {slide.horarioInicio}
                            </p>
                            <p className="text-[8px] mt-1 leading-tight opacity-90 break-words">
                              {slide.conteudo}
                            </p>
                          </>
                        )}
                      </div>
                      {!isAtual && (
                        <p className="text-[8px] font-semibold">
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