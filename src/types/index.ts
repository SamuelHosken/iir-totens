export interface Slide {
  id: string;
  titulo: string;
  horarioInicio: string; // formato "HH:mm"
  conteudo: string;
  ordem: number;
}

export interface Layout {
  id: string;
  nome: string;
  ativo: boolean;
  cronograma: Cronograma[];
}

export interface Totem {
  id: string;
  nome: string;
  tipo: 'tv' | 'vertical';
  layouts: Layout[];
}

export interface TotemFormData {
  nome: string;
  tipo: 'tv' | 'vertical';
}

export interface SlideFormData {
  titulo: string;
  horarioInicio: string;
  conteudo: string;
}

export interface Cronograma {
  id: string;
  nome: string;
  horarioInicio: string;
  descricao: string;
  cor?: 'purple' | 'green' | 'cyan' | 'pink' | 'orange';
  destaque?: boolean;
} 