import React, { useState } from 'react';
import { ArrowLeft, Clock, Volume2, Vibrate, RotateCcw, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alarm } from './AlarmApp';

interface AlarmFormProps {
  alarm?: Alarm | null;
  onSave: (alarm: Omit<Alarm, 'id'>) => void;
  onCancel: () => void;
}

const DAYS = [
  { key: 'Sun', label: 'یکشنبه' },
  { key: 'Mon', label: 'دوشنبه' },
  { key: 'Tue', label: 'سه‌شنبه' },
  { key: 'Wed', label: 'چهارشنبه' },
  { key: 'Thu', label: 'پنج‌شنبه' },
  { key: 'Fri', label: 'جمعه' },
  { key: 'Sat', label: 'شنبه' }
];

const RINGTONES = [
  { value: 'default', label: 'پیش‌فرض' },
  { value: 'gentle', label: 'ملایم' },
  { value: 'energetic', label: 'پرانرژی' },
  { value: 'classic', label: 'کلاسیک' }
];

const SNOOZE_OPTIONS = [
  { value: 5, label: '۵ دقیقه' },
  { value: 10, label: '۱۰ دقیقه' },
  { value: 15, label: '۱۵ دقیقه' },
  { value: 30, label: '۳۰ دقیقه' }
];

export const AlarmForm: React.FC<AlarmFormProps> = ({
  alarm,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    title: alarm?.title || 'زنگ جدید',
    time: alarm?.time || '07:00',
    days: alarm?.days || [],
    enabled: alarm?.enabled ?? true,
    ringtone: alarm?.ringtone || 'default',
    volume: alarm?.volume || 80,
    vibration: alarm?.vibration ?? true,
    snooze: alarm?.snooze || 10
  });

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card m-4 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="bg-surface/50 border-border hover:bg-surface-elevated"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">
              {alarm ? 'ویرایش زنگ' : 'زنگ جدید'}
            </h1>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-4 space-y-6">
        {/* Title */}
        <div className="glass-card p-6">
          <Label htmlFor="title" className="text-base font-semibold mb-3 block">
            عنوان زنگ
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="bg-surface border-border"
            placeholder="نام زنگ را وارد کنید"
          />
        </div>

        {/* Time */}
        <div className="glass-card p-6">
          <Label htmlFor="time" className="text-base font-semibold mb-3 block">
            زمان
          </Label>
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-primary" />
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="bg-surface border-border text-2xl font-mono"
            />
          </div>
        </div>

        {/* Days */}
        <div className="glass-card p-6">
          <Label className="text-base font-semibold mb-4 block">
            تکرار
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {DAYS.map((day) => (
              <Button
                key={day.key}
                type="button"
                variant={formData.days.includes(day.key) ? "default" : "outline"}
                onClick={() => toggleDay(day.key)}
                className={
                  formData.days.includes(day.key)
                    ? "bg-gradient-primary glow-effect"
                    : "bg-surface/50 border-border hover:bg-surface-elevated"
                }
              >
                {day.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sound Settings */}
        <div className="glass-card p-6">
          <Label className="text-base font-semibold mb-4 block">
            تنظیمات صدا
          </Label>
          
          <div className="space-y-6">
            {/* Ringtone */}
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Bell className="w-4 h-4" />
                آهنگ زنگ
              </Label>
              <Select
                value={formData.ringtone}
                onValueChange={(value) => setFormData(prev => ({ ...prev, ringtone: value }))}
              >
                <SelectTrigger className="bg-surface border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RINGTONES.map((ringtone) => (
                    <SelectItem key={ringtone.value} value={ringtone.value}>
                      {ringtone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Volume */}
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                صدا: {formData.volume}%
              </Label>
              <Slider
                value={[formData.volume]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, volume: value[0] }))}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Vibrate className="w-4 h-4" />
                لرزش
              </Label>
              <Switch
                checked={formData.vibration}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, vibration: checked }))}
              />
            </div>
          </div>
        </div>

        {/* Snooze */}
        <div className="glass-card p-6">
          <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            مدت تعویق
          </Label>
          <Select
            value={formData.snooze.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, snooze: parseInt(value) }))}
          >
            <SelectTrigger className="bg-surface border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SNOOZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="pb-8">
          <Button
            type="submit"
            className="w-full bg-gradient-primary glow-effect py-4 text-lg font-semibold"
          >
            {alarm ? 'ذخیره تغییرات' : 'ایجاد زنگ'}
          </Button>
        </div>
      </form>
    </div>
  );
};