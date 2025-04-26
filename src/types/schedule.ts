import { Timestamp } from 'firebase/firestore';

export type EventColor = 'purple' | 'green' | 'cyan' | 'pink' | 'orange';

export interface Slide {
  id: string;
  nome: string;
  horarioInicio: string;
  descricao: string;
  cor: EventColor;
}

export interface DaySchedule {
  date: string;
  name: string; // Nome do dia (ex: "Segunda-feira", "Dia especial", etc)
  slides: Slide[];
  active: boolean;
}

export interface TotemSchedule {
  totemId: string;
  schedules: {
    [date: string]: DaySchedule;
  };
  currentSchedule?: string;
  lastUpdated: Timestamp;
} 