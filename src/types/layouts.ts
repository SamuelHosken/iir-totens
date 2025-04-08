import { Totem } from './index';

export interface LayoutProps {
  totem: Totem;
  currentTime: Date;
  isEventoAtual: (horarioInicio: string) => boolean;
} 