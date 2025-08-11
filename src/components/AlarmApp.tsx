import React, { useState, useEffect } from 'react';
import { Clock, Plus, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlarmList } from './AlarmList';
import { AlarmForm } from './AlarmForm';
import { ThemeSelector } from './ThemeSelector';
import { useAlarms } from '@/hooks/useAlarms';
import { useTheme } from '@/hooks/useTheme';

export interface Alarm {
  id: string;
  title: string;
  time: string;
  days: string[];
  enabled: boolean;
  ringtone: string;
  volume: number;
  vibration: boolean;
  snooze: number;
}

export const AlarmApp = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [showThemes, setShowThemes] = useState(false);
  const { alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm } = useAlarms();
  const { currentTheme, themes, setTheme } = useTheme();

  const handleAddAlarm = () => {
    setEditingAlarm(null);
    setShowForm(true);
  };

  const handleEditAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setShowForm(true);
  };

  const handleSaveAlarm = (alarmData: Omit<Alarm, 'id'>) => {
    if (editingAlarm) {
      updateAlarm(editingAlarm.id, alarmData);
    } else {
      addAlarm(alarmData);
    }
    setShowForm(false);
    setEditingAlarm(null);
  };

  if (showForm) {
    return (
      <AlarmForm
        alarm={editingAlarm}
        onSave={handleSaveAlarm}
        onCancel={() => {
          setShowForm(false);
          setEditingAlarm(null);
        }}
      />
    );
  }

  if (showThemes) {
    return (
      <ThemeSelector
        onClose={() => setShowThemes(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card m-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-xl glow-effect">
              <Clock className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">تنظیم‌کننده زنگ</h1>
              <p className="text-muted-foreground text-sm">
                {alarms.filter(a => a.enabled).length} فعال از {alarms.length} زنگ
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowThemes(true)}
              className="bg-surface/50 border-border hover:bg-surface-elevated"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="mx-4 mb-6 grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{alarms.filter(a => a.enabled).length}</div>
            <div className="text-sm text-muted-foreground">زنگ فعال</div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{currentTheme}</div>
            <div className="text-sm text-muted-foreground">تم فعلی</div>
          </div>
        </div>
      </div>

      {/* Alarms List */}
      <div className="mx-4">
        <AlarmList
          alarms={alarms}
          onEdit={handleEditAlarm}
          onDelete={deleteAlarm}
          onToggle={toggleAlarm}
        />
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={handleAddAlarm}
          className="w-16 h-16 rounded-full bg-gradient-primary glow-effect shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6 text-primary-foreground" />
        </Button>
      </div>
    </div>
  );
};