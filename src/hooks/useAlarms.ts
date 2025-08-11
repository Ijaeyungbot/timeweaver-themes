import { useState, useEffect } from 'react';
import { Alarm } from '@/components/AlarmApp';

const STORAGE_KEY = 'alarms';

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  // Load alarms from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAlarms(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading alarms:', error);
      }
    }
  }, []);

  // Save alarms to localStorage whenever alarms change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = (alarmData: Omit<Alarm, 'id'>) => {
    const newAlarm: Alarm = {
      ...alarmData,
      id: Date.now().toString()
    };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const updateAlarm = (id: string, alarmData: Omit<Alarm, 'id'>) => {
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarmData, id } : alarm
      )
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  return {
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm
  };
};