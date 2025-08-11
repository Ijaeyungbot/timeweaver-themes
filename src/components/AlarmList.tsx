import React from 'react';
import { Clock, Edit, Trash2, Volume2, Vibrate, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alarm } from './AlarmApp';

interface AlarmListProps {
  alarms: Alarm[];
  onEdit: (alarm: Alarm) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const DAYS_PERSIAN = {
  'Sun': 'یکشنبه',
  'Mon': 'دوشنبه',
  'Tue': 'سه‌شنبه',
  'Wed': 'چهارشنبه',
  'Thu': 'پنج‌شنبه',
  'Fri': 'جمعه',
  'Sat': 'شنبه'
};

export const AlarmList: React.FC<AlarmListProps> = ({
  alarms,
  onEdit,
  onDelete,
  onToggle
}) => {
  if (alarms.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">هیچ زنگی تنظیم نشده</h3>
        <p className="text-muted-foreground mb-4">
          اولین زنگ خود را با فشردن دکمه + اضافه کنید
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alarms.map((alarm) => (
        <div
          key={alarm.id}
          className={`glass-card p-6 transition-all duration-300 ${
            alarm.enabled 
              ? 'ring-2 ring-primary/20 shadow-glow' 
              : 'opacity-75'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Time Display */}
              <div className="flex items-center gap-4 mb-3">
                <div className="text-3xl font-bold gradient-text">
                  {alarm.time}
                </div>
                <Switch
                  checked={alarm.enabled}
                  onCheckedChange={() => onToggle(alarm.id)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {/* Alarm Title */}
              <h3 className="text-lg font-semibold mb-2">{alarm.title}</h3>

              {/* Days */}
              <div className="flex flex-wrap gap-2 mb-3">
                {alarm.days.map((day) => (
                  <Badge
                    key={day}
                    variant="secondary"
                    className="bg-surface-elevated text-foreground"
                  >
                    {DAYS_PERSIAN[day as keyof typeof DAYS_PERSIAN]}
                  </Badge>
                ))}
              </div>

              {/* Settings Icons */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Volume2 className="w-4 h-4" />
                  <span>{alarm.volume}%</span>
                </div>
                {alarm.vibration && (
                  <div className="flex items-center gap-1">
                    <Vibrate className="w-4 h-4" />
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" />
                  <span>{alarm.snooze}م</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(alarm)}
                className="bg-surface/50 border-border hover:bg-surface-elevated"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(alarm.id)}
                className="bg-surface/50 border-border hover:bg-destructive/20 hover:border-destructive/50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};