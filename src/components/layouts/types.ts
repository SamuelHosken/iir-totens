export interface LayoutProps {
  totem: {
    nome: string;
    cronograma: Array<{
      id: string;
      titulo: string;
      horarioInicio: string;
      conteudo: string;
    }>;
  } | null;
  currentTime: Date | null;
  isEventoAtual: (horarioInicio: string) => boolean;
} 