import { LayoutProps } from '@/types/layouts';

interface Slide {
  id: string;
  titulo: string;
  horarioInicio: string;
  conteudo: string;
}

interface Totem {
  nome: string;
  cronograma: Slide[];
}

interface TVLayoutProps {
  totem: Totem | null;
  currentTime: Date;
  isEventoAtual: (horario: string) => boolean;
}

export function TVLayout({ totem, currentTime, isEventoAtual }: TVLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {totem?.nome}
          </h1>
          {currentTime && (
            <p className="text-5xl font-bold text-blue-300">
              {currentTime.toLocaleTimeString('pt-BR', { 
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