import React from 'react';
import { ArrowLeft, Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

interface ThemeSelectorProps {
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onClose }) => {
  const { currentTheme, themes, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card m-4 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-surface/50 border-border hover:bg-surface-elevated"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">تنظیمات تم</h1>
          </div>
        </div>
      </header>

      {/* Current Theme */}
      <div className="mx-4 mb-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-2">تم فعلی</h2>
          <p className="text-muted-foreground">{themes[currentTheme]?.name}</p>
          
          {/* Theme Preview */}
          <div className="mt-4 p-4 bg-gradient-primary rounded-xl">
            <div className="text-primary-foreground text-center">
              <div className="text-2xl font-bold mb-2">07:30</div>
              <div className="text-sm opacity-80">نمونه زنگ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Options */}
      <div className="mx-4 space-y-4">
        <h2 className="text-lg font-semibold mb-4">تم‌های موجود</h2>
        
        {Object.entries(themes).map(([key, theme]) => (
          <div
            key={key}
            className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
              currentTheme === key ? 'ring-2 ring-primary shadow-glow' : 'hover:scale-[1.02]'
            }`}
            onClick={() => setTheme(key)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{theme.description}</p>
                
                {/* Color Preview */}
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: theme.preview.primary }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: theme.preview.accent }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: theme.preview.background }}
                  />
                </div>
              </div>
              
              {currentTheme === key && (
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Apply Button */}
      <div className="mx-4 mt-8 pb-8">
        <Button
          onClick={onClose}
          className="w-full bg-gradient-primary glow-effect py-4 text-lg font-semibold"
        >
          اعمال تم
        </Button>
      </div>
    </div>
  );
};