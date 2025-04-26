import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { TotemSchedule, DaySchedule } from '@/types/schedule';

export function useSchedule(totemId: string) {
  const [schedule, setSchedule] = useState<TotemSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    try {
      const scheduleDoc = await getDoc(doc(db, 'schedules', totemId));
      if (scheduleDoc.exists()) {
        setSchedule(scheduleDoc.data() as TotemSchedule);
      } else {
        // Criar um novo schedule se não existir
        const newSchedule: TotemSchedule = {
          totemId,
          schedules: {},
          lastUpdated: Timestamp.now()
        };
        await setDoc(doc(db, 'schedules', totemId), newSchedule);
        setSchedule(newSchedule);
      }
    } catch (err) {
      setError('Erro ao buscar agendamento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateDay = async (date: string, daySchedule: DaySchedule) => {
    try {
      if (!schedule) return;

      const updatedSchedule = {
        ...schedule,
        schedules: {
          ...schedule.schedules,
          [date]: daySchedule
        },
        lastUpdated: Timestamp.now()
      };

      await updateDoc(doc(db, 'schedules', totemId), updatedSchedule);
      setSchedule(updatedSchedule);
    } catch (err) {
      setError('Erro ao atualizar agendamento');
      console.error(err);
    }
  };

  const removeDay = async (date: string) => {
    try {
      if (!schedule) return;

      const { [date]: removed, ...remainingSchedules } = schedule.schedules;
      const updatedSchedule = {
        ...schedule,
        schedules: remainingSchedules,
        lastUpdated: Timestamp.now()
      };

      await updateDoc(doc(db, 'schedules', totemId), updatedSchedule);
      setSchedule(updatedSchedule);
    } catch (err) {
      setError('Erro ao remover dia');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [totemId]);

  return {
    schedule,
    loading,
    error,
    addOrUpdateDay,
    removeDay,
    refreshSchedule: fetchSchedule
  };
} 