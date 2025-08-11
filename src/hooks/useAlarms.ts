import { useState, useEffect } from 'react';
import { Alarm } from '@/components/AlarmApp';
import { alarmService } from '@/services/AlarmService';

const STORAGE_KEY = 'alarms';

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  // Initialize alarm service and load alarms from localStorage on mount
  useEffect(() => {
    const initializeAndLoadAlarms = async () => {
      // Initialize alarm service
      await alarmService.initializeService();
      await alarmService.registerNotificationActions();
      
      // Load alarms from localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const loadedAlarms = JSON.parse(stored);
          setAlarms(loadedAlarms);
          
          // Re-schedule all enabled alarms
          for (const alarm of loadedAlarms) {
            if (alarm.enabled) {
              await alarmService.scheduleAlarm(alarm);
            }
          }
        } catch (error) {
          console.error('Error loading alarms:', error);
        }
      }
    };

    initializeAndLoadAlarms();
  }, []);

  // Save alarms to localStorage whenever alarms change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = async (alarmData: Omit<Alarm, 'id'>) => {
    const newAlarm: Alarm = {
      ...alarmData,
      id: Date.now().toString()
    };
    setAlarms(prev => [...prev, newAlarm]);
    
    // Schedule the alarm if enabled
    if (newAlarm.enabled) {
      await alarmService.scheduleAlarm(newAlarm);
    }
  };

  const updateAlarm = async (id: string, alarmData: Omit<Alarm, 'id'>) => {
    const updatedAlarm = { ...alarmData, id };
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === id ? updatedAlarm : alarm
      )
    );
    
    // Cancel old alarm and schedule new one if enabled
    await alarmService.cancelAlarm(id);
    if (updatedAlarm.enabled) {
      await alarmService.scheduleAlarm(updatedAlarm);
    }
  };

  const deleteAlarm = async (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    // Cancel the alarm
    await alarmService.cancelAlarm(id);
  };

  const toggleAlarm = async (id: string) => {
    let updatedAlarm: Alarm | null = null;
    
    setAlarms(prev =>
      prev.map(alarm => {
        if (alarm.id === id) {
          updatedAlarm = { ...alarm, enabled: !alarm.enabled };
          return updatedAlarm;
        }
        return alarm;
      })
    );
    
    // Schedule or cancel alarm based on enabled state
    if (updatedAlarm) {
      if (updatedAlarm.enabled) {
        await alarmService.scheduleAlarm(updatedAlarm);
      } else {
        await alarmService.cancelAlarm(id);
      }
    }
  };

  return {
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm
  };
};