'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { Box } from '@mui/material';
import { LoadingScreen } from '@/components/feedback/LoadingScreen';

interface TotemData {
  periodo: string;
  horario: string | Timestamp;
  atividade: string;
  duracao: string;
}

interface TotemDisplay {
  periodo: string;
  horario: string;
  atividade: string;
  duracao: string;
}

function TotemContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [totemData, setTotemData] = useState<TotemDisplay | null>(null);
  const [loading, setLoading] = useState(true);

  // Redireciona para a página específica do totem
  if (id) {
    router.push(`/totem/${id}`);
    return null;
  }

  useEffect(() => {
    const fetchTotemData = async () => {
      if (!id) return;
      
      try {
        const totemDoc = await getDoc(doc(db, 'totens', id));
        if (totemDoc.exists()) {
          const data = totemDoc.data() as TotemData;
          setTotemData({
            periodo: data.periodo || '',
            horario: data.horario instanceof Timestamp 
              ? data.horario.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              : data.horario as string || '',
            atividade: data.atividade || '',
            duracao: data.duracao || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do totem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotemData();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#000000'
        }}
      >
        <LoadingScreen />
      </Box>
    );
  }

  if (!totemData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Totem não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in backdrop-blur-sm bg-white/5 p-12 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="inline-block bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-xl mb-8">
            {totemData.periodo}
          </div>
          <h1 className="text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {totemData.horario}
          </h1>
          <p className="text-4xl mb-12 text-gray-200">{totemData.atividade}</p>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg">
            <p className="text-2xl font-light">Duração: {totemData.duracao}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TotemPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <TotemContent />
    </Suspense>
  );
} 