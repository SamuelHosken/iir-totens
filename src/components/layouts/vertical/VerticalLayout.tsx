import { LayoutProps } from '@/types/layouts';
import Image from 'next/image';

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

export function VerticalLayout({ totem, currentTime, isEventoAtual }: VerticalLayoutProps) {
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

  return (
    <div className="min-h-screen w-screen bg-black text-white overflow-hidden">
      {/* Container principal com borda */}
      <div className={`
        w-full h-full min-h-screen
        border-[16px] 
        ${borderColorClass}
        relative
      `}>
        {/* Container interno com cantos arredondados */}
        <div className="absolute inset-0 rounded-[2rem] bg-black overflow-hidden">
          {/* Conteúdo */}
          <div className="relative z-10 h-full flex flex-col p-4">
            {/* Header com Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src="/Lablogo.png"
                alt="Lab Camp"
                width={200}
                height={80}
                className="h-auto"
              />
            </div>

            {/* Horário Atual */}
            <div className="text-center mb-8">
              <div className="inline-block bg-green-500/20 px-4 py-1.5 rounded-full border border-green-500/30">
                <div className="text-2xl font-light text-green-300">
                  {currentTime?.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>

            {/* Lista de Eventos */}
            <div className="flex-1 flex flex-col gap-4 max-w-3xl mx-auto w-full">
              {sortedCronograma?.map((slide, index) => {
                const isAtual = index === currentEventIndex;
                const isPassado = isPast(slide.horarioInicio);
                const corBase = eventColors[slide.cor || 'purple']?.bg || 'bg-purple-500';

                return (
                  <div
                    key={slide.id}
                    className={`
                      rounded-xl p-6 transition-all duration-300
                      ${isAtual ? `${corBase} scale-105 shadow-xl` : 
                        isPassado ? `${corBase} opacity-30` : `${corBase} opacity-70`}
                      ${isAtual ? 'text-center' : ''}
                      ${isAtual && slide.destaque ? 'animate-pulse ring-4 ring-yellow-400' : ''}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <h2 className={`font-bold ${isAtual ? 'text-3xl mb-2' : 'text-2xl'}`}>
                        {slide.titulo}
                      </h2>
                      <p className={`${isAtual ? 'text-2xl' : 'text-xl'} font-semibold`}>
                        {slide.horarioInicio}
                      </p>
                    </div>
                    {isAtual && (
                      <p className="text-xl mt-2">
                        {slide.conteudo}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer com Nome do Totem */}
            <div className="text-center mt-8">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {totem?.nome}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 