export interface Slide {
  id: string;
  titulo: string;
  horarioInicio: string; // formato "HH:mm"
  conteudo: string;
  ordem: number;
}

export interface Totem {
  id: string;
  nome: string;
  tipo: 'tv' | 'vertical';
  cronograma: Slide[];
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