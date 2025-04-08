import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="text-center p-8 backdrop-blur-sm bg-white/10 rounded-2xl shadow-2xl">
        <h1 className="text-5xl font-bold text-white mb-8 animate-fade-in">
          Sistema de Gestão de Totens
        </h1>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            href="/painel" 
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold
                     hover:bg-blue-50 transition-all duration-300 shadow-lg hover:scale-105"
          >
            Acessar Painel
          </Link>
          <Link 
            href="/totem?id=1" 
            className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 rounded-xl font-semibold
                     hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            Ver Totem Demo
          </Link>
        </div>
      </div>
    </div>
  );
} 